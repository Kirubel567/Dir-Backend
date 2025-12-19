import mongoose from 'mongoose';

export const notificationSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User",
        required: true,
    },
    message:{
        type:String,
        required:true,

    },
    type:{
        type:String,
        enum:["comment","mention","reaction","task-assignment","message"],
        required:true,
    },
    repoId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Repository",
    
    },
    targetType:{
        type:String,
        enum:[ "repository", "pull_request", "issue", "message"],
        required:true,
    },
    targetId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,

    },
    isRead:{
        type: Boolean,
        default: false,
    },

},{ timestamps: true });

notificationSchema.index({ userId: 1 });
notificationSchema.index({ repoId: 1 });

export const Notification = mongoose.model("Notification", notificationSchema);