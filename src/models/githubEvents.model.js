import mongoose from "mongoose";

const githubEventSchema = new mongoose.Schema(
  {
    repoId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Repository",
    },
    eventType: {
      type: String,
      required: true,
      trim: true,
      enum: [
        "push",
        "pull_request",
        "issues",
        "issue_comment",
        "fork",
        "star",
        "watch",
        "ping"
      ],
    },
    actorUsername: {
      type: String,
      required: true,
      trim: true,
    },
    payload: {
      type: Object,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("GitHubEvent", githubEventSchema);
