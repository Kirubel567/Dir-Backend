import mongoose from "mongoose";

const accountSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    provider: {
      type: String,
      required: true,
      default: "github",
    },

    providerAccountId: {
      type: String,
      required: true,
    },
    accessToken: { 
        type: String,  
    },
    refreshToken: { 
        type: String,
    },
    accessTokenExpiresAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate provider accounts
accountSchema.index(
  { provider: 1, providerAccountId: 1 },
  { unique: true }
);

export default mongoose.model("Account", accountSchema);
