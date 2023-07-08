const express = require('express');
const socketio = require('socket.io');
const http = require('http');
const cors = require('cors')

const { addUser, removeUser, getUser, getUsersInRoom } = require('./users.js');

const PORT = process.env.PORT || 3001

const router = require('./router')

const app = express();
const server = http.createServer(app);
const io = socketio(server);

app.use(router);
app.use(cors())

io.on('connection', (socket) => {
    console.log('we have a new connection!')

    // expects event sent from FE
    socket.on('join', ({ name, room }, callback) => {
        const { error, user } = addUser({ id: socket.id, name, room });
        if (error) return callback(error);

        // admin generated messages; Emit event from BE to FE
        socket.emit('message', {
            user: 'admin',
            text: `You joined ${user.room}`,
            isAdmin: true
        })

        // a built in func that sends message to everyone besides that user
        socket.broadcast.to(user.room).emit('message', {
            user: 'admin',
            text: `${user.name} has joined the room`,
            isAdmin: true
        })

        socket.join(user.room) // a built in function that joins a room

        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        })

        callback();
    })


    // user generated messages; expect the event from FE
    socket.on('sendMessage', (message, callback) => {
        const user = getUser(socket.id)

        io.to(user.room).emit('message', {
            user: user.name,
            text: message,
            isAdmin: false
        })

        io.to(user.room).emit('roomData', {
            room: user.room,
            users: getUsersInRoom(user.room)
        })

        callback();
    });

    socket.on('disconnect', () => {
        const user = removeUser(socket.id);
        if (user) {
            io.to(user.room).emit('message', {
                user: 'admin',
                text: `${user.name} has left`,
                isAdmin: true
            })
        }
    });
})

server.listen(PORT, () => console.log(`Server has started on port ${PORT}`))