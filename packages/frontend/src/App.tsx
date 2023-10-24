import { useEffect } from "react";
import "./App.css";
import Chats from "./pages/Chats/Chats";
import Conversation from "./pages/Conversation/Conversation";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  conversationsState,
  fullSelectedConversationState,
  isLoadingState,
  loggedUserState,
} from "./state/State";
import NotLogged from "./pages/NotLogged/NotLogged";
import { useQuery } from "@tanstack/react-query";
import { fetchUserProfile } from "./api/Api";
import Cookies from "js-cookie";
import { socket } from "./socket/Socket";
import Loader from "./components/Loader/Loader";

function App() {
  const [loggedUser, setLoggedUser] = useRecoilState(loggedUserState),
    conversations = useRecoilValue(conversationsState),
    fullSelectedConversation = useRecoilValue(fullSelectedConversationState),
    isLoading = useRecoilValue(isLoadingState),
    { data: userProfileData, error } = useQuery({
      queryKey: ["userProfile"],
      queryFn: fetchUserProfile,
      retry: false,
      initialData: null,
    });

  useEffect(() => {
    window.onbeforeunload = function (e) {
      if (fullSelectedConversation && loggedUser) {
        socket.emit(`stopTyping`, {
          conversationId: fullSelectedConversation.id,
          loggedUserId: loggedUser.id,
        });
      }
      e.preventDefault();
    };

    return () => {
      window.onbeforeunload = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fullSelectedConversation]);

  useEffect(() => {
    if (userProfileData !== loggedUser) {
      setLoggedUser(() => userProfileData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userProfileData]);

  if (error || !Cookies.get("access_token")) {
    return <NotLogged />;
  }

  return loggedUser ? (
    <>
      {isLoading ? <Loader /> : <></>}
      <div className={`App ${loggedUser ? "wobble-hor-top" : ""}`}>
        <Chats />
        <Conversation
          loggedUser={loggedUser}
          usersInConversationTyping={
            conversations.find((c) => c.id === fullSelectedConversation?.id)
              ?.users || []
          }
        />
      </div>
    </>
  ) : (
    <></>
  );
}

export default App;
