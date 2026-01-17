import { useEffect, useState } from 'react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { useUser } from '../../context/UserContext';

export default function AlbumGuard() {
    const { albumId } = useParams(); 
    const { currentUser } = useUser();
    const navigate = useNavigate();
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        const checkOwnership = async () => {
            if (!currentUser || !albumId) return;

            try {
                const res = await axios.get(`http://localhost:3000/albums?id=${albumId}&userId=${currentUser.id}`);

                if (res.data.length > 0) {
                    setIsAuthorized(true); 
                } else {
                    navigate('/home', { 
                        state: { error: "The album does not belong to you" },
                        replace: true 
                    });
                }
            } catch (err) {
                navigate('/home');
            }
        };

        checkOwnership();
    }, [albumId, currentUser, navigate]);

    if (!isAuthorized) return null; 

    return <Outlet />;
}