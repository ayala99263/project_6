import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useResource } from '../hooks/useResource';

export default function Albums() {
    const { id } = useParams();
    const { data: albums, add, remove, update } = useResource('albums', { userId: id });


    return (
        <div>
            <h1>Albums List</h1>
            {albums && albums.map(album => (
                <div key={album.id}>
                    <h3>{album.title}</h3>
                </div>
            ))}
        </div>
    )


}