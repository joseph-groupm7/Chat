module.exports = [

    {method: 'GET', path: '/chat/admin', handler: function(request, reply){
        reply.file('./templates/admin.html');
    }},
    {method: 'GET', path: '/chat/admin/login', handler: function(request, reply){
        reply.file('./templates/login.html');
    }},

    //Admin token
    //invalid credentials: error
    //correct credentials: token
    //already has cookie.token valid: cookie.token
    //already has token invalid: new token
    {method: 'POST', path: '/chat/admin/auth', handler: function(request, reply){

        var jwt = require('jsonwebtoken');

        jwt.verify(request.state.token, require('./../secret'), function(err, decoded){

            if(err){
                require('./../validate')(request.payload.email, request.payload.password, function(err, user){

                    if(typeof err === 'undefined'){

                        var jwt = require('jsonwebtoken');

                        var token = jwt.sign(
                            {
                                name: user.name,
                                email: user.email,
                                type: 'admin'
                            },
                            require('./../secret')
                        );

                        reply(token);

                    }else{

                        reply({
                            error: true,
                            name: 'InvalidCredentialsError',
                            message: 'Invalid Email or Password'
                        });

                    }
                });
            }else{
                reply(request.state.token);
            }

        });

    }}

];