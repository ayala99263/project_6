import { useState, useEffect } from 'react';
import axios from 'axios';

// הוספנו פרמטר שני: generalId (שהוא אופציונלי, למקרה שאין משתמש)
export const useResource = (resourceName, generalId = null) => {
    const [data, setData] = useState([]);

    const baseUrl = `http://localhost:3000/${resourceName}`;

    // הוספנו את generalId לרשימת התלויות, כדי שאם המשתמש מתחלף - הנתונים יתרעננו
    useEffect(() => {
        if (resourceName) getAll();
    }, [resourceName, generalId]);

    const getAll = async () => {
        try {
            // אם יש generalId, אנחנו מוסיפים אותו לסינון ב-URL
            // התוצאה תהיה: http://localhost:3000/todos?generalId=5
            const url = generalId ? `${baseUrl}?generalId=${generalId}` : baseUrl;
            
            const res = await axios.get(url);
            setData(res.data);
        } catch (err) { console.error(err); }
    };

    const add = async (newItem) => {
        try {
            // טריק חשוב: אנחנו מוסיפים את ה-generalId לאובייקט באופן אוטומטי!
            const itemToSend = generalId ? { ...newItem, generalId } : newItem;
            
            const res = await axios.post(baseUrl, itemToSend);
            setData([...data, res.data]);
        } catch (err) { console.error(err); }
    };

    // מחיקה ועדכון נשארים אותו דבר, כי הם עובדים לפי ה-ID של הפריט עצמו
    const remove = async (id) => {
        try {
            await axios.delete(`${baseUrl}/${id}`);
            setData(data.filter(item => item.id !== id));
        } catch (err) { console.error(err); }
    };

    const update = async (id, updatedFields) => {
        try {
            const res = await axios.patch(`${baseUrl}/${id}`, updatedFields);
            setData(data.map(item => item.id === id ? { ...item, ...updatedFields } : item));
        } catch (err) { console.error(err); }
    };

    return { data, add, remove, update };
};