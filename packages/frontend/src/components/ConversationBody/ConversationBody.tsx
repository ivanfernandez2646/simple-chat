import { useRecoilValue } from "recoil";
import Message from "../Message/Message";
import "./ConversationBody.css";
import { displayMessagesSelector } from "../../state/State";
import { useEffect, useRef } from "react";
import { usePrevious } from "@uidotdev/usehooks";

function ConversationBody() {
  const displayMessages = useRecoilValue(displayMessagesSelector),
    previousMessages = usePrevious(displayMessages),
    scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (displayMessages.length) {
      scrollRef.current!.scrollIntoView({
        behavior:
          displayMessages.length > 5 && !previousMessages ? "auto" : "smooth",
        block: "end",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [displayMessages.length]);

  return (
    <div className="ConversationBody">
      {displayMessages?.map((displayMessage) => (
        <Message key={displayMessage.id} displayMessage={displayMessage} />
      ))}
      <div ref={scrollRef} />
    </div>
  );
}

export default ConversationBody;
