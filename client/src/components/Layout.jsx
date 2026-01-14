import React from 'react';
import { useEffect } from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import Navbar from './Navbar';
import Info from './Info'
import '../pages/Home.css';

export default function Layout({ currentUser, setCurrentUser }) {
    const navigate = useNavigate();
    const [showInfoState, setShowInfoState] = React.useState(false);

    const getAvatarColor = (name) => {
        const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4'];
        const index = name.charCodeAt(0) % colors.length;
        return colors[index];
    };

    useEffect(() => {
        if (!currentUser) {
            navigate('/');
        }
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('currentUser');
        setCurrentUser(null);
        navigate('/');
    };

    const setShowInfo = () => {
        setShowInfoState(true)
    };

    if (!currentUser) return null;

    const firstLetter = currentUser.name.charAt(0).toUpperCase();

    return (
        <div className="app-layout">

            <Link to={"/"} className="layout-profile-link">
                <div className="layout-user-avatar" style={{ background: getAvatarColor(currentUser.name) }}>{firstLetter}</div>
                <span>{currentUser.name}</span>
            </Link>

            <Navbar user={currentUser} handleLogout={handleLogout} setShowInfo={setShowInfo} />

            {showInfoState && <Info user={currentUser} setShowInfoState={setShowInfoState} />}

            <main style={{ padding: '20px' }}>
                <Outlet />
            </main>
        </div>
    );
};