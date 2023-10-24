import { UserInConversation } from "../entities/Conversation";
import { Message } from "../entities/Message";

export type ChatWrapper = {
  conversationId: string;
  otherUser: UserInConversation;
  haveMessagesUnread: boolean;
  lastMessage?: Message;
  lastMessageHour?: Date;
};
