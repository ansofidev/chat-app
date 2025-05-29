export interface Message {
  text: string;
  sender: "user" | "bot";
  createdAt: string;
  _id: string;
}

export interface Chat {
  _id: string;
  firstName: string;
  lastName: string;
  messages: Message[];
}
