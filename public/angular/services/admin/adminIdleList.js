nodechat.service("IdleList", [function() {
	var idleUsers = [];

	this.addUser = function(username, id) {
		idleUsers.push(new User(username, id));
	};

	this.removeUser = function(user) {
		var index = idleUsers.indexOf(user);
		idleUsers.splice(index, 1);
	};

	this.getIdleUsers = function() {
		return idleUsers;
	};

	this.synchronize = function(list) {
		_.forEach(list, function(client) {
			idleUsers.push(new User(client.username, client.sessionID));
		});
	};
}]);