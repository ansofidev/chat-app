import mongoose, { Schema, Document } from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    sender: { type: String, enum: ["user", "bot"], required: true },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true }
);

const chatSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    messages: [messageSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Chat", chatSchema);
