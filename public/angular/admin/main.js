angular.module('admin', ['socket', 'ui.router']);

angular.module('admin').config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise("/ongoingChats");

    $stateProvider
        .state("idleUsers", {
            url: '/idleUsers',
            templateUrl: "/public/angular/admin/templates/idleUsers.html"
        })
        .state("ongoingChats", {
            url: '/ongoingChats',
            templateUrl: "/public/angular/admin/templates/ongoingChats.html"
        })
        .state("activeAdmins", {
            url: '/activeAdmins',
            templateUrl: "/public/angular/admin/templates/activeAdmins.html"
        });

});

angular.module('admin').controller('AdminController', function($scope, socket){

    $scope.text = '';

    socket.on('lobby', function(lobby){
        $scope.lobby = lobby;
    });

    socket.on('lobby.activateChat', function(room_name){
        socket.setRoom(room_name);
    });

    socket.on('message', function(message){
        $scope.text += message;
    });

    $scope.activateChat = function(user_id){
        socket.emit('lobby.activateChat', {user_id: user_id,admin_id: socket.getID()});
    };

    $scope.sendMessage = function(message){
        socket.sendMessage(message);
    };


});