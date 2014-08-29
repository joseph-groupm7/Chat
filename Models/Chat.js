var _ = require('lodash-node');

module.exports = function(clients, room){
    var that = this;
    this.clients = clients;
    this.room = room;
    this.lighten = function(){
        var lightChat = _.cloneDeep(that);
        lightChat.clients.map(function(client){
            client.socket = undefined;
        });
        return lightChat;
    }
};