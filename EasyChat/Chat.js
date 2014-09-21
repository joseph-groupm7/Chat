var _ = require('lodash-node');

module.exports = function(clients, room_id){
    var that = this;
    this.clients = clients;
    this.room_id = room_id;
    this.lighten = function(){
        var lightChat = _.cloneDeep(that);
        lightChat.clients.map(function(client){
            client.socket = undefined;
        });
        return lightChat;
    }
};