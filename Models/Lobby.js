module.exports = lobby;

var socket = require('socket.io');
var Client = require('./Client');
var _ = require('lodash-node');
var chatUtils = require('../EasyChat/chatUtils');
var util = require('util');

var mysql      = require('mysql');
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'root',
    database : 'testdb'
});

function lobby(io){

    var state = require('../EasyChat/state')();

    io.use(function(socket, next){
        if(socket.handshake.query.session_id != 'undefined' && socket.handshake.query.username != 'undefined'){
            next();
        }
    });

    io.on('connection', function(socket){

        var client = new Client(socket);

        //returns where the client was placed in 'state'
        chatUtils.refreshClientSocket(client, state).then(function(where){
            io.emit('lobby', state.lighten());
        });

        socket.on('disconnect', function(){
            //TODO: handle disconnects on client side
        });

        socket.on('lobby.activateChat', function(user){

            //returns the created chat, requires that all users either be client objects already, or have a session_id property
            chatUtils.createChat([user, client], state).then(function(chat){

                //tell all clients in the room that the chat was created
                io.to(chat.room).emit('lobby.activateChat', chat.lighten());

                io.emit('lobby', state.lighten());

            });

        });

        socket.on('message', function(message){
            io.to(message.room).emit('message', message);
        });

    });

}