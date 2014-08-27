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
        });

});

angular.module('admin').controller('AdminController', function($scope, socket, $location, $rootScope, $cookies){

    $rootScope.location = $location;
    $scope.local = {
        chats: []
    };

    socket.on('lobby', function(lobby){
        $scope.lobby = lobby;

        var chats_belonged_to = [];

        //add chats that the admin is participating in to client side chat list
        $scope.chats = _.find(lobby.ongoing_chats, function(chat){

            chat.clients.map(function(client){
                if(client.session_id == $cookies.session){
                    chats_belonged_to.push(chat);
                }
            });
        });

        $scope.local.chats = chats_belonged_to;
    });

    socket.on('message', function(message){
        $scope.chat.messages.push(message);
    });

    $scope.activateChat = function(user){
        socket.emit('lobby.activateChat', {user: user, admin: _.find($scope.lobby.active_admins, function(admin){
            return admin.session_id == $cookies.session;
        })});
    };

    $scope.sendMessage = function(message){
        socket.sendMessage(message, 'admin');
    };

    $scope.setActiveChat = function(chat){
        _.find()
    };


});