import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";

import chatRoutes from "./routes/chatRoutes";
import quoteRoutes from "./routes/quoteRoutes";


dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
  },
});

app.use(cors());
app.use(express.json());

app.use("/api/chats", chatRoutes);
app.use("/api/quotes", quoteRoutes); 

app.get("/", (req, res) => {
  res.send("API Running");
});

io.on("connection", (socket) => {
  console.log("🟢 New client connected");

  socket.on("disconnect", () => {
    console.log("🔴 Client disconnected");
  });
});

const PORT = process.env.PORT || 5001;
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/chat";

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB connected");
    httpServer.listen(PORT, () =>
      console.log(`🚀 Server running on port ${PORT}`)
    );
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err);
  });
