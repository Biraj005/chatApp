import express from 'express';
import { protectedRoute } from '../middlewares/ProctectRoute.js';
import { getMessages, sendMessages } from '../Controller/MessageController.js';
import { upload } from '../middlewares/multer.js';

const MessageRoute = express.Router();

MessageRoute.get("/message/getmessages",protectedRoute,getMessages);
MessageRoute.post("/message/send",protectedRoute,upload.single("image"),sendMessages);





export default MessageRoute;