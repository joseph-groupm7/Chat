## Websocket Server

PORT: 3000

Endpoints:

```
POST /chat/admin/login
with
{email:'', password:''}
returns
error OR token
```

```
POST /chat/user/login
with
{email:'', name:''}
returns
error OR token
```

```
GET /chat/chats/{room_id}/messages
with token cookie
returns
{messages:{}}
```

The token should be saved as a cookie named token for subsequent requests and connection to websocket server

Websocket Events:

### connection
this is only used to build a Client object on the server from the token

### lobby.chat
pass token id of user to chat with, and a chat will be created with the current user and the selected user.

### lobby.message
pass object like:
{
    room_id:'',
    text:''
}