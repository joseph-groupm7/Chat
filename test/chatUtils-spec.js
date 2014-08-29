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

    lab.beforeEach(function (done) {
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

            var chat = chatUtils.createChat([user_client, admin_client], state);

            expect(chat.room).to.equal('session_id2');
            expect(state.idle_users.length).to.equal(0);
            expect(state.ongoing_chats.length).to.equal(1);
            expect(state.active_admins.length).to.equal(1);

            done();
        });
    });

});