import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useEffect, useState } from 'react';

export default function Todos() {
    const { id } = useParams();
    const [todos, setTodos] = useState([]);
    const [addTodoInput, setAddTodoInput] = useState(false);
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
    }, [id]);

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

    const toggleTodo = async (todoId, currentCompleted) => {
        try {
            const updatedTodo = { completed: !currentCompleted };
            await axios.patch(`http://localhost:3000/todos/${todoId}`, updatedTodo);
            setTodos(todos.map(todo => 
                todo.id === todoId ? { ...todo, completed: !currentCompleted } : todo
            ));
        }
        catch (err) {
            console.error(err);
        }
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
                        <span>{todo.title}</span>
                        <button onClick={() => deleteTodo(todo.id)}>Delete</button>
                    </div>
                ))}
            </div>

        </div>
    )
}