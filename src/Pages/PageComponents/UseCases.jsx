import React from "react";
import useScrollAnimation from "../../hooks/useScrollAnimation";
import "../stylePages/landingPage.css";
const UseCases = () => {
  const ref = useScrollAnimation();

  return (
    <section className="usecases scroll-animate" ref={ref}>
            <div className="stars"></div>

      <h2 className="section-title">🌍 Use Cases</h2>

      <div className="marquee">
        <div className="marquee-content">
          <span>💻 Developers & Tech Communities</span>
          <span>🎓 Students & Study Groups</span>
          <span>👥 Remote Teams</span>
          <span>🚀 Startup Founders</span>
          <span>🧠 Brainstorming Sessions</span>

          <span>💻 Developers & Tech Communities</span>
          <span>🎓 Students & Study Groups</span>
          <span>👥 Remote Teams</span>
          <span>🚀 Startup Founders</span>
          <span>🧠 Brainstorming Sessions</span>
        </div>
      </div>
    </section>
  );
};

export default UseCases;
