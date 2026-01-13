import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useResource } from '../hooks/useResource';

export default function Albums() {
    const { id } = useParams();
    const { data: albums, add, remove, update } = useResource('albums', { userId: id });
    const [addAlbumInput, setaddAlbumInput] = useState(false);
    const [newAlbumTitle, setnewAlbumTitle] = useState("");

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!newAlbumTitle) return;

        await add({ title: newAlbumTitle });

        setnewAlbumTitle("");
        setaddAlbumInput(false);
    };

    return (
        <div>
            <h1>Albums List</h1>

            <button onClick={() => setaddAlbumInput(!addAlbumInput)}>
                {addAlbumInput ? 'Cancel Add' : 'Add New Album'}
            </button>

            {addAlbumInput && (
                <form onSubmit={handleAdd}>
                    <input
                        type="text"
                        placeholder="Title..."
                        value={newAlbumTitle}
                        onChange={(e) => setnewAlbumTitle(e.target.value)}
                    />
                    <button type="submit">Save</button>
                </form>
            )}
            {albums && albums.map(album => (
                <div key={album.id}>
                    <p>{album.id}</p>
                    <Link to={`/users/${id}/albums/${album.id}/photos`}>{album.title}</Link>
                </div>
            ))}


        </div>
    )


}