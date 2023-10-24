import { CreateConversationDto } from "../types/dto/CreateConversationDto";
import { CreateMessageDto } from "../types/dto/CreateMessageDto";
import {
  Conversation,
  UserInConversation,
} from "../types/entities/Conversation";
import { User } from "../types/entities/User";
import { v4 as uuidv4 } from "uuid";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:3000";

export const fetchUserProfile = async (): Promise<User> => {
    const res = await fetch(`${API_URL}/user/profile`, {
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error("User not logged in");
    }

    return res.json();
  },
  fetchConversationsList = async (
    loggedUser: User
  ): Promise<Conversation[]> => {
    const res = await fetch(
      `${API_URL}/conversation/list?ids=${loggedUser.conversations!.map(
        (conversation) => `${conversation.id}`
      )}`,
      {
        credentials: "include",
      }
    );

    if (!res.ok) {
      throw new Error(res.statusText);
    }

    return res.json();
  },
  fetchFullSelectedConversation = async (
    selectedConversationId: string
  ): Promise<Conversation> => {
    const res = await fetch(
      `${API_URL}/conversation/${selectedConversationId}?getMessages=true`,
      { credentials: "include" }
    );

    if (!res.ok) {
      throw new Error(res.statusText);
    }

    return res.json();
  },
  fetchSendMessage = async ({
    messageText,
    conversationId,
    conversationUsers,
    loggedUserInConversation,
  }: {
    messageText: string;
    conversationId: string;
    conversationUsers: User[];
    loggedUserInConversation: UserInConversation;
  }): Promise<void> => {
    const res = await fetch(`${API_URL}/message`, {
      credentials: "include",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: uuidv4(),
        conversationId,
        senderId: loggedUserInConversation.id,
        receiverId: conversationUsers.find(
          (user) => user.id !== loggedUserInConversation.id
        )?.id,
        text: messageText,
      } as unknown as CreateMessageDto),
    });

    if (!res.ok) {
      throw new Error(res.statusText);
    }
  },
  fetchAllUsers = async (): Promise<User[]> => {
    const res = await fetch(`${API_URL}/user`, {
      credentials: "include",
    });

    if (!res.ok) {
      throw new Error(res.statusText);
    }

    return res.json();
  },
  fetchCreateConversation = async ({
    conversationId,
    loggedUser,
    selectedUserId,
  }: {
    conversationId: string;
    loggedUser: User;
    selectedUserId: string;
  }): Promise<void> => {
    const res = await fetch(`${API_URL}/conversation`, {
      credentials: "include",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: conversationId,
        userIds: [loggedUser.id, selectedUserId],
      } as unknown as CreateConversationDto),
    });

    if (!res.ok) {
      throw new Error(res.statusText);
    }
  };
