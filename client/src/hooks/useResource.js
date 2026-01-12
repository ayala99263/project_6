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

    const add = async (newItem) => {
        try {
            // טריק חשוב: אנחנו מוסיפים את ה-userId לאובייקט באופן אוטומטי!
            const itemToSend = userId ? { ...newItem, userId } : newItem;
            
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