angular.module('admin').controller('IdleUsersController', function($scope, lobby){

    $scope.activateChat = function(user){
        lobby.activateChat(user);
    };

});