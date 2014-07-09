// server.js (Express 4.0)
var _              = require('lodash-node'); // The Lo-Dash helper library
var express        = require('express'); // Load the Express framework
var bodyParser     = require('body-parser'); // Tell express that it needs to parse POST requests
var methodOverride = require('method-override'); // Allow express to interpret "GET" requests as "PUT" and "DELETE"
var app            = express(); // Instantiate the Express app
var http           = require('http').createServer(app); // Set up an HTTP server for sockets to attach to
var Spark          = require('primus.io'); // Include the Primus library...
var primus         = new Spark(http, {parser: 'JSON', transformer: 'engine.io'}); // ...then use it to wrap Engine.IO
var session        = require('cookie-session'); // Tell Express it needs to use sessions

// Set up Express to use sessions, and set the passphrases to verify cookie authenticity
app.use(session({
	keys: ["Keyboard Cat", "Correct Horse"]
}));

// Server Helper Objects
var Room       = require("./objects/room.js");
var Chat       = require("./objects/chat.js");
var Log        = require("./objects/logger.js");
var Connection = require("./objects/connection.js");

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
app.get("/session", routes.session.getSessionKey);

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
		debug.log(data.sessionID);
		var client;
		// If the client connecting has a sessionID that's already in the connection list, reconnect them
		if (connectionList[data.sessionID]) {
			debug.log("A client has rejoined.");
			client = connectionList[data.sessionID];
			client.setConnection(connection);
		}
		else {
			debug.log("A new client has connected.");
			// Otherwise, create a new client and add them to the connection list
			client = new Connection(data.username, false, connection, data.sessionID);
			connectionList[client.sessionID] = client;
			chat.getRoom("idleUsers")
				.addClient(client);
			// And then alert the admins
			chat.getRoom("admins")
				.broadcast(connection, "newUserConnect", {username: client.username, id: client.sessionID}, true);
		}

		callback(data.sessionID);
	});

	connection.on("adminConnect", function(data, callback) {
		debug.log(data.sessionID);
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

			console.log(admin);
			admin.username = "Foo Bar";
			console.log(admin);
			console.log(connectionList);
		}

		callback(data.sessionID);
	});

	connection.on("adminEstablishChat", function(data, callback) {
		debug.log("An admin has established a chat with a user.");
		chat.getRoom("idleUsers").removeClient(data.id);

		var roomName = data.me + data.id;
		var room = new Room(roomName, {});

		room.addClient(connectionList[data.me])
			.addClient(connectionList[data.id]);

		chat.addRoom(room);
		room.broadcast(connection, "adminChatEstablished", {username: connectionList[data.me].username, room: roomName}, true);
		callback(true, roomName);
	});

	connection.on("syncIdleUsers", function(data, callback) {
		// Verify that an admin is here?
		callback(chat.getRoom("idleUsers").serialize());
	});

	connection.on("syncAdminChats", function(data, callback) {
		// Verify that an admin is here?
	});

	connection.on("sendMessage", function(data, callback) {
		debug.log("A message was received: " + data.body + " -> Message from connection ID " + data.sessionID);
		debug.log("The message was sent to room ID " + data.roomID);

		var from = connectionList[data.sessionID];
		if (from.isAdmin) {
			type = "admin";
		}
		else {
			type = "client";
		}

		var message = {from: type, body: data.body, timestamp: 12345};
		chat.getRoom(data.roomID).broadcast(connection, "messageFromRoom", message, false);
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

debug.log("The server has started. Running on port 7040.");
http.listen(7040);