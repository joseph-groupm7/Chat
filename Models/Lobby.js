module.exports = lobby;


var socket = require('socket.io');
var Client = require('./Client');
var Chat = require('./Chat');
var _ = require('lodash-node');
var chatUtils = require('../chatUtils');

function lobby(io){

    var that = this;

    io.use(function(socket, next){
        if(socket.handshake.query.session_id != undefined){
            next();
        }
    });

    io.on('connection', function(socket){

        //TODO: if session_id in a room..
        if(chatUtils.alreadyChatting(socket, that.ongoing_chats)){
            //put them back in the room
        }else{
            //add client or admin to respective idle array on connection
            that.addUserToLobby(socket);
        }

        socket.on('disconnect', function(){
            //TODO: disable room messages if count < 1
        });

        socket.on('lobby.activateChat', function(pair){

            var room_name = pair.user.session_id+pair.admin.session_id;
            var clients = [];

            //remove from idle users when activated
            clients = clients.concat(_.remove(that.idle_users, function(client){
                return client.session_id == pair.user.session_id;
            }));

            if(clients.length > 0){
                //push the chat into the ongoing array
                that.ongoing_chats.push(new Chat(clients, room_name));

                clients.map(function(client){

                    var socket = io.of('/').connected[client.id];
                    if(socket){
                        //join each client to the room
                        io.of('/').connected[client.id].join(room_name);

                        //notify each client of the room name
                        io.to(client.id).emit('lobby.activateChat', room_name);
                    }else{
                        console.log(client.id);
                    }

                });
            }

            that.updateClient();

        });

        socket.on('message', function(message){
            //sends message to all clients
            io.to(message.room).emit('message', message);
            //TODO: persist somewhere
        });

    });

    this.updateClient = function(){
        io.sockets.emit('lobby', this);
    };

    this.addUserToLobby = function(socket){

        if(_.contains(socket.handshake.headers.referer, 'user')){

            var userExists = false;
            that.idle_users.map(function(client){
                if(socket.handshake.query.session_id == client.session_id){
                    userExists = true;
                }
            });

            if(!userExists){
                that.idle_users.push(new Client(socket.id, 'test-user', 'user', socket.handshake.query.session_id));
            }

        }else if(_.contains(socket.handshake.headers.referer, 'admin')){
            var adminExists = false;
            that.active_admins.map(function(client){
                if(socket.handshake.query.session_id == client.session_id){
                    adminExists = true;
                }
            });

            if(!adminExists){
                that.active_admins.push(new Client(socket.id, 'test-admin', 'admin', socket.handshake.query.session_id));
            }
        }

        that.updateClient();

    };

    this.idle_users = [];
    this.ongoing_chats = [];
    this.active_admins = [];
}