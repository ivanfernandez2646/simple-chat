import { Message } from "./Message";
import { User } from "./User";

export type UserInConversation = User & { isTyping: boolean };

export type Conversation = {
  id: string;
  users?: UserInConversation[];
  messages?: Message[];
  lastMessage?: Message;
  createdAt: Date;
};
