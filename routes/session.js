// Include the Cryptographic library to help us generate unique session ID hashes
var hash = require('crypto');

// Set up an API endpoint that gives a user a session ID
module.exports.getSessionKey = function(req, res) {
	if (!req.session.sessionID) {
		var sessionID = hash.createHash('md5');
		sessionID.update("" + (new Date().getTime() + Math.floor(Math.random() * 500)));
		req.session.sessionID = sessionID.digest('base64');
	}
	res.send(req.session);
};