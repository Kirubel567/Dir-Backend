import mongoose from "mongoose";
import { reactionSchema, mentionSchema} from "./task.model";
import { commentSchema } from "./comment.model.js";
export const attachmentSchema = new mongoose.Schema({
    fileId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "File",
    },
    name: String,
    url: String,
})


export const messageSchema = new mongoose.Schema({
  channelId: { 
    type: mongoose.Schema.Types.ObjectId,
    ref: "Channel",
    required: true
    },
    senderId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required:true,
    },
    content:{
        type:String,
        required:true,
    },
    attachments:[attachmentSchema],
    reactions:[reactionSchema],
    mentions:[mentionSchema],
    comments:[commentSchema],


}, { timestamps: true });

messageSchema.index({ channelId: 1 });
messageSchema.index({ senderId: 1 });


export const Message = mongoose.model("Message", messageSchema);