angular.module('user', ['lobby', 'ngCookies']);

angular.module('user').controller('UserController', function($scope, lobby, $cookies){

    $cookies.username = 'user-username';

    socket.on('lobby.activateChat', function(chat){
        $scope.active = true;
        $scope.chat = chat;
    });

});

