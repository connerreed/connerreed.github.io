import { useState, useEffect, useCallback } from "react";
import useApiRequest from "./useApiRequest";

const useFetchPagedData = (url, pageSize = 12) => {
    const [appendedData, setAppendedData] = useState([]);
    const [nextPageUrl, setNextPageUrl] = useState(null);
    const [idToTriggerNextFetch, setIdToTriggerNextFetch] = useState(null);
    const { fetchData, currentlyLoading: loading } = useApiRequest();
    const [atMaxPage, setAtMaxPage] = useState(false);

    const appendNextPage = useCallback(() => {
        if (atMaxPage || !nextPageUrl) return;
        fetchData(nextPageUrl, (res) => {
            setAppendedData((prev) => [...prev, ...(res?.results || [])]);
            if (res?.results?.length) {
                const mid = Math.floor(res.results.length / 2);
                setIdToTriggerNextFetch(res.results[mid]?.id);
            }
            if (!res?.next) {
                setAtMaxPage(true);
            } else {
                setNextPageUrl(res.next);
            }
        });
    }, [fetchData, nextPageUrl, atMaxPage]);

    const initializeData = useCallback(() => {
        setAppendedData([]);
        setIdToTriggerNextFetch(null);
        setNextPageUrl(`${url}?page=1&page_size=${pageSize}`);
        setAtMaxPage(false);
    }, [url, pageSize]);

    useEffect(() => {
        // When url changes, reset to the first page, but do not fetch automatically
        initializeData();
    }, [url, initializeData]);

    return {
        data: appendedData,
        loading,
        idToTriggerNextFetch,
        initializeData,
        appendNextPage,
    };
};

export default useFetchPagedData;
