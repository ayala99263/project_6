import { useState } from 'react';
import { useResource } from '../hooks/useResource';

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

    return (
        <div style={{ marginTop: '15px', padding: '15px', backgroundColor: '#f8f9fa', borderTop: '1px solid #dee2e6' }}>
            <h4 style={{ margin: '0 0 10px 0', fontSize: '1rem' }}>Comments</h4>

            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {comments.length === 0 && <li style={{ color: '#777' }}>No comments yet.</li>}
                
                {comments.map(comment => {
                    const isOwner = comment.email === currentUser.email;

                    return (
                        <li key={comment.id} style={{ marginBottom: '10px', paddingBottom: '10px', borderBottom: '1px solid #eee' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <span style={{ fontWeight: 'bold', fontSize: '0.85rem', color: '#555' }}>
                                    {comment.email}
                                </span>
                                
                                {isOwner && !editingId && (
                                    <div style={{ fontSize: '0.8rem' }}>
                                        <button onClick={() => startEdit(comment)} style={{ marginRight: '5px', color: 'blue', border: 'none', background: 'none', cursor: 'pointer' }}>Edit</button>
                                        <button onClick={() => remove(comment.id)} style={{ color: 'red', border: 'none', background: 'none', cursor: 'pointer' }}>Delete</button>
                                    </div>
                                )}
                            </div>

                            {editingId === comment.id ? (
                                <div style={{ marginTop: '5px' }}>
                                    <textarea 
                                        value={editBody}
                                        onChange={(e) => setEditBody(e.target.value)}
                                        style={{ width: '100%', padding: '5px' }}
                                    />
                                    <div style={{ marginTop: '5px' }}>
                                        <button onClick={() => saveEdit(comment.id)}>Save</button>
                                        <button onClick={() => setEditingId(null)} style={{ marginLeft: '5px' }}>Cancel</button>
                                    </div>
                                </div>
                            ) : (
                                <p style={{ margin: '5px 0', fontSize: '0.95rem' }}>{comment.body}</p>
                            )}
                        </li>
                    );
                })}
            </ul>

            <div style={{ marginTop: '15px', display: 'flex', gap: '8px' }}>
                <input 
                    type="text" 
                    placeholder="Write a comment..." 
                    value={newCommentBody}
                    onChange={(e) => setNewCommentBody(e.target.value)}
                    style={{ flexGrow: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                />
                <button 
                    onClick={handleAddComment}
                    disabled={!newCommentBody}
                    style={{ padding: '8px 15px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                >
                    Send
                </button>
            </div>
        </div>
    );
}