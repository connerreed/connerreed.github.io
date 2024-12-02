import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useError } from "./ErrorContext";

const useFetchData = (url, authToken = null) => {
    // TODO: If components don't need error state, remove it from this hook
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const { addError } = useError();

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
                addError("Here's a new error message!");
                setError(error.message);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [url, authToken, addError]);

    useEffect(() => {
        refreshData();
    }, [url, authToken, refreshData]);

    return { data, loading, error, refreshData };
};

export default useFetchData;
