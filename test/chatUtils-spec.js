var Lab = require('lab');
var lab = exports.lab = Lab.script();

var describe = lab.describe;
var it = lab.it;
var before = lab.before;
var after = lab.after;
var expect = Lab.expect;

var chatUtils = require('../EasyChat/chatUtils');
var Chat = require('../EasyChat/Chat');
var Client = require('../EasyChat/Client');
var state = require('../EasyChat/state');

lab.experiment('chatUtils', function () {

    describe("chatUtils.alreadyChatting", function () {
        it("should tell me if a user is in a chat room by session", function (done) {
            var state = require('../EasyChat/state')();

            var client = new Client({}, 'name_of_user', 'user', 'session_id');

            var chat = new Chat([client], 1);

            state.ongoing_chats.push(chat);

            expect(chatUtils.alreadyChatting(client, state)).to.equal(true);

            done();
        });
    });

    describe("chatUtils.rejoinChats", function () {
        it("should rejoin a room by session_id", function (done) {
            var state = require('../EasyChat/state')();

            var client = new Client({join: function(){return true;}}, 'name_of_user', 'user', 'session_id');

            var chat = new Chat([client], 1);

            state.ongoing_chats.push(chat);

            expect(chatUtils.rejoinChats(client, state)[0].room_id).to.equal(1);

            done();
        });
    });

    describe("chatUtils.createChat", function () {
        it("should create a chat with any number of clients, removing the users from idle_lobby", function (done) {
            var state = require('../EasyChat/state')();

            var user_client = new Client({join: function(){return true;}}, 'name_of_user', 'user', 'session_id1');
            var admin_client = new Client({join: function(){return true;}}, 'name_of_admin', 'admin', 'session_id2');

            state.idle_users.push(user_client);
            state.active_admins.push(admin_client);

            expect(state.idle_users.length).to.equal(1);
            expect(state.ongoing_chats.length).to.equal(0);
            expect(state.active_admins.length).to.equal(1);

            var chat = chatUtils.createChat(1, [user_client, admin_client], state);

            expect(chat.room_id).to.equal(1);
            expect(state.idle_users.length).to.equal(0);
            expect(state.ongoing_chats.length).to.equal(1);
            expect(state.active_admins.length).to.equal(1);
            done();

        });
    });

    describe('chatUtils.refreshClientSocket', function(){
       it('should find clients the client in the state with the same session_id and replace the socket', function(done){
           var state = require('../EasyChat/state')();

           var client1 = new Client(
               {
                   id: 1,
                   join: function(){return true;}
               }, 'name_of_user', 'user', 'session_id1');

           state.idle_users.push(client1);

           var client2 = new Client(
               {
                   id: 2,
                   join: function(){return true;}
               }, 'name_of_user', 'user', 'session_id1');

           chatUtils.refreshClientSocket(client2, state);

           expect(state.idle_users[0].socket.id).to.equal(2);
           done();

       });

        it('should_not_add_client_back_in_idle_users_after_disconnects', function(done){
            var state = require('../EasyChat/state')();

            var client1 = new Client({join: function(){return true;}}, 'name_of_user', 'user', 'session_id1');
            var client2 = new Client({join: function(){return true;}}, 'name_of_admin', 'admin', 'session_id2');

            state.idle_users.push(client1);
            state.active_admins.push(client2);

            expect(state.idle_users.length).to.equal(1);
            expect(state.ongoing_chats.length).to.equal(0);
            expect(state.active_admins.length).to.equal(1);

            chatUtils.createChat(1, [client1, client2], state);

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
            var state = require('../EasyChat/state')();

            var client1 = new Client({join: function(){return true;}}, 'name_of_user', 'user', 'session_id1');

            state.idle_users.push(client1);

            var client = chatUtils.getClientBySession('session_id1', state);

            expect(client.session_id).to.equal('session_id1');
            done();

        });
    });

});