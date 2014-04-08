nodechat.controller("adminController", ["$scope", "socketService", function($scope, socket) {
	$scope.adminInformation = {
		id: "",
		username: ""
	};

	$scope.connectedAdmins = [];
	$scope.connectedUsers = [];
	$scope.ongoingConversations = [];

	$scope.setUsername = function() {
		connect();
	};

	$scope.isConnected = function() {
		return socket.isConnected();
	};

	$scope.initiateConversation = function(userID) {
		socket.emit("adminConnectToUser", {admin: $scope.adminInformation.id, user: userID}, function(roomName, userID, username) {
			$scope.ongoingConversations.push({room: roomName, userID: userID, username: username});
		});
	};

	function connect() {
		socket.connect();
		socket.emit("adminConnect", {username: $scope.adminInformation.username}, function(userID) {
			$scope.adminInformation.id = userID;
			synchronizeAdminList();
			synchronizeUserList();
		});

		// Connection events for other admins and users
		// Descpite this similar names, this one is for when ANOTHER admin connects
		socket.bind("adminConnection", function(data) {
			$scope.connectedAdmins.push({id: data.id, username: data.username});
		});

		socket.bind("userConnection", function(data) {
			$scope.connectedUsers.push({id: data.id, username: data.username});
		});

		socket.bind("adminDisconnect", function(admin) {
			var index = $scope.connectedAdmins.indexOf(admin);
			$scope.connectedAdmins.splice(index, 1);
		});

		socket.bind("userDisconnect", function(user) {
			var index = $scope.connectedUsers.indexOf(user);
			$scope.connectedUsers.splice(index, 1);
		});
	}

	function synchronizeAdminList() {
		socket.emit("requestAdminListSync", {}, function(adminList) {
			$scope.connectedAdmins = adminList;
		});
	}

	function synchronizeUserList() {
		socket.emit("requestUserListSync", {}, function(userList) {
			$scope.connectedUsers = userList;
		});
	}
}]);