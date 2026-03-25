import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Components/Navbar";
import "./stylePages/roomCreation.css";
const RoomCreation = () => {
  const [roomName, setRoomName] = useState("");
  const [visibility, setVisibility] = useState("Public");
  const [generatedLink, setGeneratedLink] = useState("");
  const navigate = useNavigate();

  const handleCreate = async (e) => {
    e.preventDefault();
    const BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
    try {
      const token = localStorage.getItem("token");

      const res = await fetch(
        `${BASE_URL}/api/rooms/create`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: roomName,
            type: visibility.toUpperCase(),
          }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.message);
        return;
      }

      if (data.room.type === "PUBLIC") {
        setGeneratedLink(
          `${BASE_URL}/publicroom/${data.room.id}`,
        );
      } else {
        setGeneratedLink(data.inviteLink);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedLink);
    alert("Link copied to clipboard!");
  };

  return (
    <div className="room-creation-page">
      <Navbar isLoggedIn={true} user={{ username: "SomeXPerson" }} />

      <div className="creation-layout">
        {/* Left Sidebar */}
        <aside className="creation-sidebar">
          <button
            className="btn-secondary sidebar-btn"
            onClick={() => navigate("/")}
          >
            Back To Home
          </button>
          <button
            className="btn-primary sidebar-btn"
            onClick={() => navigate("/publicrooms")}
          >
            Public Room
          </button>
        </aside>

        {/* Main Content */}
        <main className="creation-content">
          <h1 className="creation-title">Create ROOM</h1>

          <form className="creation-form" onSubmit={handleCreate}>
            <div className="input-group">
              <label>Room Name</label>
              <input
                type="text"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                placeholder="Enter room name"
                required
              />
            </div>

            <div className="input-group">
              <label>Visibility</label>
              <select
                value={visibility}
                onChange={(e) => setVisibility(e.target.value)}
              >
                <option value="Public">Public</option>
                <option value="Private">Private</option>{" "}
              </select>
            </div>

            <button type="submit" className="btn-primary create-btn">
              Create
            </button>
          </form>

          {generatedLink && (
            <div className="link-section reveal show">
              <label className="copy-label">Copy Link</label>
              <div className="copy-box">
                <input type="text" readOnly value={generatedLink} />
                <button className="copy-action" onClick={copyToClipboard}>
                  Copy
                </button>
              </div>
              <p className="invite-text">
                You can invite your friends/team etc. With this Link
              </p>

              <button
                className="btn-primary navigate-btn"
                onClick={() =>
                  navigate(
                    `/${visibility.toLowerCase()}room/${generatedLink.split("/").pop()}`,
                  )
                }
              >
                Navigate to Room
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default RoomCreation;
