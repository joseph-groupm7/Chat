module.exports = lobby;

var _ = require('lodash-node');
var socket = require('socket.io');
var Client = require('./Client');
var chatUtils = require('../EasyChat/chatUtils');
var state = require('../EasyChat/state')();
var storage = require('../EasyChat/storage')('testdb', 'root', 'root', 'localhost');

function lobby(io){

    io.use(function(socket, next){
        if(socket.handshake.query.session_id == 'undefined'){
            throw 'session_id not on query';
        }

        if(socket.handshake.headers.referer == 'undefined'){
            throw 'referrer not on header';
        }


        next();
    });

    io.on('connection', function(socket){

        var client = new Client(socket);

        //1. finds client in state and updates socket to the newly created one
        //2. rejoins any ongoing chats they belonged to
        //3. if client is an admin: emits the state to the client
        //   if client is a user and is in an ongoing chat: emits messages to the client
        chatUtils.refreshClientSocket(client, state, function(room_id){
            if(client.type === 'user' && room_id){
                storage.getMessages(room_id, function(messages){
                    client.socket.emit('lobby.messages', messages);
                });
            }else if(client.type === 'admin'){
                client.socket.emit('lobby.state', state.lighten());
            }
        });

        socket.on('disconnect', function(){
            //TODO: handle disconnects on client side
        });

        socket.on('lobby.chat', function(user_session_id){

            var user = chatUtils.getClientBySession(user_session_id);

            storage.saveChat(function(room_id){

                chatUtils.createChat(room_id, [user, client], state);

                //notify user
                user.socket.emit('lobby.start');

                //update admin
                client.socket.emit('lobby.state', state.lighten());

            });

        });

        //needs a room and a message, saves to database and returns messages to that room
        socket.on('lobby.message', function(room_id, message){
            storage.saveMessage(room_id, message, client.name, function(){
                storage.getMessages(room_id, function(messages){
                    io.to(room_id).emit('lobby.messages', messages);
                });
            });
        });

    });

}