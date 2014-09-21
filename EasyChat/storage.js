module.exports = function(database, user, password, host){

    var module = {};

    var mysql = require("mysql");

    module.connection = mysql.createConnection({
        database: database,
        host: host,
        user: user,
        password: password
    });

    //returns message on success
    module.saveMessage = function(room_id, text, name, callback){
        module.connection.query(
            'insert into messages set ?',
            {room_id: room_id, message: text, name: name},
        function(err, result){
            if(err) throw err;
            callback(text);
        });

    };

    //return id of chat on success
    module.saveChat = function(callback){

        module.connection.query(
            'insert into rooms values(NULL, NOW(), NOW())',
        function(err, result){
            if(err) throw err;
            callback(result.insertId);
        });

    };

    module.getMessages = function(room_id, callback){

        module.connection.query(
            'select message from messages where room_id = ?',
            [room_id],
            function(err, result){
                if(err) throw err;
                callback(result);
            });

    };

    module.authUser = function(email, password){

        module.connection.query(
            'select message from messages where room_id = ?',
            [room_id],
            function(err, result){
                if(err) throw err;
                callback(result);
            });

    };

    return module;

};
