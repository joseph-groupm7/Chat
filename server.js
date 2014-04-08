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

// Tell express to use the /public directory as the default for static files
app.use(express.static(__dirname + '/public'));

console.log("Server running on port 7020. Socket Server listening on port 7040.");
app.listen(7020);
http.listen(7040);