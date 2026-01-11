import React from 'react';
import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import Navbar from './Navbar';

const Layout = () => {
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
                {showInfoState && <div>
                    <button onClick={() => setShowInfoState(false)}>X</button>
                    <h2>Info</h2>
                    <p>Name: {user.name}</p>
                    <p>Email: {user.email}</p>
                    <p>Phone: {user.phone}</p>
                    <p>address:</p>
                    <p>street: {user.address.street}</p>
                    <p>city: {user.address.city}</p>
                    <p>number: {user.address.number}</p>
                    <p>company:</p>
                    <p>name: {user.company.name}</p>
                    <p>catchPhrase: {user.company.catchPhrase}</p>
                    <p>bs: {user.company.bs}</p>
                </div>}
                <main style={{ padding: '20px' }}>
                    <Outlet />
                </main>
            </div>
        </>
    );
};

export default Layout;