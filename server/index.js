import express from 'express';
const app = express();
const port = 5000;
import cors from 'cors';

app.use(cors());

// Socket io
import { Server } from 'socket.io';
import http from 'http';
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
    }
});

io.on('connection',(socket)=>{
    // console.log(`a user connected ${socket.id}` );

    socket.on('send-message', (message)=>{
        //brodcast the recevied message to all the connected user
        io.emit('recevied-message', message)
        // console.log(message);
    })

    socket.on('disconnect',()=>{
        // console.log("User Disconnected");
    })
})

server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
