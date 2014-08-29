angular.module('admin').directive('chat', function(socket){

    var link = function(scope){

        scope.messages = [];

        scope.sendMessage = function(message){

            socket.sendMessage(message, scope.chat);

        };

        socket.on('message', function(message){
            scope.messages.push(message);
        });

    };

    return {
        link: link,
        scope: {
            chat: '=chat'
        },
        restrict: 'E',
        templateUrl: 'public/js/admin/working/directives/chat/chat.html'
    };

});