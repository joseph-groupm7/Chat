// User Sub Object
function User(id, username) {
	this.username = username;
}
User.prototype.id = "";
User.prototype.username = "";

module.exports = User;