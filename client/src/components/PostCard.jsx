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
        <div>

            <div
                onClick={() => setShowPost(!showPost)}
            >
                <h3>
                    #{post.id} - {post.title}
                </h3>
                <span>
                    {showPost ? '−' : '+'}
                </span>
            </div>

            {showPost && (
                <div>

                    {isEditing ? (
                        <div>
                            <input
                                type="text"
                                value={editData.title}
                                onChange={(e) => setEditData({ ...editData, title: e.target.value })}
                            />
                            <textarea
                                value={editData.body}
                                onChange={(e) => setEditData({ ...editData, body: e.target.value })}
                            />
                            <div>
                                <button onClick={handleSave}>Save</button>
                                <button onClick={() => setIsEditing(false)}>Cancel</button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <p>{post.body}</p>

                            <div>
                                {post.userId == currentUser.id && (<>
                                    <button onClick={() => setIsEditing(true)}>Edit</button>
                                    <button onClick={deletePost}>Delete</button>
                                </>)}
                                <button
                                    onClick={() => setShowComments(!showComments)}
                                >
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
