import { useState, useMemo } from 'react';

export const useSearch = (data, strategies) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [searchBy, setSearchBy] = useState(Object.keys(strategies)[0]);

    const filteredData = useMemo(() => {
        if (!searchTerm) return data;

        return data.filter((item) => {
            const strategy = strategies[searchBy];
            const val = searchTerm.toLowerCase();
            
            if (strategy) {
                return strategy(item, val);
            }
            return true;
        });
    }, [data, searchTerm, searchBy, strategies]);

    return {
        filteredData,
        searchTerm,
        setSearchTerm,
        searchBy,
        setSearchBy,
        searchOptions: Object.keys(strategies)
    };
};