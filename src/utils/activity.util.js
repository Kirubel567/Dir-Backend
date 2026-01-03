import mongoose from "mongoose";
import { ActivityLog } from "../models/activityLog.model.js";

export const createLog = async (userId, repoId, action, targetType, targetId, message) => {
  await ActivityLog.create({
    userId: new mongoose.Types.ObjectId(userId),
    repoId: repoId ? new mongoose.Types.ObjectId(repoId) : null,
    action, 
    targetType, 
    targetId: new mongoose.Types.ObjectId(targetId),
    details: { message } 
  });
};