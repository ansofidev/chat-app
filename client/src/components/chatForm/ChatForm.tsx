import React, { useState, useEffect } from "react";
import "./ChatForm.scss";
import { Chat } from "../../types";

interface ChatFormProps {
  onSubmit: (chatData: { firstName: string; lastName: string }) => void;
  onClose: () => void;
  initialData?: Chat;
}

const ChatForm: React.FC<ChatFormProps> = ({ onSubmit, onClose, initialData }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  useEffect(() => {
    if (initialData) {
      setFirstName(initialData.firstName);
      setLastName(initialData.lastName);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (firstName.trim() && lastName.trim()) {
      onSubmit({ firstName, lastName });
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{initialData ? "Edit Chat" : "Create Chat"}</h2>
        <form onSubmit={handleSubmit}>
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
          <div className="modal-actions">
            <button type="submit">Save</button>
            <button type="button" onClick={onClose} className="cancel">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatForm;
