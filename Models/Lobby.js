module.exports = lobby;

var socket = require('socket.io');
var Client = require('./Client');
var _ = require('lodash-node');
var chatUtils = require('../EasyChat/chatUtils');
var util = require('util');


function lobby(io){

    var state = require('../EasyChat/state')();

    var that = this;

    io.use(function(socket, next){
        if(socket.handshake.query.session_id != 'undefined' && socket.handshake.query.username != 'undefined'){
            next();
        }
    });

    io.on('connection', function(socket){

        var client = new Client(socket);

        if(chatUtils.alreadyChatting(client, state)){
            chatUtils.rejoinChat(client, state);
        }else{
            chatUtils.addClientToLobby(client, state);
            that.updateClient();
        }

        socket.on('disconnect', function(){
            //TODO: disable room messages if count < 1
        });

        socket.on('lobby.activateChat', function(pair){

            var chat = chatUtils.createChat(pair, state);

            //join each client to room
            chat.clients.map(function(client){
                //join each client to the room
                client.socket.join(chat.room);
            });

            socket.emit('lobby.activateChat', chat);

            that.updateClient();

        });

        socket.on('message', function(message){
            //sends message to all clients
            io.to(message.room).emit('message', message);
            //TODO: persist somewhere
        });

        that.updateClient();

    });

    this.updateClient = function(){

        var idle_users = [];
        var active_admins = [];
        var ongoing_chats = [];

        state.idle_users.map(function(client){
           idle_users.push(_.omit(client, 'socket'));
        });

        state.active_admins.map(function(client){
            active_admins.push(_.omit(client, 'socket'));
        });

        state.ongoing_chats.map(function(chat){

            var paredChat = _.clone(chat, true);
            paredChat.clients.map(function(client){
                client.socket = undefined;
            });
            ongoing_chats.push(paredChat);

        });

        var paredState = {idle_users:idle_users, active_admins:active_admins, ongoing_chats:ongoing_chats};
        io.emit('lobby', paredState);

    };

}