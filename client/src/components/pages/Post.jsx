// const [addPostInput, setAddPostInput] = useState(false);
// const [newPost, setNewPost] = useState({
//     userId: id,
//     title: "",
//     body: ""
// });

// const handleChange = (e) => {
//     setNewPost({ ...newPost, [e.target.name]: e.target.value });
// };



// const addPost = async (e) => {
//     e.preventDefault();
//     try {
//         const res = await axios.post("http://localhost:3000/posts", newTodo);
//         setPosts([...todos, res.data]);
//         setNewPost({ userId: id, title: "", completed: false });
//         setAddPostInput(false);
//     }
//     catch (err) {
//         console.error(err);
//     }
// }

// const togglePost = async (PostId, currentCompleted) => {  //עדכון
//     try {
//         await axios.patch(`http://localhost:3000/todos/${todoId}`, updatedTodo);
//         setTodos(todos.map(todo =>
//             todo.id === todoId ? { ...todo, completed: !currentCompleted } : todo
//         ));
//     }
//     catch (err) {
//         console.error(err);
//     }
// }



// return (
//     <div>
//         <h1>post</h1>
//        

//         <div>
//             {todos.map(todo => (
//                 <div key={todo.id}>
//                     <input
//                         type="checkbox"
//                         checked={todo.completed}
//                         onChange={() => toggleTodo(todo.id, todo.completed)}
//                     />
//                     <span>{todo.title}</span>
//                     <button onClick={() => deleteTodo(todo.id)}>Delete</button>
//                 </div>
//             ))}
//         </div>

//     </div>
// )
import { useState } from 'react';

export default function Post({ post, setPosts }) {
    const [showPost, setShowPost] = useState(false);

    const deletePost = async (postId) => {
        try {
            await axios.delete(`http://localhost:3000/Posts/${postId}`);
            setPosts(Posts.filter(post => post.id !== postId));
        }
        catch (err) {
            console.error(err);
        }
    }

    return (<>
        <p>post.id</p>
        <p onClick={setShowPost(!showPost)}>post.title</p>
        showPost &&(
        <p>post.body</p>
        <button onClick={() => deletePost(post.id)}>Delete</button>)

    </>)
}