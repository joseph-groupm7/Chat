nodechat.controller("clientController", ["$scope", "socketService", function($scope, socket) {
	$scope.clientInformation = {
		username: "John Doe",
		serverID: ""
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
			socket.emit("userConnect", {username: $scope.clientInformation.username}, function(response) {
				$scope.clientInformation.serverID = response;
			});
		}
	}
}]);