import { Schema, Document } from "mongoose";

export interface IMessage {
  _id?: string;
  text: string;
  sender: "user" | "bot";
  createdAt: Date;
}

const messageSchema = new Schema<IMessage>(
  {
    text: { type: String, required: true },
    sender: { type: String, enum: ["user", "bot"], required: true },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: true }
);

export default messageSchema;
