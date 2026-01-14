import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import '../pages/Home.css';

const Navbar = ({ user, handleLogout, setShowInfo }) => {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar-links">
        <button className="navbar-button" onClick={() => setShowInfo(true)}>Info</button>
        <Link 
          className={`navbar-link ${location.pathname.includes('/todos') ? 'active' : ''}`} 
          to={`/users/${user.id}/todos`}
        >
          Todos
        </Link>
        <Link 
          className={`navbar-link ${location.pathname.includes('/posts') ? 'active' : ''}`} 
          to={`/users/${user.id}/posts`}
        >
          Posts
        </Link>
        <Link 
          className={`navbar-link ${location.pathname.includes('/albums') ? 'active' : ''}`} 
          to={`/users/${user.id}/albums`}
        >
          Albums
        </Link>
      </div>
      <button className="navbar-button logout" onClick={handleLogout}>Logout</button>
    </nav>
  );
};



export default Navbar;