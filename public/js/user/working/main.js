angular.module('client', ['socket', 'ngCookies']);

angular.module('client').controller('ClientController', function($scope, socket, $cookies){

    $cookies.username = 'user-username';

    $scope.sendMessage = function(message){
        socket.sendMessage(message);
    };

    socket.on('message', function(message){
        $scope.chat.messages.push(message);
    });

    socket.on('chat.Disconnected', function(){
        //$scope.chat.connected = false;
    });

});

