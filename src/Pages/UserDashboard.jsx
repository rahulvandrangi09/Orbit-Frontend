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

  const [relativeTime, setRelativeTime] = useState("");

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

  // Inside UserDashboard.jsx, add this function right above the return statement:

  const handleDeleteRoom = async (roomId) => {
    const confirmDelete = window.confirm(
      "⚠️ WARNING: Are you sure you want to permanently delete this room? All messages and members will be lost.",
    );

    if (!confirmDelete) return;

    try {
      const response = await fetch(`${url}/api/rooms/${roomId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        // 2. Remove the room from the UI immediately without reloading the page
        else {
        alert(data.message || "Failed to delete room.");
      }
    } catch (err) {
      console.error("Error deleting room:", err);
      alert("Asteroid collision! Could not reach the server.");
    }
  };

  return (
    <div className="dashboard-container">
      <Navbar isLoggedIn={true} user={user} />

      <section className="welcome-section">
        <h1 className="welcome-title">Welcome {user.username}</h1>

        {/* 🔥 Updated subtitle to show the ticking duration */}
        <p className="welcome-subtitle">
          Total Journey Duration:{" "}
          <span style={{ color: "#a3ff6c", fontWeight: "bold" }}>
            {relativeTime || "Calculating..."}
          </span>
        </p>
        <p style={{ fontSize: "14px", opacity: 0.7, marginTop: "5px" }}>
          Coordinates established on:{" "}
          {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}
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
          <p>
            You haven’t joined or created any rooms yet. Create one to get
            started!
          </p>
        ) : (
          rooms.map((room) => (
            <div key={room.id} className="room-card">
              <div className="room-info">
                <h3>{room.name}</h3>
                <p>{room.type === "PUBLIC" ? "Public Room" : "Private Room"}</p>
              </div>

              {/* 🔥 Added a wrapper for the buttons to sit side-by-side */}
                style={{ display: "flex", gap: "10px", alignItems: "center" }}
              >
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
                  Enter
                </button>

                {/* 🔥 The New Delete Button */}
                <but
                  style={{
                    backgroundColor: "transparent",
                    border: "2px solid #ff5c5c",
                    color: "#ff5c5c",
                    padding: "8px 12px",
                    cursor: "pointer",
                    fontFamily: "DynaPuff, cursive",
                    boxShadow: "3px 3px 0px #ff5c5c",
                    transition: "0.2s ease",
                  }}
                  onMouseOver={(e) =>
                    (e.target.style.transform = "translate(-2px, -2px)")
                  }
                  onMouseOut={(e) =>
                    (e.target.style.transform = "translate(0, 0)")
                  }
                  onClick={() => handleDeleteRoom(room.id)}
                  title="Delete Room"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))
        )}

        {error && <p className="error-message">{error}</p>}
      </section>
    </div>
  );
};

export default UserDashboard;
