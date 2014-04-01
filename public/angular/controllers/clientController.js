nodechat.controller("clientController", ["$scope", "socketService", function($scope, socket) {
	$scope.clientInformation = {
		username: "",
		id: ""
	};

	$scope.setUsername = function() {
		connect();
	};

	$scope.isConnected = function() {
		return socket.isConnected();
	};

	function connect() {
		socket.connect();
		socket.emit("chatConnect", {username: $scope.clientInformation.username}, function(userID) {
			$scope.clientInformation.id = userID;
		});
	}
}]);