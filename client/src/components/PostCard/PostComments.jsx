import { useState } from 'react';
import { useResource } from '../../hooks/useResource';
import './PostCard.css';

export default function PostComments({ postId, currentUser }) {
    const { data: comments, add, remove, update } = useResource('comments', { postId });
    const [newCommentBody, setNewCommentBody] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [editBody, setEditBody] = useState("");

    const handleAddComment = async () => {
        if (!newCommentBody) return;
        const commentData = {
            body: newCommentBody,
            email: currentUser.email,
            name: currentUser.name || currentUser.username
        };
        await add(commentData);
        setNewCommentBody("");
    };

    const startEdit = (comment) => {
        setEditingId(comment.id);
        setEditBody(comment.body);
    };

    const saveEdit = async (commentId) => {
        await update(commentId, { body: editBody });
        setEditingId(null);
    };

    const getAvatarColor = (name) => {
        const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4'];
        const index = name.charCodeAt(0) % colors.length;
        return colors[index];
    };

    return (
        <div className="comments-section">
            <h4 className="comments-title">Comments</h4>

            <ul className="comments-list">
                {comments.length === 0 && <li className="no-comments">No comments yet.</li>}

                {comments.map(comment => {
                    const isOwner = comment.email === currentUser.email;
                    const firstLetter = comment.name?.charAt(0).toUpperCase() || comment.email?.charAt(0).toUpperCase() || '?';

                    return (
                        <li key={comment.id} className="comment-item">
                            <div className="comment-header">
                                <div className="comment-user">
                                    <div className="comment-avatar" style={{ background: getAvatarColor(comment.name || comment.email) }}>
                                        {firstLetter}
                                    </div>
                                    <span className="comment-email">{comment.email}</span>
                                </div>

                                {isOwner && (!editingId || editingId !== comment.id) && (
                                    <div className="comment-actions">
                                        <button className="comment-btn edit" onClick={() => startEdit(comment)}>Edit</button>
                                        <button className="comment-btn delete" onClick={() => remove(comment.id)}>Delete</button>
                                    </div>
                                )}
                            </div>

                            {editingId === comment.id ? (
                                <div className="comment-edit-form">
                                    <textarea
                                        value={editBody}
                                        onChange={(e) => setEditBody(e.target.value)}
                                    />
                                    <div className="comment-actions">
                                        <button className="comment-btn save" onClick={() => saveEdit(comment.id)}>Save</button>
                                        <button className="comment-btn cancel" onClick={() => setEditingId(null)}>Cancel</button>
                                    </div>
                                </div>
                            ) : (
                                <p className="comment-body">{comment.body}</p>
                            )}
                        </li>
                    );
                })}
            </ul>

            <div className="comment-add">
                <input
                    type="text"
                    placeholder="Write a comment..."
                    value={newCommentBody}
                    onChange={(e) => setNewCommentBody(e.target.value)}
                />
                <button onClick={handleAddComment} disabled={!newCommentBody}>
                    Send
                </button>
            </div>
        </div>
    );
}
