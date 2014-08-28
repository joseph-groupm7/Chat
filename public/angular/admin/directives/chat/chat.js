angular.module('admin').directive('chat', function(){

    return {
        scope: {chat: '@'},
        restrict: 'E',
        templateUrl: 'public/angular/admin/directives/chat/chat.html'
    };

});