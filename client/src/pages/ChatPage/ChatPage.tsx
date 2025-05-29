import React, { useEffect, useRef, useState } from "react";
import { Chat } from "../../types";
import { getChats, deleteChat } from "../../api/chatApi";
import ChatList from "../../components/chatList/ChatList";
import NewChatForm from "../../components/NewChatForm/NewChatForm";
import ChatWindow from "../../components/chatWindow/ChatWindow";
import Toast from "../../components/Toast/Toast";
import ConfirmModal from "../../components/ConfirmModal/ConfirmModal";
import "./ChatPage.scss";

const ChatPage = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [chatToDelete, setChatToDelete] = useState<Chat | null>(null);
  const [chatToEdit, setChatToEdit] = useState<Chat | null>(null);

  const chatWindowRef = useRef<HTMLDivElement>(null);
  const chatListRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadChats();
  }, []);

  const loadChats = async () => {
    try {
      const data = await getChats();
      setChats(data);
    } catch (error) {
      console.error("Failed to load chats", error);
    }
  };

  const handleDelete = (chat: Chat) => {
    setChatToDelete(chat);
    setShowConfirmModal(true);
  };

  const confirmDelete = async () => {
    if (!chatToDelete) return;

    try {
      await deleteChat(chatToDelete._id);
      setToastMessage("Chat deleted");
      setShowConfirmModal(false);
      setChatToDelete(null);

      if (selectedChat?._id === chatToDelete._id) {
        setSelectedChat(null);
      }

      loadChats();
    } catch (err) {
      console.error("❌ Failed to delete chat:", err);
      setToastMessage("Failed to delete chat");
    }
  };

  return (
    <div className="chatPage">
      <div className="chatSidebar" ref={chatListRef}>
        <NewChatForm
          onChatCreated={loadChats}
          editingChat={chatToEdit}
          onCancelEdit={() => setChatToEdit(null)}
          onSaveEdit={async (updatedChat) => {
            try {
              await fetch(`http://localhost:5001/api/chats/${updatedChat._id}`, {
                method: "PUT",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({
                  firstName: updatedChat.firstName,
                  lastName: updatedChat.lastName,
                  messages: updatedChat.messages,
                }),
              });

              setToastMessage("Chat updated");
              setChatToEdit(null);

              if (selectedChat?._id === updatedChat._id) {
                setSelectedChat(updatedChat);
              }

              loadChats();
            } catch (err) {
              console.error("❌ Failed to update chat:", err);
              setToastMessage("Failed to update chat");
              setChatToEdit(null);
            }
          }}
        />

        <ChatList
          chats={chats}
          onSelect={setSelectedChat}
          onDelete={handleDelete}
          onEdit={(chat) => setChatToEdit(chat)}
          selectedChatId={selectedChat?._id}
        />
      </div>

      <div className="chatMain" ref={chatWindowRef}>
        {selectedChat ? (
          <ChatWindow
            chat={selectedChat}
            showToast={(msg) => setToastMessage(msg)}
            onChatUpdate={(updated) => {
              setSelectedChat(updated);
              loadChats();
            }}
            onClose={() => setSelectedChat(null)}
          />
        ) : (
          <div className="empty-chat-placeholder" aria-live="polite">
            <svg
              width="80"
              height="80"
              fill="#1976d2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path d="M4 4h16v12H5.17L4 17.17V4z" opacity=".3" />
              <path d="M20 2H4a2 2 0 0 0-2 2v17l4-4h14a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zm0 12H6l-2 2V4h16z" />
            </svg>
            <p>Please select a chat to start messaging</p>
          </div>
        )}
      </div>

      {toastMessage && (
        <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
      )}

      {showConfirmModal && chatToDelete && (
        <ConfirmModal
          message={`Are you sure you want to delete chat with ${chatToDelete.firstName} ${chatToDelete.lastName}?`}
          onConfirm={confirmDelete}
          onCancel={() => setShowConfirmModal(false)}
        />
      )}
    </div>
  );
};

export default ChatPage;
