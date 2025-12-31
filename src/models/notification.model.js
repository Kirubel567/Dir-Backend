import mongoose from 'mongoose';

export const notificationSchema = new mongoose.Schema({
    userId:{
        type: String,
        ref:"User",
        required: false,
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
        enum:["system","repository", "pull_request", "issue", "message"],
        required:false,
    },
    targetId:{
        type:mongoose.Schema.Types.ObjectId,
        required:false,

    },
    isRead:{
        type: Boolean,
        default: false,
    },

},{ timestamps: true });

notificationSchema.index({ userId: 1 });
notificationSchema.index({ repoId: 1 });

export const Notification = mongoose.model("Notification", notificationSchema);