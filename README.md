# Front End Objects

### Critical events coming from the server: 

```js
socket.on('lobby', function(lobby){
        console.log(lobby)
});

socket.on('lobby.activateChat', function(room_name){
        socket.setRoom(room_name);
});

socket.on('message', function(message){
        console.log(message);
});
```

### Activating a private chat between users:

```js
socket.emit('lobby.activateChat', {user_id: 'some user id',admin_id: socket.getID()});
```

### Sending messages

```js
socket.sendMessage('message');
```



# Application Objects

## Lobby

### Creation:

```js
var socket = require('socket.io');
var io = socket.listen(server.listener);
var lobby = new Lobby(io);
```

### Interface:
```js
lobby.idle_users **Array** of **Users**
lobby.ongoing_chats **Array** of **Chats**
lobby.active_admins **Array** of **Admins**
```

## Client

> A representation of a user (admin or customer) that can be added to rooms

### Creation:

```js
var client = new Client(socket.id, 'username');
```
### Interface:

```js
client.id
client.name
```

## Chat

> A representation of multiple clients that are communicating

### Creation: 

```js
var user = new Client(socket.id, 'user1');
var admin = new Client(socket.id, 'admin1');
var clients = [user, admin];
var chat = new Chat(clients, 'name of the room');
```

