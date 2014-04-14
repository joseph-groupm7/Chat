// server.js (Express 4.0)
var _                = require('lodash-node'); // The Lo-Dash helper library
var express          = require('express'); // Load the Express framework
var bodyParser       = require('body-parser'); // Tell express that it needs to parse POST requests
var methodOverride   = require('method-override'); // Allow express to interpret "GET" requests as "PUT" and "DELETE"
var app              = express(); // Instantiate the Express app
var http             = require('http').createServer(app); // Set up an HTTP server for Socket.IO to attach to
var io               = require('socket.io').listen(http, {log: false}); // Attach the Socket server to the HTTP server

// Server Helper Objects
var User  = require("./objects/user.js");
var Admin = require("./objects/admin.js");
var Room  = require("./objects/room.js");
var Chat  = require("./objects/chat.js");
var Log   = require("./objects/logger.js");

// Server Routes
var routes = require("./routes");
var socket = require("./socket/socketRoutes.js");

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
var idleUserPool       = new Room("idle_users", {});
var connectedAdminPool = new Room("admins", {});
var chat               = new Chat({});
	chat.addRoom(idleUserPool);
	chat.addRoom(connectedAdminPool);

/*
 * This is where the Socket code starts.
 */
io.sockets.on("connection", function(socket) {
	/*
	 * Emitted by the client chat on login
	 * Data:
	 * @username -> Client's username
	 */
	socket.on("userConnect", function(data) {
		debug.log("A user has connected: " + data.username, socket.id);
		chat.getRoom("idle_users").addClient(new User(socket.id, data.username));
	});

	/*
	 * Emitted by the admin chat on login
	 * Data:
	 * @username -> Admin's Username
	 * @token -> Admin login token to prevent users from jumping into the admin pool
	 */
	socket.on("adminConnect", function(data) {
		debug.log("An admin has connected: " + data.username, socket.id);
		chat.getRoom("admins").addClient(new Admin(socket.id, data.username));
	});

	/*
	 * Emitted by an admin when they connect to a user
	 * Data:
	 * @user_id -> The ID of the user to pull into the admin's room
	 */
	socket.on("admin_connect_to_user", function(data) {
		var admin = chat.getRoom("admins").getClient(socket.id);
		var user  = chat.getRoom("idle_users").getClient(data.user_id);

		chat.addRoom(new Room(admin.socket_id + "_" + user.socket_id, {}));
	});
});
/*
 * This is where the Socket code stops.
 */

// Tell express to use the /public directory as the default for static files
app.use(express.static(__dirname + '/public'));

debug.log("The server has started. Running HTTP on port 7020 and Websocket on port 7040.");
app.listen(7020);
http.listen(7040);