import { atom, selector } from "recoil";
import { Conversation } from "../types/entities/Conversation";
import { User } from "../types/entities/User";
import { ChatWrapper } from "../types/helpers/ChatWrapper";
import { DisplayMessage } from "../types/helpers/DisplayMessage";

// Atoms
export const loggedUserState = atom<User | null>({
    key: "loggedUserState",
    default: null,
  }),
  conversationsState = atom<Conversation[]>({
    key: "conversationsState",
    default: [],
  }),
  selectedConversationIdState = atom<string | null>({
    key: "selectedConversationIdState",
    default: undefined,
  }),
  fullSelectedConversationState = atom<Conversation | null>({
    key: "fullSelectedConversationState",
    default: null,
  }),
  allUsersState = atom<User[]>({
    key: "allUsersState",
    default: [],
  }),
  filterUsersTextState = atom<string>({
    key: "filterUsersTextState",
    default: "",
  }),
  isLoadingState = atom<boolean>({ key: "isLoadingState", default: false });

// Selectors
export const chatsWrappersState = selector<ChatWrapper[]>({
    key: "chatsWrappersState",
    get: ({ get }) => {
      const conversations = get(conversationsState),
        loggedUser = get(loggedUserState),
        chatWrappers: ChatWrapper[] = conversations.map<ChatWrapper>(
          (conversation) => {
            const lastMessage = conversation.lastMessage;

            return {
              conversationId: conversation.id,
              otherUser: conversation.users?.find(
                (user) => user.id !== loggedUser?.id
              )!,
              lastMessage,
              lastMessageHour: lastMessage?.createdAt,
              haveMessagesUnread:
                !lastMessage?.isReadByReceiver &&
                lastMessage?.receiverId === loggedUser?.id,
            };
          }
        );

      return chatWrappers;
    },
  }),
  displayMessagesSelector = selector<DisplayMessage[]>({
    key: "displayMessagesSelector",
    get: ({ get }) => {
      const fullSelectedConversation = get(fullSelectedConversationState),
        loggedUser = get(loggedUserState);

      if (fullSelectedConversation?.messages && loggedUser) {
        const otherUserPhotoUrl = fullSelectedConversation.users!.find(
          (user) => user.id !== loggedUser.id
        )?.photoUrl!;

        return fullSelectedConversation.messages.map((message) => {
          const isSentByLoggedUser = message.senderId === loggedUser.id;

          return {
            id: message.id,
            text: message.text,
            isFavourite: message.isFavourite,
            isSentByLoggedUser,
            photoUrl: isSentByLoggedUser
              ? loggedUser.photoUrl
              : otherUserPhotoUrl,
          };
        });
      }

      return [];
    },
  }),
  filteredAllUsersSelector = selector<User[]>({
    key: "filteredAllUsersSelector",
    get: ({ get }) => {
      const allUsers = get(allUsersState),
        filterUser = get(filterUsersTextState),
        loggedUser = get(loggedUserState);

      if (!allUsers) {
        return [];
      }

      return allUsers.filter(
        (user) =>
          loggedUser?.id !== user.id &&
          user?.name
            .concat(...[" ", user.surname])
            .toLowerCase()
            .includes(filterUser.toLowerCase())
      );
    },
  });

// Helpers functions
export function generateUpdatedItems<T extends { id: string }>(
  prev: T[],
  itemToAddOrModify: {
    value: T;
    isNew: boolean;
    insertAtBeginning?: boolean;
  }
): T[] {
  if (!prev) {
    return [itemToAddOrModify.value];
  }

  if (!itemToAddOrModify.isNew) {
    const index = prev.findIndex(
        (conversation) => conversation.id === itemToAddOrModify.value.id
      ),
      cloned = [...prev];

    if (index !== -1) {
      cloned[index] = itemToAddOrModify.value;
    }

    return cloned;
  }

  return itemToAddOrModify.insertAtBeginning
    ? [itemToAddOrModify.value, ...prev]
    : [...prev, itemToAddOrModify.value];
}

export function updateTypingInConversation(
  prev: Conversation[],
  {
    conversationId,
    userId,
    isTyping,
  }: { conversationId: string; userId: string; isTyping: boolean }
): Conversation[] {
  const index = prev.findIndex(
      (conversation) => conversation.id === conversationId
    ),
    cloned = [...prev];

  if (index !== -1) {
    const newUsers = cloned[index].users?.map((user) => {
      if (user.id === userId) {
        return {
          ...user,
          isTyping,
        };
      }

      return user;
    });
    return generateUpdatedItems(prev, {
      value: { ...cloned[index], users: newUsers },
      isNew: false,
    });
  }

  return cloned;
}
