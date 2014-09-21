angular.module('admin').controller('OngoingChatsController', function($scope, $rootScope){

    $scope.viewChat = function(chat){
        $rootScope.activeChat = chat;
    }

});