import { Link, useLocation } from 'react-router-dom';
import './Home.css';
import { useUser } from '../../context/UserContext';
import { useState, useEffect } from 'react';



export default function Home() {
    const { currentUser } = useUser()
    const location = useLocation();
    const [msg, setMsg] = useState("");

    useEffect(() => {
        if (location.state?.error) {
            setMsg(location.state.error);

            window.history.replaceState({}, document.title);
            
            const timer = setTimeout(() => {
                setMsg("");
            }, 20000);
            
            return () => clearTimeout(timer);
        }
    }, [location]);

    const getAvatarColor = (name) => {
        const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4'];
        const index = name.charCodeAt(0) % colors.length;
        return colors[index];
    };

    const firstLetter = currentUser.name.charAt(0).toUpperCase();

    return (
        <>
            {msg && <div className="home-message">{msg}</div>}
            <div className="home-container">
                <div className="home-content">
                    <div className="home-header">
                        <div className="user-profile">
                            <div className="user-avatar" style={{ background: getAvatarColor(currentUser.name) }}>{firstLetter}</div>
                            <div>
                                <h3>Welcome, {currentUser.name}!</h3>
                                <p>Your personal content management system is ready for use.</p>
                            </div>
                        </div>
                    </div>

                    <div className="home-cards">
                        <Link to={`/users/${currentUser.id}/todos`} className="home-card">
                            <h4>📝 Todos</h4>
                            <p>Manage your tasks and stay organized</p>
                        </Link>
                        <Link to={`/users/${currentUser.id}/posts`} className="home-card">
                            <h4>📄 Posts</h4>
                            <p>Share your thoughts and ideas</p>
                        </Link>
                        <Link to={`/users/${currentUser.id}/albums`} className="home-card">
                            <h4>📸 Albums</h4>
                            <p>Browse and organize your photos</p>
                        </Link>
                    </div>
                </div>
            </div>
        </>
    )
}