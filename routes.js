module.exports = [
    //static file serving
    {path: "/public/{path*}", method: "GET", handler: {directory: {path: "./public", listing: false, index: false}}},
    {path: "/bower_components/{path*}", method: "GET", handler: {directory: {path: "./bower_components", listing: false, index: false}}},

    //application routing
    {method: 'GET', path: '/chat/user', handler: function(request, reply){
        reply.file('./templates/user.html');
    }},
    {method: 'GET', path: '/chat/admin', handler: function(request, reply){
        reply.file('./templates/admin.html');
    }},
    {method: 'GET', path: '/chat/admin/login', handler: function(request, reply){
        reply.file('./templates/login.html');
    }},
    {method: 'POST', path: '/chat/admin/login', handler: function(request, reply){
        var storage = require('./EasyChat/storage');
        //TODO: result should auth in database and return valid T|F, name and type of user
        storage.authUser(request.payload.email, request.payload.password, function(result){
            if(result.valid){
                var token = jwt.sign(
                    {
                        name: result.name,
                        email: request.payload.email,
                        type: 'admin'
                    }
                    , require('./secret'));
                reply(token);
            }else{
                reply('invalid');
            }
        });
    }},

    //User token
    {method: 'POST', path: '/chat/user/auth', handler: function(request, reply){
        var jwt = require('jsonwebtoken');
        var token = jwt.sign(
            {
                name: request.payload.name,
                email: request.payload.email,
                type: 'user'
            }
            , require('./secret'));
        reply(token);
    }},

    //Admin token
    {method: 'POST', path: '/chat/admin/auth', handler: function(request, reply){
        var jwt = require('jsonwebtoken');
        var storage = require('./EasyChat/storage');
        if(storage.authUser(request.payload.email, request.payload.password)){

        }else{
            reply('invalid!');
        }

    }},

    {method: 'GET', path: '/chat/chats/{room_id}/messages', handler: function(request, reply){
        var storage = require('./EasyChat/storage')('testdb', 'root', 'root', 'localhost');
        storage.getMessages(request.params.room_id, function(messages){
            reply(messages);
        });
    }}
];