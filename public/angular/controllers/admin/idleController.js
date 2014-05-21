// This controller handles everything with the idle users panel.
// Functionality associated with idle users needs to go here.

nodechat.controller("idleController", ["$scope", "socketService", "ChatList", "IdleList", function($scope, socket, chatList, IdleList) {
	$scope.idleList = IdleList;
}]);