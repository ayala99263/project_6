import { Link } from 'react-router-dom';
import './Home.css';

export default function Home({ user }) {
    const getAvatarColor = (name) => {
        const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4'];
        const index = name.charCodeAt(0) % colors.length;
        return colors[index];
    };

    const firstLetter = user.name.charAt(0).toUpperCase();
    
    return (
        <div className="home-container">
            <div className="home-content">
                <div className="home-header">
                    <div className="user-profile">
                        <div className="user-avatar" style={{ background: getAvatarColor(user.name) }}>{firstLetter}</div>
                        <div>
                            <h3>Welcome, {user.name}!</h3>
                            <p>Your personal content management system is ready for use.</p>
                        </div>
                    </div>
                </div>
                
                <div className="home-cards">
                    <Link to={`/users/${user.id}/todos`} className="home-card">
                        <h4>📝 Todos</h4>
                        <p>Manage your tasks and stay organized</p>
                    </Link>
                    <Link to={`/users/${user.id}/posts`} className="home-card">
                        <h4>📄 Posts</h4>
                        <p>Share your thoughts and ideas</p>
                    </Link>
                    <Link to={`/users/${user.id}/albums`} className="home-card">
                        <h4>📸 Albums</h4>
                        <p>Browse and organize your photos</p>
                    </Link>
                </div>
            </div>
        </div>
    )
}