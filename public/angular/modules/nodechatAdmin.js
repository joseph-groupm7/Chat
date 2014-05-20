var nodechat = angular.module("nodechat", ["ngRoute"]);

nodechat.config(["$routeProvider", "$locationProvider", function($routeProvider, $locationProvider) {
	$routeProvider
	.when("/idleUsers", {
	})
	.when("/activeChats", {
		templateUrl: "/angular/templates/ongoingChats.html"
	})
	.when("/activeAdmins", {
	})
	.otherwise({
		redirectTo: "/activeChats"
	});
}]);