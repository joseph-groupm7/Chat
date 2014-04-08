var _ = require('lodash-node');

// The Client collection wrapper
function Room(list) {
	this.connected_clients = list;
}
Room.prototype.connected_clients = {};
Room.prototype.addClient = function(client) {
	this.connected_clients[client.socket_id] = client;
};
Room.prototype.getClient = function(id) {
	var client;
	if ((client = this.connected_clients[id]) !== undefined) {
		return client;
	}
	else {
		return -1;
	}
};
Room.prototype.removeClientByReference = function(client) {
	var index = _.findKey(this.connected_clients, function(i) {
		return client == i;
	});
	if (index > 0) {
		return this.removeClientByID(index);
	}
	else {
		return false;
	}
};
Room.prototype.removeClientByID = function(id) {
	return delete this.connected_clients[id];
};
Room.prototype.getConnectedSockets = function() {
	var socketList = [];
	_.forEach(this.connected_clients, function(client) {
		socketList.push(client.socket_id);
	});
	return socketList;
};

module.exports = Room;