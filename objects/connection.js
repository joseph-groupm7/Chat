function Connection(username, isAdmin, spark, sessionID) {
	this.username  = username;
	this.isAdmin   = isAdmin;
	this.spark     = spark;
	this.sessionID = sessionID;
}

Connection.prototype.username  = "";
Connection.prototype.isAdmin   = "";
Connection.prototype.spark     = "";
Connection.prototype.sessionID = "";

Connection.prototype.getConnection = function() {
	return this.spark;
};

Connection.prototype.setConnection = function(spark) {
	this.spark = spark;
};

module.exports = Connection;