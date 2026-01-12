import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState } from 'react';

export default function Todos() {
    const { id } = useParams();
    const [todos, setTodos] = useState([]);
    const [addTodoInput, setAddTodoInput] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [editTitle, setEditTitle] = useState("");
    const [newTodo, setNewTodo] = useState({
        userId: id,
        title: "",
        completed: false
    });

    const handleChange = (e) => {
        setNewTodo({ ...newTodo, [e.target.name]: e.target.value });
    };

    useEffect(() => {
        getTodos();
    }, []);

    const getTodos = async () => {
        try {
            const res = await axios.get(`http://localhost:3000/todos?userId=${id}`);
            setTodos(res.data);
        }
        catch (err) {
            console.error(err);
        }
    }

    const addTodo = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:3000/todos", newTodo);
            setTodos([...todos, res.data]); 
            setNewTodo({ userId: id, title: "", completed: false });
            setAddTodoInput(false);
        }
        catch (err) {
            console.error(err);
        }
    }

    const updateTodo = async (todoId, updates) => {
        try {
            await axios.patch(`http://localhost:3000/todos/${todoId}`, updates);
            setTodos(todos.map(todo => 
                todo.id === todoId ? { ...todo, ...updates } : todo
            ));
        }
        catch (err) {
            console.error(err);
        }
    }

    const editTodo = async (todoId) => {
        await updateTodo(todoId, { title: editTitle });
        setEditingId(null);
        setEditTitle("");
    }

    const toggleTodo = async (todoId, currentCompleted) => {
        await updateTodo(todoId, { completed: !currentCompleted });
    }

    const startEdit = (todo) => {
        setEditingId(todo.id);
        setEditTitle(todo.title);
    }

    const cancelEdit = () => {
        setEditingId(null);
        setEditTitle("");
    }

    const deleteTodo = async (todoId) => {
        try {
            await axios.delete(`http://localhost:3000/todos/${todoId}`);
            setTodos(todos.filter(todo => todo.id !== todoId)); // מחיקה מקומית
        }
        catch (err) {
            console.error(err);
        }
    }

    return (
        <div>
            <h1>todos</h1>
            <button onClick={() => setAddTodoInput(!addTodoInput)}>add todos</button>
            {addTodoInput && <form onSubmit={addTodo}>
                <input type="text"
                    placeholder="title"
                    name="title"
                    onChange={handleChange}
                    value={newTodo.title} />
                <label htmlFor="completed">complete</label>
                <input type="checkbox"
                    name='completed'
                    onChange={(e) => setNewTodo({...newTodo, completed: e.target.checked})}
                    checked={newTodo.completed} />
                <button type="submit">add</button>
            </form>}

            <div>
                {todos.map(todo => (
                    <div key={todo.id}>
                        <input 
                            type="checkbox" 
                            checked={todo.completed} 
                            onChange={() => toggleTodo(todo.id, todo.completed)}
                        />
                        {editingId === todo.id ? (
                            <>
                                <input 
                                    type="text" 
                                    value={editTitle} 
                                    onChange={(e) => setEditTitle(e.target.value)}
                                />
                                <button onClick={() => editTodo(todo.id)}>Save</button>
                                <button onClick={cancelEdit}>Cancel</button>
                            </>
                        ) : (
                            <>
                                <span>{todo.title}</span>
                                <button onClick={() => startEdit(todo)}>Edit</button>
                            </>
                        )}
                        <button onClick={() => deleteTodo(todo.id)}>Delete</button>
                    </div>
                ))}
            </div>

        </div>
    )
}