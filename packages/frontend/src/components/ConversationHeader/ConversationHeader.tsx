import "./ConversationHeader.css";
import { UserInConversation } from "../../types/entities/Conversation";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useMediaQuery } from "react-responsive";
import { useSetRecoilState } from "recoil";
import {
  fullSelectedConversationState,
  selectedConversationIdState,
} from "../../state/State";

export type Props = {
  loggedUserInConversation: UserInConversation;
  conversationUsers: UserInConversation[];
};

function ConversationHeader({
  loggedUserInConversation,
  conversationUsers,
}: Props) {
  const otherUser = conversationUsers.find(
      (user) => user.id !== loggedUserInConversation.id
    )!,
    setFullSelectedConversation = useSetRecoilState(
      fullSelectedConversationState
    ),
    setSelectedConversationId = useSetRecoilState(selectedConversationIdState),
    isSmallScreen = useMediaQuery({ query: "(max-width: 800px)" });

  const handleClickCloseConversation = (_event: any) => {
    setSelectedConversationId(null);
    setFullSelectedConversation(null);
  };

  return loggedUserInConversation ? (
    <div className="ConversationHeader">
      {isSmallScreen ? (
        <ArrowBackIcon color="primary" onClick={handleClickCloseConversation} />
      ) : (
        <></>
      )}
      <img
        referrerPolicy="no-referrer"
        src={otherUser.photoUrl}
        alt={otherUser.photoUrl}
      />
      <div className="ConversationHeader_info">
        <h3 className="ConversationHeader_info_h3">
          {otherUser.name} {otherUser.surname}
        </h3>

        <div className="ConversationHeader_typing">
          {otherUser.isTyping ? (
            <div className="ConversationHeader_typing_yes wobble-hor-top">
              <p>✍🏼 is typing</p>
              <div className="scale-up-horizontal-left">
                <p>...</p>
              </div>
            </div>
          ) : (
            <p>{otherUser.bioStatus}</p>
          )}
        </div>
      </div>
    </div>
  ) : (
    <></>
  );
}

export default ConversationHeader;
