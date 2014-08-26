angular.module('client', ['socket']).controller('ClientController', function($scope, socket){
    $scope.testMessage = function(){
        socket.emit('message', 'test');
    }
});

