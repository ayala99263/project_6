import { useState } from 'react';
import PostComments from './PostComments';

export default function PostCard({ post, deletePost, updatePost, currentUser }) {
    const [showPost, setShowPost] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({ title: post.title, body: post.body });

    const handleSave = () => {
        updatePost(editData);
        setIsEditing(false);
    };

    return (
        <div style={{
            border: showPost ? '2px solid #007bff' : '1px solid #ccc',
            backgroundColor: showPost ? '#f0f8ff' : 'white',
            margin: '10px 0',
            padding: '15px',
            borderRadius: '8px',
            transition: 'all 0.3s ease'
        }}>

            <div
                onClick={() => setShowPost(!showPost)}
                style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
                <h3 style={{ margin: 0, fontSize: '1.1rem' }}>
                    #{post.id} - {post.title}
                </h3>
                <span style={{ fontSize: '1.5rem', color: '#888' }}>
                    {showPost ? '−' : '+'}
                </span>
            </div>

            {showPost && (
                <div style={{ marginTop: '15px', borderTop: '1px solid #eee', paddingTop: '10px' }}>

                    {isEditing ? (
                        <div>
                            <input
                                type="text"
                                value={editData.title}
                                onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                                style={{ width: '100%', marginBottom: '10px', padding: '5px' }}
                            />
                            <textarea
                                value={editData.body}
                                onChange={(e) => setEditData({ ...editData, body: e.target.value })}
                                style={{ width: '100%', height: '100px', marginBottom: '10px', padding: '5px' }}
                            />
                            <div>
                                <button onClick={handleSave}>Save</button>
                                <button onClick={() => setIsEditing(false)} style={{ marginLeft: '5px' }}>Cancel</button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <p style={{ lineHeight: '1.5' }}>{post.body}</p>

                            <div style={{ marginTop: '15px' }}>
                                <button onClick={() => setIsEditing(true)}>Edit</button>
                                <button onClick={deletePost} style={{ marginLeft: '5px', color: 'red' }}>Delete</button>

                                <button
                                    onClick={() => setShowComments(!showComments)}
                                    style={{ marginLeft: '10px' }}>
                                    {showComments ? 'Hide Comments' : 'Show Comments'}
                                </button>

                                {showComments && <PostComments postId={post.id} currentUser={currentUser} />}
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}