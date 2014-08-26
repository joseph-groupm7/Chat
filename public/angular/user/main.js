angular.module('client', ['socket']).controller('ClientController', function($scope, socket){
    $scope.testMessage = function(){
        socket.emit('message', 'test');
    };
    socket.on('message', function(message){
        //TODO: put messages on users screen
    });
});

