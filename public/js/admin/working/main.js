angular.module('admin', ['lobby', 'ui.router', 'ngCookies']).config(function($stateProvider, $urlRouterProvider) {

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
        });

});

angular.module('admin').controller('LobbyController', function($scope, lobby){

    $scope.$watch(function(){
        return lobby.lobby
    }, function(newLobby, oldLobby){
        if (typeof newLobby !== 'undefined') {
            $scope.lobby = newLobby;
        }
    });

});