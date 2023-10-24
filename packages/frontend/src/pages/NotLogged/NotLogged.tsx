import { Button } from "@mui/material";
import "./NotLogged.css";

function NotLogged() {
  return (
    <div className="NotLogged">
      <h1>Not Logged</h1>
      <Button
        variant="contained"
        href={`${
          process.env.REACT_APP_API_URL || "http://localhost:3000"
        }/auth`}
      >
        Sign In
      </Button>
    </div>
  );
}

export default NotLogged;
