nodechat.service("socketService", ["$rootScope", function($rootScope) {
	var socket;

	this.connect = function() {
		socket = io.connect('http://localhost:7040');
	};
	this.bind = function(event, callback) {
		socket.on(event, function() {
			var args = arguments;
			callback.apply(socket, args);
			$rootScope.$apply();
		});
	};
	this.emit = function(eventName, data, callback) {
		socket.emit(eventName, data, function() {
			if (callback) {
				var args = arguments;
				callback.apply(socket, args);
				$rootScope.$apply();
			}
		})
	};
	this.isConnected = function() {
		if (socket) {
			return true;
		}
		else {
			return false;
		}
	};
}]);