import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useResource } from '../../hooks/useResource';
import { useSearch } from '../../hooks/useSearch';
import { useUser } from '../../context/UserContext';
import SearchBar from '../../components/SearchBar/SearchBar';
import DataViewer from '../../components/DataViewer/DataViewer';
import PostCard from "../../components/PostCard/PostCard";
import './Posts.css';

export default function Posts() {
    const { id } = useParams();
    const { currentUser } = useUser();

    const { data: posts, add, remove, update, loading, error } = useResource('posts', { _expand: 'user' });

    const { data: users } = useResource('users');

    const searchStrategies = {
        title: (post, val) => post.title.toLowerCase().includes(val),
        id: (post, val) => post.id.toString().includes(val),
        myPosts: (post) => post.userId == currentUser?.id
    };

    const {
        filteredData: displayPosts,
        searchTerm, setSearchTerm, searchBy, setSearchBy, searchOptions
    } = useSearch(posts, searchStrategies);

    const [addPostInput, setAddPostInput] = useState(false);
    const [newPost, setNewPost] = useState({ title: '', body: '' });

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!newPost.title || !newPost.body) return;
        await add({ ...newPost, userId: currentUser.id });
        setNewPost({ title: '', body: '' });
        setAddPostInput(false);
        setSearchTerm("");
    };

    return (
        <div className="posts-page">
            <div className="posts-controls">
                <SearchBar
                    searchTerm={searchTerm} setSearchTerm={setSearchTerm}
                    searchBy={searchBy} setSearchBy={setSearchBy}
                    options={searchOptions}
                />
            </div>

            <div className="posts-header">
                <button
                    className={`add-post-btn ${addPostInput ? 'cancel' : ''}`}
                    onClick={() => setAddPostInput(!addPostInput)}
                >
                    {addPostInput ? 'Cancel' : 'Add New Post'}
                </button>

                {addPostInput && (
                    <form className="add-post-form" onSubmit={handleAdd}>
                        <input
                            type="text"
                            placeholder="Title..."
                            value={newPost.title}
                            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                        />
                        <textarea
                            placeholder="Content..."
                            value={newPost.body}
                            onChange={(e) => setNewPost({ ...newPost, body: e.target.value })}
                        />
                        <button type="submit">Save Post</button>
                    </form>
                )}
            </div>

            <DataViewer loading={loading} error={error} data={displayPosts}>
                <div className="posts-list">
                    {displayPosts.map(post => (
                        <PostCard
                            key={post.id}
                            post={post}
                            deletePost={() => remove(post.id)}
                            updatePost={(updatedFields) => update(post.id, updatedFields)}
                            author = {users?.find(u => u.id == post.userId)}
                        />
                    ))}
                </div>
            </DataViewer>
        </div>
    );
}