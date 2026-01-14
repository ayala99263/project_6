import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useResource } from '../hooks/useResource';

export default function AlbumPhotos() {
    const { id, albumId } = useParams();
    const { data: photos, add, remove, update } = useResource('photos', { albumId: albumId });
    const [addPhoto, setAddPhoto] = useState(false);
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
        setAddPhoto(false);
    };

    return (
        <div>
            <h1>Album Page</h1>

            <button onClick={() => setAddPhoto(!addPhoto)}>
                {addPhoto ? 'Cancel Add' : 'Add New Photo'}
            </button>

            {addPhoto && (
                <form onSubmit={handleAdd}>
                    <input
                        type="text"
                        placeholder="Title..."
                        value={newPhoto.title}
                        onChange={(e) => setNewPhoto({ ...newPhoto, title: e.target.value })} />
                    <input
                        type="text"
                        placeholder="URL..."
                        value={newPhoto.url}
                        onChange={(e) => setNewPhoto({ ...newPhoto, url: e.target.value })} />

                    <button type="submit">Save</button>
                </form>
            )}

            {photos && photos.map(photo => (
                <div key={photo.id}>
                    <p>#{photo.id} - {photo.title}</p>
                    <img src={photo.url} alt={photo.title} />
                    <button onClick={() => remove(photo.id)}>Delete</button>
                </div>
            ))}
        </div>
    )
}