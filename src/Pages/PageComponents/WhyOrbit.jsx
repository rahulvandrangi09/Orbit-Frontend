import React from "react";
import useScrollAnimation from "../../hooks/useScrollAnimation";
import "../stylePages/landingPage.css";
const WhyOrbit = () => {
  const ref = useScrollAnimation();

  return (
    <section className="why-orbit scroll-animate" ref={ref}>
      <div className="stars"></div>
      <h2 className="section-title">🚀 Why Orbit?</h2>

      <div className="why-container">
        <div className="why-item">
          <h3>⚡ Built for Real-Time Collaboration</h3>
          <p>
            Orbit is engineered for instant communication — no delays, no refresh,
            just seamless interaction.
          </p>
        </div>

        <div className="why-item">
          <h3>🖥 Designed for Focused Conversations</h3>
          <p>
            Whether you're brainstorming with a team or joining a public
            discussion, Orbit keeps conversations structured and distraction-free.
          </p>
        </div>

        <div className="why-item">
          <h3>🔒 Privacy When You Need It</h3>
          <p>
            Public when you want it. Private when you need it. Full control over your space.
          </p>
        </div>
      </div>
    </section>
  );
};

export default WhyOrbit;
