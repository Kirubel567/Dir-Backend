import mongoose from "mongoose"; 


export const tagSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true,
        trim:true,
        lowercase: true
    },
    description:{
        type:String,
        trim:true,
        maxlength: 200
    },
    color:{
        type:String,
        default: "#4f46e5",
    },
    createdBy: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User", 
        required: true 
    }
}, {timestamps:true});

// tagSchema.index({ name: 1 });

export const Tag = mongoose.model("Tag", tagSchema);