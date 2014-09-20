var Chat = require('../EasyChat/Chat');
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

    rejoinChats : function(client, state){

        var chats = [];

        //looks for clients by session_id and if they are found, replace them with the new client, and rejoin the room
        state.ongoing_chats.map(function(chat){
            chat.clients.map(function(cli){
                if(client.session_id == cli.session_id) {
                    cli = client;
                    cli.socket.join(chat.room);
                    if(typeof cli.socket.emit === 'function'){
                        cli.socket.emit('lobby.activateChat', chat.lighten());
                    }
                    chats.push(chat);
                }
            });
        });

        return chats;

    },

    getClientBySession : function(session_id, state){

        var i;

        for(i=0;i<state.idle_users.length;i++){
            if (session_id === state.idle_users[i].session_id) {
                return state.idle_users[i];
            }
        }

        for(i=0;i<state.active_admins.length;i++){
            if (session_id === state.active_admins[i].session_id) {
                return state.active_admins[i];
            }
        }

        for(i=0;i<state.ongoing_chats.length;i++){
            if (session_id === state.ongoing_chats[i].session_id) {
                return state.ongoing_chats[i];
            }
        }

    },

    createChat : function(room_id, clients, state){

        var roomClients = [];

        clients.map(function(client){

            //remove from idle users when activated, and add user to new chat
            state.idle_users.map(function(cli){
                if(client.session_id === cli.session_id){
                    roomClients.push(cli);
                    state.idle_users.splice(state.idle_users.indexOf(cli));
                }
            });

            //add admin to roomClients and leave in active admins
            state.active_admins.map(function(cli){
                if(client.session_id === cli.session_id){
                    roomClients.push(cli);
                }
            });

        });

        var chat = new Chat(roomClients, room_id);

        //join each client to room
        chat.clients.map(function(client){
            //join each client to the room
            client.socket.join(chat.room_id);
        });

        //update state
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
                return 'idle_users';
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
                return 'active_admins';
            }
        }

    },

    refreshClientSocket : function(client, state, callback){

        var i;

        //check idle_users
        for(i=0;i<state.idle_users.length;i++){
            if (client.session_id === state.idle_users[i].session_id) {
                state.idle_users[i] = client;
            }
        }

        //check active_admins
        for(i=0;i<state.active_admins.length;i++){
            if (client.session_id === state.active_admins[i].session_id) {
                state.active_admins[i] = client;
            }
        }

        //check ongoing_chats
        var room_id = false;
        state.ongoing_chats.map(function(chat){
            chat.clients.map(function(cli){
                if (client.session_id === cli.session_id) {

                    cli = client;
                    room_id = chat.room_id;

                }
            });
        });

        //else add it where it belongs based on client type
        if(!room_id){
            this.addClientToLobby(client, state);
            if(typeof callback === 'function'){
                callback();
            }
        }else{
            if(typeof callback === 'function'){
                callback(room_id);
            }
        }

    }
};
