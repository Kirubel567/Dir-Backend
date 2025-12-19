import mongoose from "mongoose";
import { commentSchema } from "./comment.model.js";
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

export const taskSchema = new mongoose.Schema({
  repoId: { 
    type: mongoose.Schema.Types.ObjectId,
     ref: "Repository",
      required: true },
  title: { 
    type: String, 
    required: true },
  description: { 
    type: String, 
    required: true 
    },
  status: { 
    type: String, 
    enum: ["pending", "in-progress", "completed"],
     default: "pending" },
  assignedTo: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User" },
  attachments: [
    {
      fileId: { type: mongoose.Schema.Types.ObjectId, ref: "File" },
      name: String,
      url: String,
    },
  ],
  comments: [commentSchema],
  mentions: [mentionSchema],
}, { timestamps: true });

// export const Task = mongoose.model("Task", taskSchema);
