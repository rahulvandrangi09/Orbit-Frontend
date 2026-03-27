import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./stylePages/signupPage.css";
import Navbar from "../Components/Navbar";

const SignupForm = () => {
  const navigate = useNavigate();
  const url = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

  // Form States
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [otp, setOtp] = useState("");

  // UI States
  const [step, setStep] = useState(1); // 1 = Signup, 2 = OTP Verification
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 🔥 STEP 1: Handle Initial Signup (Creates unverified user & sends email)
  const handleSignupSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${url}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(`⚠️ Docking failed: ${data.message || "Coordinates invalid"}`);
        setLoading(false);
        return;
      }

      // // Success! Move to Step 2 to enter the OTP
      // setStep(2);
      // setLoading(false);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/publicrooms");
    } catch (err) {
      console.error(err);
      setError("☄️ System overload! Try initializing again.");
      setLoading(false);
    }
  };

  // 🔥 STEP 2: Handle OTP Verification (Logs user in if correct)
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${url}/api/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // We send the email from Step 1 along with the OTP they just typed
        body: JSON.stringify({ email: formData.email, otp }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(`⚠️ Verification failed: ${data.message || "Invalid OTP"}`);
        setLoading(false);
        return;
      }

      // Verified successfully! Store tokens and navigate
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      navigate("/publicrooms");
    } catch (err) {
      console.error(err);
      setError("☄️ Asteroid collision! Communication lost.");
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="auth-page">
        <div className="auth-container reveal show">
          {/* Dynamic Title based on Step */}
          <h1 className="auth-title">
            {step === 1 ? "Signup" : "Verify Email"}
          </h1>

          {error && <div className="orbit-error">{error}</div>}

          {/* --- STEP 1 UI: SIGNUP FORM --- */}
          {step === 1 && (
            <form onSubmit={handleSignupSubmit} className="auth-form">
              <div className="input-group">
                <label htmlFor="username">User Name</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input-group">
                <label htmlFor="email">Mail Id</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="input-group">
                <label htmlFor="password">PassWord</label>
                <div className="password-wrapper">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    className="eye-btn"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "🙈" : "👁️"}
                  </button>
                </div>
              </div>

              <p className="auth-switch">
                Already have an account? Please <Link to="/login">Login</Link>
              </p>

              <button
                type="submit"
                className="btn-primary auth-btn"
                disabled={loading}
              >
                {loading ? "Transmitting Data..." : "Start My Journey"}
              </button>
            </form>
          )}

          {/* --- STEP 2 UI: OTP VERIFICATION FORM --- */}
          {step === 2 && (
            <form onSubmit={handleOtpSubmit} className="auth-form">
              <p
                style={{
                  textAlign: "center",
                  marginBottom: "20px",
                  color: "#a1a1aa",
                }}
              >
                We've sent a 6-digit transmission code to{" "}
                <strong>{formData.email}</strong>. It will expire in 5 minutes.
              </p>

              <div className="input-group">
                <label htmlFor="otp">Security Code (OTP)</label>
                <input
                  type="text"
                  id="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                  required
                  style={{
                    textAlign: "center",
                    letterSpacing: "5px",
                    fontSize: "1.2rem",
                  }}
                />
              </div>

              <button
                type="submit"
                className="btn-primary auth-btn"
                disabled={loading}
              >
                {loading ? "Verifying Coordinates..." : "Confirm Identity"}
              </button>

              <p
                className="auth-switch"
                style={{ marginTop: "15px", cursor: "pointer" }}
                onClick={() => setStep(1)}
              >
                Wrong email? Go back.
              </p>
            </form>
          )}
        </div>
      </div>
    </>
  );
};

export default SignupForm;
