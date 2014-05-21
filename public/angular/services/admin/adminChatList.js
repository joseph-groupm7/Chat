nodechat.service("ChatList", [function() {
	var me;

	var userList = [
		new User("Joseph Walker", 23),
		new User("Nathan Mickler", 42),
		new User("Sum Guai", 63)
	];

	var chatList = [
		new Chat(
			"1",
			userList[0], [
				new Message("client", "Hello World.", "05/31/1999"),
				new Message("admin", "Lorem ipsum dolor sit amet.", "05/31/1999"),
				new Message("admin", "Correct horse battery staple.", "05/31/2013")
			]),

		new Chat(
			"2",
			userList[1], [
				new Message("client", "This is just a test.", "05/14/1991"),
				new Message("client", "This is some more text.", "05/14/1991"),
				new Message("admin", "I like pie.", "05/14/1991"),
				new Message("client", "Me too.", "05/14/2014")
			]),

		new Chat(
			"3",
			userList[2], [
				new Message("client", "This is just a test.", "01/01/2014"),
				new Message("client", "Ole!", "01/01/2014"),
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

	this.setActiveChat = function(chat) {
		activeChat = chat;
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