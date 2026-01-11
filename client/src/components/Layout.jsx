import React from 'react';
import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const Layout = () => {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('currentUser'));

    useEffect(() => {
        if (!user) {
            navigate('/');
        }
    }, []);


    const handleLogout = () => {
        localStorage.removeItem('currentUser');
        navigate('/');
    };

    if (!user) return null;

    return (
        <div className="app-layout">
            <Navbar user={user} handleLogout={handleLogout} />
            
            <main style={{ padding: '20px' }}>
                <Outlet /> 
            </main>
        </div>
    );
};

export default Layout;