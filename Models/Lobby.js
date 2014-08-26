module.exports = lobby;


var socket = require('socket.io');
var Client = require('./Client');
var Chat = require('./Chat');
var _ = require('lodash-node');

function lobby(io){

    var that = this;

    io.on('connection', function(socket){

        //add client and admin to respective idles on connect
        if(_.contains(socket.handshake.headers.referer, 'user')){
            that.idle_users.push(new Client(socket.id, 'test-user'));
            that.updateClient();
        }else if(_.contains(socket.handshake.headers.referer, 'admin')){
            that.active_admins.push(new Client(socket.id, 'test-admin'));
            that.updateClient();
        }

        //remove from lobby on disconnect
        socket.on('disconnect', function(){
            _.remove(that.idle_users, function(client){
                return client.id == socket.id;
            });
            _.remove(that.active_admins, function(client){
                return client.id == socket.id;
            });
            that.updateClient();
        });

        socket.on('lobby.activateChat', function(users){

            var room_name = users.user_id.toString()+users.admin_id.toString();
            var clients = [];

            clients = clients.concat(_.remove(that.idle_users, function(client){
                return client.id == users.user_id;
            }));
            clients = clients.concat(_.remove(that.active_admins, function(client){
                return client.id == users.admin_id;
            }));

            //changes in lobby
            that.ongoing_chats.push(new Chat(clients, room_name));

            //notify clients of the room name
            clients.map(function(client){

                //join each client to the room
                io.of('/').connected[client.id].join(room_name);

                //notify each client of the room name
                io.to(client.id).emit('lobby.activateChat', room_name);

            });

            that.updateClient();

        });

        socket.on('message', function(message){
            //emit to clients in the room
            io.to(message.room).emit('message', message.content);
            //TODO: persist somewhere
        });

    });

    this.updateClient = function(){
        io.sockets.emit('lobby', this);
    };

    this.idle_users = [];
    this.ongoing_chats = [];
    this.active_admins = [];
}