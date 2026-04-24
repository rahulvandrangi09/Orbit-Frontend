import React, { useState, useEffect } from "react";
import Navbar from "../Components/Navbar";
import Hero from "./PageComponents/Hero";
import KeyFeatures from "./PageComponents/KeyFeatures";
import WhyOrbit from "./PageComponents/WhyOrbit";
import UseCases from "./PageComponents/UseCases";
import CTA from "./PageComponents/CtaSection";
import "./stylePages/landingPage.css";
import Footer from "../Components/Footer";

const LandingPage = () => {

  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const isLoggedIn = !!user; 

  return (
    <div className="landing-page">
      <Navbar isLoggedIn={isLoggedIn} user={user} />
      <main className="page-content">
        <Hero />
        <KeyFeatures />
        <WhyOrbit />
        <UseCases />
        <CTA />
        <Footer />
      </main>
    </div>
  );
};

export default LandingPage;
