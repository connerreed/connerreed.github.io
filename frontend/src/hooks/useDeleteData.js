import { useState } from "react";

import axios from "axios";
import { useError } from "./ErrorContext";

const useDeleteData = (url, authToken = null) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const { addError } = useError();
    // TODO: Push errors to ErrorContext instead of using local state
    // TODO: Remove error state from this hook

    const handleDelete = async (id) => {
        setError("");
        setLoading(true);
        axios
            .delete(`${url}${id}/`, {
                headers: authToken ? { Authorization: `Token ${authToken}` } : {},
            })
            .then(() => {
                //setError("");
                console.log(`Deleted item with id: ${id}`);
            })
            .catch((error) => {
                //setError("Failed to delete");
                addError("Failed to delete item");
                console.error(error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return { loading, error, handleDelete };
};

export default useDeleteData;
