module.exports = {
    alreadyChatting : function(socket, ongoing_chats){
        ongoing_chats.map(function(chat){
            chat.clients.map(function(client){
                if(client.session_id == socket.handshake.query.session_id) {
                    return true;
                }
            });
        });

        return false;
    }
};
