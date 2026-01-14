import { useState, useEffect } from 'react';
import axios from 'axios';

export const useResource = (resourceName, queryParams = {}) => {
    // 1. originalData: מחזיק את כל המידע שהגיע מהשרת (ה"אמת")
    const [originalData, setOriginalData] = useState([]);
    // 2. data: מחזיק את המידע שמוצג למשתמש (אחרי סינון/מיון)
    const [data, setData] = useState([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const baseUrl = `http://localhost:3000/${resourceName}`;

    // --- A. פונקציה לטעינה מהשרת (תומכת בפגינציה/שרשור) ---
    const fetchData = async (newParams = {}, shouldAppend = false) => {
        setLoading(true);
        try {
            const finalParams = { ...queryParams, ...newParams };
            const res = await axios.get(baseUrl, { params: finalParams });

            if (shouldAppend) {
                // מצב Load More: מוסיפים לסוף הרשימה
                const newData = [...originalData, ...res.data];
                setOriginalData(newData);
                setData(newData); // מעדכנים גם את התצוגה
                return res.data; // מחזירים כדי שהקומפוננטה תדע אם נגמר המידע
            } else {
                // מצב רגיל: מחליפים את הרשימה
                setOriginalData(res.data);
                setData(res.data);
                return res.data;
            }
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    // טעינה ראשונית אוטומטית
    useEffect(() => {
        if (resourceName) fetchData();
    }, [resourceName, JSON.stringify(queryParams)]);

    // --- B. פונקציה לסינון מקומי (Client Side) ---
    // הקומפוננטה שולחת פונקציית בדיקה (callback), ההוק מבצע
    const filterData = (filterFn) => {
        if (!filterFn) {
            setData(originalData); // איפוס: מציגים את המקור
        } else {
            setData(originalData.filter(filterFn)); // סינון על המקור
        }
    };

    // --- C. פונקציות CRUD (מעדכנות את שני המצבים) ---
    const add = async (newItem) => {
        try {
            setLoading(true);
            const res = await axios.post(baseUrl, { ...newItem, ...queryParams });
            const newData = [...originalData, res.data];
            setOriginalData(newData);
            setData(newData); // חשוב לעדכן גם את התצוגה כדי לראות את הפריט מיד
        } catch (err) { setError(err) }
        finally {
            setLoading(false);
        }
    };

    const remove = async (id) => {
        try {
            setLoading(true);
            await axios.delete(`${baseUrl}/${id}`);
            const helper = (list) => list.filter(item => item.id !== id);
            setOriginalData(prev => helper(prev));
            setData(prev => helper(prev));
        } catch (err) { setError(err) }
        finally {
            setLoading(false);
        }
    };

    const update = async (id, updatedFields) => {
        try {
            setLoading(true);
            await axios.patch(`${baseUrl}/${id}`, updatedFields);
            const helper = (list) => list.map(item => item.id === id ? { ...item, ...updatedFields } : item);
            setOriginalData(prev => helper(prev));
            setData(prev => helper(prev));
        } catch (err) { setError(err) }
        finally {
            setLoading(false);
        }
    };

    return {
        data,
        loading,
        error,
        add,
        remove,
        update,
        fetchData,  // לשימוש באלבומים (שרת)
        filterData  // לשימוש בפוסטים וטודוס (מקומי)
    };
};