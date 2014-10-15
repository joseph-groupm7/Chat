var dotenv = require('dotenv');
dotenv.load();

var Hapi = require('hapi');
var routes = require('./routes');
var socket = require('socket.io');
var _ = require('lodash-node');
var Lobby = require('./EasyChat/Lobby');

var server = new Hapi.Server('localhost', 3000);

//load routes
routes.forEach(function(route){
    server.route(route);
});

//start server
server.start(function () {
    console.log('Server running at:', server.info.uri);
});

var io = socket.listen(server.listener);
var lobby = new Lobby(io);


