import { io } from "socket.io-client";

// This will use your Render URL in production and localhost during development
const URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

export const socket = io(URL, {
  auth: {
    // This ensures the token is pulled if available when connect() is called
    token: localStorage.getItem("token"),
  },
  autoConnect: false, // Recommended: prevents connection before user logs in
  transports: ["websocket", "polling"], // Allow polling as a fallback if websocket fails on some networks
  withCredentials: true, // Required for cross-origin requests on some hosting providers
});