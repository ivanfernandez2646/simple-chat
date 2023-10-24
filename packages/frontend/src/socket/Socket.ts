import { io } from "socket.io-client";

const SOCKET_URL =
  process.env.REACT_APP_API_URL?.replace("/api", "") || "http://localhost:3000";

export const socket = io(SOCKET_URL, {
  withCredentials: true,
  secure: true,
});
