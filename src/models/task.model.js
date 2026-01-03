import mongoose from "mongoose";
import { commentSchema } from "./comment.model.js";
import {reactionSchema, mentionSchema} from "./shared.model.js"

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
