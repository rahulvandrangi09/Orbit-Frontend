import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../Components/Navbar";
import { socket } from "../socket";
import "./stylePages/publicRoomInteraction.css";

const PublicRoomInteraction = () => {
  const navigate = useNavigate();
  const { roomid } = useParams();

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

  // Socket join & connect (Fixed Race Condition)
  useEffect(() => {
    const token = localStorage.getItem("token");
    socket.auth = { token };

    // Only connect if not already connected to avoid StrictMode double-firing
    if (!socket.connected) {
      socket.connect();
    }

    socket.emit("joinRoom", roomid);

    const handleReceiveMessage = (msg) => {
      setMessages((prev) => [...prev, msg]);
    };

    socket.on("receiveMessage", handleReceiveMessage);

    // Cleanup: Remove listener, but DO NOT globally disconnect the socket
    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, [roomid]);

  // Send message
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    // Emit to backend
    socket.emit("sendMessage", {
      roomId: roomid,
      message: newMessage,
    });

    // Optimistically update UI
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
    <div className="chat-page">
      <Navbar isLoggedIn={true} user={currentUser} />

      <main className="chat-layout">
        {/* Left Sidebar */}
        <aside className="chat-sidebar left">
          <button className="sidebar-btn btn-secondary" onClick={() => navigate("/")}>
            Back To Home
          </button>
          <button className="sidebar-btn btn-primary" onClick={() => navigate("/publicrooms")}>
            Rooms List
          </button>
        </aside>

        {/* Center Chat Area */}
        <section className="chat-content">
          <h2 className="room-header">Public Room</h2>
          
          <div className="message-feed">
            {messages.length === 0 ? (
              <p style={{ textAlign: "center", opacity: 0.7 }}>No messages yet. Start the conversation!</p>
            ) : (
              messages.map((msg) => {
                const isMe = msg.user === currentUser.username;
                return (
                  <div key={msg.id} className={`message-block ${isMe ? "me" : ""}`}>
                    <span className="user-label">{msg.user}</span>
                    <div className="bubble">{msg.text}</div>
                  </div>
                );
              })
            )}
            <div ref={messageEndRef} />
          </div>

          <form className="chat-input-area" onSubmit={handleSendMessage}>
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
            />
            <button type="submit">Send</button>
          </form>
        </section>

        {/* Right Sidebar */}
        <aside className="chat-sidebar right">
          <h3 className="sidebar-title">People Online</h3>
          <ul className="online-list">
            <li className="online-user">
              👤 <span className="neon-text">{currentUser.username}</span>
            </li>
            {/* You can add dynamic online users here later */}
          </ul>
        </aside>
      </main>
    </div>
  );
};

export default PublicRoomInteraction;