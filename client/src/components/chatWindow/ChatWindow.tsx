import React, { useState } from "react";
import ConfirmModal from "../ConfirmModal/ConfirmModal";
import { Chat } from "../../types";
import "./ChatWindow.scss";
import { useChatMessages } from "../../hooks/useChatMessages";
import { useAutoScroll } from "../../hooks/useAutoScroll";

interface Props {
  chat: Chat;
  showToast: (message: string) => void;
  onChatUpdate: (updated: Chat) => void;
  onClose: () => void;
}

const ChatWindow: React.FC<Props> = ({ chat, showToast, onChatUpdate, onClose }) => {
  const [input, setInput] = useState("");
  const {
    messages,
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
  } = useChatMessages({ chat, onChatUpdate, showToast });

  const {
    messagesContainerRef,
    messagesEndRef,
    autoScroll,
    setAutoScroll,
    initialScrollDone,
    handleMessagesUpdate,
    scrollToBottom,
  } = useAutoScroll();

  React.useEffect(() => {
    handleMessagesUpdate(messages.length);
  }, [messages.length, initialScrollDone, handleMessagesUpdate]);

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    await sendMessage(input, "user");
    setInput("");
    setTimeout(() => sendBotReply(), 3000);
  };

  const toggleMenu = (messageId: string) => {
    setMenuOpenId((prevId) => (prevId === messageId ? null : messageId));
  };

  const [menuOpenId, setMenuOpenId] = useState<string | null>(null);

  return (
    <div className="chat-window">
      <div className="chat-header">
        <div className="avatar">{chat.firstName ? chat.firstName[0] : "?"}</div>
        <div className="name">
          {chat.firstName} {chat.lastName}
        </div>
        <button className="close-btn" onClick={onClose}>
          ✕
        </button>
      </div>

      <div className="chat-messages" ref={messagesContainerRef}>
        {messages?.map((msg) => {
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
                      if (e.key === "Enter") handleEditSave(messageId, editingText);
                      if (e.key === "Escape") setEditingMessageId(null);
                    }}
                    autoFocus
                  />
                  <div className="edit-controls">
                    <button className="btn-save" onClick={() => handleEditSave(messageId, editingText)}>
                      Save
                    </button>
                    <button className="btn-cancel" onClick={() => setEditingMessageId(null)}>
                      Cancel
                    </button>
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
        <div ref={messagesEndRef} />
      </div>

      {!autoScroll && (
        <button
          className="scroll-to-bottom"
          onClick={() => {
            scrollToBottom(true);
            setAutoScroll(true);
          }}
        >
          ⬇
        </button>
      )}

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
        <button className="send-btn" onClick={handleSend}>
          ➤
        </button>
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
