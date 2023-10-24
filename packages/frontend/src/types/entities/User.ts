import { Conversation } from "./Conversation";

export type User = {
  id: string;
  name: string;
  surname: string;
  bioStatus: string;
  photoUrl: string;
  createdAt: Date;
  conversations?: Conversation[];
};
