import React from 'react';
import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';
import Info from './Info'

export default function Layout({setCurrentUser}){
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const [showInfoState, setShowInfoState] = React.useState(false);

    useEffect(() => {
        if (!user) {
            navigate('/');
        }
    }, []);


    const handleLogout = () => {
        localStorage.removeItem('currentUser');
        setCurrentUser(null)
        navigate('/');
    };

    const setShowInfo = () => {
        setShowInfoState(true)
    };

    if (!user) return null;

    return (
        <>
            <div className="app-layout">
                <Navbar user={user} handleLogout={handleLogout} setShowInfo={setShowInfo} />
                {showInfoState && <Info user={user} setShowInfoState={setShowInfoState} />}
                <main style={{ padding: '20px' }}>
                    <Outlet />
                </main>
            </div>
        </>
    );
};

