nodechat.controller("adminController", ["$scope", "socketService", "ChatList", "$location", function($scope, socket, chatList, $location) {
	$scope.chatList = chatList;
	$scope.username = "Joseph Walker"; // Temporary
	$scope.location = $location;

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