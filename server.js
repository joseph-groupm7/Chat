// server.js (Express 4.0)
var _              = require('lodash-node'); // The Lo-Dash helper library
var express        = require('express'); // Load the Express framework
var bodyParser     = require('body-parser'); // Tell express that it needs to parse POST requests
var methodOverride = require('method-override'); // Allow express to interpret "GET" requests as "PUT" and "DELETE"
var app            = express(); // Instantiate the Express app
var http           = require('http').createServer(app); // Set up an HTTP server for sockets to attach to
var Spark          = require('primus.io'); // Include the Primus library...
var primus         = new Spark(http, {parser: 'JSON', transformer: 'engine.io'}); // ...then use it to wrap Engine.IO

// Server Helper Objects
var User  = require("./objects/user.js");
var Admin = require("./objects/admin.js");
var Room  = require("./objects/room.js");
var Chat  = require("./objects/chat.js");
var Log   = require("./objects/logger.js");

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

// Persistent server variables
var debug              = new Log();
var idleUserPool       = new Room("idleUsers", {});
var connectedAdminPool = new Room("admins", {});
var chat               = new Chat({});
	chat.addRoom(idleUserPool);
	chat.addRoom(connectedAdminPool);

/*
 * This is where the Socket code starts.
 */

primus.on("connection", function(connection) {
	debug.log("A user has connected.");

	connection.on("userConnect", function(data) {
		var newUser = new User(data.username);
		chat.getRoom("idleUsers").addClient(newUser);
		debug.log("A user was added to the idle pool.");
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
app.listen(7020);
http.listen(7040);