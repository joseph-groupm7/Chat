module.exports = lobby;

var socket = require('socket.io');
var Client = require('./Client');
var _ = require('lodash-node');
var chatUtils = require('../EasyChat/chatUtils');
var util = require('util');

var Hashids = require("hashids");
var Hash = new Hashids("this is my salt");

var mysql      = require('mysql');
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'root',
    database : 'testdb'
});

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

        chatUtils.refreshClientSocket(client, state);

        if(chatUtils.alreadyChatting(client, state)){
            chatUtils.rejoinChats(client, state);
        }else{
            chatUtils.addClientToLobby(client, state);
        }

        that.updateClient();

        socket.on('disconnect', function(){
            //TODO: handle disconnects on client side
        });

        socket.on('lobby.activateChat', function(user){

            //put the activating client in the array
            var allClients = [];
            allClients.push(user);
            allClients.push(client);

            var chat = chatUtils.createChat(allClients, state);
            console.log(chat.room);
            console.log('br');
            console.log(Hash.encrypt('asdf asdf'));
            connection.query('insert into chat (room, transcript) values ( ?, ? )', [Hash.encrypt(chat.room), ''], function(err, results){
                console.log(err);
                console.log(results);
            });

            chat.clients.map(function(client){
                client.socket.emit('lobby.activateChat', chat.lighten());
            });

            that.updateClient();

        });

        socket.on('message', function(message){
            //sends message to all clients in room
            io.to(message.room).emit('message', message);

            //persist to db
            connection.query('update chat set transcript = concat(transcript, ' + connection.escape(message.content) + ') where chat = ' + Hash.encrypt(message.room));

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