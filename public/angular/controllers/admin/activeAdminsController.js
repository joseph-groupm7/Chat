nodechat.controller("activeAdminsController",
	["$scope", "socketService", "ChatList", "AdminList", function($scope, socket, chatList, adminList) {
	$scope.adminList = adminList;
}]);