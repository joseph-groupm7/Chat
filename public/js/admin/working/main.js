angular.module('admin', ['socket', 'ui.router', 'ngCookies']).config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise("/ongoingChats");

    $stateProvider
        .state("idleUsers", {
            url: '/idleUsers',
            templateUrl: "/public/js/admin/working/templates/idleUsers.html"
        })
        .state("ongoingChats", {
            url: '/ongoingChats',
            templateUrl: "/public/js/admin/working/templates/ongoingChats.html"
        })
        .state("activeAdmins", {
            url: '/activeAdmins',
            templateUrl: "/public/js/admin/working/templates/activeAdmins.html"
        })
        .state("myChats", {
            url: '/myChats',
            templateUrl: "/public/js/admin/working/templates/myChats.html"
        });

});

angular.module('admin').controller('AdminController', function($scope, socket, $location, $rootScope, $cookies){

    $cookies.username = 'admin-username';

    $rootScope.location = $location;

    $scope.myChats = [];

    socket.on('lobby', function(lobby){
        $scope.lobby = lobby;
    });

    $scope.activateChat = function(user){
        socket.emit('lobby.activateChat', user);
    };

    socket.on('lobby.activateChat', function(chat){
        $scope.myChats.push(chat);
    });

    $scope.setActiveChat = function(chat){
        $scope.activeChat = chat;
    };

});