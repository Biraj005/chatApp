import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import UserRouter from './Routes/User.router.js';
import { connectDb } from './Util/Db.js';
import 'dotenv/config'
import multer from 'multer';


const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;
const io = new Server(server, {
  cors: {
    origin:'*',
    methods: ['GET', 'POST']
  }
});

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id);

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

connectDb();



app.use(cors());
app.use(express.json()); 
app.use('/api', UserRouter);

server.listen(PORT, () => {
  console.log(`🚀 Server listening on http://localhost:${PORT}`);
});
