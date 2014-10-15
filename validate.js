module.exports = function (email, password, callback) {

    var storage = require('./EasyChat/storage')(process.env.database, process.env.username, process.env.password, process.env.hostname);

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