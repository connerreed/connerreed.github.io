import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useMessage } from "../contexts/MessageContext";

const useFetchData = (url, authToken = null) => {
    const [data, setData] = useState(null);
    const [maxDataCount, setMaxDataCount] = useState(0);
    const [pageNumber, setPageNumber] = useState(1);
    const [idToTriggerNextFetch, setIdToTriggerNextFetch] = useState(null);
    const [loading, setLoading] = useState(false);
    const { addError } = useMessage();

    const pageSize = 12;

    const fetchData = useCallback((page) => {
        setLoading(true);
        axios
            .get(`${url}?page=${page}&page_size=${pageSize}`, {
                headers: authToken
                    ? { Authorization: `Token ${authToken}` }
                    : {},
            })
            .then((response) => {
                setData((prevData) => {
                    if (page === 1) {
                        setMaxDataCount(response?.data?.count);
                        return response?.data?.results;
                    }
                    return [...prevData, ...response?.data?.results];
                });
                setPageNumber((prevPageNumber) => prevPageNumber + 1);
                setIdToTriggerNextFetch(
                    response?.data?.results[
                        response?.data?.results.length / 2 - 1
                    ]?.id
                );
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
                console.log("Fetch completed");
                setLoading(false);
            });
    }, [url, authToken, addError]);

    const appendNextPage = useCallback(() => {
        const maxPage = Math.ceil(maxDataCount / pageSize);
        if (pageNumber > maxPage) return;
        fetchData(pageNumber);
    }, [fetchData, pageNumber, maxDataCount]);

    const initializeData = useCallback(() => {
        setData(null);
        setPageNumber(1);
        setIdToTriggerNextFetch(null);
        const pageNumber = 1;
        fetchData(pageNumber);
    }, [fetchData]);

    useEffect(() => {
        // Automatically fetch data when url or authToken changes
        initializeData();
    }, [url, authToken, initializeData]);

    return {
        data,
        loading,
        idToTriggerNextFetch,
        initializeData,
        appendNextPage,
        pageSize,
    };
};

export default useFetchData;
