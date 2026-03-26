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
  
  // 🔥 New States for Typing Indicator
  const [typingUsers, setTypingUsers] = useState([]);
  const typingTimeoutRef = useRef(null);
  const messageEndRef = useRef(null);

  const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
  const currentUser = JSON.parse(localStorage.getItem("user")) || { username: "Guest" };

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

    // 🔥 Real-Time Listeners
    const handleUserTyping = ({ username }) => {
      setTypingUsers((prev) => (!prev.includes(username) ? [...prev, username] : prev));
    };

    const handleUserStoppedTyping = ({ username }) => {
      setTypingUsers((prev) => prev.filter((u) => u !== username));
    };

    socket.on("receiveMessage", handleReceiveMessage);
    socket.on("userTyping", handleUserTyping);
    socket.on("userStoppedTyping", handleUserStoppedTyping);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
      socket.off("userTyping", handleUserTyping);
      socket.off("userStoppedTyping", handleUserStoppedTyping);
    };
  }, [roomid]);

  // 🔥 Handle Typing Event
  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    socket.emit("typing", { roomId: roomid, username: currentUser.username });

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stopTyping", { roomId: roomid, username: currentUser.username });
    }, 2000);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;
    
    const token = localStorage.getItem("token");
    if (!token) {
      alert("📡 Comm-link offline! Your spaceship must be logged in.");
      navigate("/login");
      return;
    }

    // Clear typing instantly
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    socket.emit("stopTyping", { roomId: roomid, username: currentUser.username });

    socket.emit("sendMessage", { roomId: roomid, message: newMessage });

    setMessages((prev) => [
      ...prev,
      { id: Date.now(), text: newMessage, user: currentUser.username },
    ]);
    setNewMessage("");
  };

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingUsers]);

  return (
    <div className="chat-page">
      <Navbar isLoggedIn={true} user={currentUser} />

      <main className="chat-layout">
        <aside className="chat-sidebar left">
          <button className="sidebar-btn btn-secondary" onClick={() => navigate("/")}>Back To Home</button>
          <button className="sidebar-btn btn-primary" onClick={() => navigate("/publicrooms")}>Rooms List</button>
        </aside>

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

            {/* 🔥 TYPING INDICATOR */}
            {typingUsers.length > 0 && (
              <div className="typing-indicator" style={{marginLeft: "15px"}}>
                {typingUsers.join(", ")} {typingUsers.length === 1 ? "is" : "are"} typing
                <div className="typing-dots"><span></span><span></span><span></span></div>
              </div>
            )}
            <div ref={messageEndRef} />
          </div>

          <form className="chat-input-area" onSubmit={handleSendMessage}>
            <input
              type="text"
              value={newMessage}
              onChange={handleTyping}
              placeholder="Type your message..."
            />
            <button type="submit">Send</button>
          </form>
        </section>

        {/* Static Sidebar for Public Room */}
        <aside className="chat-sidebar right">
          <h3 className="sidebar-title">Joined as:</h3>
          <ul className="online-list">
            <li className="online-user">
              👤 <span className="neon-text">{currentUser.username}</span>
            </li>
          </ul>
        </aside>
      </main>
    </div>
  );
};

export default PublicRoomInteraction;