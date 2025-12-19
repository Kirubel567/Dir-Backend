import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    //github profile fields
    githubUserName: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    gitHubID: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    email: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    avatarUrl: {
      type: String,
    },
    profileUrl: {
      type: String,
    },

    bio: {
      type: String,
      trim: true,
    },

    //OAuth tokens
    accessToken: {
      type: String,
      required: true,
      select: false,
    },
    refreshToken: {
      type: String,
      select: false,
    },

    //system control fields
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLogin: {
      type: Date,
    },

    //user settings
    preferences: {
      notificationsEnabled: {
        type: Boolean,
        default: true,
      },
      emailNotifications: {
        type: Boolean,
        default: false,
      },
      theme: {
        type: String,
        enum: ["light", "dark", "system"],
        default: "system",
      },
    },
    //relations
    reposOwned: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Repository",
      },
    ],
    notifications: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Notification",
      },
    ],
  },
  { timestamps: true }
);
export const User = mongoose.model("User", userSchema);
