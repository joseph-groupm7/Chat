var _ = require('lodash-node');

// The Client collection wrapper
function Room(id, list) {
	this.roomID = id;
	this.connectedClients = list;
}
Room.prototype.roomID = "";
Room.prototype.connectedClients = {}; // This is an object, NOT an array. This is important.

Room.prototype.getID = function() {
	return this.roomID;
};

Room.prototype.addClient = function(client) {
	this.connectedClients[client.sessionID] = client;
	client.getConnection().join(this.roomID);
	return this;
};

Room.prototype.broadcast = function(connection, event, data, ignore) {
	if (ignore === true) {
		connection.room(this.roomID).except(connection.id).send(event, data);
	}
	else {
		connection.room(this.roomID).send(event, data);
	}
};

Room.prototype.getClient = function(id) {
	var client;
	if ((client = this.connectedClients[id]) !== undefined) {
		return client;
	}
	else {
		return -1;
	}
};

Room.prototype.removeClient = function(clientID) {
	var temp = this.connectedClients[clientID];
	delete this.connectedClients[clientID];
	return temp;
};

Room.prototype.serialize = function() {
	var serial = [];
	_.forEach(this.connectedClients, function(client) {
		serial.push({username: client.username, sessionID: client.sessionID});
	});
	return serial;
};

module.exports = Room;