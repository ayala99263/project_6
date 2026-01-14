import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ user, handleLogout, setShowInfo }) => {

  return (
    <nav >
      <button onClick={() => setShowInfo(true)}>Info</button>

      <Link to={`/users/${user.id}/todos`}>  Todos </Link>
      <Link to={`/users/${user.id}/posts`}>Posts </Link>
      <Link to={`/users/${user.id}/albums`}>Albums  </Link>

      <button onClick={handleLogout}>Logout</button>
    </nav>
  );
};



export default Navbar;