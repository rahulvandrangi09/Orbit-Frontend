import "./styles/navbar.css";
import { Link, useNavigate } from 'react-router-dom';
const Navbar = ({ isLoggedIn, user }) => {
  const navigate = useNavigate()
  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/">
          <h1 className="logo">Orbit</h1>
        </Link>
        <span className="tagline">Real-Time collaborative space</span>
      </div>

      <div className="nav-right">
        {isLoggedIn ? (
          <div className="user-info">
            <span className="username" onClick={() => navigate('/userdashboard')}  style={{cursor: 'pointer'}}>{user.username}</span>
          </div>
        ) : (
          <>
          <Link to="/login">
            <p className="login">
              Login
            </p>
          </Link>
        

        <span className="divider">/</span>
        <Link to="/signup">
          <p className="signup">
            Signup
          </p>
        </Link></>)}
      </div>
    </nav>
  );
};

export default Navbar;
