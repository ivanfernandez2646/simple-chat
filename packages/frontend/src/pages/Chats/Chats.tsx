import UserInfo from "../../components/UserInfo/UserInfo";
import "./Chats.css";
import { useRecoilValue, useSetRecoilState } from "recoil";
import ChatWrapper from "../../components/ChatWrapper/ChatWrapper";
import { ChatWrapper as ChatWrapperType } from "../../types/helpers/ChatWrapper";
import {
  chatsWrappersState,
  conversationsState,
  generateUpdatedItems,
  isLoadingState,
  loggedUserState,
  selectedConversationIdState,
  updateTypingInConversation,
} from "../../state/State";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchConversationsList } from "../../api/Api";
import { socket } from "../../socket/Socket";
import { Conversation } from "../../types/entities/Conversation";
import { useMediaQuery } from "react-responsive";

function Chats() {
  const setConversations = useSetRecoilState(conversationsState),
    chatsWrappers: ChatWrapperType[] = useRecoilValue(chatsWrappersState),
    loggedUser = useRecoilValue(loggedUserState),
    selectedConversationId = useRecoilValue(selectedConversationIdState),
    setIsLoading = useSetRecoilState(isLoadingState),
    isSmallScreen = useMediaQuery({ query: "(max-width: 800px)" }),
    {
      data: conversationsListData,
      isLoading,
      error,
    } = useQuery({
      queryKey: loggedUser ? ["conversationsList"] : undefined,
      queryFn: loggedUser
        ? () => fetchConversationsList(loggedUser)
        : undefined,
      retry: 0,
      enabled: !!loggedUser?.conversations?.length,
    });

  useEffect(() => {
    if (conversationsListData) {
      setConversations(conversationsListData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [conversationsListData]);

  useEffect(() => {
    setIsLoading(isLoading && !!selectedConversationId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading, selectedConversationId]);

  useEffect(() => {
    const startTypingEvent = "startTyping",
      stopTypingEvent = "stopTyping",
      conversationCreatedEvent = "conversationCreated";

    if (!socket.hasListeners(startTypingEvent)) {
      socket.on(
        startTypingEvent,
        ({
          conversationId,
          userId,
        }: {
          conversationId: string;
          userId: string;
        }) => {
          setConversations((prev) => {
            return updateTypingInConversation(prev, {
              conversationId,
              userId,
              isTyping: true,
            });
          });
        }
      );
    }

    if (!socket.hasListeners(stopTypingEvent)) {
      socket.on(
        stopTypingEvent,
        ({
          conversationId,
          userId,
        }: {
          conversationId: string;
          userId: string;
        }) => {
          setConversations((prev) => {
            return updateTypingInConversation(prev, {
              conversationId,
              userId,
              isTyping: false,
            });
          });
        }
      );
    }

    if (!socket.hasListeners(conversationCreatedEvent)) {
      socket.on(conversationCreatedEvent, (conversation: Conversation) => {
        setConversations((prev) => {
          return generateUpdatedItems(prev, {
            value: conversation,
            isNew: true,
            insertAtBeginning: true,
          });
        });
      });
    }

    return () => {
      socket.off(startTypingEvent);
      socket.off(stopTypingEvent);
      socket.off(conversationCreatedEvent);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (error) {
    return (
      <h1>Error while fetching conversations list {error as any as string}</h1>
    );
  }

  return (!selectedConversationId && isSmallScreen) || !isSmallScreen ? (
    <div className="Chats">
      <UserInfo />
      {chatsWrappers.map((chatWrapper) => (
        <ChatWrapper
          key={chatWrapper.conversationId}
          chatWrapper={chatWrapper}
        />
      ))}
    </div>
  ) : (
    <></>
  );
}

export default Chats;
