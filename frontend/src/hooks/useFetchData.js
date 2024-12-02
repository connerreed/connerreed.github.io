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
                let errorMessage = "Error: ";
                if (error.response.status === 404) {
                    errorMessage += "Could not find item(s)";
                } else if (error.response.status === 403) {
                    errorMessage += "Forbidden";
                } else if (error.response.status === 401) {
                    errorMessage += "Unauthorized";
                } else if (error.response.status === 400) {
                    errorMessage += "Bad Request";
                } else if (error.response.status === 500) {
                    errorMessage += "Internal Server Error";
                } else {
                    errorMessage += "An error occurred";
                }
                addError(errorMessage);
                setError(errorMessage);
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
