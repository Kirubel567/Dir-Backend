import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    sessionId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    userId: {
      type: String,
      required: true,
      index: true,
    },

    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 }, // TTL index → auto delete
    },

  },
  {
    timestamps: true, // adds createdAt & updatedAt
  }
);

export const Session = mongoose.model("Session", sessionSchema);
