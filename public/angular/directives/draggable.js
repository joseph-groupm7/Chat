nodechat.directive("draggable", [function() {
	return {
		restrict: "A",
		scope: {
			handle: "@draggable"
		},
		link: function(scope, element, attributes) {
			var target = $("#" + scope.handle);
			target.bind("mousedown", function(event) {
				var xOrigin = event.offsetX;
				var yOrigin = event.offsetY;

				$("body").bind("mousemove", function(event) {
					element.css("left", (event.pageX - xOrigin) + "px");
					element.css("top", (event.pageY - yOrigin) + "px");
				});

				$("body").bind("mouseup", function(event) {
					$("body").unbind();
				});
			});
		}
	};
}]);