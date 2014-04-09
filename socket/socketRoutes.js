var io = require('socket.io');

module.exports = function(socket) {
	socket.emit("message", {
		body: getMessage()
	});
};