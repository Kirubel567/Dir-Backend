import mongoose from "mongoose";
import { channelSchema } from "./channel.model.js";
import { taskSchema } from "./task.model.js";
import { fileSchema } from "./file.model.js";
import { webhookEventSchema } from "./webhookEvent.model.js";
import { membershipSchema } from "./membership.model.js";

const repositorySchema = new mongoose.Schema(
  {
    //github profile fields
    githubId: {
      type: String,
      required: true,
      unique: true,
    },

    //github repo name to separate it from workspace names
    githubRepoName: {
      type: String,
      required: true,
      trim: true,
    },

    githubOwner: {
      type: String,
      required: true,
      trim: true,
    },

    //dir workspace name
    workspaceName: {
      type: String,
      required: true,
      trim: true,
    },

    githubFullName: {
      type: String,
      required: true,
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
    //github syncing on dashboard fields
    url: {
      type: String,
    },

    isPrivate: {
      type: Boolean,
      default: false,
    },
    language: {
      //primary programming language
      type: String,
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
