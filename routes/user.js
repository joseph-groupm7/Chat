module.exports = [

    {method: 'GET', path: '/chat/user', handler: function(request, reply){
        reply.file('./templates/user.html');
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
            , process.env.secret);
        reply(token);
    }}

];