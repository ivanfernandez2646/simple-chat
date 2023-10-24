import "./TypeMessage.css";
import SendIcon from "@mui/icons-material/Send";
import { useState } from "react";
import { fetchSendMessage } from "../../api/Api";
import { socket } from "../../socket/Socket";
import {
  Conversation,
  UserInConversation,
} from "../../types/entities/Conversation";
import { useSetRecoilState } from "recoil";
import { isLoadingState } from "../../state/State";

export type Props = {
  loggedUserInConversation: UserInConversation;
  fullSelectedConversation: Conversation;
};

function TypeMessage({
  loggedUserInConversation,
  fullSelectedConversation,
}: Props) {
  const [messageText, setMessageText] = useState(""),
    setIsLoading = useSetRecoilState(isLoadingState);

  const handleInputMessageChange = (event: any) => {
    setMessageText(event.target.value);
  };

  const handleInputMessageBlur = (_event: any) => {
    socket.emit(`stopTyping`, {
      conversationId: fullSelectedConversation.id,
      loggedUserId: loggedUserInConversation.id,
    });
  };

  const handleInputMessageFocus = (_event: any) => {
    socket.emit(`startTyping`, {
      conversationId: fullSelectedConversation.id,
      loggedUserId: loggedUserInConversation.id,
    });
  };

  const handleInputMessageKeyPress = async (event: any) => {
    if (event.key === "Enter" && event.shiftKey) {
      await sendMessage();
      setMessageText("");
    }
  };

  const handleSendMessage = async (event: any) => {
    await sendMessage();
  };

  async function sendMessage() {
    if (messageText && loggedUserInConversation) {
      setIsLoading(() => true);
      await fetchSendMessage({
        messageText,
        conversationId: fullSelectedConversation.id,
        conversationUsers: fullSelectedConversation.users!,
        loggedUserInConversation,
      });
      setIsLoading(false);
    }
  }

  return (
    <div className="TypeMessage_wrapper">
      <div className="TypeMessage">
        <input
          type="text"
          className="no_outline"
          placeholder="Type your message"
          onChange={handleInputMessageChange}
          onKeyUp={handleInputMessageKeyPress}
          onBlur={handleInputMessageBlur}
          onFocus={handleInputMessageFocus}
          maxLength={50}
          value={messageText}
        />
        <SendIcon
          fontSize="small"
          onClick={handleSendMessage}
          color={messageText ? "secondary" : "disabled"}
        />
      </div>
    </div>
  );
}

export default TypeMessage;
