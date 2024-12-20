import axios from "axios";
import { useState, useCallback } from "react";
import { useMessage } from "../contexts/MessageContext";
import { useAuth } from "../contexts/AuthContext";

const useFetchData = () => {
    const { addError } = useMessage();
    const { authToken } = useAuth();
    const [data, setData] = useState(null);
    const [currentlyLoading, setCurrentlyLoading] = useState(false);

    const fetchData = useCallback(
        (url) => {
            setCurrentlyLoading(true);
            axios
                .get(url, {
                    headers: authToken
                        ? { Authorization: `Token ${authToken}` }
                        : {},
                })
                .then((response) => {
                    setData(response?.data);
                    console.log("Data fetched successfully");
                })
                .catch((error) => {
                    const status = error?.response?.status;
                    let errorMessage = "Error: ";
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
                            errorMessage += "An error has occurred";
                            break;
                    }
                    addError(errorMessage);
                })
                .finally(() => {
                    setCurrentlyLoading(false);
                });
        },
        [authToken, addError]
    );

    return { fetchData, data, currentlyLoading };
};

export default useFetchData;
