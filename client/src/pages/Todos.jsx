import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useResource } from '../hooks/useResource';

export default function Todos() {
    const { id } = useParams();

    // קריאה להוק: "תביא לי todos ששייכים ל-userId הזה"
    const { data: todos, add, remove, update, loading, error } = useResource('todos', { userId: id });

    // --- State מקומי לניהול ה-UI בלבד ---
    const [addTodoInput, setAddTodoInput] = useState(false);
    const [newTodoTitle, setNewTodoTitle] = useState("");
    const [editingId, setEditingId] = useState(null);
    const [editTitle, setEditTitle] = useState("");
    const [sortBy, setSortBy] = useState("none");
    const [searchTerm, setSearchTerm] = useState("");
    const [searchBy, setSearchBy] = useState("title");

    // --- פונקציות טיפול (Handlers) ---

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!newTodoTitle) return;

        await add({ title: newTodoTitle, completed: false });

        setNewTodoTitle("");
        setAddTodoInput(false);
    };

    const handleSaveEdit = async (todoId) => {
        await update(todoId, { title: editTitle });
        setEditingId(null);
        setEditTitle("");
    };

    const sortTodos = (sortBy) => {
        setSortBy(sortBy);
    }

    const getFilteredAndSortedTodos = () => {
        let filtered = todos;

        // Filter by search term
        if (searchTerm) {
            filtered = todos.filter(todo => {
                switch (searchBy) {
                    case 'id':
                        return todo.id.toString().includes(searchTerm);
                    case 'title':
                        return todo.title.toLowerCase().includes(searchTerm.toLowerCase());
                    case 'status':
                        const term = searchTerm.toLowerCase();
                        if (term === 'completed') return todo.completed;
                        if (term === 'not completed') return !todo.completed;
                        return false;
                    default:
                        return true;
                }
            });
        }


        if (!sortBy || sortBy === "none") return filtered;

        return [...filtered].sort((a, b) => {
            switch (sortBy) {
                case 'completed':
                    return b.completed - a.completed;
                case 'not-completed':
                    return a.completed - b.completed;
                case 'id':
                    return a.id - b.id;
                case 'title':
                    return a.title.localeCompare(b.title);
                default:
                    return 0;
            }
        });
    }

    if (loading) return <h2 style={{ textAlign: 'center' }}>Loading posts... ⏳</h2>;
    if (error) return <h2 style={{ textAlign: 'center', color: 'red' }}>Error: {error.message} ⚠️</h2>;

    return (
        <div className="todos-container">
            <h1>Todos List</h1>

            <button onClick={() => setAddTodoInput(!addTodoInput)}>
                {addTodoInput ? 'Cancel Add' : 'Add New Todo'}
            </button>

            {addTodoInput && (
                <form onSubmit={handleAdd}>
                    <input
                        type="text"
                        placeholder="Title..."
                        value={newTodoTitle}
                        onChange={(e) => setNewTodoTitle(e.target.value)}
                    />
                    <button type="submit">Save</button>
                </form>
            )}

            <div className='sort'>
                sort by:
                <select value={sortBy} onChange={(e) => sortTodos(e.target.value)}>
                    <option value="none">none</option>
                    <option value="completed">completed</option>
                    <option value="not-completed">not completed</option>
                    <option value="id">id</option>
                    <option value="title">title</option>
                </select>

            </div>

            <div className='search'>
                Search by:
                <select value={searchBy} onChange={(e) => setSearchBy(e.target.value)}>
                    <option value="title">Title</option>
                    <option value="id">ID</option>
                    <option value="status">Status</option>
                </select>
                <input
                    type="text"
                    placeholder={`Search by ${searchBy}...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button onClick={() => setSearchTerm("")}>Clear</button>
            </div>

            <div className="list">
                {getFilteredAndSortedTodos().map(todo => (
                    <div key={todo.id} className="todo-item" style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>


                        <input
                            type="checkbox"
                            checked={todo.completed}
                            onChange={() => update(todo.id, { completed: !todo.completed })}
                        />

                        {editingId === todo.id ? (

                            <>
                                <input
                                    type="text"
                                    value={editTitle}
                                    onChange={(e) => setEditTitle(e.target.value)}
                                />
                                <button onClick={() => handleSaveEdit(todo.id)}>Save</button>
                                <button onClick={() => setEditingId(null)}>Cancel</button>
                            </>
                        ) : (
                            // מצב תצוגה רגיל
                            <>

                                <span style={{ textDecoration: todo.completed ? 'line-through' : 'none', margin: '0 10px' }}>
                                    #{todo.id} - {todo.title}
                                </span>
                                <button onClick={() => {
                                    setEditingId(todo.id);
                                    setEditTitle(todo.title);
                                }}>Edit</button>

                                <button onClick={() => remove(todo.id)} style={{ marginLeft: '5px', color: 'red' }}>
                                    Delete
                                </button>
                            </>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}