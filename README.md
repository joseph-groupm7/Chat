# Lobby API

## Creating a chat

event: lobby.chat
message: (USER) must implement
{
    session_id: value
}

success event: lobby.chat
to: everyone in chat
message: (CHAT)
{
    messages: ARRAY,
    clients: ARRAY,
    room: id
}

## Sending a message
event: lobby.message
message: (MESSAGE) must implement
{
    content: STRING,
    room: id
}

success event: lobby.message
to: everyone in chat
message: STRING content