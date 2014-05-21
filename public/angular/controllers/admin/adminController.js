// This is the top level controller which handles events from the chat server.
// It initializes the models, syncs information from the server on load, and sets up event handlers.
// It also controls navigation.
// Anything to do with handling events or navigation should go here.
// Otherwise, defer to the associated controller.

nodechat.controller("adminController",
	["$scope", "socketService", "ChatList", "IdleList", "$location", function($scope, socket, chatList, idleList, $location) {
	$scope.chatList = chatList;
	$scope.idleList = idleList;
	$scope.location = $location;
	$scope.username = "Joseph Walker"; // Temporary

	$scope.init = function() {
		socket.connect();
		socket.emit("adminConnect", {username: $scope.username}, function(response) {
			// Needs to be updated to the new response format
			$scope.chatList.initializeMe($scope.username, response);
		});

		socket.bind("newAdminConnect", function(data) {
			alert("Someone connected!");
		});

		socket.bind("newUserConnect", function(data) {
			$scope.idleList.addUser(data.username, data.id);
		});
	};

	$scope.idleUsersCount = function() {
		return $scope.idleList.getIdleUsers().length;
	};

	$scope.ongoingChatsCount = function() {
		return $scope.chatList.getChatList().length;
	};

	$scope.activeAdminsCount = function() {
		return 0;
	};

	$scope.init();
}]);