angular.module('client', ['socket']).controller('ClientController', function($scope, socket){

    $scope.chat = {
        connected: false,
        messages: []
    };

    $scope.sendMessage = function(message){
        socket.sendMessage(message, 'user');
    };

    socket.on('lobby.activateChat', function(room_name){
        $scope.chat.connected = true;
        socket.setRoom(room_name);
        console.log('joined room ', room_name);
    });

    socket.on('message', function(message){
        $scope.chat.messages.push(message);
    });

    socket.on('chat.Disconnected', function(){
        $scope.connected = false;
    });
});

