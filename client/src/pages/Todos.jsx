import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useResource } from '../hooks/useResource';
import DataViewer from '../components/DataViewer';
import './Todos.css';

export default function Todos() {
    const { id } = useParams();

    const { data: todos, add, remove, update, filterData, error, loading } = useResource('todos', { userId: id });

    const [addTodoInput, setAddTodoInput] = useState(false);
    const [newTodoTitle, setNewTodoTitle] = useState("");

    const [editingId, setEditingId] = useState(null);
    const [editTitle, setEditTitle] = useState("");

    const [sortBy, setSortBy] = useState("none");

    const [searchTerm, setSearchTerm] = useState("");
    const [searchBy, setSearchBy] = useState("title");

    useEffect(() => {
        if (!searchTerm) {
            filterData(null);
        } else {
            filterData(todo => {
                const val = searchTerm.toLowerCase();
                switch (searchBy) {
                    case 'id':
                        return todo.id.toString().includes(val);
                    case 'title':
                        return todo.title.toLowerCase().includes(val);
                    case 'status':
                        if (val === 'completed') return todo.completed;
                        if (val === 'not completed') return !todo.completed;
                        return false;
                    default:
                        return true;
                }
            });
        }
    }, [searchTerm, searchBy]);

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!newTodoTitle) return;
        await add({ title: newTodoTitle, completed: false });
        setNewTodoTitle("");
        setAddTodoInput(false);
        setSearchTerm("")
    };

    const handleSaveEdit = async (todoId) => {
        await update(todoId, { title: editTitle });
        setEditingId(null);
        setEditTitle("");
    };

    const getSortedTodos = () => {
        if (!sortBy || sortBy === "none") return todos;

        return [...todos].sort((a, b) => {
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

    return (
        <div className="todos-container">
            <div className="todos-controls">
                <div className="control-group">
                    <label>Sort by:</label>
                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                        <option value="none">None</option>
                        <option value="completed">Completed</option>
                        <option value="not-completed">Not Completed</option>
                        <option value="id">ID</option>
                        <option value="title">Title</option>
                    </select>
                </div>

                <div className="control-group">
                    <label>Search by:</label>
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
                    <button className="clear-btn" onClick={() => setSearchTerm("")}>Clear</button>
                </div>
            </div>

            <div className="todos-header">
                <button 
                    className={`add-todo-btn ${addTodoInput ? 'cancel' : ''}`}
                    onClick={() => setAddTodoInput(!addTodoInput)}
                >
                    {addTodoInput ? 'Cancel' : 'Add New Todo'}
                </button>

                {addTodoInput && (
                    <form className="add-todo-form" onSubmit={handleAdd}>
                        <input
                            type="text"
                            placeholder="Enter todo title..."
                            value={newTodoTitle}
                            onChange={(e) => setNewTodoTitle(e.target.value)}
                        />
                        <button type="submit">Save</button>
                    </form>
                )}
            </div>

            <DataViewer loading={loading} error={error} data={todos}>
                <div className="todos-list">
                    {getSortedTodos().map(todo => (
                        <div key={todo.id} className="todo-item">
                            <span className="todo-id">#{todo.id}</span>
                            <input
                                type="checkbox"
                                className="todo-checkbox"
                                checked={todo.completed}
                                onChange={() => update(todo.id, { completed: !todo.completed })}
                            />

                            {editingId === todo.id ? (
                                <>
                                    <input
                                        type="text"
                                        className="todo-edit-input"
                                        value={editTitle}
                                        onChange={(e) => setEditTitle(e.target.value)}
                                    />
                                    <div className="todo-actions">
                                        <button className="todo-btn save" onClick={() => handleSaveEdit(todo.id)}>Save</button>
                                        <button className="todo-btn cancel" onClick={() => setEditingId(null)}>Cancel</button>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <span className={`todo-content ${todo.completed ? 'completed' : ''}`}>
                                        {todo.title}
                                    </span>
                                    <div className="todo-actions">
                                        <button className="todo-btn edit" onClick={() => {
                                            setEditingId(todo.id);
                                            setEditTitle(todo.title);
                                        }}>Edit</button>
                                        <button className="todo-btn delete" onClick={() => remove(todo.id)}>Delete</button>
                                    </div>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </DataViewer>
        </div>
    );
}