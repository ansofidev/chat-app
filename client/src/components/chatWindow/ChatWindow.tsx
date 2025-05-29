import React, { useState, useEffect } from "react";
import axios from "axios";
import { Chat, Message } from "../../types";
import ConfirmModal from "../ConfirmModal/ConfirmModal";
import "./ChatWindow.scss";

interface Props {
  chat: Chat;
  showToast: (message: string) => void;
  onChatUpdate: (updated: Chat) => void;
  onClose: () => void;
}

const ChatWindow: React.FC<Props> = ({ chat, showToast, onChatUpdate, onClose }) => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState<string>("");
  const [deletingMessageId, setDeletingMessageId] = useState<string | null>(null);

  useEffect(() => {
    setMessages(chat.messages || []);
  }, [chat]);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    try {
      const res = await axios.post(
        `http://localhost:5001/api/chats/${chat._id}/messages`,
        { text: input, sender: "user" }
      );

      const updated = res.data;
      setMessages(updated.messages);
      onChatUpdate(updated);
      setInput("");

      setTimeout(() => sendBotReply(), 3000);
    } catch (err) {
      console.error("❌ Failed to send message:", err);
      showToast("Failed to send message");
    }
  };

  const sendBotReply = async () => {
    try {
      const res = await axios.get("http://localhost:5001/api/quotes/random");
      const quote = res.data.content;

      const botRes = await axios.post(
        `http://localhost:5001/api/chats/${chat._id}/messages`,
        { text: quote, sender: "bot" }
      );

      const updated = botRes.data;
      setMessages(updated.messages);
      onChatUpdate(updated);
      showToast("New message from bot");
    } catch (err) {
      console.error("❌ Bot reply failed:", err);
    }
  };

  const handleEditSave = async (messageId: string) => {
    try {
      const response = await axios.patch(
        `http://localhost:5001/api/chats/${chat._id}/messages/${messageId}`,
        { text: editingText }
      );

      const updated = response.data;
      setMessages(updated.messages);
      onChatUpdate(updated);
      showToast("Message updated");
    } catch (err) {
      console.error("❌ Failed to update message:", err);
      showToast("Failed to update message");
    } finally {
      setEditingMessageId(null);
    }
  };

  const handleDeleteConfirm = async () => {
    if (!deletingMessageId) return;

    try {
      const res = await axios.delete(
        `http://localhost:5001/api/chats/${chat._id}/messages/${deletingMessageId}`
      );

      const updated = res.data.chat;
      setMessages(updated.messages);
      onChatUpdate(updated);
      showToast("Message deleted");
    } catch (err) {
      console.error("Failed to delete message:", err);
      showToast("Failed to delete message");
    } finally {
      setDeletingMessageId(null);
    }
  };

  const toggleMenu = (messageId: string) => {
    setMenuOpenId((prevId) => (prevId === messageId ? null : messageId));
  };

  return (
    <div className="chat-window">
      <div className="chat-header">
        <div className="avatar">{chat.firstName[0]}</div>
        <div className="name">
          {chat.firstName} {chat.lastName}
        </div>
        <button className="close-btn" onClick={onClose}>✕</button>
      </div>

      <div className="chat-messages">
        {messages.map((msg) => {
          const messageId = msg._id;
          if (!messageId) return null;

          return (
            <div key={messageId} className={`bubble ${msg.sender === "user" ? "right" : "left"}`}>
              {editingMessageId === messageId ? (
                <>
                  <input
                    className="edit-input"
                    value={editingText}
                    onChange={(e) => setEditingText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleEditSave(messageId);
                      if (e.key === "Escape") setEditingMessageId(null);
                    }}
                    autoFocus
                  />
                  <div className="edit-controls">
                    <button className="btn-save" onClick={() => handleEditSave(messageId)}>Save</button>
                    <button className="btn-cancel" onClick={() => setEditingMessageId(null)}>Cancel</button>
                  </div>
                </>
              ) : (
                <>
                  <span>{msg.text}</span>
                  <small>{formatTime(msg.createdAt)}</small>
                  {msg.sender === "user" && (
                    <div className="menu-wrapper">
                      <button
                        className="menu-button"
                        onClick={() => toggleMenu(messageId)}
                        aria-label="Message options"
                        title="Options"
                      >
                        ⋮
                      </button>
                      {menuOpenId === messageId && (
                        <div className="menu-dropdown">
                          <button
                            onClick={() => {
                              setEditingMessageId(messageId);
                              setEditingText(msg.text);
                              setMenuOpenId(null);
                            }}
                          >
                            ✏️ Edit
                          </button>
                          <button
                            onClick={() => {
                              setDeletingMessageId(messageId);
                              setMenuOpenId(null);
                            }}
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          );
        })}
      </div>

      <div className="chat-input">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Type your message..."
          className="message-input"
        />
        <button className="send-btn" onClick={handleSend}>➤</button>
      </div>

      {deletingMessageId && (
        <ConfirmModal
          message="Are you sure you want to delete this message?"
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeletingMessageId(null)}
        />
      )}
    </div>
  );
};

export default ChatWindow;
