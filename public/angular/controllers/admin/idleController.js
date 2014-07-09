// This controller handles everything with the idle users panel.
// Functionality associated with idle users needs to go here.

nodechat.controller("idleController", ["$scope", "socketService", "ChatList", "IdleList", function($scope, socket, ChatList, IdleList) {
	$scope.idleList = IdleList;
	$scope.chatList = ChatList;

	$scope.activateChat = function(user) {
		socket.emit("adminEstablishChat", {me: $scope.chatList.getMe().getServerID(), id: user.serverID}, function(success, name) {
			if (success) {
				$scope.idleList.removeUser(user);
				$scope.chatList.addChat(name, user);
			}
		});
	};
}]);