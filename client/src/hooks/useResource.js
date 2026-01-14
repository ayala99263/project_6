// import { useState, useEffect } from 'react';
// import axios from 'axios';

// // ההוק מקבל את שם המשאב ואובייקט של פרמטרים לסינון
// export const useResource = (resourceName, queryParams = {}) => {
//     const [data, setData] = useState([]);

//     const baseUrl = `http://localhost:3000/${resourceName}`;

//     useEffect(() => {
//         if (!resourceName) return;

//         // הגדרת הפונקציה בתוך ה-useEffect כדי למנוע בעיות תלות
//         const fetchData = async () => {
//             try {
//                 // שליחה לשרת עם הסינון (למשל ?userId=1)
//                 const res = await axios.get(baseUrl, { params: queryParams });
//                 setData(res.data);
//             } catch (err) {
//                 console.error("Error fetching data:", err);
//             }
//         };

//         fetchData();

//         // 1. resourceName: אם עוברים מ-todos ל-posts, חייבים לטעון מחדש
//         // 2. JSON.stringify(queryParams): אם הסינון משתנה (למשל עברנו אלבום), טוענים מחדש.
//         // אם ה-userId קבוע ולא משתנה, הערך הזה נשאר זהה והאפקט לא ירוץ סתם.
//     }, [resourceName, JSON.stringify(queryParams)]);

//     // הוספה (Create)
//     const add = async (newItem) => {
//         try {
//             // מיזוג הפריט החדש עם הפרמטרים (למשל הוספת userId באופן אוטומטי)
//             const itemToSend = { ...newItem, ...queryParams };
//             const res = await axios.post(baseUrl, itemToSend);
//             setData(prevData => [...prevData, res.data]); // עדכון יעיל של ה-State
//         } catch (err) {
//             console.error("Error adding item:", err);
//         }
//     };

//     // עדכון (Update / Patch)
//     const update = async (id, updatedFields) => {
//         try {
//             const res = await axios.patch(`${baseUrl}/${id}`, updatedFields);
//             // החלפת הפריט הישן בחדש בתוך המערך
//             setData(prevData => prevData.map(item => 
//                 item.id === id ? { ...item, ...updatedFields } : item
//             ));
//         } catch (err) {
//             console.error("Error updating item:", err);
//         }
//     };

//     // מחיקה (Delete)
//     const remove = async (id) => {
//         try {
//             await axios.delete(`${baseUrl}/${id}`);
//             // הסרת הפריט מהמערך
//             setData(prevData => prevData.filter(item => item.id !== id));
//         } catch (err) {
//             console.error("Error deleting item:", err);
//         }
//     };

//     return { data, add, remove, update };
// };

import { useState, useEffect } from 'react';
import axios from 'axios';

export const useResource = (resourceName, queryParams = {}) => {
    const [data, setData] = useState([]);
    
    // שינוי 1: הוספנו State לטעינה ושגיאות (בונוס מומלץ)
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const baseUrl = `http://localhost:3000/${resourceName}`;

    // שינוי 2: הפונקציה fetchData הוגדרה בנפרד (לא בתוך ה-useEffect)
    // היא מקבלת פרמטרים חדשים ואופציה לשרשור (shouldAppend)
    const fetchData = async (newParams = {}, shouldAppend = false) => {
        setLoading(true);
        try {
            // מיזוג פרמטרים: מה שהוגדר בהתחלה + מה שביקשו עכשיו (למשל עמוד 2)
            const finalParams = { ...queryParams, ...newParams };
            
            const res = await axios.get(baseUrl, { params: finalParams });
            
            // שינוי 3: הלוגיקה הקריטית - החלפה או הוספה?
            if (shouldAppend) {
                setData(prev => [...prev, ...res.data]); // הוספה לסוף
            } else {
                setData(res.data); // החלפה מלאה (התנהגות רגילה)
            }
            return res.data;
        } catch (err) {
            setError(err);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // שינוי 4: ה-useEffect קורא ל-fetchData
    // מכיוון שלא העברנו פרמטרים, shouldAppend הוא false (ברירת מחדל)
    // לכן זה עובד רגיל עבור Todos ו-Posts
    useEffect(() => {
        if (resourceName) {
            fetchData();
        }
    }, [resourceName, JSON.stringify(queryParams)]);

    // --- הפונקציות הישנות נשארו ללא שינוי ---
    const add = async (newItem) => {
        try {
            const itemToSend = { ...newItem, ...queryParams };
            const res = await axios.post(baseUrl, itemToSend);
            setData(prev => [...prev, res.data]);
        } catch (err) { console.error(err); }
    };

    const update = async (id, updatedFields) => {
        try {
            await axios.patch(`${baseUrl}/${id}`, updatedFields);
            setData(prev => prev.map(item => item.id === id ? { ...item, ...updatedFields } : item));
        } catch (err) { console.error(err); }
    };

    const remove = async (id) => {
        try {
            await axios.delete(`${baseUrl}/${id}`);
            setData(prev => prev.filter(item => item.id !== id));
        } catch (err) { console.error(err); }
    };

    // שינוי 5: מחזירים גם את fetchData ואת loading החוצה
    return { data, add, remove, update, fetchData, loading, error };
};