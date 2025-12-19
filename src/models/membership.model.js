import mongoose from "mongoose";

export const membershipSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  role: {
    type: String,
    enum: ["owner", "maintainer", "contributor", "viewer"],
    default: "viewer",
  },
  joinedAt: { type: Date, default: Date.now },
});
