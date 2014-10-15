angular.module('lobby', ['ngCookies']).service('lobby', function($rootScope, $cookies, $http) {
    var that = this;

    var socket = io({
        'query': 'token=' + $cookies.token
    });

    socket.on('lobby.state', function(newLobby){
        that.lobby = newLobby;
        $rootScope.$digest();
    });

    socket.on('lobby.message', function(message){
        $rootScope.activeChat.messages.push(message);
        $rootScope.$digest();
    });

    this.activateChat = function(user){
        socket.emit('lobby.chat', user.session_id);
    };

    this.sendMessage = function(room_id, message){
        socket.emit('lobby.message',
            {
                room_id: room_id,
                text: message
            }
        );
    };

    this.getMessages = function(room_id, callback){
        $http.get('/chat/chats/'+room_id+'/messages').success(function(data){
            callback(data);
        });
    };

});