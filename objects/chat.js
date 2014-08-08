module.exports = Chat;

function Chat(list) {
	this.rooms = list;
}
Chat.prototype.rooms = {};
Chat.prototype.addRoom = function(room) {
	this.rooms[room.getID()] = room;
	return this.rooms[room.getID()];
};
Chat.prototype.getRoom = function(id) {
	return this.rooms[id];
};