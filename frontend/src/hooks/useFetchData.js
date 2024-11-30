import { useState, useEffect, useCallback } from "react";
import axios from "axios";

const useFetchData = (url, authToken = null) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const refreshData = useCallback(() => {
        setLoading(true);
        axios
            .get(url, {
                headers: authToken
                    ? { Authorization: `Token ${authToken}` }
                    : {},
            })
            .then((response) => {
                //console.log(` Fetch Response: ${response}`);
                setData(response.data);
            })
            .catch((error) => {
                setError(error.message);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [url, authToken]);

    useEffect(() => {
        refreshData();
    }, [url, authToken, refreshData]);

    return { data, loading, error, refreshData };
};

export default useFetchData;
