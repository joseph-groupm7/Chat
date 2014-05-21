nodechat.service("AdminList", [function() {
	var activeAdmins = [];

	this.getActiveAdmins = function() {
		return activeAdmins;
	};
}]);