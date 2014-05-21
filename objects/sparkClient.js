// These methods extend the Spark prototype of Primus to include a username and an admin flag
function SparkClient(primus) {
	var Spark = primus.Spark;

	Spark.prototype.username = "";
	Spark.prototype.admin = "";

	Spark.prototype.setUsername = function(username) {
		this.username = username;
	};
	Spark.prototype.getUsername = function() {
		return this.username;
	};

	Spark.prototype.setAdmin = function(admin) {
		this.admin = admin;
	};
	Spark.prototype.isAdmin = function() {
		return this.admin;
	};
}

module.exports = SparkClient;