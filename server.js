var hapi = require('hapi');
var routes = require('./routes');
var socket = require('socket.io');

var server = new hapi.Server(3000);

//load routes
routes.forEach(function(route){
    server.route(route);
});

//start node server
server.start(function () {
    console.log('Server running at:', server.info.uri);
});

//open socket and listen on hapi connection
var io = socket.listen(server.listener);

io.on('connection', function(socket){

    socket.on('clientMessage', function(msg){
        console.log(msg);
    });

});