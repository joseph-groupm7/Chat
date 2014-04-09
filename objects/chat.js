// A collection of rooms
function Chat(list) {
	this.rooms = list;
}
Chat.prototype.rooms = {};
Chat.prototype.addRoom = function(room) {
	this.rooms[room.room_id] = room;
};
Chat.prototype.getRoom = function(id) {
	return this.rooms[id];
};

module.exports = Chat;