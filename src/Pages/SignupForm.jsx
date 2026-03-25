import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './stylePages/signupPage.css';
import Navbar from '../Components/Navbar';

const SignupForm = () => {
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false); // 🔥 Added state
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ 
    username: '', 
    email: '', 
    password: '' 
  });
  
  const url = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${url}/api/auth/signup`, {
         method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      if (!response.ok) {
        setError(`⚠️ Docking failed: ${data.message || "Coordinates invalid"}`);
        return;
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/publicrooms');

    } catch (err) {
      console.error(err);
      setError('☄️ System overload! Try initializing the sequence again.');
    }
  };

  return (
    <>
      <Navbar />
      <div className="auth-page">
        <div className="auth-container reveal show">
          <h1 className="auth-title">Signup</h1>
          
          {/* 🔥 Thematic Error Display */}
          {error && <div className="orbit-error">{error}</div>}
          
          <form onSubmit={handleSubmit} className="auth-form">
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
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>
            
            <p className="auth-switch">
              Already have an account? Please <Link to="/login">Login</Link>
            </p>
            <button type="submit" className="btn-primary auth-btn">
              Start My Journey
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default SignupForm;