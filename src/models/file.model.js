import mongoose from "mongoose";

export const fileSchema = new mongoose.Schema(
  {
    repoId:{ 
        type: mongoose.Schema.Types.ObjectId,
         ref: "Repository",
          required: true
    },
    uploadedBy: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: "User", 
        required: true 
    },
    name: { 
        type: String, 
        required: true 
    },
    url: { 
        type: String,
        required: true
    },
    sizeKB: { 
        type: Number, 
        min: 0 
    },
  },
  { timestamps: true }
);

// Indexes for faster queries
fileSchema.index({ repoId: 1 });
fileSchema.index({ uploadedBy: 1 });

// export const File = mongoose.model("File", fileSchema);
