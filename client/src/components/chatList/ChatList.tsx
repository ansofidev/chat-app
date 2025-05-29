import React, { useState } from "react";
import "./ChatList.scss";
import { Chat } from "../../types";

interface Props {
  chats: Chat[];
  onSelect: (chat: Chat) => void;
  onDelete: (chat: Chat) => void;
  onEdit?: (chat: Chat) => void;
  selectedChatId?: string;
  onCloseSelectedChat?: () => void;
}

const ChatList: React.FC<Props> = ({
  chats,
  onSelect,
  onDelete,
  onEdit,
  selectedChatId,
  onCloseSelectedChat,
}) => {
  const [openMenuChatId, setOpenMenuChatId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleMenu = (chatId: string) => {
    setOpenMenuChatId((prev) => (prev === chatId ? null : chatId));
  };

  const closeMenu = () => setOpenMenuChatId(null);

  const filteredChats = chats.filter((chat) => {
    const fullName = `${chat.firstName} ${chat.lastName}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });

  return (
    <div className="chat-list">
      <div className="chat-list-header">
        <h3>Chats</h3>
        <input
          type="text"
          placeholder="Search chats..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="chat-search-input"
        />
      </div>
      <ul className="chat-items">
        {filteredChats.map((chat) => {
          const lastMessage = chat.messages?.[chat.messages.length - 1];
          const preview = lastMessage?.text || "No messages yet";
          const time = lastMessage
            ? new Date(lastMessage.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "";

          return (
            <li
              key={chat._id}
              className={`chat-item ${
                selectedChatId === chat._id ? "selected" : ""
              }`}
            >
              <div className="avatar" onClick={() => onSelect(chat)}>
                {chat.firstName.charAt(0)}
              </div>
              <div className="chat-info" onClick={() => onSelect(chat)}>
                <div className="chat-name">
                  {chat.firstName} {chat.lastName}
                </div>
                <div className="chat-preview">{preview}</div>
              </div>
              <div className="chat-meta">
                <div className="chat-date">{time}</div>

                <div className="menu-wrapper">
                  <button
                    className="menu-button"
                    onClick={() => toggleMenu(chat._id)}
                    aria-label="More options"
                  >
                    ⋮
                  </button>

                  {openMenuChatId === chat._id && (
                    <div
                      className="menu-dropdown"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {onEdit && (
                        <button
                          onClick={() => {
                            onEdit(chat);
                            closeMenu();
                          }}
                        >
                          ✏️ Edit
                        </button>
                      )}
                      <button
                        onClick={() => {
                          onDelete(chat);
                          closeMenu();
                        }}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default ChatList;
