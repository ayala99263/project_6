import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useResource } from '../../hooks/useResource';
import PostCard from "../../components/PostCard/PostCard";
import DataViewer from '../../components/DataViewer/DataViewer';
import './Posts.css';

export default function Posts({ currentUser }) {
    const { id } = useParams();

    const { data: posts, add, remove, update, loading, error, filterData } = useResource('posts');

    const [searchTerm, setSearchTerm] = useState("");
    const [searchBy, setSearchBy] = useState("title");

    const [addPostInput, setAddPostInput] = useState(false);
    const [newPost, setNewPost] = useState({ title: '', body: '' });

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!newPost.title || !newPost.body) return;
        await add({ ...newPost, userId: currentUser.id });
        setNewPost({ title: '', body: '' });
        setAddPostInput(false);
        setSearchTerm("")
    };

    useEffect(() => {
        if (!searchTerm && searchBy !== 'myPosts') {
            filterData(null);
        }
        else {
            filterData((post) => {
                switch (searchBy) {
                    case 'id':
                        return post.id.toString().includes(searchTerm);
                    case 'title':
                        return post.title.toLowerCase().includes(searchTerm.toLowerCase());
                    case 'myPosts':
                        return post.userId == currentUser.id;
                }

            });
        }
    }, [searchTerm, searchBy])


    return (
        <div className="posts-page">
            <div className="posts-controls">
                <label>Search by:</label>
                <select value={searchBy} onChange={(e) => setSearchBy(e.target.value)}>
                    <option value="title">Title</option>
                    <option value="id">ID</option>
                    <option value="myPosts">My Posts</option>
                </select>
                <input
                    type="text"
                    placeholder={`Search by ${searchBy}...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button className="clear-btn" onClick={() => setSearchTerm("")}>Clear</button>
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
                            placeholder="Post title..."
                            value={newPost.title}
                            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                        />
                        <textarea
                            placeholder="Post content..."
                            value={newPost.body}
                            onChange={(e) => setNewPost({ ...newPost, body: e.target.value })}
                        />
                        <button type="submit">Save Post</button>
                    </form>
                )}
            </div>

            <DataViewer loading={loading} error={error} data={posts}>
                <div className="posts-list">
                    {posts.map(post => (
                        <PostCard
                            key={post.id}
                            post={post}
                            deletePost={() => remove(post.id)}
                            updatePost={(updatedFields) => update(post.id, updatedFields)}
                            currentUser={currentUser}
                        />
                    ))}
                </div>
            </DataViewer>
        </div>
    )
}