import { useState } from "react";

import axios from "axios";

const useDeleteData = (url, authToken = null) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
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
                setError("");
                console.log(`Deleted item with id: ${id}`);
            })
            .catch((error) => {
                setError("Failed to delete");
                console.error(error);
            })
            .finally(() => {
                setLoading(false);
            });
        /*try {
            const response = await fetch(`${url}${id}/`, {
                method: "DELETE",
                headers: {
                    Authorization: `Token ${authToken}`,
                },
            });
            if (!response.ok) {
                throw new Error(
                    `Failed to delete item with id: ${id}\n
                    Response: ${response.statusText}`
                );
            } else {
                setError("");
                console.log(`Deleted item with id: ${id}`);
            }
        } catch (error) {
            setError("Failed to delete");
            console.error(error);
        } finally {
            setLoading(false);
        }
            */
    };

    return { loading, error, handleDelete };
};

export default useDeleteData;
