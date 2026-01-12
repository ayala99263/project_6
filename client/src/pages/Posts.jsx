import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { useResource } from '../hooks/useResource';
import PostCard from "../components/PostCard";

export default function Posts({currentUser}) {
    const { id } = useParams();
    
    const { data: posts, add, remove, update } = useResource('posts', { userId: id });

    const [searchTerm, setSearchTerm] = useState("");
    const [searchBy, setSearchBy] = useState("title"); 

    const [addPostInput, setAddPostInput] = useState(false);
    const [newPost, setNewPost] = useState({ title: '', body: '' });

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!newPost.title || !newPost.body) return;
        
        await add(newPost);
        
        setNewPost({ title: '', body: '' });
        setAddPostInput(false);
    };

    const filteredPosts = posts.filter(post => {
        if (searchBy === 'id') {
            return post.id.toString().includes(searchTerm);
        } else {
            return post.title.toLowerCase().includes(searchTerm.toLowerCase());
        }
    });

    return (
        <div className="posts-page">
            <h1>Posts</h1>

            <div style={{ margin: '20px 0', display: 'flex', gap: '10px' }}>
                <select value={searchBy} onChange={(e) => setSearchBy(e.target.value)}>
                    <option value="title">Title</option>
                    <option value="id">ID</option>
                </select>
                <input 
                    type="text" 
                    placeholder={`Search by ${searchBy}...`} 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ padding: '5px', flexGrow: 1 }}
                />
            </div>

            <button onClick={() => setAddPostInput(!addPostInput)}>
                {addPostInput ? 'Cancel Add' : 'Add New Post'}
            </button>

            {addPostInput && (
                <form onSubmit={handleAdd} style={{ margin: '15px 0', border: '1px solid #eee', padding: '10px' }}>
                    <div style={{ marginBottom: '10px' }}>
                        <input
                            type="text"
                            placeholder="Title..."
                            value={newPost.title}
                            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                            style={{ width: '100%', padding: '5px' }}
                        />
                    </div>
                    <div>
                        <textarea
                            placeholder="Body content..."
                            value={newPost.body}
                            onChange={(e) => setNewPost({ ...newPost, body: e.target.value })}
                            style={{ width: '100%', height: '80px', padding: '5px' }}
                        />
                    </div>
                    <button type="submit" style={{ marginTop: '5px' }}>Save Post</button>
                </form>
            )}

            <div className="posts-list">
                {filteredPosts.map(post => (
                    <PostCard 
                        key={post.id} 
                        post={post} 
                        deletePost={() => remove(post.id)} 
                        updatePost={(updatedFields) => update(post.id, updatedFields)}
                        currentUser={currentUser}
                    />
                ))}
            </div>
        </div>
    )
}