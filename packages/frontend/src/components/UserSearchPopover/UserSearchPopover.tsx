import { Popover, Typography } from "@mui/material";
import { useRecoilValue, useSetRecoilState } from "recoil";
import {
  allUsersState,
  conversationsState,
  filterUsersTextState,
  filteredAllUsersSelector,
  isLoadingState,
  loggedUserState,
  selectedConversationIdState,
} from "../../state/State";
import { useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { useQuery } from "@tanstack/react-query";
import { fetchAllUsers, fetchCreateConversation } from "../../api/Api";

export type Props = {
  anchorEl: Element | null;
  handlePopoverClose: any;
};

function UserSearchPopover(props: Props) {
  const setAllUsers = useSetRecoilState(allUsersState),
    setSelectedConversationId = useSetRecoilState(selectedConversationIdState),
    setFilterUsersText = useSetRecoilState(filterUsersTextState),
    filteredUsers = useRecoilValue(filteredAllUsersSelector),
    conversations = useRecoilValue(conversationsState),
    loggedUser = useRecoilValue(loggedUserState),
    setIsLoading = useSetRecoilState(isLoadingState),
    open = Boolean(props.anchorEl),
    id = open ? "simple-popover" : undefined,
    { data: allUsersData, isFetching: isLoadingQuery } = useQuery({
      queryKey: ["allUsers"],
      queryFn: fetchAllUsers,
      retry: false,
    });

  useEffect(() => {
    if (allUsersData) {
      setAllUsers(allUsersData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allUsersData]);

  useEffect(() => {
    setIsLoading(isLoadingQuery);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoadingQuery]);

  const handleClickSelectUser = async (event: any) => {
    const selectedUserId = event.target.id,
      existingConversation = conversations
        .filter((conversation) =>
          conversation.users?.find((user) => user.id === selectedUserId)
        )
        .pop(),
      conversationId = !existingConversation
        ? uuidv4()
        : existingConversation.id;

    if (!existingConversation) {
      await fetchCreateConversation({
        conversationId,
        loggedUser: loggedUser!,
        selectedUserId,
      });
    }

    setSelectedConversationId(() => conversationId);
    props.handlePopoverClose();
    setFilterUsersText("");
  };

  return (
    <Popover
      id={id}
      open={open}
      anchorEl={props.anchorEl}
      onClose={props.handlePopoverClose}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "left",
      }}
      disableAutoFocus={true}
      disableEnforceFocus={true}
    >
      {filteredUsers?.length ? (
        filteredUsers.map((user) => (
          <Typography
            id={user.id}
            key={user.id}
            sx={{ p: 2 }}
            onClick={handleClickSelectUser}
          >
            {user.name} {user.surname}
          </Typography>
        ))
      ) : (
        <Typography sx={{ p: 2 }}>No users</Typography>
      )}
    </Popover>
  );
}

export default UserSearchPopover;
