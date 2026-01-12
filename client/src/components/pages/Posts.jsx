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

    const addPost = async (e) => {
        e.preventDefault();
        //     try {
        //         const res = await axios.post("http://localhost:3000/posts", newTodo);
        //         setPosts([...todos, res.data]);
        //         setNewPost({ userId: id, title: "", completed: false });
        //         setAddPostInput(false);
        //     }
        //     catch (err) {
        //         console.error(err);
        //     }
    }

    return (
        <div>
            <h1>Posts</h1>
            <button onClick={() => setAddTodoInput(!addTodoInput)}>add todos</button>
            {addPostInput && <form onSubmit={addPost}>
                <input type="text"
                    placeholder="title"
                    name="title"
                    onChange={handleChange}
                    value={newTodo.title} />
                <label htmlFor="completed">complete</label>
                <input type="checkbox"
                    name='completed'
                    onChange={(e) => setNewTodo({ ...newTodo, completed: e.target.checked })}
                    checked={newTodo.completed} />
                <button type="submit">add</button>
            </form>}
            <div>
                {posts.map(post => (
                    <div key={post.id}>
                        <Post post={post} setPosts={setPosts} />
                    </div>
                ))}
            </div>
        </div>
    )
}