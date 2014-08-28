var Chat = require('../Models/Chat');
var _ = require('lodash-node');

module.exports = {
    alreadyChatting : function(client, state){

        var exists = false;

        state.ongoing_chats.map(function(chat){
            chat.clients.map(function(cli){
                if(client.session_id == cli.session_id) {
                    exists = true;
                }
            });
        });

        return exists;
    },

    rejoinChat : function(client, state){

        var room = false;

        state.ongoing_chats.map(function(chat){
            chat.clients.map(function(cli){
                if(client.session_id == cli.session_id) {
                    client.socket.join(chat.room);
                    room = chat.room;
                }
            });
        });

        return room;

    },

    createChat : function(pair, state){

        var room_name = pair.user.session_id+pair.admin.session_id;
        var clients = [];

        //remove from idle users when activated, and add user to new chat
        clients = clients.concat(_.remove(state.idle_users, function(client){
            return client.session_id == pair.user.session_id;
        }));

        //add admin to chat
        clients = clients.concat(_.find(state.active_admins, {'session_id': pair.admin.session_id}));

        var chat = new Chat(clients, room_name);

        state.ongoing_chats.push(chat);

        return chat;

    },

    addClientToLobby : function(client, state){

        if(client.type === 'user'){

            var userExists = false;
            state.idle_users.map(function(cli){
                if(client.session_id == cli.session_id){
                    userExists = true;
                }
            });

            if(!userExists){
                state.idle_users.push(client);
            }

        }else if(client.type === 'admin'){
            var adminExists = false;
            state.active_admins.map(function(cli){
                if(client.session_id == cli.session_id){
                    adminExists = true;
                }
            });

            if(!adminExists){
                state.active_admins.push(client);
            }
        }

    }
};
