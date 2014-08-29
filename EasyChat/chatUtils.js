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

    //name of the room is the session_id of the first admin found.
    createChat : function(clients, state){

        var room_name = _.find(clients, {'type': 'admin'}).session_id;

        var roomClients = [];

        clients.map(function(client){
            //remove from idle users when activated, and add user to new chat
            roomClients = roomClients.concat(_.remove(state.idle_users, function(cli){
                return client.session_id == cli.session_id;
            }));

            //add admin to chat
            roomClients = roomClients.concat(_.find(state.active_admins, function(cli){
                return client.session_id == cli.session_id;
            }));
        });

        roomClients.map(function(client){
            if(typeof client == 'undefined'){
                _.remove(roomClients, function(client){
                    return typeof client == 'undefined';
                });
            }
        });

        var chat = new Chat(roomClients, room_name);

        //join each client to room
        chat.clients.map(function(client){
            //join each client to the room
            client.socket.join(chat.room);
        });

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

    },

    refreshClientSocket : function(client, state){

        state.idle_users.map(function(cli){
            if(client.session_id === cli.session_id){
                state.idle_users[state.idle_users.indexOf(cli)] = client;
            }
        });

        state.active_admins.map(function(cli){
            if(client.session_id === cli.session_id){
                state.active_admins[state.active_admins.indexOf(cli)] = client;
            }
        });

        state.ongoing_chats.map(function(chat){
            chat.clients.map(function(cli){
                if(client.session_id === cli.session_id){
                    state.ongoing_chats[state.ongoing_chats.indexOf(cli)] = client;
                    cli.socket.join(chat.room);
                }
            });
        });

    }
};
