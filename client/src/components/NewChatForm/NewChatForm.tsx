import React, { useEffect, useState } from "react";
import { Chat } from "../../types";
import "./NewChatForm.scss";

interface Props {
  onChatCreated: () => void;
  editingChat?: Chat | null;
  onCancelEdit?: () => void;
  onSaveEdit?: (updatedChat: Chat) => void;
}

const NewChatForm: React.FC<Props> = ({
  onChatCreated,
  editingChat = null,
  onCancelEdit,
  onSaveEdit,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  useEffect(() => {
    if (editingChat) {
      setFirstName(editingChat.firstName);
      setLastName(editingChat.lastName);
      setIsOpen(true);
    } else {
      setFirstName("");
      setLastName("");
      setIsOpen(false);
    }
  }, [editingChat]);

  const toggleForm = () => {
    // Якщо зараз редагування, не дозволяємо закривати форму toggle-ом
    if (editingChat) return;
    setIsOpen((prev) => !prev);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!firstName.trim() || !lastName.trim()) return;

    if (editingChat && onSaveEdit) {
      await onSaveEdit({ ...editingChat, firstName, lastName });
    } else {
      try {
        await fetch("https://chat-app-backend-qwq2.onrender.com/api/chats", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ firstName, lastName }),
        });
        onChatCreated();
        setIsOpen(false);
        setFirstName("");
        setLastName("");
      } catch (err) {
        console.error("❌ Failed to create chat:", err);
      }
    }
  };

  return (
    <div className="new-chat-container">
      <button className="toggle-btn" onClick={toggleForm} disabled={!!editingChat}>
        {isOpen ? (editingChat ? "✏️ Edit Chat" : "✖ Close") : "➕ New Chat"}
      </button>

      {isOpen && (
        <form className="new-chat-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="First name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Last name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button type="submit">{editingChat ? "Save" : "Create"}</button>
            {editingChat && (
              <button
                type="button"
                onClick={() => {
                  if (onCancelEdit) onCancelEdit();
                }}
                style={{
                  background: "#ccc",
                  color: "#333",
                  borderRadius: "6px",
                  border: "none",
                  cursor: "pointer",
                  padding: "0.6rem 1rem",
                  fontSize: "1rem",
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  );
};

export default NewChatForm;
