import { io } from "socket.io-client";

const URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

export const socket = io(URL, {
  auth: {
    token: localStorage.getItem("token"),
  },
  autoConnect: false,
  transports: ["websocket", "polling"],
  withCredentials: true,
});