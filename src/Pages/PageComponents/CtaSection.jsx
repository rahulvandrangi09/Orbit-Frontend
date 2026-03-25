import React from "react";
import useScrollAnimation from "../../hooks/useScrollAnimation";
import "../stylePages/landingPage.css";
import { Link } from 'react-router-dom';
const CTA = () => {
  const ref = useScrollAnimation();

  return (
    <section className="cta-section scroll-animate" ref={ref}>
      {/* Ensures the star background persists */}
      <div className="stars"></div>

      <div className="cta-container">
        <h2 className="section-title">Ready to Enter Orbit?</h2>
        <p className="cta-sub">
          Start your real-time collaboration journey today.
        </p>

        <div className="hero-buttons">
            {/* Enter Orbit leads to Login */}
            <Link to="/login">
              <button className="btn-primary">🚀 Enter Orbit</button>
            </Link>

            {/* Explore leads to the Public Rooms list */}
            <Link to="/publicrooms">
              <button className="btn-secondary">🌍 Explore Public Rooms</button>
            </Link>
          </div>
      </div>
    </section>
  );
};

export default CTA;