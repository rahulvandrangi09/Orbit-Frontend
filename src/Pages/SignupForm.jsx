import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './stylePages/signupPage.css';
import Navbar from '../Components/Navbar';
const SignupForm = () => {
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ 
    username: '', 
    email: '', 
    password: '' 
  });
  const url = import.meta.env.VITE_BACKEND_URL ||"http://localhost:3000"

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Signup Data:", formData);
    try{
      const response = await fetch(`${url}/api/auth/signup`, {
         method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json();
      if(!response.ok){
        setError(`${data.message}` | "Signup Failed");
        return;
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      navigate('/publicrooms');



    }catch (err) {
      console.error(err);
      setError('Something went wrong. Try again.');
    }

  };

  return (
    <>
    <Navbar />
    <div className="auth-page">
      <div className="auth-container reveal show">
        <h1 className="auth-title">Signup</h1>
        
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
            <input 
              type="password" 
              id="password" 
              name="password" 
              value={formData.password}
              onChange={handleChange}
              required 
            />
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