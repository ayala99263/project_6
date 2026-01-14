import React from 'react';
import { useEffect } from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import Navbar from './Navbar';
import Info from './Info'

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

    return (
        <div className="app-layout">

            <Link to={"/"}>🧒 {currentUser.name}</Link>

            <Navbar user={currentUser} handleLogout={handleLogout} setShowInfo={setShowInfo} />

            {showInfoState && <Info user={currentUser} setShowInfoState={setShowInfoState} />}

            <main style={{ padding: '20px' }}>
                <Outlet />
            </main>
        </div>
    );
};