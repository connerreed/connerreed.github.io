import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useMessage } from "./MessageContext";

const useFetchData = (url, authToken = null) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const { addError} = useMessage();

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
                let status = error?.response?.status;
                switch (status) {
                    case 404:
                        errorMessage += "Could not find item(s)";
                        break;
                    case 403:
                        errorMessage += "Forbidden";
                        break;
                    case 401:
                        errorMessage += "Unauthorized";
                        break;
                    case 400:
                        errorMessage += "Bad Request";
                        break;
                    case 500:
                        errorMessage += "Internal Server Error";
                        break;
                    default:
                        errorMessage += "An error occurred";
                        break;
                }
                addError(errorMessage);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [url, authToken, addError]);

    useEffect(() => {
        // Automatically fetch data when url or authToken changes
        refreshData();
    }, [url, authToken, refreshData]);

    return { data, loading, refreshData };
};

export default useFetchData;
