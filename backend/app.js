import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import UserRouter from './Routes/User.router.js';
import { connectDb } from './Util/Db.js';
import 'dotenv/config'


const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;
const io = new Server(server, {
  cors: {
    origin:'*',
    methods: ['GET', 'POST']
  }
});


const users = new Map(); 

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join", (userId) => {
    users.set(userId, socket.id);
    console.log(`User ${userId} mapped to socket ${socket.id}`);
  });

  socket.on("private-message", ({ to, from, text }) => {
    const receiverSocketId = users.get(to);
    if (receiverSocketId) {
      io.broadcast("private-message", { from, text ,to});
    }
  });

  socket.on("disconnect", () => {
    for (const [userId, sId] of users.entries()) {
      if (sId === socket.id) {
        users.delete(userId);
        break;
      }
    }
    console.log("Disconnected:", socket.id);
  });
});

connectDb();



app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use('/api', UserRouter);

server.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
});
