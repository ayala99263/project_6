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
        <div>
            <h4>Comments</h4>

            <ul>
                {comments.length === 0 && <li>No comments yet.</li>}

                {comments.map(comment => {
                    const isOwner = comment.email === currentUser.email;

                    return (
                        <li key={comment.id}>
                            <div>
                                <span>
                                    {comment.email}
                                </span>

                                {isOwner && (!editingId || editingId !== comment.id) && (
                                    <div>
                                        <button onClick={() => startEdit(comment)}>Edit</button>
                                        <button onClick={() => remove(comment.id)}>Delete</button>
                                    </div>
                                )}
                            </div>

                            {editingId === comment.id ? (
                                <div>
                                    <textarea
                                        value={editBody}
                                        onChange={(e) => setEditBody(e.target.value)}
                                    />
                                    <div>
                                        <button onClick={() => saveEdit(comment.id)}>Save</button>
                                        <button onClick={() => setEditingId(null)}>Cancel</button>
                                    </div>
                                </div>
                            ) : (
                                <p>{comment.body}</p>
                            )}
                        </li>
                    );
                })}
            </ul>

            <div>
                <input
                    type="text"
                    placeholder="Write a comment..."
                    value={newCommentBody}
                    onChange={(e) => setNewCommentBody(e.target.value)}
                />
                <button
                    onClick={handleAddComment}
                    disabled={!newCommentBody}
                >
                    Send
                </button>
            </div>
        </div>
    );
}
