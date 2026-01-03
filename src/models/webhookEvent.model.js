import mongoose from "mongoose";

export const webhookEventSchema = new mongoose.Schema(
  {
    eventType: { type: String, required: true }, // e.g., "push", "pull_request"
    payload: { type: mongoose.Schema.Types.Mixed }, // store any data related to the event
  },
  { timestamps: true }
);
