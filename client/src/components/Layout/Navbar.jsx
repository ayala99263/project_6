import { Link, useLocation } from 'react-router-dom';
import './Layout.css';
import { useUser } from '../../context/UserContext';

export default function Navbar({ handleLogout, setShowInfo }) {
  const location = useLocation();
  const { currentUser } = useUser()

  return (
    <nav className="navbar">
      <div className="navbar-links">
        <button className="navbar-button" onClick={() => setShowInfo(true)}>Info</button>
        <Link
          className={`navbar-link ${location.pathname.includes('/todos') ? 'active' : ''}`}
          to={`/users/${currentUser.id}/todos`}
        >
          Todos
        </Link>
        <Link
          className={`navbar-link ${location.pathname.includes('/posts') ? 'active' : ''}`}
          to={`/users/${currentUser.id}/posts`}
        >
          Posts
        </Link>
        <Link
          className={`navbar-link ${location.pathname.includes('/albums') ? 'active' : ''}`}
          to={`/users/${currentUser.id}/albums`}
        >
          Albums
        </Link>
      </div>
      <button className="navbar-button logout" onClick={handleLogout}>Logout</button>
    </nav>
  );
};

