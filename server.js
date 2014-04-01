// server.js (Express 4.0)
var _              = require('lodash-node'); // The Lo-Dash helper library
var express        = require('express'); // Load the Express framework
var bodyParser     = require('body-parser'); // Tell express that it needs to parse POST requests
var methodOverride = require('method-override'); // Allow express to interpret "GET" requests as "PUT" and "DELETE"
var app            = express(); // Instantiate the Express app
var http		   = require('http').createServer(app); // Set up an HTTP server for Socket.IO to attach to
var io             = require('socket.io').listen(http); // Attach the Socket server to the HTTP server

app.use(bodyParser());
app.use(methodOverride());

// Express Routes
// The /client route sends the chat application for the user side
app.get("/client", function(req, res) {
	res.sendfile(__dirname + "/public/angular/client.html");
});

app.get("/debug", function(req, res) {
	res.json(userPool);
});

// Persistent Socket Variables
var userPool = [];

// Socket Events
io.sockets.on("connection", function(socket) {
	socket.on("chatConnect", function(data, callback) {
		userPool.push({id: socket.id, username: data.username});
		callback(socket.id);
	});

	socket.on("disconnect", function(data) {
		var userIndex = _.findIndex(userPool, {id: socket.id});
		userPool.splice(userIndex, 1);
	});
});

app.use(express.static(__dirname + '/public')); // Tell express to use the /public directory as the default for static files
app.listen(7020);
http.listen(7040);