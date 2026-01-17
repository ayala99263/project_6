import './Layout.css';

export default function Info({ user, setShowInfoState }) {
    const getAvatarColor = (name) => {
        const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4'];
        const index = name.charCodeAt(0) % colors.length;
        return colors[index];
    };

    const firstLetter = user.name.charAt(0).toUpperCase();
    
    return (
        <div className="info-overlay" onClick={() => setShowInfoState(false)}>
            <div className="info-modal" onClick={(e) => e.stopPropagation()}>
                <button className="info-close" onClick={() => setShowInfoState(false)}>✕</button>
                
                <div className="info-header">
                    <div className="info-user-avatar" style={{ background: getAvatarColor(user.name) }}>{firstLetter}</div>
                    <div>
                        <h2>{user.name}</h2>
                        <p className="info-subtitle">User Information</p>
                    </div>
                </div>

                <div className="info-content">
                    <div className="info-grid">
                        <div className="info-card">
                            <span className="info-icon">✉</span>
                            <div className="info-card-content">
                                <div className="info-card-label">Email</div>
                                <div className="info-card-value">{user.email}</div>
                            </div>
                        </div>

                        <div className="info-card">
                            <span className="info-icon">☎</span>
                            <div className="info-card-content">
                                <div className="info-card-label">Phone</div>
                                <div className="info-card-value">{user.phone}</div>
                            </div>
                        </div>

                        <div className="info-card">
                            <span className="info-icon">🗺️</span>
                            <div className="info-card-content">
                                <div className="info-card-label">Address</div>
                                <div className="info-card-value">{user.address.street} {user.address.number}, {user.address.city}</div>
                            </div>
                        </div>

                        <div className="info-card">
                            <span className="info-icon">🏢</span>
                            <div className="info-card-content">
                                <div className="info-card-label">Company</div>
                                <div className="info-card-value">{user.company.name}</div>
                                <div className="info-card-subtitle">{user.company.catchPhrase}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}