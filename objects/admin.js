// Admin Sub Object
function Admin(socket_id, username) {
	this.socket_id = socket_id;
	this.username = username;
}
Admin.prototype.socket_id = "";
Admin.prototype.username = "";

module.exports = Admin;