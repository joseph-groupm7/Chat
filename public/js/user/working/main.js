angular.module('user', ['socket', 'ngCookies']);

angular.module('user').controller('UserController', function($scope, socket, $cookies){

    $cookies.username = 'user-username';

    socket.on('lobby.activateChat', function(chat){
        $scope.active = true;
        $scope.chat = chat;
    });

});

