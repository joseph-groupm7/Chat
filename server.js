var hapi = require('hapi');
var routes = require('./routes');
var socket = require('socket.io');
var _ = require('lodash-node');
var Lobby = require('./EasyChat/Lobby');

var server = new hapi.Server(3000);

//cookies
server.pack.register({
    plugin: require('yar'),
    options: {
        cookieOptions: {
            isSecure: false,
            password: 'seems secure'
        }
    }
}, function(err){console.log(err)});

//authentication
server.pack.register(require('hapi-auth-basic'), function (err) {
    server.auth.strategy('simple', 'basic', { validateFunc: require('./validate') });
});

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


