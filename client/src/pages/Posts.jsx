import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useResource } from '../hooks/useResource';
import PostCard from "../components/PostCard";

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

    if (loading) return <h2>Loading posts... ⏳</h2>;
    if (error) return <h2>Error: {error.message} ⚠️</h2>;

    return (
        <div className="posts-page">
            <h1>Posts</h1>

            <div>
                <select value={searchBy} onChange={(e) => setSearchBy(e.target.value)}>
                    <option value="title">Title</option>
                    <option value="id">ID</option>
                    <option value="myPosts">my posts</option>
                </select>
                <input
                    type="text"
                    placeholder={`Search by ${searchBy}...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            <button onClick={() => setAddPostInput(!addPostInput)}>
                {addPostInput ? 'Cancel Add' : 'Add New Post'}
            </button>

            {addPostInput && (
                <form onSubmit={handleAdd}>
                    <div>
                        <input
                            type="text"
                            placeholder="Title..."
                            value={newPost.title}
                            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                        />
                    </div>
                    <div>
                        <textarea
                            placeholder="Body content..."
                            value={newPost.body}
                            onChange={(e) => setNewPost({ ...newPost, body: e.target.value })}
                        />
                    </div>
                    <button type="submit">Save Post</button>
                </form>
            )}

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
        </div>
    )
}