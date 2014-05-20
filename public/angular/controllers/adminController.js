nodechat.controller("adminController", ["$scope", "socketService", "ChatList", function($scope, socket, chatList) {
	$scope.chatList = chatList;
	$scope.username = "Joseph Walker";

	$scope.init = function() {
		socket.connect();
		socket.emit("adminConnect", {username: $scope.username}, function(response) {
			$scope.chatList.initializeMe($scope.username, response);
		});

		socket.bind("newAdminConnect", function(data) {
			alert(data.data);
		});
	};

	$scope.init();
}]);