import mongoose from "mongoose";

export const commentSchema = new mongoose.Schema({
  commentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Comment" },
  content: String,
  reactions: [reactionSchema],
});

