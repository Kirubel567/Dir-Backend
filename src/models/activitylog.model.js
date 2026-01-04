import mongoose from "mongoose";

export const activityLogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    repoId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Repository",
        required: false,
    },
    action: {
        type: String,
        required: true,
    },
    targetType: {
        type: String,
        enum: ["repository", "pull_request", "issue", "message", "comment", "tag", "user", "workspace", "file"],
        required: true,
    },
    targetId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,

    },
    details: {
        type: mongoose.Schema.Types.Mixed,
    }
}, { timestamps: true });

activityLogSchema.index({ userId: 1 });
activityLogSchema.index({ repoId: 1 });

export const ActivityLog = mongoose.model("ActivityLog", activityLogSchema);    