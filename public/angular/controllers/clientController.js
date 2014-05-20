nodechat.controller("clientController", ["$scope", "socketService", function($scope, socket) {
	$scope.clientInformation = {
		username: "John Doe",
		id: ""
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
			socket.emit("userConnect", {username: $scope.clientInformation.username});
		}
	}
}]);