angular.module('admin').directive('chat', function(lobby){

    var link = function(scope){

        scope.$watch(function(){
            return scope.chat
        }, function(newChat, oldChat){
            if (typeof newChat !== 'undefined') {
                scope.chat = newChat;
                lobby.getMessages(scope.chat.room_id, function(messages){
                    scope.chat.messages = messages;
                });
            }
        });

        scope.sendMessage = function(message){
            lobby.sendMessage(scope.chat.room_id, message);
            scope.chat.messages.push({message: message, type: 'admin'});
            scope.message = '';
        };

    };

    return {
        link: link,
        scope: {
            chat: '=chat'
        },
        restrict: 'E',
        templateUrl: '/public/js/admin/working/directives/chat/chat.html'
    };

});