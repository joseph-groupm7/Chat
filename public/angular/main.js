angular.module('client', []);
angular.module('admin', []);

angular.module('client', []).controller('ClientController', function($scope){
    var socket = io();
    $scope.testMessage = function(){
        socket.emit('message', 'test');
    }
});

angular.module('admin', []).controller('AdminController', function($scope){
    var socket = io();
    socket.on('message', function(message){
        alert(message);
    });
});