import { useState, useEffect } from 'react';
import axios from 'axios';

export const useResource = (resourceName, queryParams = {}) => {
    const [originalData, setOriginalData] = useState([]);
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
                const newData = [...originalData, ...res.data];
                setOriginalData(newData);
                setData(newData);
                return res.data;
            } else {
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

    useEffect(() => {
        if (resourceName) fetchData();
    }, [resourceName, JSON.stringify(queryParams)]);

    const filterData = (filterFn) => {
        if (!filterFn) {
            setData(originalData);
        } else {
            setData(originalData.filter(filterFn));
        }
    };

    const add = async (newItem) => {
        try {
            setLoading(true);
            const res = await axios.post(baseUrl, { ...newItem, ...queryParams });
            const newData = [...originalData, res.data];
            setOriginalData(newData);
            setData(newData);
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
        fetchData,
        filterData
    };
};
