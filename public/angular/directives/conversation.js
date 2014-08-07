nodechat.directive("conversation", [function() {
	return {
		restrict: "E",
		templateUrl: "/public/angular/templates/conversation.html",
		replace: true,
		scope: {
			source: "=source"
		},
		link: function(scope, element, attributes) {

		}
	};
}]);