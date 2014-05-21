//
// The Chat Prototype
//
function Chat(id, client, messages) {
	this.roomID = id;
	this.client = client;
	this.messages = messages;
}

Chat.prototype.messages = [];
Chat.prototype.client   = [];
Chat.prototype.roomID   = "";

Chat.prototype.addMessage = function(message) {
	this.messages.push(message);
};

Chat.prototype.getActiveChat = function() {
	return this.activeChat;
};

Chat.prototype.getClientUsername = function() {
	return this.client.getUsername();
};

Chat.prototype.getMessageList = function() {
	return this.messages;
};

Chat.prototype.getRoomID = function() {
	return this.roomID;
};

Chat.prototype.getLastMessageBody = function() {
	if (this.messages.length > 0) {
		return this.messages[this.messages.length - 1].getBody();
	}
	else {
		return "No Messages Yet";
	}
};

Chat.prototype.getLastActivity = function() {
	if (this.messages.length > 0) {
		return this.messages[this.messages.length - 1].getTime();
	}
	else {
		return "No Activity Yet";
	}
};

//
// The Message prototype
//
function Message(user, body, timestamp) {
	this.user = user;
	this.body = body;
	this.time = timestamp;
}

Message.prototype.user = "";
Message.prototype.body = "";
Message.prototype.time = "";

Message.prototype.getBody = function() {
	return this.body;
};

Message.prototype.getTime = function() {
	return this.time;
};

Message.prototype.getUser = function() {
	return this.user;
};

//
// The User prototype
//
function User(username, serverID) {
	this.username = username;
	this.serverID = serverID;
}

User.prototype.username = "";
User.prototype.serverID = "";

User.prototype.getUsername = function() {
	return this.username;
};

User.prototype.getServerID = function() {
	return this.serverID;
};

//
// The Me prototype
//
function Me(username, serverID) {
	this.username = username;
	this.serverID = serverID;
}

Me.prototype.username = "";
Me.prototype.serverID = "";

Me.prototype.getServerID = function() {
	return this.serverID;
};