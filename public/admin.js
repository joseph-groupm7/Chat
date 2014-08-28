angular.module('admin', ['socket', 'ui.router', 'ngCookies']).config(function($stateProvider, $urlRouterProvider) {

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
        })
        .state("myChats", {
            url: '/myChats',
            templateUrl: "/public/angular/admin/templates/myChats.html"
        });

});

angular.module('admin').controller('AdminController', function($scope, socket, $location, $rootScope, $cookies){

    $cookies.username = 'admin-username';

    $rootScope.location = $location;

    $scope.myChats = [];

    socket.on('lobby', function(lobby){
        $scope.lobby = lobby;
    });

    socket.on('message', function(message){
        $scope.chat.messages.push(message);
    });

    $scope.activateChat = function(user){
        socket.emit('lobby.activateChat', {user: user, admin: _.find($scope.lobby.active_admins, function(admin){
            return admin.session_id == $cookies.session;
        })});
    };

    $scope.sendMessage = function(message, room){
        socket.sendMessage(message, 'admin', room);
    };

    socket.on('lobby.activateChat', function(chat){
        $scope.myChats.push(chat);
    });

    $scope.setActiveChat = function(chat){
        $scope.activeChat = chat;
    };

});
angular.module('admin').directive('chat', function(){

    return {
        scope: {chat: '@'},
        restrict: 'E',
        templateUrl: 'public/angular/admin/directives/chat/chat.html'
    };

});