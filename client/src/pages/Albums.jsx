import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useResource } from '../hooks/useResource';
import DataViewer from '../components/DataViewer';

export default function Albums() {
    const { id } = useParams();
    const { data: albums, add, filterData, error, loading } = useResource('albums', { userId: id });
    const [addAlbumInput, setaddAlbumInput] = useState(false);
    const [newAlbumTitle, setnewAlbumTitle] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [searchBy, setSearchBy] = useState("title");

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!newAlbumTitle) return;

        await add({ title: newAlbumTitle });

        setnewAlbumTitle("");
        setaddAlbumInput(false);
    };

    useEffect(() => {
        if (!searchTerm) {
            filterData(null);
        } else {
            filterData(album => {
                const val = searchTerm.toLowerCase();
                if (searchBy === 'id') return album.id.toString().includes(val);
                return album.title.toLowerCase().includes(val);
            });
        }
    }, [searchTerm, searchBy]);

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
            <div>
                <select value={searchBy} onChange={(e) => setSearchBy(e.target.value)}>
                    <option value="title">Title</option>
                    <option value="id">ID</option>
                </select>
                <input
                    type="text"
                    placeholder={`Search by ${searchBy}...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <DataViewer loading={loading} error={error} data={albums}>
                <div className="albums-grid">
                    {albums.map(album => (
                        <div key={album.id}>
                            <p>{album.id}</p>
                            <Link to={`/users/${id}/albums/${album.id}/photos`}
                                state={{ albumTitle: album.title }} >{album.title}</Link>
                        </div>
                    ))}
                </div>
            </DataViewer>
        </div>
    )
}
