import { useState, useEffect } from "react";
import axios from "axios";
import { Chat, Message } from "../types";
import { getChatById } from "../api/chatApi";

interface UseChatMessagesProps {
  chat: Chat;
  onChatUpdate: (updated: Chat) => void;
  showToast: (message: string) => void;
}

export const useChatMessages = ({ chat, onChatUpdate, showToast }: UseChatMessagesProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState<string>("");
  const [deletingMessageId, setDeletingMessageId] = useState<string | null>(null);

  useEffect(() => {
    setMessages(chat.messages ?? []);
  }, [chat]);

  const sendMessage = async (text: string, sender: "user" | "bot") => {
    try {
      await axios.post(
        `http://localhost:5001/api/chats/${chat._id}/messages`,
        { text, sender }
      );

      const updatedChat = await getChatById(chat._id);
      setMessages(updatedChat.messages ?? []);
      onChatUpdate(updatedChat);
      if (sender === "bot") {
        showToast("New message from bot");
      }
    } catch (err) {
      console.error("❌ Failed to send message:", err);
      if (sender === "user") showToast("Failed to send message");
    }
  };

  const sendBotReply = async () => {
    try {
      const res = await axios.get("http://localhost:5001/api/quotes/random");
      const quote = res.data.content;

      await sendMessage(quote, "bot");
    } catch (err) {
      console.error("❌ Bot reply failed:", err);
    }
  };

  const handleEditSave = async (messageId: string, newText: string) => {
    try {
      const res = await axios.patch(
        `http://localhost:5001/api/chats/${chat._id}/messages/${messageId}`,
        { text: newText }
      );

      const updatedChat = res.data.chat || res.data;
      setMessages(updatedChat.messages ?? []);
      onChatUpdate(updatedChat);
      showToast("Message updated");
    } catch (err) {
      console.error("❌ Failed to update message:", err);
      showToast("Failed to update message");
    } finally {
      setEditingMessageId(null);
      setEditingText("");
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingMessageId) return;

    try {
      const res = await axios.delete(
        `http://localhost:5001/api/chats/${chat._id}/messages/${deletingMessageId}`
      );

      const updatedChat = res.data.chat || res.data;
      setMessages(updatedChat.messages ?? []);
      onChatUpdate(updatedChat);
      showToast("Message deleted");
    } catch (err) {
      console.error("Failed to delete message:", err);
      showToast("Failed to delete message");
    } finally {
      setDeletingMessageId(null);
    }
  };

  return {
    messages,
    setMessages,
    editingMessageId,
    setEditingMessageId,
    editingText,
    setEditingText,
    deletingMessageId,
    setDeletingMessageId,
    sendMessage,
    sendBotReply,
    handleEditSave,
    handleDeleteConfirm,
  };
};
