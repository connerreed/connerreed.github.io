import { useState, useEffect, useCallback } from "react";
import useFetchData from "./useFetchData";

const useFetchPagedData = (url, authToken = null, pageSize = 12) => {
    const [appendedData, setAppendedData] = useState([]);
    const [maxDataCount, setMaxDataCount] = useState(0);
    const [pageNumber, setPageNumber] = useState(1);
    const [idToTriggerNextFetch, setIdToTriggerNextFetch] = useState(null);
    const { fetchData, currentlyLoading: loading } = useFetchData();

    const appendPage = useCallback(
        (page) => {
            const pageUrl = `${url}?page=${page}&page_size=${pageSize}`;
            fetchData(pageUrl, (res) => {
                if (page === 1) {
                    setAppendedData(res?.results || []);
                } else {
                    setAppendedData((prev) => [...prev, ...(res?.results || [])]);
                }
                if (res?.results?.length) {
                    const mid = Math.floor(res.results.length / 2);
                    setIdToTriggerNextFetch(res.results[mid]?.id);
                }
                if (typeof res?.count === "number") {
                    setMaxDataCount(res.count);
                }
            });
        },
        [fetchData, pageSize, url]
    );

    const appendNextPage = useCallback(() => {
        const maxPage = Math.ceil(maxDataCount / pageSize);
        if (pageNumber > maxPage) return;
        appendPage(pageNumber);
        setPageNumber((prev) => prev + 1);
    }, [pageNumber, maxDataCount, pageSize, appendPage]);

    const initializeData = useCallback(() => {
        setAppendedData([]);
        setPageNumber(1);
        setIdToTriggerNextFetch(null);
        appendPage(1);
        setPageNumber(2);
    }, [appendPage]);

    useEffect(() => {
        initializeData();
    }, [url, authToken, initializeData]);

    return {
        data: appendedData,
        loading,
        idToTriggerNextFetch,
        initializeData,
        appendNextPage,
    };
};

export default useFetchPagedData;