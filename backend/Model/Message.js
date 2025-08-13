import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    conversationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },
    seen: {
      type: Boolean,
      default: false,
    },
    text: {
      type: String,
    },
    attachments: {
      type:String
    }, 
    id:{
      type:mongoose.Schema.Types.ObjectId,
      ref:"User",
      required:true,
    }
  },
  { timestamps: true }
);

messageSchema.index({ conversationId: 1, createdAt: 1 });

const messageModel = mongoose.model("messages",messageSchema);

export default messageModel;
