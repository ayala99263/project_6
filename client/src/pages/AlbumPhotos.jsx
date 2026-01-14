import { useState, useMemo } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { useResource } from '../hooks/useResource';
import DataViewer from '../components/DataViewer';
import './AlbumPhotos.css';

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
        }, true);

        if (newPhotos) {
            if (newPhotos.length < limit) {
                setHasMore(false);
            }
        } else {
            setHasMore(false);
        }
    };

    return (
        <div className="album-photos-page">
            <div className="album-title-header">
                <span className="album-icon-small">📁</span>
                <h1 className="album-photos-title">{albumTitle}</h1>
            </div>

            <div className="photos-header">
                <button 
                    className={`add-photo-btn ${addPhotoMode ? 'cancel' : ''}`}
                    onClick={() => setAddPhotoMode(!addPhotoMode)}
                >
                    {addPhotoMode ? 'Cancel' : 'Add New Photo'}
                </button>

                {addPhotoMode && (
                    <form className="add-photo-form" onSubmit={handleAdd}>
                        <h3>Add New Photo</h3>
                        <input
                            type="text"
                            placeholder="Enter photo title..."
                            value={newPhoto.title}
                            onChange={(e) => setNewPhoto({ ...newPhoto, title: e.target.value })}
                        />
                        <input
                            type="text"
                            placeholder="Enter image URL..."
                            value={newPhoto.url}
                            onChange={(e) => setNewPhoto({ ...newPhoto, url: e.target.value })}
                        />
                        <button type="submit">Save Photo</button>
                    </form>
                )}
            </div>

            <DataViewer loading={loading} error={error} data={photos}>
                <div className="photos-grid">
                    {photos && photos.map(photo => (
                        <div key={photo.id} className="photo-card">
                            <div className="photo-image-container">
                                <span className="photo-id">#{photo.id}</span>
                                <img src={photo.url} alt={photo.title} className="photo-image" />
                                {editingId === photo.id && (
                                    <div className="photo-edit-overlay">
                                        <div className="photo-edit-form">
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
                                            <div className="photo-actions">
                                                <button className="photo-btn save" onClick={() => handleSaveEdit(photo)}>Save</button>
                                                <button className="photo-btn cancel" onClick={() => { setEditingId(null); setEditPhoto({ title: "", url: "" }); }}>Cancel</button>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="photo-content">
                                <p className="photo-title">{photo.title}</p>
                                <div className="photo-actions">
                                    <button className="photo-btn edit" onClick={() => { setEditingId(photo.id); setEditPhoto({ title: "", url: "" }); }}>Edit</button>
                                    <button className="photo-btn delete" onClick={() => remove(photo.id)}>Delete</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </DataViewer>

            <div className="load-more-container">
                {hasMore ? (
                    <button onClick={loadMore} className="load-more-btn">
                        Load More Photos
                    </button>
                ) : (
                    <p className="no-more-photos">No more photos to show</p>
                )}
            </div>
        </div>
    );
}