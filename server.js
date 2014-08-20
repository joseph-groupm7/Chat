var hapi = require('hapi');
var routes = require('./routes');
var socket = require('socket.io');
var _ = require('lodash-node');

var server = new hapi.Server(3000);

//load routes
routes.forEach(function(route){
    server.route(route);
});

//start server
server.start(function () {
    console.log('Server running at:', server.info.uri);
});

//open socket
var io = socket.listen(server.listener);

var lobby = {
    idle_users: [],
    ongoing_chats: [],
    active_admins: []
};

io.on('connection', function(socket){

    //add client and admin to respective idles on connect
    if(_.contains(socket.handshake.headers.referer, 'client')){
        lobby.idle_users.push(socket);
    }else if(_.contains(socket.handshake.headers.referer, 'admin')){
        lobby.active_admins.push(socket);
    }

    //remove from lobby on disconnect
    socket.on('disconnect', function(){
        _.pull(lobby.idle_users, socket);
        _.pull(lobby.active_admins, socket);
    });

    //test message
    socket.on('message', function(message){
        socket.broadcast.emit('message', message);
    });

    //show users in admin

});



