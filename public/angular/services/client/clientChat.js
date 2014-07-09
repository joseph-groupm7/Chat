nodechat.service("ClientChat", function() {
	var chat = "";

	this.initChat = function(room, admin) {
		chat = new Chat(room, admin, []);
	};

	this.addMessage = function(message) {
		chat.addMessage(message);
	};

	this.getChat = function() {
		return chat;
	};
});