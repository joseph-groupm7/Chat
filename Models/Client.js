var _ = require('lodash-node');

module.exports = function(socket){
    this.socket = socket;

    this.username = socket.handshake.query.username;

    if(_.contains(socket.handshake.headers.referer, 'admin')){
        this.type = 'admin';
    }else{
        this.type = 'user';
    }

    this.session_id = socket.handshake.query.session_id;
};