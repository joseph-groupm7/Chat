angular.module('user', ['lobby', 'ngCookies']);

angular.module('user').controller('UserController', function($scope, lobby, LoginService){

    $scope.login = function(email){
        LoginService.login(email);
    };



    lobby.getMessages(room_id, function(messages){
        $scope.chat.messages = messages;
    });

    lobby.on('lobby.message', function(message){
        $scope.chat.messages.push(message);
    });

});

