import { useState, useEffect } from 'react';
import axios from 'axios';

// הוספנו פרמטר שני: userId (שהוא אופציונלי, למקרה שאין משתמש)
export const useResource = (resourceName, userId = null) => {
    const [data, setData] = useState([]);

    const baseUrl = `http://localhost:3000/${resourceName}`;

    // הוספנו את userId לרשימת התלויות, כדי שאם המשתמש מתחלף - הנתונים יתרעננו
    useEffect(() => {
        if (resourceName) getAll();
    }, [resourceName, userId]);

    const getAll = async () => {
        try {
            // אם יש userId, אנחנו מוסיפים אותו לסינון ב-URL
            // התוצאה תהיה: http://localhost:3000/todos?userId=5
            const url = userId ? `${baseUrl}?userId=${userId}` : baseUrl;
            
            const res = await axios.get(url);
            setData(res.data);
        } catch (err) { console.error(err); }
    };

        fetchData();

        // 1. resourceName: אם עוברים מ-todos ל-posts, חייבים לטעון מחדש
        // 2. JSON.stringify(queryParams): אם הסינון משתנה (למשל עברנו אלבום), טוענים מחדש.
        // אם ה-userId קבוע ולא משתנה, הערך הזה נשאר זהה והאפקט לא ירוץ סתם.
    }, [resourceName, JSON.stringify(queryParams)]);

    // הוספה (Create)
    const add = async (newItem) => {
        try {
            // טריק חשוב: אנחנו מוסיפים את ה-userId לאובייקט באופן אוטומטי!
            const itemToSend = userId ? { ...newItem, userId } : newItem;
            
            const res = await axios.post(baseUrl, itemToSend);
            setData(prevData => [...prevData, res.data]); // עדכון יעיל של ה-State
        } catch (err) {
            console.error("Error adding item:", err);
        }
    };

    // עדכון (Update / Patch)
    const update = async (id, updatedFields) => {
        try {
            const res = await axios.patch(`${baseUrl}/${id}`, updatedFields);
            // החלפת הפריט הישן בחדש בתוך המערך
            setData(prevData => prevData.map(item => 
                item.id === id ? { ...item, ...updatedFields } : item
            ));
        } catch (err) {
            console.error("Error updating item:", err);
        }
    };

    // מחיקה (Delete)
    const remove = async (id) => {
        try {
            await axios.delete(`${baseUrl}/${id}`);
            // הסרת הפריט מהמערך
            setData(prevData => prevData.filter(item => item.id !== id));
        } catch (err) {
            console.error("Error deleting item:", err);
        }
    };

    return { data, add, remove, update };
};