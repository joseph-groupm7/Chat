module.exports = lobby;

var _ = require('lodash-node');
var socket = require('socket.io');
var Client = require('./Client');
var chatUtils = require('./chatUtils');
var state = require('./state')();
var storage = require('./storage')('testdb', 'root', 'root', 'localhost');
var cookies = require('./cookies');
var socketioJwt   = require("socketio-jwt");

function lobby(io){
    /*
    function(socket, next){

    console.log(socket.handshake.headers.cookie);

    //get name from querystring, type from url, session from cookie

    //or just check for token, and if there get from that

    var valid_socket = true;

    var socketCookies = cookies.parse(socket.request.headers.cookie);

    ['session'].every(function(prop){
        if(!socketCookies.hasOwnProperty(prop)){
            //console.log(prop);
            valid_socket = false;
        }
    });

    if(valid_socket){
        next();
    }

}
*/

    io.use(socketioJwt.authorize({
        secret: 'example_secret',
        handshake: true
    }));

    io.on('connection', function(socket){

        console.log('hello! ', socket.decoded_token);

        var client = new Client(
            socket,
            socket.request.headers.cookie.name,
            socket.request.headers.cookie.type,
            socket.request.headers.cookie.session
        );

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

            var user = chatUtils.getClientBySession(user_session_id, state);

            storage.saveChat(function(room_id){

                chatUtils.createChat(room_id, [user, client], state);

                //notify user
                user.socket.emit('lobby.start');

                //update admin
                client.socket.emit('lobby.state', state.lighten());

            });

        });

        //needs a room and a message, saves to database and returns messages to that room
        socket.on('lobby.message', function(message){
            storage.saveMessage(message.room_id, message.text, client.name, function(){
                io.to(message.room_id).emit('lobby.messages', message);
            });
        });

    });

}