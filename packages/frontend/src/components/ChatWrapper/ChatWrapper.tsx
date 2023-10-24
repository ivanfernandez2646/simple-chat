import "./ChatWrapper.css";
import { ChatWrapper as ChatWrapperType } from "../../types/helpers/ChatWrapper";
import { PropsWithChildren, useEffect, useState } from "react";
import moment from "moment";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import {
  conversationsState,
  fullSelectedConversationState,
  loggedUserState,
  selectedConversationIdState,
} from "../../state/State";
import { socket } from "../../socket/Socket";
import { Message } from "../../types/entities/Message";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import { usePrevious } from "@uidotdev/usehooks";

export interface Props {
  chatWrapper: ChatWrapperType;
}

function ChatWrapper({ chatWrapper }: PropsWithChildren<Props>) {
  const [selectedConversationId, setSelectedConversationId] = useRecoilState(
      selectedConversationIdState
    ),
    previousSelectedConversationId = usePrevious(selectedConversationId),
    setFullSelectedConversation = useSetRecoilState(
      fullSelectedConversationState
    ),
    setConversations = useSetRecoilState(conversationsState),
    loggedUser = useRecoilValue(loggedUserState),
    [haveMessagesUnread, setHaveMessagesUnread] = useState<boolean>(
      chatWrapper.haveMessagesUnread
    );

  const handleConversationClick = (_event: any) => {
    if (selectedConversationId === chatWrapper.conversationId) {
      setSelectedConversationId(() => null);
      setFullSelectedConversation(() => null);
      return;
    }

    setSelectedConversationId(() => chatWrapper.conversationId);
    setFullSelectedConversation(() => null);
  };

  useEffect(() => {
    const eventLastMessage = `${chatWrapper.conversationId}#lastMessage`;

    if (!socket.hasListeners(eventLastMessage)) {
      socket.on(eventLastMessage, (addedMessage: Message) => {
        let newAddedMessage: Message = { ...addedMessage },
          isItsConversationOpened: boolean = false;
        setFullSelectedConversation((prev) => {
          if (!prev) {
            return null;
          }

          isItsConversationOpened = prev?.id === newAddedMessage.conversationId;

          if (isItsConversationOpened) {
            newAddedMessage = {
              ...newAddedMessage,
              isReadByReceiver: loggedUser?.id === newAddedMessage.receiverId,
            };
          }

          return {
            ...prev,
            messages: prev.messages
              ? [...prev.messages, newAddedMessage]
              : [newAddedMessage],
            lastMessage: newAddedMessage,
          };
        });

        setConversations((prev) => {
          const index = prev.findIndex(
              (conversation) => conversation.id === chatWrapper.conversationId
            ),
            cloned = [...prev];

          if (index !== -1) {
            cloned[index] = {
              ...cloned[index],
              lastMessage: newAddedMessage,
            };
          }

          return cloned.sort((conversation1, conversation2) => {
            if (conversation1.lastMessage && conversation2.lastMessage) {
              return (
                moment(conversation2.lastMessage.createdAt).valueOf() -
                moment(conversation1.lastMessage.createdAt).valueOf()
              );
            }

            if (!conversation1.lastMessage && conversation2.lastMessage) {
              return 1;
            }

            if (conversation1.lastMessage && !conversation2.lastMessage) {
              return -1;
            }

            return 0;
          });
        });

        if (
          isItsConversationOpened &&
          loggedUser?.id === newAddedMessage.receiverId
        ) {
          socket.emit(`markLastMessagesAsRead`, {
            conversationId: chatWrapper.conversationId,
            loggedUserId: loggedUser?.id,
          });
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (selectedConversationId === chatWrapper.conversationId) {
      socket.emit(`markLastMessagesAsRead`, {
        conversationId: chatWrapper.conversationId,
        loggedUserId: loggedUser?.id,
      });
      setHaveMessagesUnread(false);
    }

    if (
      previousSelectedConversationId &&
      selectedConversationId !== previousSelectedConversationId
    ) {
      setConversations((prev) => {
        return prev.map((conversation) => {
          if (conversation.id === chatWrapper.conversationId) {
            return {
              ...conversation,
              lastMessage: conversation.lastMessage
                ? {
                    ...conversation.lastMessage,
                    isReadByReceiver: true,
                  }
                : undefined,
            };
          }
          return conversation;
        });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedConversationId]);

  useEffect(() => {
    if (chatWrapper.lastMessage) {
      setHaveMessagesUnread(
        !chatWrapper?.lastMessage?.isReadByReceiver &&
          loggedUser?.id === chatWrapper?.lastMessage?.receiverId
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatWrapper.lastMessage]);

  return (
    <div
      className={`ChatWrapper ${
        selectedConversationId === chatWrapper.conversationId
          ? "ChatWrapper_selected"
          : ""
      }`}
      onClick={handleConversationClick}
    >
      <div className="ChatWrapper-user">
        <img
          referrerPolicy="no-referrer"
          src={chatWrapper.otherUser.photoUrl}
          alt={chatWrapper.otherUser.photoUrl}
        />
        <div className="ChatWrapper-user_data">
          <h3 className="ChatWrapper-user_name">
            {chatWrapper.otherUser.name} {chatWrapper.otherUser.surname}
          </h3>
          <p className="ChatWrapper-user_lastMessage">
            {chatWrapper.otherUser.isTyping
              ? "Typing..."
              : `${
                  chatWrapper.lastMessage?.senderId === loggedUser?.id
                    ? "You: "
                    : ""
                } ${
                  chatWrapper.lastMessage?.text.length! > 15
                    ? chatWrapper.lastMessage?.text
                        .substring(0, 15)
                        .concat("...")
                    : chatWrapper.lastMessage?.text || ""
                }`}
          </p>
        </div>
      </div>
      <div className="ChatWrapper-info">
        {chatWrapper.lastMessageHour ? (
          <p className="ChatWrapper-info_lastMessageHour">
            {moment(chatWrapper.lastMessageHour).format("HH:mm")}
          </p>
        ) : (
          <></>
        )}
        <div className="ChatWrapper-info_legendIcons">
          {chatWrapper.otherUser.isTyping ? <>✍🏼</> : <></>}
          {haveMessagesUnread ? (
            <PriorityHighIcon
              fontSize="small"
              color="error"
              className="wobble-hor-top"
            />
          ) : (
            <></>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatWrapper;
