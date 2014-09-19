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
    module.saveMessage = function(chat_id, text, callback){

        module.connection.query(
            'insert into messages set ?',
            {chat_id: chat_id, text: text},
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

    module.getMessages = function(chat, callback){

        module.connection.query(
            'select text from messages where chat_id = ?',
            [chat.room],
            function(err, result){
                if(err) throw err;
                callback(result.insertId);
            })

    };

    return module;

};
