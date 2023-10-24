import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import "./Conversation.css";
import {
  fullSelectedConversationState,
  isLoadingState,
  selectedConversationIdState,
} from "../../state/State";
import ConversationHeader from "../../components/ConversationHeader/ConversationHeader";
import ConversationBody from "../../components/ConversationBody/ConversationBody";
import TypeMessage from "../../components/TypeMessage/TypeMessage";
import { useQuery } from "@tanstack/react-query";
import { fetchFullSelectedConversation } from "../../api/Api";
import { useEffect } from "react";
import { User } from "../../types/entities/User";
import { UserInConversation } from "../../types/entities/Conversation";

export type Props = {
  loggedUser: User;
  usersInConversationTyping: UserInConversation[];
};

function Conversation({ loggedUser, usersInConversationTyping }: Props) {
  const [fullSelectedConversation, setFullSelectedConversation] =
      useRecoilState(fullSelectedConversationState),
    setIsLoading = useSetRecoilState(isLoadingState),
    selectedConversationId = useRecoilValue(selectedConversationIdState),
    {
      data: fullSelectedConversationData,
      isFetching,
      isLoading,
      error,
    } = useQuery({
      queryKey: selectedConversationId
        ? ["fullSelectedConversation", selectedConversationId]
        : undefined,
      queryFn: selectedConversationId
        ? () => fetchFullSelectedConversation(selectedConversationId)
        : undefined,
      retry: 0,
      enabled: !!selectedConversationId,
    });

  useEffect(() => {
    setIsLoading(
      ((isFetching && isLoading) || isLoading) &&
        selectedConversationId !== null
    );

    if (fullSelectedConversationData) {
      setFullSelectedConversation(fullSelectedConversationData);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    fullSelectedConversationData,
    isFetching,
    isLoading,
    selectedConversationId,
  ]);

  if (error) {
    return <h1>Error while fetching full selected conversation</h1>;
  }

  return (
    <div className="Conversation">
      {fullSelectedConversation ? (
        <>
          <ConversationHeader
            loggedUserInConversation={
              usersInConversationTyping?.find(
                (user) => user.id === loggedUser.id
              )!
            }
            conversationUsers={usersInConversationTyping ?? []}
          />
          <ConversationBody />
          <TypeMessage
            loggedUserInConversation={
              usersInConversationTyping?.find(
                (user) => user.id === loggedUser.id
              )!
            }
            fullSelectedConversation={fullSelectedConversation}
          />
        </>
      ) : (
        <></>
      )}
    </div>
  );
}

export default Conversation;
