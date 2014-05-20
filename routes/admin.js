var path = require('path');

module.exports.sendChatClient = function(req, res) {
	// Express considers relative paths a security risk, so the path needs to be resolved to absolute
	// before it can be used.
	var location = path.resolve(__dirname + '/../public/angular/admin.html');
	res.sendfile(location);
};