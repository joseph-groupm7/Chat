angular.module('lobby', ['ngCookies']).service('lobby', function($rootScope, $cookies, $http) {
    var that = this;
    var socket = io({ query: 'session_id=' + $cookies.session + '&username=' +  $cookies.username});

    socket.on('lobby.state', function(newLobby){
        console.log(newLobby);
        that.lobby = newLobby;
        $rootScope.$digest();
    });

    socket.on('lobby.chat', function(chat){
        this.myChats.push(chat);
    });

    this.activateChat = function(user){
        socket.emit('lobby.chat',
            {
                session_id: $cookies.session
            }
        );
    };

    this.sendMessage = function(message, chat){
        socket.emit('lobby.message',
            {
                message: message,
                room:chat.room,
                session_id: $cookies.session
            }
        );
    };

    this.getMessages = function(id){
        $http.post('chats/'+id+'/messages', function(data){
            console.log(data);
        });
    };

});