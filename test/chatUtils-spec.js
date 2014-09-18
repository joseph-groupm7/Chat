var Lab = require('lab');
var lab = exports.lab = Lab.script();

var describe = lab.describe;
var it = lab.it;
var before = lab.before;
var after = lab.after;
var expect = Lab.expect;

var chatUtils = require('../EasyChat/chatUtils');
var Chat = require('../Models/Chat');
var Client = require('../Models/Client');
var state = require('../EasyChat/state');

lab.experiment('chatUtils', function () {

    lab.beforeEach(function(done) {
        done();
        state = require('../EasyChat/state')();
    });

    describe("chatUtils.alreadyChatting", function () {
        it("should tell me if a user is in a chat room by session", function (done) {
            var mocksocket = {
                handshake: {
                    headers: {
                        referer: '...user...'
                    },
                    query: {
                        session_id: 'session_id'
                    }
                }
            };

            var client = new Client(mocksocket);
            var chat = new Chat([client], 'room-name');
            state.ongoing_chats.push(chat);

            expect(chatUtils.alreadyChatting(client, state)).to.equal(true);
            done();
        });
    });

    describe("chatUtils.rejoinChats", function () {
        it("should rejoin a room by session_id", function (done) {
            var mocksocket = {
                join: function(){
                    return true;
                },
                handshake: {
                    headers: {
                        referer: '...user...'
                    },
                    query: {
                        session_id: 'session_id'
                    }
                }
            };

            var client = new Client(mocksocket);
            var chat = new Chat([client], 'room-name');
            state.ongoing_chats.push(chat);

            expect(chatUtils.rejoinChats(client, state)[0].room).to.equal('room-name');
            done();
        });
    });

    describe("chatUtils.createChat", function () {
        it("should create a chat with any number of clients, removing the users from idle_lobby", function (done) {

            var usersocket = {
                join: function(){
                    return true;
                },
                handshake: {
                    headers: {
                        referer: '...user...'
                    },
                    query: {
                        session_id: 'session_id1'
                    }
                }
            };

            var adminsocket = {
                join: function(){
                    return true;
                },
                handshake: {
                    headers: {
                        referer: '...admin...'
                    },
                    query: {
                        session_id: 'session_id2'
                    }
                }
            };

            var user_client = new Client(usersocket);
            var admin_client = new Client(adminsocket);

            state.idle_users.push(user_client);
            state.active_admins.push(admin_client);

            expect(state.idle_users.length).to.equal(1);
            expect(state.ongoing_chats.length).to.equal(0);
            expect(state.active_admins.length).to.equal(1);

            chatUtils.createChat([user_client, admin_client], state).then(function(chat){
                expect(chat.room).to.equal('session_id2');
                expect(state.idle_users.length).to.equal(0);
                expect(state.ongoing_chats.length).to.equal(1);
                expect(state.active_admins.length).to.equal(1);
                done();
            });

        });
    });

    describe('chatUtils.refreshClientSocket', function(){
       it('should find clients the client in the state with the same session_id and replace the socket', function(done){
           var socket1 = {
               id: '1',
               join: function(){
                   return true;
               },
               handshake: {
                   headers: {
                       referer: '...user...'
                   },
                   query: {
                       session_id: 'session_id1'
                   }
               }
           };
           var socket2 = {
               id: '2',
               join: function(){
                   return true;
               },
               handshake: {
                   headers: {
                       referer: '...user...'
                   },
                   query: {
                       session_id: 'session_id1'
                   }
               }
           };

           var client1 = new Client(socket1);

           state.idle_users.push(client1);

           var client2 = new Client(socket2);

           chatUtils.refreshClientSocket(client2, state);


           expect(state.idle_users[0].socket.id).to.equal('2');
           done();

       });

        it('should_not_add_client_back_in_idle_users_after_disconnects', function(done){
            var socket1 = {
                id: '1',
                join: function(){
                    return true;
                },
                handshake: {
                    headers: {
                        referer: '...user...'
                    },
                    query: {
                        session_id: 'session_id1'
                    }
                }
            };

            var socket2 = {
                id: '2',
                join: function(){
                    return true;
                },
                handshake: {
                    headers: {
                        referer: '...admin...'
                    },
                    query: {
                        session_id: 'session_id2'
                    }
                }
            };

            var client1 = new Client(socket1);
            var client2 = new Client(socket2);

            state.idle_users.push(client1);
            state.active_admins.push(client2);

            expect(state.idle_users.length).to.equal(1);
            expect(state.ongoing_chats.length).to.equal(0);
            expect(state.active_admins.length).to.equal(1);

            chatUtils.createChat([client1, client2], state);

            expect(state.idle_users.length).to.equal(0);
            expect(state.ongoing_chats.length).to.equal(1);
            expect(state.active_admins.length).to.equal(1);

            chatUtils.refreshClientSocket(client1, state);

            expect(state.idle_users.length).to.equal(0);
            expect(state.ongoing_chats.length).to.equal(1);
            expect(state.active_admins.length).to.equal(1);

            done();


        });
    });

    describe('chatUtils.getClientBySession', function(){
        it('should return a client object when given a session id that exists in the lobby', function(done){
            var socket1 = {
                id: '1',
                join: function(){
                    return true;
                },
                handshake: {
                    headers: {
                        referer: '...user...'
                    },
                    query: {
                        session_id: 'session_id1'
                    }
                }
            };

            var client1 = new Client(socket1);

            state.idle_users.push(client1);

            var client = chatUtils.getClientBySession('session_id1', state);
            console.log(client);
            expect(client.session_id).to.equal('session_id1');
            done();

        });
    });

});