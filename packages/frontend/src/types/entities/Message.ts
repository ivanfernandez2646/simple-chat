export type Message = {
  id: string;
  senderId: string;
  receiverId: string;
  conversationId: string;
  text: string;
  isFavourite: boolean;
  isReadByReceiver: boolean;
  createdAt: Date;
};
