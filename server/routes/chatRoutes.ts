import express from "express";
import {
  getChats,
  createChat,
  updateChat,
  deleteChat,
  getChatById,
  addMessageToChat,
  updateMessage,
  deleteMessage,
} from "../controllers/chatController";

const router = express.Router();

router.get("/", getChats);
router.get("/:id", getChatById);
router.post("/", createChat);
router.put("/:id", updateChat);
router.delete("/:id", deleteChat);

router.post("/:chatId/messages", addMessageToChat);
router.patch("/:chatId/messages/:messageId", updateMessage);
router.delete("/:chatId/messages/:messageId", deleteMessage);

export default router;
