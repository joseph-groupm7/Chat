//
// The service wrapper
//
nodechat.service("ChatList", [function() {
	var me;

	var userList = [
		new User("Joseph Walker", 23),
		new User("Nathan Mickler", 42)
	];

	var chatList = [
		new Chat("1", userList[0], []),
		new Chat(
			"2",
			userList[1], [
				new Message("client", "This is just a test.", "05/14/1991"),
				new Message("client", "This is some more text.", "05/14/1991"),
				new Message("admin", "I like pie.", "05/14/1991"),
				new Message("client", "Me too.", "05/14/2014")
			])
	];

	var activeChat = chatList[1];

	this.initializeMe = function(username, id) {
		me = new Me(username, id);
	};

	this.getMe = function() {
		return me;
	};

	this.getChatList = function() {
		return chatList;
	};

	this.getActiveChat = function() {
		if (activeChat) {
			return activeChat;
		}
	};

	this.addChat = function(userList, messageList) {
		chatList.push(new Chat(userList, messageList));
	};

	this.pushMessage = function(chat, message) {
		if (chat === null) {
			chat = activeChat;
		}

		chat.addMessage(message);
	};
}]);

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