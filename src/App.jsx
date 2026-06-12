import React from "react";
import './App.css';
import LandingPage from "./Pages/LandingPage";
import Footer from "./Components/Footer";
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from "./Pages/LoginForm";
import PublicRooms from "./Pages/PublicRooms";
import SignupForm from "./Pages/SignupForm";
import RoomCreation from "./Pages/RoomCreation";
import PublicRoomInteraction from "./Pages/PublicRoomInteraction";
import PrivateRoomInteraction from "./Pages/PrivateRoomInteraction";
import UserDashboard from "./Pages/UserDashboard";
import ChatWidget from "./Components/ChatWidget";
const App = () => {
  return (
    <BrowserRouter>
  <div className="app-main-layout">
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignupForm />} />
      <Route path="/publicrooms" element={<PublicRooms />} />
      <Route path="/roomcreation" element={<RoomCreation />} />
      <Route path="/publicroom/:roomid" element={<PublicRoomInteraction />} />
      <Route path="/privateroom/:roomid" element={<PrivateRoomInteraction />} />
      <Route path="/userdashboard" element={<UserDashboard />} />
    </Routes>
    <ChatWidget />
  </div>
</BrowserRouter>

  );
}

export default App;