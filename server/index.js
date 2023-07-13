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

const io = socket(server, {
    cors: {
        origin: "http://localhost:3000",
        credentials: true,
    }
});

// const io = socket(server);

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
});

server.listen(PORT, () => console.log(`Server has started on port ${PORT}`));