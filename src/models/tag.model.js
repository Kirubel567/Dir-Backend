import mongoose from "mongoose"; 


export const tagSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    
    },
    description:{
        type:String,
    },
    color:{
        type:String,
    }
}, {timestamps:true});

tagSchema.index({ name: 1 });

export const Tag = mongoose.model("Tag", tagSchema);