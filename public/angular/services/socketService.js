nodechat.service("socketService", ["$rootScope", function($rootScope) {
	var open = false;
	var primus = null;

	this.connect = function() {
		if (!open) {
			primus = new Primus("http://localhost:7040", {});
			open = true;
		}
	};
	this.bind = function(event, callback) {
		primus.on(event, function() {
			var args = arguments;
			callback.apply(primus, args);
			$rootScope.$apply();
		});
	};
	this.emit = function(eventName, data, callback) {
		primus.send(eventName, data, function() {
			if (callback) {
				var args = arguments;
				callback.apply(primus, args);
				$rootScope.$apply();
			}
		});
	};
	this.isConnected = function() {
		return open;
	};
}]);