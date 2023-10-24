import { TextField } from "@mui/material";
import "./UserInfo.css";
import LogoutIcon from "@mui/icons-material/Logout";
import SearchIcon from "@mui/icons-material/Search";
import { useRecoilState } from "recoil";
import { filterUsersTextState, loggedUserState } from "../../state/State";
import Cookies from "js-cookie";
import { useState } from "react";
import UserSearchPopover from "../UserSearchPopover/UserSearchPopover";

function UserInfo() {
  const [loggedUser, setLoggedUser] = useRecoilState(loggedUserState),
    [filterUsersText, setFilterUsersText] =
      useRecoilState(filterUsersTextState),
    [anchorEl, setAnchorEl] = useState(null);

  const handleLogoutClick = () => {
    Cookies.remove("access_token");
    setLoggedUser(null);
  };

  const handleOnChangeUserText = (event: any) => {
    const text = event.target.value;

    setFilterUsersText(() => text);

    if (!text && anchorEl) {
      setAnchorEl(null);
      return;
    }

    if (!anchorEl) {
      setAnchorEl(event.currentTarget);
    }
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  return loggedUser ? (
    <div className="UserInfo">
      <div className="UserInfo-header">
        <div className="UserInfo-header_left">
          <img
            referrerPolicy="no-referrer"
            src={loggedUser.photoUrl}
            alt={loggedUser.photoUrl}
          />
          <div>
            <h3 className="UserInfo-header_name">
              {loggedUser.name} {loggedUser.surname}
            </h3>
            <p className="UserInfo-header_status">{loggedUser.bioStatus}</p>
          </div>
        </div>
        <LogoutIcon color="info" fontSize="small" onClick={handleLogoutClick} />
      </div>
      <div className="UserInfo-searcher">
        <SearchIcon color="info" fontSize="small" />
        <TextField
          hiddenLabel
          placeholder="Search for users"
          variant="standard"
          size="small"
          color="secondary"
          sx={{ input: { color: "white" } }}
          value={filterUsersText}
          autoComplete="off"
          onChange={handleOnChangeUserText}
        />
      </div>
      <UserSearchPopover
        anchorEl={anchorEl}
        handlePopoverClose={handlePopoverClose}
      />
    </div>
  ) : (
    <></>
  );
}

export default UserInfo;
