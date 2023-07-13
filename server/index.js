const express = require('express');
const socket = require('socket.io');
const http = require('http');
const cors = require('cors');

const mongoose = require('mongoose');
require("dotenv").config();

const PORT = process.env.PORT || 3001;

const userRoutes = require('./routes/userRoutes.js');
const messageRoutes = require('./routes/messageRoutes.js');

const app = express();
const server = http.createServer(app);

app.use(cors());
app.use(express.json());
app.use("/api/auth", userRoutes);
app.use("/api/messages", messageRoutes);

mongoose.connect(process.env.MONGO_URL, {
    useNewURLParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Successfully connected to DB');
}).catch((err) => {
    console.log(err.message);
});

// const io = socket(server, {
//     cors: {
//         origin: "http://localhost:3000",
//         credentials: true,
//     }
// });

const io = socket(server);

global.onlineUsers = new Map();

io.on('connection', (socket) => {
    console.log('we have a new connection!');

    socket.on('add-online-user', (userId) => {
        onlineUsers.set(userId, socket.id);

        io.emit("get-online-users", Array.from(onlineUsers.keys()));
    });


    socket.on('remove-online-user', (userId) => {
        onlineUsers.delete(userId);

        io.emit("get-online-users", Array.from(onlineUsers.keys()));

        io.emit('update-last-seen', {
            userId: userId,
            lastSeenAt: Date.now()
        });
    });

    socket.on("send-msg", (data) => {
        const sendUserSocket = onlineUsers.get(data.to);
        if (sendUserSocket) {
            socket.to(sendUserSocket).emit("receive-msg", data);
        }
    });

    // // expects event sent from FE
    // socket.on('join', ({ name, room }, callback) => {
    //     const { error, user } = addUser({ id: socket.id, name, room });
    //     if (error) return callback(error);

    //     // admin generated messages; Emit event from BE to FE
    //     socket.emit('message', {
    //         user: 'admin',
    //         text: `You joined ${user.room}`,
    //         isAdmin: true
    //     });

    //     // built in func that sends message to everyone besides that user
    //     socket.broadcast.to(user.room).emit('message', {
    //         user: 'admin',
    //         text: `${user.name} has joined the room`,
    //         isAdmin: true
    //     });

    //     socket.join(user.room); // built in function that joins a room

    //     io.to(user.room).emit('roomData', {
    //         room: user.room,
    //         users: getUsersInRoom(user.room)
    //     });

    //     callback();
    // });


    // // user generated messages; expect the event from FE
    // socket.on('sendMessage', (message, callback) => {
    //     const user = getUser(socket.id);

    //     io.to(user.room).emit('message', {
    //         user: user.name,
    //         text: message,
    //         isAdmin: false
    //     });

    //     io.to(user.room).emit('roomData', {
    //         room: user.room,
    //         users: getUsersInRoom(user.room)
    //     });

    //     callback();
    // });

    // socket.on('disconnect', () => {
    //     const user = removeUser(socket.id);
    //     if (user) {
    //         io.to(user.room).emit('message', {
    //             user: 'admin',
    //             text: `${user.name} has left`,
    //             isAdmin: true
    //         });
    //     }
    // });
});

server.listen(PORT, () => console.log(`Server has started on port ${PORT}`));