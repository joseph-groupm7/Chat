nodechat.controller("chatController", ["$scope", "socketService", "ChatList", function($scope, socket, chatList) {
	$scope.response = "Hello";

	$scope.sendMessage = function() {
		socket.emit("sendMessage", {body: $scope.response, roomID: chatList.getActiveChat().getRoomID()}, function(response) {
			if (response === true) {
				var now = new Date();
				var time = now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
				chatList.pushMessage(null, new Message("admin", $scope.response, time));
				$scope.response = "";
			}
		});
	};
}]);