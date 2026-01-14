import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useResource } from '../hooks/useResource';
import DataViewer from '../components/DataViewer';
import './Albums.css';

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
        <div className="albums-page">
            <div className="albums-controls">
                <label>Search by:</label>
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

            <div className="albums-header">
                <button 
                    className={`add-album-btn ${addAlbumInput ? 'cancel' : ''}`}
                    onClick={() => setaddAlbumInput(!addAlbumInput)}
                >
                    {addAlbumInput ? 'Cancel' : 'Add New Album'}
                </button>

                {addAlbumInput && (
                    <form className="add-album-form" onSubmit={handleAdd}>
                        <input
                            type="text"
                            placeholder="Enter album title..."
                            value={newAlbumTitle}
                            onChange={(e) => setnewAlbumTitle(e.target.value)}
                        />
                        <button type="submit">Save</button>
                    </form>
                )}
            </div>

            <DataViewer loading={loading} error={error} data={albums}>
                <div className="albums-grid">
                    {albums.map(album => (
                        <Link 
                            key={album.id}
                            to={`/users/${id}/albums/${album.id}/photos`}
                            state={{ albumTitle: album.title }}
                            className="album-card"
                        >
                            <span className="album-id">#{album.id}</span>
                            <div className="album-icon">📁</div>
                            <h3 className="album-title">{album.title}</h3>
                        </Link>
                    ))}
                </div>
            </DataViewer>
        </div>
    )
}