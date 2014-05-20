// Admin Sub Object
function Admin(connection, username) {
	this.id = connection.id;
	this.connection = connection;
	this.username = username;
}

Admin.prototype.id = "";
Admin.prototype.connection = "";
Admin.prototype.username = "";

Admin.prototype.getConnection = function() {
	return this.connection;
};

Admin.prototype.getID = function() {
	return this.id;
};

module.exports = Admin;