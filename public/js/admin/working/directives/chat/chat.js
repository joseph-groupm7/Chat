angular.module('admin').directive('chat', function(lobby){

    var link = function(scope){

        lobby.getMessages(chat, function(messages){
            scope.chat.messages = messages;
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