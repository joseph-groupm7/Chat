module.exports = [

    {method: 'GET', path: '/chat/admin', handler: function(request, reply){
        reply.file('./templates/admin.html');
    }},
    {method: 'GET', path: '/chat/admin/login', handler: function(request, reply){
        reply.file('./templates/login.html');
    }},

    //Admin token
    {method: 'POST', path: '/chat/admin/auth', handler: function(request, reply){
        require('./../validate')(request.payload.email, request.payload.password, function(err, user){
            if(typeof err === 'undefined'){
                var jwt = require('jsonwebtoken');
                var token = jwt.sign(
                    {
                        name: user.name,
                        email: user.email,
                        type: 'admin'
                    }
                    , require('./../secret'));
                reply(token);
            }else{
                reply('failure');
            }
        });
    }}

];