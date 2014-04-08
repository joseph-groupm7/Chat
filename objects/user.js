// User Sub Object
function User(socket_id, username) {
	this.socket_id = socket_id;
	this.username = username;
}
User.prototype.socket_id = "";
User.prototype.username = "";

module.exports = User;