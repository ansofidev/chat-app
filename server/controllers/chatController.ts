import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import Chat from "../models/Chat";

export const getChats = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const chats = await Chat.find();
    res.json(chats);
  } catch (err) {
    next(err);
  }
};

export const getChatById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const chat = await Chat.findById(req.params.id);
    if (!chat) {
      res.status(404).json({ message: "Chat not found" });
      return;
    }
    res.json(chat);
  } catch (err) {
    next(err);
  }
};

export const createChat = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { firstName, lastName } = req.body;
    const newChat = new Chat({ firstName, lastName, messages: [] });
    const savedChat = await newChat.save();
    res.status(201).json(savedChat);
  } catch (err) {
    next(err);
  }
};

export const updateChat = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const updated = await Chat.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) {
      res.status(404).json({ message: "Chat not found" });
      return;
    }
    res.json(updated);
  } catch (err) {
    next(err);
  }
};

export const deleteChat = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const deleted = await Chat.findByIdAndDelete(req.params.id);
    if (!deleted) {
      res.status(404).json({ message: "Chat not found" });
      return;
    }
    res.json({ message: "Chat deleted" });
  } catch (err) {
    next(err);
  }
};

export const addMessageToChat = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { chatId } = req.params;
    const { text, sender } = req.body;

    const chat = await Chat.findById(chatId);
    if (!chat) {
      res.status(404).json({ message: "Chat not found" });
      return;
    }

    const newMessage = {
      _id: new mongoose.Types.ObjectId(),
      text,
      sender,
      createdAt: new Date(),
    };

    chat.messages.push(newMessage);
    await chat.save();

    res.status(201).json(newMessage);
  } catch (err) {
    next(err);
  }
};

export const updateMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { chatId, messageId } = req.params;
    const { text } = req.body;

    const chat = await Chat.findById(chatId);
    if (!chat) {
      res.status(404).json({ message: "Chat not found" });
      return;
    }

    const message = chat.messages.id(messageId);
    if (!message) {
      res.status(404).json({ message: "Message not found" });
      return;
    }

    message.text = text;
    await chat.save();

    res.json(chat);
  } catch (err) {
    next(err);
  }
};

export const deleteMessage = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { chatId, messageId } = req.params;

    const chat = await Chat.findById(chatId);
    if (!chat) {
      res.status(404).json({ message: "Chat not found" });
      return;
    }

    const message = chat.messages.id(messageId);
    if (!message) {
      res.status(404).json({ message: "Message not found" });
      return;
    }

    message.deleteOne();
    await chat.save();

    res.json({ message: "Message deleted", chat });
  } catch (err) {
    next(err);
  }
};
