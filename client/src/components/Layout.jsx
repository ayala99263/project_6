import React from 'react';
import { useEffect } from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import Navbar from './Navbar';
import Info from './Info'
import '../pages/Home.css';

export default function Layout({ currentUser, setCurrentUser }) {
    const navigate = useNavigate();
    const [showInfoState, setShowInfoState] = React.useState(false);

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
                <div className="layout-user-avatar">{firstLetter}</div>
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