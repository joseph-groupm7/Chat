nodechat.service("IdleList", [function() {
	var idleUsers = [];

	this.addUser = function(username, id) {
		idleUsers.push(new User(username, id));
	};

	this.getIdleUsers = function() {
		return idleUsers;
	};
}]);