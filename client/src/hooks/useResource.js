import { useState, useEffect } from 'react';
import axios from 'axios';

export const useResource = (resourceName, queryParams = {}) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const baseUrl = `http://localhost:3000/${resourceName}`;

    const fetchData = async (newParams = {}, shouldAppend = false) => {
        setLoading(true);
        try {
            const finalParams = { ...queryParams, ...newParams };
            const res = await axios.get(baseUrl, { params: finalParams });

            if (shouldAppend) {
                setData(prev => [...prev, ...res.data]);
            } else {
                setData(res.data);
            }
            return res.data;
        } catch (err) {
            setError(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (resourceName) fetchData();
    }, [resourceName, JSON.stringify(queryParams)]);

    const add = async (newItem) => {
        try {
            setLoading(true);
            const res = await axios.post(baseUrl, { ...newItem, ...queryParams });
            setData(prev => [...prev, res.data]);
        } catch (err) { setError(err) }
        finally { setLoading(false); }
    };

    const remove = async (id) => {
        try {
            setLoading(true);
            await axios.delete(`${baseUrl}/${id}`);
            setData(prev => prev.filter(item => item.id !== id));
        } catch (err) { setError(err) }
        finally { setLoading(false); }
    };

    const update = async (id, updatedFields) => {
        try {
            setLoading(true);
            await axios.patch(`${baseUrl}/${id}`, updatedFields);
            setData(prev => prev.map(item => item.id === id ? { ...item, ...updatedFields } : item));
        } catch (err) { setError(err) }
        finally { setLoading(false); }
    };

    return { data, loading, error, add, remove, update, fetchData };
};