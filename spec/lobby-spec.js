var chatUtils = require('../chatUtils');
var Chat = require('../Models/Chat');
var Client = require('../Models/Client');

describe("test", function () {
    it("should tell me if a user is in a chat room by session", function () {
        var mocksocket = {
            handshake: {
                query: {
                    session_id: 'session_id'
                }
            }
        };
        expect(
            chatUtils.alreadyChatting(
                mocksocket,
                [new Chat([new Client('mock', 'mock', 'mock', 'session_id')], 'mock room')]
            )
        ).toBe(true);
    });
});