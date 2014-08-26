## Main Models

### Lobby

```js
var socket = require('socket.io');
var io = socket.listen(server.listener);
var lobby = new Lobby(io);
```

Requires an instance of socketio, and adds an automatic interface for the entrance and exit of idle_users and active_admins.

Access array of current idle users:
```js
lobby.idle_users
```

Access array of current active admins users:
```js
lobby.active_admins
```

