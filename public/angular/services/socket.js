angular.module('socket', []).factory('socket', function($rootScope) {
    var socket = io();

    function Message(message, type, room){
        this.content = message;
        this.type = type;
        this.room = room;
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
        setRoom: function(room_name){
            this.room = room_name;
        },
        sendMessage: function(message, type){
            if(this.hasOwnProperty('room')){
                var msg = new Message(message, type, this.room);
                socket.emit('message', msg);
            }
        }
    };
});