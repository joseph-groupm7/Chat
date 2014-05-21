// server.js (Express 4.0)
var _              = require('lodash-node'); // The Lo-Dash helper library
var express        = require('express'); // Load the Express framework
var bodyParser     = require('body-parser'); // Tell express that it needs to parse POST requests
var methodOverride = require('method-override'); // Allow express to interpret "GET" requests as "PUT" and "DELETE"
var app            = express(); // Instantiate the Express app
var http           = require('http').createServer(app); // Set up an HTTP server for sockets to attach to
var Spark          = require('primus.io'); // Include the Primus library...
var primus         = new Spark(http, {parser: 'JSON', transformer: 'engine.io'}); // ...then use it to wrap Engine.IO
var session        = require('cookie-session');
var hash           = require('crypto');

app.use(session({
	keys: ["Keyboard Cat", "Correct Horse"]
}));

// Server Helper Objects
var Client     = require("./objects/sparkClient.js");
var Room       = require("./objects/room.js");
var Chat       = require("./objects/chat.js");
var Log        = require("./objects/logger.js");
var Connection = require("./objects/connection.js");

// Set up some useful properties on the Connection object that will greatly simplify working with connections
primus.use("client", {
	server: Client
});

// Server Routes
var routes = require("./routes");

// App Configuration
app.use(bodyParser());
app.use(methodOverride());

// Express Routes
// The /client and /admin route sends the chat application for the user side
// Debug shows stats for GroupM7
app.get("/client", routes.client.sendChatClient);
app.get("/admin", routes.admin.sendChatClient);
app.get("/debug", routes.debug.showStats);

// Set up an API endpoint that gives a user a session ID
app.get("/session", function(req, res) {
	if (!req.session.sessionID) {
		var sessionID = hash.createHash('md5');
		sessionID.update("" + (new Date().getTime() + Math.floor(Math.random() * 500)));
		req.session.sessionID = sessionID.digest('base64');
	}
	res.send(req.session);
});

// Persistent server variables
var debug              = new Log();
var idleUserPool       = new Room("idleUsers", {});
var connectedAdminPool = new Room("admins", {});
var chat               = new Chat({});
	chat.addRoom(idleUserPool);
	chat.addRoom(connectedAdminPool);

// A simple collection of all the connected users
var connectionList = {};

/*
 * This is where the Socket code starts.
 */

primus.on("connection", function(connection) {
	debug.log("Connection ID " + connection.id + " has connected");

	connection.on("userConnect", function(data, callback) {
		debug.log("A user was added to the idle pool.");

		/*
		if (this user's sessionID exists in some pool of disconnected people...) {
			reinitialize this user and update their
		}
		else {
		 */
		var client = new Connection(data.username, true, connection, data.sessionID);
		chat.getRoom("idleUsers")
			.addClient(client);
		chat.getRoom("admins")
			.broadcast(connection, "newUserConnect", {username: client.username, id: client.sessionID}, true);

		callback(connection.id);
	});

	connection.on("adminConnect", function(data, callback) {
		var admin;
		// If the admin connecting has a sessionID that's already in the connection list, reconnect them
		if (connectionList[data.sessionID]) {
			debug.log("An admin has rejoined.");
			admin = connectionList[data.sessionID];
			admin.setConnection(connection);
		}
		else {
			debug.log("A new admin has connected.");
			// Otherwise, create a new admin and add them to the connection list
			admin = new Connection(data.username, true, connection, data.sessionID);
			connectionList[admin.sessionID] = admin;
			chat.getRoom("admins")
				.addClient(admin)
				.broadcast(connection, "newAdminConnect", {username: admin.username, id: admin.sessionID}, true);
		}

		callback(connection.id);
	});

	connection.on("sendMessage", function(data, callback) {
		debug.log("A message was received: " + data.body + " -> Message from connection ID " + connection.id);
		debug.log("The message was sent to room ID " + data.roomID);
		callback(true);
	});
});

/*
 * This is where the Socket code stops.
 */

// Tell express to use the /public directory as the default for static files
app.use(express.static(__dirname + '/public'));
// And if it isn't in /public, check in /bower_components
app.use(express.static(__dirname + '/bower_components'));

debug.log("The server has started. Running HTTP on port 7020 and Websocket on port 7040.");
http.listen(7040);