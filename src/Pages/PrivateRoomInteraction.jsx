import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../Components/Navbar";
import { socket } from "../socket";
import "./stylePages/privateRoomInteraction.css";

const PrivateRoomInteraction = () => {
  const navigate = useNavigate();
  const { roomid } = useParams(); // Ensure your route in App.jsx looks like /privateroom/:roomid

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messageEndRef = useRef(null);

  const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
  const currentUser = JSON.parse(localStorage.getItem("user")) || { username: "Guest" };

  // Fetch old messages
  useEffect(() => {
    const fetchMessages = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await fetch(`${BASE_URL}/api/rooms/${roomid}/messages`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        
        if (res.ok) {
          const formatted = data.messages.map((msg) => ({
            id: msg.id,
            text: msg.content,
            user: msg.sender.username,
          }));
          setMessages(formatted);
        }
      } catch (err) {
        console.error("Failed to fetch messages", err);
      }
    };
    fetchMessages();
  }, [roomid, BASE_URL]);

  // Socket join & connect
  useEffect(() => {
    const token = localStorage.getItem("token");
    socket.auth = { token };

    if (!socket.connected) {
      socket.connect();
    }

    socket.emit("joinRoom", roomid);

    const handleReceiveMessage = (msg) => {
      setMessages((prev) => [...prev, msg]);
    };

    socket.on("receiveMessage", handleReceiveMessage);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, [roomid]);

  // Send message
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    socket.emit("sendMessage", {
      roomId: roomid,
      message: newMessage,
    });

    setMessages((prev) => [
      ...prev,
      { id: Date.now(), text: newMessage, user: currentUser.username },
    ]);
    setNewMessage("");
  };

  // Auto-scroll to bottom
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="private-chat-page">
      <Navbar isLoggedIn={true} user={currentUser} />

      <div className="private-layout">
        {/* LEFT SIDEBAR */}
        <aside className="private-sidebar left">
          <button className="sidebar-btn secondary" onClick={() => navigate("/")}>
            Back To Home
          </button>
          <button className="sidebar-btn primary" onClick={() => navigate("/roomcreation")}>
            Create Room
          </button>
        </aside>

        {/* CENTER */}
        <main className="private-content">
          <h1 className="private-title">Private ROOM</h1>
          <p className="private-room-id">ID: {roomid}</p>

          <div className="private-messages">
            {messages.length === 0 ? (
              <p style={{ textAlign: "center", opacity: 0.7 }}>No messages yet. Send a secure message!</p>
            ) : (
              messages.map((msg) => {
                const isMe = msg.user === currentUser.username;
                return (
                  <div key={msg.id} className={`private-message ${isMe ? "me" : ""}`}>
                    <span className="private-user">{msg.user}</span>
                    <div className="private-bubble">{msg.text}</div>
                  </div>
                );
              })
            )}
            <div ref={messageEndRef} />
          </div>

          <form className="private-input" onSubmit={handleSendMessage}>
            <input
              type="text"
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <button type="submit">Send</button>
          </form>
        </main>

        {/* RIGHT SIDEBAR */}
        <aside className="private-sidebar right">
          <h3>People Online</h3>
          <div className="online-user online">
            👤 <span>{currentUser.username}</span>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default PrivateRoomInteraction;