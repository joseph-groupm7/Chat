nodechat.directive("conversation", [function() {
	return {
		restrict: "E",
		templateUrl: "/angular/templates/conversation.html",
		replace: true,
		scope: {
			source: "=source"
		},
		link: function(scope, element, attributes) {

		}
	};
}]);