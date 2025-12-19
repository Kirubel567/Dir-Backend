import mongoose from "mongoose";
import { channelSchema } from "./channel.model.js";
import { taskSchema } from "./task.model.js";
import { fileSchema } from "./file.model.js";
import { webhookEventSchema } from "./webhookEvent.model.js";
import { membershipSchema } from "./membership.model.js";

const repositorySchema = new mongoose.Schema(
  {
    //github profile fields
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    description: {
      type: String,
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    members: [membershipSchema],
    channels: [channelSchema],
    tags: {
      type: [String],
      default: [],
    },
    tasks: [taskSchema],
    files: [fileSchema],
    webhookEvents: [webhookEventSchema],
  },
  { timestamps: true }
);
export const Repository = mongoose.model("Repository", repositorySchema);
