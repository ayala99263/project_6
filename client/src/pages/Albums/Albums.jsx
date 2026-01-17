import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useResource } from '../../hooks/useResource';
import { useSearch } from '../../hooks/useSearch';
import SearchBar from '../../components/SearchBar/SearchBar';
import DataViewer from '../../components/DataViewer/DataViewer';
import './Albums.css';

export default function Albums() {
    const { id } = useParams();
    const { data: albums, add, error, loading } = useResource('albums', { userId: id });

    const searchStrategies = {
        title: (album, val) => album.title.toLowerCase().includes(val),
        id: (album, val) => album.id.toString().includes(val)
    };

    const { 
        filteredData: displayAlbums,
        searchTerm, setSearchTerm, searchBy, setSearchBy, searchOptions 
    } = useSearch(albums, searchStrategies);

    const [addAlbumInput, setAddAlbumInput] = useState(false);
    const [newAlbumTitle, setNewAlbumTitle] = useState("");

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!newAlbumTitle) return;
        await add({ title: newAlbumTitle });
        setNewAlbumTitle("");
        setAddAlbumInput(false);
        setSearchTerm("");
    };

    return (
        <div className="albums-page">
            <div className="albums-controls">
                <SearchBar 
                    searchTerm={searchTerm} setSearchTerm={setSearchTerm}
                    searchBy={searchBy} setSearchBy={setSearchBy}
                    options={searchOptions}
                />
            </div>

            <div className="albums-header">
                <button 
                    className={`add-album-btn ${addAlbumInput ? 'cancel' : ''}`}
                    onClick={() => setAddAlbumInput(!addAlbumInput)}
                >
                    {addAlbumInput ? 'Cancel' : 'Add New Album'}
                </button>

                {addAlbumInput && (
                    <form className="add-album-form" onSubmit={handleAdd}>
                        <input
                            type="text"
                            placeholder="Enter album title..."
                            value={newAlbumTitle}
                            onChange={(e) => setNewAlbumTitle(e.target.value)}
                        />
                        <button type="submit">Save</button>
                    </form>
                )}
            </div>

            <DataViewer loading={loading} error={error} data={displayAlbums}>
                <div className="albums-grid">
                    {displayAlbums.map(album => (
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
    );
}