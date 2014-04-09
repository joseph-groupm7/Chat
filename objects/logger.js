function Logger() {

}
// This "log" method will be changed in the future to generate logfiles somewhere on the server, or send them to MySQL
// For now it's just a console.log
Logger.prototype.log = function(message) {
	var now = new Date();
	console.log(now.toUTCString() + " -> " + message);
};

module.exports = Logger;