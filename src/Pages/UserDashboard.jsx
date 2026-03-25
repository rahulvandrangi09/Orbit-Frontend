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

  const token = localStorage.getItem("token");
  const storedUser = localStorage.getItem("user");
  const url = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

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
            "Authorization": `Bearer ${token}`,
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

  // 🔥 THE LOGOUT FUNCTION
  const handleLogout = async () => {
    try {
      // 1. Tell the backend we are logging out (optional for local JWTs, but good practice)
      await fetch(`${url}/api/auth/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });
    } catch (err) {
      console.error("Backend logout failed:", err);
    } finally {
      // 2. Obliterate the token and user data from the browser
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      
      // 3. Kick them back to the login screen
      navigate("/login");
    }
  };

  return (
    <div className="dashboard-container">
      <Navbar isLoggedIn={true} user={user} />

      {/* Welcome Section */}
      <section className="welcome-section">
        <h1 className="welcome-title">Welcome {user.username}</h1>
        <p className="welcome-subtitle">
          Thanks for traveling with us since:{" "}
          {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}
        </p>
        
        <div style={{ display: "flex", gap: "15px", justifyContent: "center", marginTop: "20px" }}>
          <button className="go-home-btn" onClick={() => navigate("/")}>
            Go Home
          </button>
          {/* 🔥 THE LOGOUT BUTTON */}
          <button 
            className="go-home-btn" 
            style={{ backgroundColor: "#ff7e7e", color: "#112240" }} 
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </section>

      {/* Rooms Section */}
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
                onClick={() => navigate(`/${room.type.toLowerCase()}room/${room.id}`)}
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