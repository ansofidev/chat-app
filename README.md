# 💬 Chat App

A fullstack chat application built with **React**, **TypeScript**, **Express**, and **MongoDB**. The interface is fully custom and styled using **SCSS only** — no UI libraries. Users can create chats, send messages, receive automated bot responses, and edit or delete their messages.

---

## 🚀 Features

- ✅ Create and delete chats  
- ✅ View and switch between chats  
- ✅ Send messages with bot auto-reply  
- ✅ Edit and delete individual messages  
- ✅ Keyboard-friendly (e.g. press `Enter` to send)  
- ✅ Responsive, clean SCSS-based UI  

---

## 🛠️ Tech Stack

- **Frontend:** React, TypeScript, SCSS  
- **Backend:** Node.js, Express, TypeScript  
- **Database:** MongoDB + Mongoose  
- **HTTP Client:** Axios  

---

## 📦 Installation

### 1. Clone the repository

```bash
git clone https://github.com/ansofidev/chat-app.git
cd chat-app
```

### 2. Install dependencies

#### Frontend

```bash
cd client
npm install
```

#### Backend

```bash
cd ../server
npm install
```

### 3. Run locally

#### Start Backend

```bash
cd server
npm run dev
```

#### Start Frontend (in another terminal)

```bash
cd client
npm start
```

Then open: [http://localhost:3000](http://localhost:3000)

---

## 🌐 Deployment

The frontend is deployed on Vercel:  
👉 https://chat-app-theta-one-46.vercel.app/

The backend must be run locally, or optionally deployed separately (e.g., to Render, Railway, etc.).

---

## 🔄 API Endpoints

### Chats

- `GET /api/chats` – Get all chats  
- `POST /api/chats` – Create a chat  
- `PUT /api/chats/:id` – Update chat  
- `DELETE /api/chats/:id` – Delete chat  

### Messages

- `POST /api/chats/:chatId/messages` – Add a message  
- `PATCH /api/chats/:chatId/messages/:messageId` – Edit a message  
- `DELETE /api/chats/:chatId/messages/:messageId` – Delete a message  

---

## ✏️ Notes

- Bot replies use a public quote API  
- Messages are embedded in each chat document  
- No authentication/login  
- No UI libraries — all styled manually  

---

## 👤 Author
[GitHub Profile](https://github.com/ansofidev)
