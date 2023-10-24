import { DisplayMessage } from "../../types/helpers/DisplayMessage";
import "./Message.css";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";

export type Props = {
  displayMessage: DisplayMessage;
};

function Message(props: Props) {
  return (
    <div
      className={`Message ${
        props.displayMessage.isSentByLoggedUser
          ? "Message_right"
          : "Message_left"
      }`}
    >
      <img
        referrerPolicy="no-referrer"
        src={props.displayMessage.photoUrl}
        alt={props.displayMessage.photoUrl}
      ></img>
      <div
        className={`Message_text ${
          props.displayMessage.isSentByLoggedUser
            ? "Message_text-right"
            : "Message_text-left"
        }`}
      >
        <p>{props.displayMessage.text}</p>
      </div>
      {!props.displayMessage.isSentByLoggedUser ? (
        <>
          {props.displayMessage.isFavourite ? (
            <FavoriteIcon fontSize="small" color="secondary" />
          ) : (
            <>
              <FavoriteBorderIcon fontSize="small" color="secondary" />
            </>
          )}
        </>
      ) : (
        <></>
      )}
    </div>
  );
}

export default Message;
