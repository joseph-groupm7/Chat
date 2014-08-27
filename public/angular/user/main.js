angular.module('client', ['socket']);

angular.module('client').controller('ClientController', function($scope, socket){

    $scope.chat = {
        connected: false,
        messages: []
    };

    $scope.sendMessage = function(message){
        socket.sendMessage(message, 'user');
    };

    socket.on('message', function(message){
        $scope.chat.messages.push(message);
    });

    socket.on('chat.Disconnected', function(){
        //$scope.chat.connected = false;
    });

});

