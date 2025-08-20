import conversationModel from "../Model/ConversationModel.js";
import messageModel from "../Model/Message.js";
import cloudinary from "../Util/cloudinary.js";
import fs from 'fs'

export const getMessages = async (req, res) => {
  try {
    const { from, to } = req.query; 

    const conversation = await conversationModel.findOne({
      participants: { $all: [from, to] },
    });

    if (!conversation) {
      return res.json({ success: true, messages: [] });
    }

    const messages = await messageModel
      .find({ conversationId: conversation._id })
      .sort({ createdAt: 1 });
       const filterdMessages = messages.filter(item => item.text ||item.attachments )
      res.json({ success: true,messages: filterdMessages });

  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const sendMessages = async (req, res) => {
  try {
    const { from, to, text } = req.body;
 

    let conversation = await conversationModel.findOne({
      participants: { $all: [from, to] },
    });

    if (!conversation) {
      conversation = await conversationModel.create({
        participants: [from, to],
      });
    }

    let attachmentsUrl = null;
    if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: "chat_files",
      });
      attachmentsUrl = result.secure_url;
      fs.unlinkSync(req.file.path);
    }

    const newMessage = new messageModel({
      conversationId: conversation._id,
      sender: from,
      text: text || "",
      attachments: attachmentsUrl,
      seen: false,
      id: from,
    });

    await newMessage.save();

    res.json({ success: true, message: newMessage });
  } catch (error) {

    res.status(500).json({ success: false, message: error.message });
  }
};
