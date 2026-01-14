import { useState, useMemo } from 'react';
import {useLocation, useParams } from 'react-router-dom';
import { useResource } from '../hooks/useResource';
import DataViewer from '../components/DataViewer';

export default function AlbumPhotos() {
    const { albumId } = useParams();
    const location = useLocation();
    const albumTitle = location.state?.albumTitle || "Album Photos";
    const [hasMore, setHasMore] = useState(true);
    const limit = 5;

    const queryParams = useMemo(() => ({
        albumId: albumId,
        _limit: limit,
        _start: 0
    }), [albumId]);

    const [addPhotoMode, setAddPhotoMode] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [editPhoto, setEditPhoto] = useState({ title: "", url: "" });
    const [newPhoto, setNewPhoto] = useState({ title: "", url: "", thumbnailUrl: "" });

    const { data: photos, add, remove, update, fetchData, loading, error } = useResource('photos', queryParams);

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!newPhoto.title || !newPhoto.url) {
            alert("חובה למלא כותרת וקישור");
            return;
        }
        const itemToSend = { ...newPhoto, thumbnailUrl: newPhoto.url };
        await add(itemToSend);
        setNewPhoto({ title: '', url: '', thumbnailUrl: '' });
        setAddPhotoMode(false);
    };

    const handleSaveEdit = async (originalPhoto) => {
        const fieldsToSend = {};
        if (editPhoto.title && editPhoto.title !== originalPhoto.title) fieldsToSend.title = editPhoto.title;
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

    const loadMore = async () => {
        const currentCount = photos.length;

        const newPhotos = await fetchData({
            _start: currentCount,
            _limit: limit
        }, true); // true אומר ל-Hook להוסיף את התמונות למערך הקיים

        if (newPhotos) {
            // אם השרת החזיר פחות תמונות מהמגבלה (5), סימן שנגמר המידע
            if (newPhotos.length < limit) {
                setHasMore(false);
            }
        } else {
            setHasMore(false);
        }
    };

    return (
        <div>
            <h1>{albumTitle}</h1>

            <button onClick={() => setAddPhotoMode(!addPhotoMode)}>
                {addPhotoMode ? 'Cancel Add' : 'Add New Photo'}
            </button>

            {addPhotoMode && (
                <form onSubmit={handleAdd}>
                    <h3>Add New Photo</h3>
                    <input
                        type="text"
                        placeholder="Title..."
                        value={newPhoto.title}
                        onChange={(e) => setNewPhoto({ ...newPhoto, title: e.target.value })}
                    />
                    <input
                        type="text"
                        placeholder="URL..."
                        value={newPhoto.url}
                        onChange={(e) => setNewPhoto({ ...newPhoto, url: e.target.value })}
                    />
                    <button type="submit">Save New Photo</button>
                </form>
            )}

            <DataViewer loading={loading} error={error} data={photos}>
                <div>
                    {photos && photos.map(photo => (
                        <div key={photo.id} style={{ borderBottom: '1px solid #ccc', padding: '10px' }}>
                            <p>ID: {photo.id}</p>

                            {editingId === photo.id ? (
                                <>
                                    <input
                                        type="text"
                                        value={editPhoto.title}
                                        onChange={(e) => setEditPhoto({ ...editPhoto, title: e.target.value })}
                                        placeholder={photo.title}
                                    />
                                    <input
                                        type="text"
                                        value={editPhoto.url}
                                        onChange={(e) => setEditPhoto({ ...editPhoto, url: e.target.value })}
                                        placeholder="New URL..."
                                    />
                                    <div>
                                        <button onClick={() => handleSaveEdit(photo)}>Save</button>
                                        <button onClick={() => { setEditingId(null); setEditPhoto({ title: "", url: "" }); }}>Cancel</button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <p>{photo.title}</p>
                                    <img src={photo.thumbnailUrl || photo.url} alt={photo.title} style={{ width: '100px' }} />
                                    <div>
                                        <button onClick={() => { setEditingId(photo.id); setEditPhoto({ title: "", url: "" }); }}>Edit</button>
                                        <button onClick={() => remove(photo.id)}>Delete</button>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </DataViewer>

            {hasMore ? (
                <button onClick={loadMore} className="load-more-btn" style={{ marginTop: '20px', padding: '10px' }}>
                    Load More Photos
                </button>
            ) : (
                <p style={{ color: 'gray', marginTop: '20px' }}>No more photos to show</p>
            )}
        </div>
    );
}