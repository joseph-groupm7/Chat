module.exports = [

    {method: 'GET', path: '/chat/chats/{room_id}/messages', handler: function(request, reply){
        var storage = require('./../EasyChat/storage')('testdb', 'root', 'root', 'localhost');
        storage.getMessages(request.params.room_id, function(messages){
            reply(messages);
        });
    }}

];