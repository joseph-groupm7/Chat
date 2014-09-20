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
    module.saveMessage = function(room_id, message, name, callback){

        module.connection.query(
            'insert into messages set ?',
            {room_id: room_id, message: message, name: name},
        function(err, result){
            if(err) throw err;
            callback(text);
        });

    };

    //return id of chat on success
    module.saveChat = function(callback){

        module.connection.query(
            'insert into chats values(NULL, NOW(), NOW())',
        function(err, result){
            if(err) throw err;
            callback(result.insertId);
        })

    };

    module.getMessages = function(room_id, callback){

        module.connection.query(
            'select message from messages where chat_id = ?',
            [room_id],
            function(err, result){
                if(err) throw err;
                callback(result);
            })

    };

    return module;

};
