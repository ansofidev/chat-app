import axios from "axios";
import { Chat } from "../types";

const API = axios.create({
  baseURL: "http://https://chat-app-backend-qwq2.onrender.com :5001/api",
});

export const getChats = async (): Promise<Chat[]> => {
  const res = await API.get("/chats");
  return res.data;
};

export const createChat = async (firstName: string, lastName: string): Promise<Chat> => {
  const res = await API.post("/chats", { firstName, lastName });
  return res.data;
};

export const updateChat = async (id: string, firstName: string, lastName: string): Promise<Chat> => {
  const res = await API.put(`/chats/${id}`, { firstName, lastName });
  return res.data;
};

export const deleteChat = async (id: string): Promise<void> => {
  await API.delete(`/chats/${id}`);
};

export const getChatById = async (id: string): Promise<Chat> => {
  const res = await API.get(`/chats/${id}`);
  return res.data;
};
