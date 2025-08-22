import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import UserRouter from './Routes/User.router.js';
import { connectDb } from './Util/Db.js';
import 'dotenv/config';
import MessageRoute from './Routes/Message.route.js';

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;

const io = new Server(server, {
  cors: {
    origin: [process.env.FRONTEND_URL],
    methods: ['GET', 'POST']
  }
});
const users = new Map(); 
io.on('connection', (socket) => {
//  console.log(' User connected:', socket.id);
  socket.on('join', (userId) => {
    users.set(userId, socket.id);
   // console.log(` User ${userId} mapped to socket ${socket.id}`);
  });
  socket.on('send-message', (content) => {
    // console.log(' Message received:', content);

    const receiverSocketId = users.get(content.to);
    // console.log(receiverSocketId);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit('receive-message', {
        from: content.from,
        to: content.to,
        text: content.text,
      });
      // console.log(` Forwarded message to ${content.to}`);
    } else {
      // console.log(` User ${content.to} not online`);
    }
  });
  socket.on('private-message', ({ to, from, text }) => {
    const receiverSocketId = users.get(to);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('private-message', { from, text, to });
    }
  });
  socket.on('disconnect', () => {
    for (const [userId, sId] of users.entries()) {
      if (sId === socket.id) {
        users.delete(userId);

        break;
      }
    }
  });
});


connectDb();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/api', UserRouter);
app.use('/api',MessageRoute);


server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
