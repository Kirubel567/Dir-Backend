import mongoose from "mongoose";
import {reactionSchema} from "./shared.model.js"

export const commentSchema = new mongoose.Schema({
  commentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Comment" },
  content: String,
  reactions: [reactionSchema],
});

