import './Home.css';

export default function Home({ user }) {
    const firstLetter = user.name.charAt(0).toUpperCase();
    
    return (
        <div className="home-container">
            <div className="home-content">
                <div className="home-header">
                    <div className="user-profile">
                        <div className="user-avatar">{firstLetter}</div>
                        <div>
                            <h3>Welcome, {user.name}!</h3>
                            <p>Your personal content management system is ready for use.</p>
                        </div>
                    </div>
                </div>
                
                <div className="home-cards">
                    <div className="home-card">
                        <h4>📝 Todos</h4>
                        <p>Manage your tasks and stay organized</p>
                    </div>
                    <div className="home-card">
                        <h4>📄 Posts</h4>
                        <p>Share your thoughts and ideas</p>
                    </div>
                    <div className="home-card">
                        <h4>📸 Albums</h4>
                        <p>Browse and organize your photos</p>
                    </div>
                </div>
            </div>
        </div>
    )
}