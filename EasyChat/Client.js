var _ = require('lodash-node');

module.exports = function(socket, name, type, session_id){

    this.socket = socket;

    this.name = name;

    this.type = type;

    this.session_id = session_id;

    this.lighten = function(){
        return _.omit(this, 'socket')
    };

};