var _ = require('lodash-node');

// The Client collection wrapper
function Room(id, list) {
	this.room_id = id;
	this.connected_clients = list;
}
Room.prototype.room_id = "";
Room.prototype.connected_clients = {};

Room.prototype.addClient = function(client) {
	this.connected_clients[client.getID()] = client;
	var room = this.room_id;
	client.getConnection().join(room);
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
		socketList.push(client.id);
	});
	return socketList;
};

module.exports = Room;