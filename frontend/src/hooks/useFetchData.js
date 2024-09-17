import { useState, useEffect } from 'react';
import axios from 'axios';

const useFetchData = (url, authToken = null) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        let isMounted = true;
        setLoading(true);
        axios
            .get(url, {
                headers: authToken ? { Authorization: `Token ${authToken}` } : {},
            })
            .then((response) => {
                if (isMounted) {
                    setData(response.data);
                }
            })
            .catch((error) => {
                if (isMounted) {
                    setError(error.message);
                }
            })
            .finally(() => {
                if (isMounted) {
                    setLoading(false);
                }
            });
        return () => {
            isMounted = false;
        };
    }, [url, authToken]);

    return { data, loading, error };
}

export default useFetchData;