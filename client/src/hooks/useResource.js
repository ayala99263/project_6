import { useState, useEffect } from 'react';
import axios from 'axios';

// ההוק מקבל את שם המשאב ואובייקט של פרמטרים לסינון
export const useResource = (resourceName, queryParams = {}) => {
    const [data, setData] = useState([]);

    const baseUrl = `http://localhost:3000/${resourceName}`;

    useEffect(() => {
        if (!resourceName) return;

        // הגדרת הפונקציה בתוך ה-useEffect כדי למנוע בעיות תלות
        const fetchData = async () => {
            try {
                // שליחה לשרת עם הסינון (למשל ?userId=1)
                const res = await axios.get(baseUrl, { params: queryParams });
                setData(res.data);
            } catch (err) {
                console.error("Error fetching data:", err);
            }
        };

        fetchData();

        // 1. resourceName: אם עוברים מ-todos ל-posts, חייבים לטעון מחדש
        // 2. JSON.stringify(queryParams): אם הסינון משתנה (למשל עברנו אלבום), טוענים מחדש.
        // אם ה-userId קבוע ולא משתנה, הערך הזה נשאר זהה והאפקט לא ירוץ סתם.
    }, [resourceName, JSON.stringify(queryParams)]);

    // הוספה (Create)
    const add = async (newItem) => {
        try {
            // מיזוג הפריט החדש עם הפרמטרים (למשל הוספת userId באופן אוטומטי)
            const itemToSend = { ...newItem, ...queryParams };
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