import './Layout.css';
import { useUser } from '../../context/UserContext';

export default function Info({ setShowInfoState }) {
    const { currentUser } = useUser()
    const getAvatarColor = (name) => {
        const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4'];
        const index = name.charCodeAt(0) % colors.length;
        return colors[index];
    };

    const firstLetter = currentUser.name.charAt(0).toUpperCase();
    
    return (
        <div className="info-overlay" onClick={() => setShowInfoState(false)}>
            <div className="info-modal" onClick={(e) => e.stopPropagation()}>
                <button className="info-close" onClick={() => setShowInfoState(false)}>✕</button>
                
                <div className="info-header">
                    <div className="info-user-avatar" style={{ background: getAvatarColor(currentUser.name) }}>{firstLetter}</div>
                    <div>
                        <h2>{currentUser.name}</h2>
                        <p className="info-subtitle">User Information</p>
                    </div>
                </div>

                <div className="info-content">
                    <div className="info-grid">
                        <div className="info-card">
                            <span className="info-icon">✉</span>
                            <div className="info-card-content">
                                <div className="info-card-label">Email</div>
                                <div className="info-card-value">{currentUser.email}</div>
                            </div>
                        </div>

                        <div className="info-card">
                            <span className="info-icon">☎</span>
                            <div className="info-card-content">
                                <div className="info-card-label">Phone</div>
                                <div className="info-card-value">{currentUser.phone}</div>
                            </div>
                        </div>

                        <div className="info-card">
                            <span className="info-icon">🗺️</span>
                            <div className="info-card-content">
                                <div className="info-card-label">Address</div>
                                <div className="info-card-value">{currentUser.address.street} {currentUser.address.number}, {currentUser.address.city}</div>
                            </div>
                        </div>

                        <div className="info-card">
                            <span className="info-icon">🏢</span>
                            <div className="info-card-content">
                                <div className="info-card-label">Company</div>
                                <div className="info-card-value">{currentUser.company.name}</div>
                                <div className="info-card-subtitle">{currentUser.company.catchPhrase}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}