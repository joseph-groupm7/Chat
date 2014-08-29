angular.module('socket', ['ngCookies']).factory('socket', function($rootScope, $cookies) {

    var socket = io({ query: 'session_id=' + $cookies.session + '&username=' +  $cookies.username});

    function Message(message, type, room, session_id){
        this.content = message;
        this.type = type;
        this.room = room;
        this.session_id = session_id;
    }

    return {
        on: function(eventName, callback) {
            socket.on(eventName, function() {
                var args = arguments;
                $rootScope.$apply(function() {
                    callback.apply(socket, args);
                });
            });
        },
        emit: function(eventName, message) {
            socket.emit(eventName, message);
        },
        getID: function(){
            return socket.io.engine.id;
        },
        sendMessage: function(message, type, room){
                var msg = new Message(message, type, room, $cookies.session);
                socket.emit('message', msg);
        }
    };
});