import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useResource } from '../hooks/useResource'; 

export default function AlbumPhotos() {
    const { albumId } = useParams();
    
    const { data: photos, add, remove, update } = useResource('photos', { albumId: albumId });

    const [addPhotoMode, setAddPhotoMode] = useState(false); 
    const [editingId, setEditingId] = useState(null);
    
    const [editPhoto, setEditPhoto] = useState({ title: "", url: "" });
    
    const [newPhoto, setNewPhoto] = useState({
        title: "",
        url: "",
        thumbnailUrl: ""
    });

    const handleAdd = async (e) => {
        e.preventDefault();

        if (!newPhoto.title || !newPhoto.url) {
            alert("חובה למלא כותרת וקישור");
            return;
        }

        const itemToSend = {
            ...newPhoto,
            thumbnailUrl: newPhoto.url 
        };

        await add(itemToSend);

        setNewPhoto({ title: '', url: '', thumbnailUrl: '' });
        setAddPhotoMode(false);
    };

    const handleSaveEdit = async (originalPhoto) => {
        const fieldsToSend = {};

        if (editPhoto.title && editPhoto.title !== originalPhoto.title) {
            fieldsToSend.title = editPhoto.title;
        }

        if (editPhoto.url && editPhoto.url !== originalPhoto.url) {
            fieldsToSend.url = editPhoto.url;
            fieldsToSend.thumbnailUrl = editPhoto.url; 
        }

        if (Object.keys(fieldsToSend).length === 0) {
            setEditingId(null);
            setEditPhoto({ title: "", url: "" });
            return;
        }

        await update(originalPhoto.id, fieldsToSend);
        
        setEditingId(null);
        setEditPhoto({ title: "", url: "" });
    };

    return (
        <div>
            <h1>Album Page</h1>

            <button onClick={() => setAddPhotoMode(!addPhotoMode)}>
                {addPhotoMode ? 'Cancel Add' : 'Add New Photo'}
            </button>

            {addPhotoMode && (
                <form onSubmit={handleAdd} style={{ marginBottom: '20px', border: '1px solid #ccc', padding: '10px' }}>
                    <h3>Add New Photo</h3>
                    <input
                        type="text"
                        placeholder="Title..."
                        value={newPhoto.title}
                        onChange={(e) => setNewPhoto({ ...newPhoto, title: e.target.value })} 
                        style={{ display: 'block', margin: '5px 0' }}
                    />
                    <input
                        type="text"
                        placeholder="URL..."
                        value={newPhoto.url}
                        onChange={(e) => setNewPhoto({ ...newPhoto, url: e.target.value })} 
                        style={{ display: 'block', margin: '5px 0' }}
                    />
                    <button type="submit">Save New Photo</button>
                </form>
            )}

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
                {photos && photos.map(photo => (
                    <div key={photo.id} style={{ border: '1px solid #eee', padding: '10px', width: '200px' }}>
                        <p>ID: {photo.id}</p>
                        
                        {editingId === photo.id ? (
                            <>
                                <input 
                                    type="text" 
                                    value={editPhoto.title} 
                                    onChange={(e) => setEditPhoto({...editPhoto, title: e.target.value})}
                                    placeholder={photo.title} 
                                />
                                <input 
                                    type="text" 
                                    value={editPhoto.url} 
                                    onChange={(e) => setEditPhoto({...editPhoto, url: e.target.value})}
                                    placeholder="New URL..."
                                />
                                <div style={{ marginTop: '5px' }}>
                                    <button onClick={() => handleSaveEdit(photo)}>Save</button>
                                    <button onClick={() => {
                                        setEditingId(null);
                                        setEditPhoto({ title: "", url: "" });
                                    }}>Cancel</button>
                                </div>
                            </>
                        ) : (
                            <>
                                <p style={{ fontWeight: 'bold' }}>{photo.title}</p>
                                <img 
                                    src={photo.thumbnailUrl || photo.url} 
                                    alt={photo.title} 
                                    style={{ width: '100%', height: '150px', objectFit: 'cover' }}
                                />
                                <div style={{ marginTop: '10px' }}>
                                    <button onClick={() => {
                                        setEditingId(photo.id);
                                        setEditPhoto({ title: "", url: "" }); 
                                    }}>Edit</button>
                                    
                                    <button 
                                        onClick={() => remove(photo.id)} 
                                        style={{ marginLeft: '5px', color: 'red' }}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    )
}