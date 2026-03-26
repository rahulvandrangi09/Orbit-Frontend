import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './stylePages/loginPage.css';
import Navbar from '../Components/Navbar';

const LoginForm = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false); // 🔥 Added loading state
  const navigate = useNavigate();
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const url = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // 🚀 Start loading
    setError('');

    try {
      const response = await fetch(`${url}/api/auth/login`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      
      if (!response.ok) {
        setError("🛰️ Signal rejected! Incorrect username or password.");
        setLoading(false);
        return;
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/publicrooms');

    } catch (err) {
      console.error(err);
      setError('☄️ Asteroid collision! Server communication lost.');
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="login-page">
        <div className="login-container reveal show">
          <h1 className="login-title">Login</h1>
          
          {error && <div className="orbit-error">{error}</div>}
          
          <form onSubmit={handleSubmit} className="login-form">
            <div className="input-group">
              <label htmlFor="username">User Name</label>
              <input 
                type="text" id="username" name="username" 
                value={formData.username} onChange={handleChange}
                placeholder="Enter your username" required 
              />
            </div>

            <div className="input-group">
              <label htmlFor="password">PassWord</label>
              <div className="password-wrapper">
                <input 
                  type={showPassword ? "text" : "password"} 
                  id="password" name="password" 
                  value={formData.password} onChange={handleChange}
                  placeholder="Enter your password" required 
                />
                <button 
                  type="button" className="eye-btn" 
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <p className="auth-switch">
              Don't have an account? Please <Link to="/signup">Sign up</Link>
            </p>

            <button type="submit" className="btn-primary login-btn" disabled={loading}>
              {loading ? "Verifying Coordinates..." : "Lets Go!"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default LoginForm;