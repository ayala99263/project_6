import axios from 'axios';
import { useState, useEffect } from 'react';
import PostComments from './PostComments';
import './PostCard.css';
import { useUser } from '../../context/UserContext';

export default function PostCard({ post, deletePost, updatePost, author }) {
    const { currentUser } = useUser();
    const [showPost, setShowPost] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({ title: post.title, body: post.body });

    const handleSave = () => {
        updatePost(editData);
        setIsEditing(false);
    };

    const handleDelete = async () => {
        try {
            const res = await axios.get(`http://localhost:3000/comments?postId=${post.id}`);
            const comments = res.data;
            await Promise.all(comments.map(c =>
                axios.delete(`http://localhost:3000/comments/${c.id}`)
            ));
            deletePost();
        } catch (err) {
            console.error(err);
        }
    }

    const getAvatarColor = (name) => {
        const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4'];
        const index = name.charCodeAt(0) % colors.length;
        return colors[index];
    };

    const firstLetter = author?.name?.charAt(0).toUpperCase() || '?';

    return (
        <div className="post-card">
            <div className="post-header" onClick={() => setShowPost(!showPost)}>
                <span className="post-id">#{post.id}</span>
                <div className="post-header-content">
                    {author && (
                        <div className="post-author">
                            <div className="post-avatar" style={{ background: getAvatarColor(author.name) }}>
                                {firstLetter}
                            </div>
                            <span className="post-author-name">{author.name}</span>
                        </div>
                    )}
                    <h3 className="post-title">{post.title}</h3>
                </div>
                <span className="post-toggle">{showPost ? '−' : '+'}</span>
            </div>

            {showPost && (
                <div className="post-content">
                    {isEditing ? (
                        <div className="post-edit-form">
                            <input
                                type="text"
                                value={editData.title}
                                onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                            />
                            <textarea
                                value={editData.body}
                                onChange={(e) => setEditData({ ...editData, body: e.target.value })}
                            />
                            <div className="post-actions">
                                <button className="post-btn save" onClick={handleSave}>Save</button>
                                <button className="post-btn cancel" onClick={() => setIsEditing(false)}>Cancel</button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <p className="post-body">{post.body}</p>

                            <div className="post-actions">
                                {post.userId == currentUser.id && (
                                    <>
                                        <button className="post-btn edit" onClick={() => setIsEditing(true)}>Edit</button>
                                        <button className="post-btn delete" onClick={handleDelete}>Delete</button>
                                    </>
                                )}
                                <button className="post-btn comments" onClick={() => setShowComments(!showComments)}>
                                    {showComments ? 'Hide Comments' : 'Show Comments'}
                                </button>
                            </div>

                            {showComments && <PostComments postId={post.id} />}
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
