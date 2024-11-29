import { useState, useEffect } from 'react';
import axios from 'axios';

const useFetchData = (url, authToken = null) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        refreshData();
    }, [url, authToken]);

    const refreshData = () => {
        setLoading(true);
        axios
            .get(url, {
                headers: authToken ? { Authorization: `Token ${authToken}` } : {},
            })
            .then((response) => {
                setData(response.data);
            })
            .catch((error) => {
                setError(error.message);
            })
            .finally(() => {
                setLoading(false);
            });
    }

    return { data, loading, error, refreshData };
}

export default useFetchData;