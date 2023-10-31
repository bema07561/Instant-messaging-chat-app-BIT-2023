var path = require('path');
var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 4000;
const usedUsernames = new Set();
const onlineUsers = new Map();

server.listen(port, function(){
    console.log('Listening on localhost:' + port);
});

app.use(express.static(path.join(__dirname, 'static')));
var numberOfUsers = 0;

io.on('connection', (socket) => {
    var userJoined = false;
    socket.on('new_message', (msg) => {
        socket.broadcast.emit('new_message', {
            username: socket.username,
            message: msg
        });
    });
    socket.on('check_username', (username) => {
        if (usedUsernames.has(username)) {
            socket.emit('username_taken');
        } else {
            usedUsernames.add(username);
            socket.emit('username_available');
        }
    });
    socket.on('user_added', (username) => { 
        socket.username = username;
        userJoined = true;
        numberOfUsers++;
        usedUsernames.add(username);
        //
        onlineUsers.set(socket.id, username);
        io.emit('update_online_users', Array.from(onlineUsers.values()));
        //
        socket.emit('login', {
            numberOfUsers: numberOfUsers
        });
        socket.broadcast.emit('user_joined', {
            username: socket.username,
            numberOfUsers: numberOfUsers
        });
    });
    //
    socket.on('private_chat', ({ recipient, message }) => {
        const recipientSocket = getRecipientSocket(recipient);
        if (recipientSocket) {
            // Create a unique room for the private chat
            const roomName = getPrivateRoomName(socket.username, recipient);
            socket.join(roomName);
            recipientSocket.join(roomName);

            // Emit a private_message event to the recipient
            recipientSocket.emit('private_message', {
                sender: socket.username,
                message: message
            });
        }
    });
    //
    socket.on('typing', () => {
        socket.broadcast.emit('typing', {
            username: socket.username
        });
    });
    socket.on('typing_stop', () => {
        socket.broadcast.emit('typing_stop', {
            username: socket.username
        });
    });
    socket.on('disconnect', () => {
        if (userJoined) {
            usedUsernames.delete(socket.username);
            --numberOfUsers;
            //
            onlineUsers.delete(socket.id);
            io.emit('update_online_users', Array.from(onlineUsers.values()));
            //
            socket.broadcast.emit('user_left', {
                username: socket.username,
                numberOfUsers: numberOfUsers
            });
        }
    });
});
//
function getRecipientSocket(recipientUsername) {
    for (const [socketId, username] of onlineUsers.entries()) {
        if (username === recipientUsername) {
            return io.sockets.sockets.get(socketId);
        }
    }
    return null;
}

function getPrivateRoomName(user1, user2) {
    return user1 < user2 ? `${user1}-${user2}` : `${user2}-${user1}`;
}
//