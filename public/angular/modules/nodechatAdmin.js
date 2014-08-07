var nodechat = angular.module("nodechat", ["ngRoute", "ngAnimate"]);

// Initiate the routes for the navigation
nodechat.config(["$routeProvider", "$locationProvider", function($routeProvider, $locationProvider) {
	$routeProvider
	.when("/idleUsers", {
		templateUrl: "/angular/templates/idleUsers.html",
		controller: "idleController"
	})
	.when("/activeChats", {
		templateUrl: "/public/angular/templates/ongoingChats.html"
	})
	.when("/activeAdmins", {
		templateUrl: "/public/angular/templates/activeAdmins.html"
	})
	.otherwise({
		redirectTo: "/activeChats"
	});
}]);