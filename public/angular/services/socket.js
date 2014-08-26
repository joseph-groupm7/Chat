angular.module('socket', []).factory('socket', function($rootScope) {
    var socket = io();
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
        sendMessage: function(message){
            if(this.hasOwnProperty('room')){
                socket.emit('message', {room: this.room, content: message});
            }
        }
    };
});