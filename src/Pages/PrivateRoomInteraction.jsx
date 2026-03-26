import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../Components/Navbar";
import { socket } from "../socket";
import "./stylePages/privateRoomInteraction.css";

const PrivateRoomInteraction = () => {
  const navigate = useNavigate();
  const { roomid: token } = useParams(); // URL contains the secret token
  
  // States
  const [realRoomId, setRealRoomId] = useState(null); // The actual UUID for DB
  const [roomName, setRoomName] = useState("Private Room");
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUsers, setTypingUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const typingTimeoutRef = useRef(null);
  const messageEndRef = useRef(null);

  const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
  const currentUser = JSON.parse(localStorage.getItem("user")) || { username: "Guest" };

  // 1. Resolve Token to UUID (Fixes Foreign Key Error)
 // Updated useEffect for PrivateRoomInteraction.jsx
useEffect(() => {
  const resolveRoom = async () => {
    const jwt = localStorage.getItem("token");
    
    // 🔥 NEW: Check if the token is already a UUID (from Dashboard)
    const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(token);

    if (isUUID) {
      setRealRoomId(token);
      setLoading(false);
      return; // Skip the fetch call
    }

    try {
      const res = await fetch(`${BASE_URL}/api/rooms/token/${token}`, {
        headers: { Authorization: `Bearer ${jwt}` },
      });
      const data = await res.json();
      if (res.ok) {
        setRealRoomId(data.roomId);
        setRoomName(data.roomName);
      } else {
        console.error("Token resolution failed:", data.message);
        alert("Invalid invite link!");
        navigate("/publicrooms");
      }
    } catch (err) {
      console.error("Resolution error:", err);
    } finally {
      setLoading(false);
    }
  };
  resolveRoom();
}, [token, navigate, BASE_URL]);

  // 2. Fetch Message History using realRoomId
  useEffect(() => {
    if (!realRoomId) return;
    const fetchMessages = async () => {
      const jwt = localStorage.getItem("token");
      try {
        const res = await fetch(`${BASE_URL}/api/rooms/${realRoomId}/messages`, {
          headers: { Authorization: `Bearer ${jwt}` },
        });
        const data = await res.json();
        if (res.ok) {
          setMessages(data.messages.map(msg => ({
            id: msg.id, text: msg.content, user: msg.sender.username
          })));
        }
      } catch (err) { console.error("History fetch failed", err); }
    };
    fetchMessages();
  }, [realRoomId]);

  // 3. Socket Logic using realRoomId
  useEffect(() => {
    if (!realRoomId) return;

    const jwt = localStorage.getItem("token");
    socket.auth = { token: jwt };
    if (!socket.connected) socket.connect();

    socket.on("roomUsers", (users) => setOnlineUsers(users));
    socket.on("receiveMessage", (msg) => setMessages((prev) => [...prev, msg]));
    socket.on("userTyping", ({ username }) => {
      setTypingUsers((prev) => !prev.includes(username) ? [...prev, username] : prev);
    });
    socket.on("userStoppedTyping", ({ username }) => {
      setTypingUsers((prev) => prev.filter((u) => u !== username));
    });

    socket.emit("joinRoom", realRoomId);

    return () => {
      socket.off("roomUsers");
      socket.off("receiveMessage");
      socket.off("userTyping");
      socket.off("userStoppedTyping");
    };
  }, [realRoomId]);

  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    if (!realRoomId) return;
    socket.emit("typing", { roomId: realRoomId, username: currentUser.username });
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stopTyping", { roomId: realRoomId, username: currentUser.username });
    }, 2000);
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !realRoomId) return;

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    socket.emit("stopTyping", { roomId: realRoomId, username: currentUser.username });
    
    socket.emit("sendMessage", { roomId: realRoomId, message: newMessage });

    setMessages((prev) => [...prev, { id: Date.now(), text: newMessage, user: currentUser.username }]);
    setNewMessage("");
  };

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typingUsers]);

  if (loading) return <div className="private-chat-page"><Navbar /><h2 style={{textAlign:'center', marginTop:'100px'}}>Establishing Secure Connection...</h2></div>;

  return (
    <div className="private-chat-page">
      <Navbar isLoggedIn={true} user={currentUser} />
      <div className="private-layout">
        <aside className="private-sidebar left">
          <button className="sidebar-btn secondary" onClick={() => navigate("/")}>Back To Home</button>
          <button className="sidebar-btn primary" onClick={() => navigate("/roomcreation")}>Create Room</button>
        </aside>

        <main className="private-content">
          <h1 className="private-title">{roomName}</h1>
          <p className="private-room-id">Secure ID: {realRoomId}</p>
          <div className="private-messages">
            {messages.map((msg) => (
              <div key={msg.id} className={`private-message ${msg.user === currentUser.username ? "me" : ""}`}>
                <span className="private-user">{msg.user}</span>
                <div className="private-bubble">{msg.text}</div>
              </div>
            ))}
            {typingUsers.length > 0 && (
              <div className="typing-indicator" style={{marginLeft: "15px"}}>
                {typingUsers.join(", ")} is typing <div className="typing-dots"><span></span><span></span><span></span></div>
              </div>
            )}
            <div ref={messageEndRef} />
          </div>
          <form className="private-input" onSubmit={handleSendMessage}>
            <input type="text" value={newMessage} onChange={handleTyping} placeholder="Type your message..." />
            <button type="submit">Send</button>
          </form>
        </main>

        <aside className="private-sidebar right">
          <h3>Online ({onlineUsers.length})</h3>
          {onlineUsers.map((user, idx) => (
            <div key={idx} className="online-user online">
              👤 <span>{user} {user === currentUser.username ? "(You)" : ""}</span>
            </div>
          ))}
        </aside>
      </div>
    </div>
  );
};

export default PrivateRoomInteraction;