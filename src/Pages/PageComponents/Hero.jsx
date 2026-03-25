import React from "react";
import "../stylePages/landingPage.css";
import { Link } from "react-router-dom";
const Hero = () => {
    const user = JSON.parse(localStorage.getItem("user"));
  return (
    <>
      <section className="hero">
        <div className="stars"></div>

        <div className="hero-content">
          <h1>
            Stay in Orbit.
            <br />
            Stay Connected.
          </h1>

          <p>
            Orbit is a real-time collaborative chat platform designed for
            seamless communication. Create public rooms, host private
            discussions, and connect instantly — all in one powerful space.
          </p>

          <div className="hero-buttons">
            <Link to={user ? "/publicrooms" : "/login"}>
              <button className="btn-primary">🚀 Enter Orbit</button>
            </Link>

            <Link to="/publicrooms">
              <button className="btn-secondary">🌍 Explore Public Rooms</button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default Hero;
