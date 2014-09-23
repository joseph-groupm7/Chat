module.exports = function (email, password, callback) {

    var storage = require('./EasyChat/storage')('testdb', 'root', 'root', 'localhost');
    var Bcrypt = require('bcrypt');

    storage.getUserByEmail(email, function(user){

        if (!user) {
            return callback(null, false);
        }

        if(password !== user.password){
            var err = 'invalid password';
        }

        callback(err, { id: user.id, name: user.name, email: user.email });

    });

};