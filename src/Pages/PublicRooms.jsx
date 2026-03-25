import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Components/Navbar';
import './stylePages/publicRooms.css';

const PublicRooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Fetch current user from localStorage (or your auth context)
  const token = localStorage.getItem('token');
  const storedUser = localStorage.getItem('user');
  const currentUser = storedUser ? JSON.parse(storedUser) : { username: 'Guest' };

  const url = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

  // Fetch rooms from backend
  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await fetch(`${url}/api/rooms/public`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        let data = {};
        try {
          data = await response.json();
        } catch {}

        if (!response.ok) {
          setError(data.message || 'Failed to fetch rooms');
          setRooms([]);
        } else {
          setRooms(data.rooms || []); // assuming backend returns { rooms: [] }
        }
      } catch (err) {
        console.error(err);
        setError('Something went wrong while fetching rooms.');
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [token, url]);

  return (
    <div className="rooms-page">
      <Navbar isLoggedIn={true} user={currentUser} />

      <main className="rooms-layout">
        {/* Left Sidebar */}
        <aside className="rooms-sidebar left">
          <button className="btn-secondary sidebar-btn" onClick={() => navigate('/')}>
            Back To Home
          </button>
          <button className="btn-primary sidebar-btn" onClick={() => navigate('/roomcreation')}>
            Create Room
          </button>
        </aside>

        {/* Center Content */}
        <section className="rooms-content">
          <h1 className="rooms-title">Public Rooms</h1>

          {loading ? (
            <p>Loading rooms...</p>
          ) : rooms.length === 0 ? (
            <p>No public rooms available. Create one to get started!</p>
          ) : (
            <div className="rooms-grid">
              {rooms.map((room) => (
                <div key={room.id} className="room-card">
                  <div className="room-info">
                    <h2 className="room-name">{room.name}</h2>
                    <p className="room-desc">{room.description || 'No description provided.'}</p>
                    <span className="online-count">People Online - {room.online || 0}</span>
                  </div>
                  <button className="btn-primary enter-btn" onClick={() => navigate(`/publicroom/${room.id}`)}>
                    Enter Room
                  </button>
                </div>
              ))}
            </div>
          )}

          <div className="search-container">
            <input type="text" placeholder="Search rooms..." className="search-input" />
            <button className="search-btn">Search</button>
          </div>
        </section>

        {/* Right Sidebar */}
        <aside className="rooms-sidebar right">
          <div className="user-info-section">
            <p className="join-label">Join as</p>
            <p className="username-display">{currentUser.username}</p>
          </div>

          <div className="profile-trigger" onClick={() => navigate('/userdashboard')}>
            <div className="user-icon-placeholder">👤</div>
          </div>
        </aside>
      </main>

      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default PublicRooms;