nodechat.service("socketService", ["$rootScope", "$http", "$q", function($rootScope, $http, $q) {
	var open = false;
	var primus;
	var sessionID = false;

	this.connect = function() {
		// If the connection isn't open, request the session ID of this user from the server
		// then open up the Primus connection
		if (!open) {
			open = true;
			primus = new Primus("http://localhost:7040", {});
		}
		else {
			return false;
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
		getSessionID().then(function(sessionID) {
			data.sessionID = sessionID;
			primus.send(eventName, data, function() {
				if (callback) {
					var args = arguments;
					callback.apply(primus, args);
					$rootScope.$apply();
				}
			});
		});
	};
	this.isConnected = function() {
		return open;
	};

	var setSessionID = function(id) {
		sessionID = id;
	};

	var getSessionID = function() {
		var deferred = $q.defer();

		if (sessionID === false) {
			$http.get("http://localhost:7040/session").success(function(response) {
				sessionID = response.sessionID;
				setSessionID(sessionID);
				deferred.resolve(sessionID);
			});
		}
		else {
			deferred.resolve(sessionID);
		}
		return deferred.promise;
	};
}]);