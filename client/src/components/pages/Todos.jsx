import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useResource } from '../../hooks/useResource';

export default function Todos() {
    const { id } = useParams();
    
    // 2. שימוש בהוק כדי לקבל את המידע והפונקציות
    // אנחנו שולחים 'todos' ואת ה-id של המשתמש
    const { data: todos, add, remove, update } = useResource('todos', id);

    // --- משתני UI בלבד (לא קשורים לשרת) ---
    const [addTodoInput, setAddTodoInput] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [editTitle, setEditTitle] = useState("");
    
    // ניהול הטופס של הוספה חדשה
    const [newTodo, setNewTodo] = useState({
        title: "",
        completed: false
    });

    const handleChange = (e) => {
        setNewTodo({ ...newTodo, [e.target.name]: e.target.value });
    };

    // --- פונקציות מעטפת (Wrappers) ---
    // הפונקציות האלו קוראות להוק, ואז מסדרות את התצוגה (מאפסות טופס וכו')

    const handleAdd = async (e) => {
        e.preventDefault();
        // ה-Hook כבר יודע להוסיף את ה-userId לבד!
        await add(newTodo); 
        
        // איפוס הטופס וסגירתו
        setNewTodo({ title: "", completed: false });
        setAddTodoInput(false);
    };

    const handleSaveEdit = async (todoId) => {
        await update(todoId, { title: editTitle });
        setEditingId(null);
        setEditTitle("");
    };

    // פונקציות UI פשוטות
    const startEdit = (todo) => {
        setEditingId(todo.id);
        setEditTitle(todo.title);
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditTitle("");
    };

    return (
        <div>
            <h1>todos</h1>
            <button onClick={() => setAddTodoInput(!addTodoInput)}>add todos</button>
            
            {addTodoInput && <form onSubmit={handleAdd}>
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
                            // שימוש ישיר בפונקציית העדכון מההוק
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
                                <button onClick={cancelEdit}>Cancel</button>
                            </>
                        ) : (
                            <>
                                <span style={{ textDecoration: todo.completed ? 'line-through' : 'none' }}>
                                    {todo.title}
                                </span>
                                <button onClick={() => startEdit(todo)}>Edit</button>
                            </>
                        )}
                        {/* שימוש ישיר בפונקציית המחיקה מההוק */}
                        <button onClick={() => remove(todo.id)}>Delete</button>
                    </div>
                ))}
            </div>
        </div>
    )
}