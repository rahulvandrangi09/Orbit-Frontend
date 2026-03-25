import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './stylePages/loginPage.css';
import Navbar from '../Components/Navbar';
import { useNavigate } from 'react-router-dom';
const LoginForm = () => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const url = import.meta.env.VITE_BACKEND_URL ||"http://localhost:3000"
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Login Attempt:", formData);
    //sending the data to the backend 
    try{
      const response = await fetch(`${url}/api/auth/login`, {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      const data = await response.json()
      if(!response.ok){
        setError(data.message || 'Login Failed');
        return;
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));

      navigate('/publicrooms')

    } catch (err) {
      console.error(err);
      setError('Something went wrong. Try again.');
    }
  };

  return (
    <>
    <Navbar />
    <div className="login-page">
      <div className="login-container reveal show">
        <h1 className="login-title">Login</h1>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-group">
            <label htmlFor="username">User Name</label>
            <input 
              type="text" 
              id="username" 
              name="username" 
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter your username"
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
              placeholder="Enter your password"
              required 
            />
          </div>

          <p className="auth-switch">
            Don't have an account? Please <Link to="/signup">Sign up</Link>
          </p>

          <button type="submit" className="btn-primary login-btn" >
            Lets Go!
          </button>
        </form>
      </div>
    </div>
    </>
  );
};

export default LoginForm;