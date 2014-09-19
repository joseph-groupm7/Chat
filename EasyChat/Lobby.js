module.exports = lobby;

var _ = require('lodash-node');
var socket = require('socket.io');
var Client = require('./Client');
var chatUtils = require('../EasyChat/chatUtils');
var state = require('../EasyChat/state')();
var storage = require('../EasyChat/storage')('testdb', 'root', 'root', 'localhost');

function lobby(io){

    io.use(function(socket, next){
        if(socket.handshake.query.session_id != 'undefined' && socket.handshake.query.username != 'undefined'){
            next();
        }
    });

    io.on('connection', function(socket){

        var client = new Client(socket);

        //returns where the client was placed in 'state'
        chatUtils.refreshClientSocket(client, state);

        io.emit('lobby.lobby', state.lighten());

        socket.on('disconnect', function(){
            //TODO: handle disconnects on client side
        });

        socket.on('lobby.chat', function(user){

            storage.saveChat(function(chat_id){

                var chat = chatUtils.createChat(chat_id, [user, client], state);

                io.to(chat.room).emit('lobby.chat', chat.lighten());

                io.emit('lobby.lobby', state.lighten());

            });

        });

        socket.on('lobby.message', function(message){
            storage.saveMessage(message.room, message.content, function(){
                io.to(message.room).emit('lobby.message', message.content);
            });
        });

    });

}