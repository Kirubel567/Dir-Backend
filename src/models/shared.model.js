import mongoose from "mongoose";

export const reactionSchema = new mongoose.Schema(
  {
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User" 
    },
    emoji: String,
  },
  { timestamps: true }
);



export const mentionSchema = new mongoose.Schema({
  mentionedUserId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User" },
  mentionedBy: { 
    type: mongoose.Schema.Types.ObjectId,
     ref: "User" 
    },
  context: String,
  mentionedAt: { type: Date, default: Date.now },
});