var nodechat = angular.module("nodechat", ["ngRoute", "ngAnimate"]);

// Initiate the routes for the navigation
nodechat.config(["$routeProvider", "$locationProvider", function($routeProvider, $locationProvider) {
	$routeProvider
	.when("/idleUsers", {
		templateUrl: "/angular/templates/idleUsers.html",
		controller: "idleController"
	})
	.when("/activeChats", {
		templateUrl: "/angular/templates/ongoingChats.html"
	})
	.when("/activeAdmins", {
		templateUrl: "/angular/templates/activeAdmins.html"
	})
	.otherwise({
		redirectTo: "/activeChats"
	});
}]);