import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useResource } from '../hooks/useResource';

export default function Todos() {
    const { id } = useParams(); // ה-ID של המשתמש מה-URL

    // קריאה להוק: "תביא לי todos ששייכים ל-userId הזה"
    const { data: todos, add, remove, update } = useResource('todos', { userId: id });

    // --- State מקומי לניהול ה-UI בלבד ---
    const [addTodoInput, setAddTodoInput] = useState(false);
    const [newTodoTitle, setNewTodoTitle] = useState(""); // שומרים רק את הכותרת, ה-ID יתווסף לבד
    const [editingId, setEditingId] = useState(null);
    const [editTitle, setEditTitle] = useState("");

    // --- פונקציות טיפול (Handlers) ---

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!newTodoTitle) return;

        // אנחנו שולחים רק כותרת וסטטוס. ה-Hook יוסיף את ה-userId אוטומטית!
        await add({ title: newTodoTitle, completed: false });
        
        setNewTodoTitle("");
        setAddTodoInput(false);
    };

    const handleSaveEdit = async (todoId) => {
        await update(todoId, { title: editTitle });
        setEditingId(null);
        setEditTitle("");
    };

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

            <div className="list">
                {todos.map(todo => (
                    <div key={todo.id} className="todo-item" style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
                        
                        {/* Checkbox - מעדכן ישירות דרך ההוק */}
                        <input 
                            type="checkbox" 
                            checked={todo.completed} 
                            onChange={() => update(todo.id, { completed: !todo.completed })}
                        />

                        {editingId === todo.id ? (
                            // מצב עריכה
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
                                    {todo.title}
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