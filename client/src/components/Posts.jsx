import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Post from "./Post";


export default function Posts() {

    const [posts, setPosts] = useState([]);
    const { id } = useParams();

    useEffect(() => {
        getPosts();
    }, []);

    const getPosts = async () => {
        try {
            const res = await axios.get(`http://localhost:3000/posts?userId=${id}`);
            setPosts(res.data);
        }
        catch (err) {
            console.error(err);
        }
    }

    return (
        <div>
            <h1>Posts</h1>
            <div>
                {posts.map(post => (
                    <div key={post.id}>
                        <Post post={post} setPOsts={setPOsts} />
                    </div>
                ))}
            </div>
        </div>
    )
}