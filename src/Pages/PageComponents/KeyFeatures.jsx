import React from "react";
import useScrollAnimation from "../../hooks/useScrollAnimation";
import "../stylePages/landingPage.css";
const Features = () => {
  const ref = useScrollAnimation();

  return (
    <section className="key-features scroll-animate" ref={ref}>
      <div className="stars"></div>

      <h2 className="section-title">Key Features Of Orbit</h2>

      <div className="features-grid">
        <div className="feature-card">🔒 Secure Communication</div>
        <div className="feature-card">🌍 Public Rooms</div>
        <div className="feature-card">🔐 Private Rooms</div>
        <div className="feature-card">🟢 Real-Time Online Status</div>
      </div>
    </section>
  );
};

export default Features;
