//import { useState } from "react";

import axios from "axios";
import { useError } from "./ErrorContext";

const useDeleteData = (url, authToken = null) => {
    const { addError } = useError();

    const handleDelete = async (id) => {
        axios
            .delete(`${url}${id}/`, {
                headers: authToken ? { Authorization: `Token ${authToken}` } : {},
            })
            .then(() => {
                console.log(`Deleted item with id: ${id}`);
            })
            .catch((error) => {
                addError("Error: Failed to delete item");
                console.error(error);
            });
    };

    return { handleDelete };
};

export default useDeleteData;
