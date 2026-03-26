import React, { useState, useEffect } from "react";
import "./stylePages/userDashboard.css";
import Navbar from "../Components/Navbar";
import { useNavigate } from "react-router-dom";

const UserDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ username: "Guest", createdAt: null });
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // 🔥 NEW: State to hold the ticking relative time string
  const [relativeTime, setRelativeTime] = useState("");

  const token = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");
  const url = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

  // 1. Load user and fetch rooms
  useEffect(() => {
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
    }

    const fetchUserRooms = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${url}/api/rooms/my`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        let data = {};
        try {
          data = await response.json();
        } catch {}

        if (!response.ok) {
          setError(data.message || "Failed to fetch rooms.");
          setRooms([]);
        } else {
          setRooms(data.rooms || []);
        }
      } catch (err) {
        console.error(err);
        setError("Something went wrong while fetching rooms.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserRooms();
  }, [token, storedUser, url]);

  // 🔥 2. THE DYNAMIC TIMER LOGIC
  useEffect(() => {
    if (!user.createdAt) return;

    const calculateTime = () => {
      const start = new Date(user.createdAt).getTime();
      const now = new Date().getTime();
      const diff = now - start;

      if (diff < 0) return "0s";

      const seconds = Math.floor((diff / 1000) % 60);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const days = Math.floor((diff / (1000 * 60 * 60 * 24)) % 30);
      const months = Math.floor((diff / (1000 * 60 * 60 * 24 * 30)) % 12);
      const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));

      let timeString = "";
      if (years > 0) timeString += `${years}y `;
      if (months > 0) timeString += `${months}m `;
      if (days > 0) timeString += `${days}d `;
      timeString += `${hours}h ${minutes}m ${seconds}s`;

      setRelativeTime(timeString);
    };

    // Initial calculation
    calculateTime();

    // Update every second
    const timer = setInterval(calculateTime, 1000);

    return () => clearInterval(timer); // Cleanup on unmount
  }, [user.createdAt]);

  const handleLogout = async () => {
    try {
      await fetch(`${url}/api/auth/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });
    } catch (err) {
      console.error("Backend logout failed:", err);
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      navigate("/login");
    }
  };

  return (
    <div className="dashboard-container">
      <Navbar isLoggedIn={true} user={user} />

      <section className="welcome-section">
        <h1 className="welcome-title">Welcome {user.username}</h1>
        
        {/* 🔥 Updated subtitle to show the ticking duration */}
        <p className="welcome-subtitle">
          Total Journey Duration: <span style={{ color: "#a3ff6c", fontWeight: "bold" }}>{relativeTime || "Calculating..."}</span>
        </p>
        <p style={{ fontSize: "14px", opacity: 0.7, marginTop: "5px" }}>
          Coordinates established on: {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}
        </p>

        <div
          style={{
            display: "flex",
            gap: "15px",
            justifyContent: "center",
            marginTop: "20px",
          }}
        >
          <button className="go-home-btn" onClick={() => navigate("/")}>
            Go Home
          </button>
          <button
            className="go-home-btn"
            style={{ backgroundColor: "#ff7e7e", color: "#112240" }}
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </section>

      <section className="rooms-section">
        <h2 className="rooms-heading">Your Rooms</h2>

        {loading ? (
          <p>Loading your rooms...</p>
        ) : rooms.length === 0 ? (
          <p>You haven’t joined or created any rooms yet. Create one to get started!</p>
        ) : (
          rooms.map((room) => (
            <div key={room.id} className="room-card">
              <div className="room-info">
                <h3>{room.name}</h3>
                <p>{room.type === "PUBLIC" ? "Public Room" : "Private Room"}</p>
              </div>
              <button
                className="enter-btn"
                onClick={() => {
                  const path =
                    room.type.toLowerCase() === "public"
                      ? "publicroom"
                      : "privateroom";
                  navigate(`/${path}/${room.id}`);
                }}
              >
                Enter Room
              </button>
            </div>
          ))
        )}

        {error && <p className="error-message">{error}</p>}
      </section>
    </div>
  );
};

export default UserDashboard;