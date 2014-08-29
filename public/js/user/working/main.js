angular.module('user', ['socket', 'ngCookies']);

angular.module('user').controller('UserController', function($scope, socket, $cookies){

    $cookies.username = 'user-username';
    $scope.chat = {
        messages: [],
        active: false
    };

    $scope.sendMessage = function(message){
        socket.sendMessage(message, $scope.chat);
    };

    socket.on('message', function(message){
        $scope.chat.messages.push(message);
    });

    socket.on('lobby.activateChat', function(){
        $scope.chat.active = true;
    });

});

