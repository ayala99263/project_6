import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useResource } from '../hooks/useResource';
import DataViewer from '../components/DataViewer';

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
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
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

            <DataViewer loading={loading} error={error} data={todos}>
                <div className="list">
                    {getSortedTodos().map(todo => (
                        <div key={todo.id} className="todo-item">
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
                                <>
                                    <span>
                                        #{todo.id} - {todo.title}
                                    </span>
                                    <button onClick={() => {
                                        setEditingId(todo.id);
                                        setEditTitle(todo.title);
                                    }}>Edit</button>

                                    <button onClick={() => remove(todo.id)}>
                                        Delete
                                    </button>
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </DataViewer>
        </div>
    );
}