module.exports = lobby;


var socket = require('socket.io');
var Client = require('./Client');
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
            var Room = [];
            Room = Room.concat(_.remove(that.idle_users, function(client){
                return client.id == users.user_id;
            }));
            Room = Room.concat(_.remove(that.active_admins, function(client){
                return client.id == users.admin_id;
            }));

            var nsp_name = '/'+users.user_id.toString()+users.admin_id.toString();
            var nsp = io.of(nsp_name);
            console.log('new namespace: ' + nsp_name);
            console.log(Room);

            Room.map(function(client){
                io.to(client.id).emit('lobby.activateChat', nsp_name);
                console.log(nsp_name, client.id);
            });

            that.updateClient();

        })

    });

    this.updateClient = function(){
        io.sockets.emit('lobby', this);
    };

    this.idle_users = [];
    this.ongoing_chats = [];
    this.active_admins = [];
}