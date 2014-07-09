nodechat.controller("clientController", ["$scope", "socketService", "ClientChat", function($scope, socket, ClientChat) {
	$scope.clientInformation = {
		username: "John Doe",
		serverID: ""
	};
	$scope.chat = ClientChat;

	$scope.init = function() {
		socket.emit("userConnect", {username: $scope.clientInformation.username}, function(response) {
			$scope.clientInformation.serverID = response;
		});

		socket.bind("adminChatEstablished", function(data) {
			$scope.chat.initChat(data.room, data.username);
		});

		socket.bind("messageFromRoom", function(data) {
			$scope.chat.addMessage(new Message(data.from, data.body, data.timestamp));
		});
	};

	$scope.setUsername = function() {
		connect();
	};

	$scope.isConnected = function() {
		return socket.isConnected();
	};

	function connect() {
		if (!$scope.isConnected()) {
			socket.connect();
			$scope.init();
		}
	}
}]);