import axios from "axios";
import { useState, useCallback } from "react";
import { useMessage } from "../contexts/MessageContext";
import { useAuth } from "../contexts/AuthContext";

const useApiRequest = () => {
    const { addError, addSuccessMessage } = useMessage();
    const { authToken } = useAuth();
    const [data, setData] = useState(null);
    const [currentlyLoading, setCurrentlyLoading] = useState(false);

    const fetchData = useCallback(
        (url, onSuccess) => {
            setCurrentlyLoading(true);
            axios
                .get(url, {
                    headers: authToken
                        ? { Authorization: `Token ${authToken}` }
                        : {},
                })
                .then((response) => {
                    setData(response?.data);
                    if (onSuccess) {
                        onSuccess(response?.data);
                    }
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

    const postData = useCallback(
        (url, formData, onSuccess) => {
            setCurrentlyLoading(true);
            axios
                .post(url, formData, {
                    headers: {
                        ...(authToken
                            ? { Authorization: `Token ${authToken}` }
                            : {}),
                        "Content-Type": "multipart/form-data",
                    },
                })
                .then((response) => {
                    setData(response?.data);
                    switch (response?.status) {
                        case 201:
                            setTimeout(() => {
                                addSuccessMessage(
                                    "Item(s) uploaded successfully"
                                );
                            }, 250);
                            break;
                        default:
                            console.error(
                                `An unknown response status was received: ${response?.status}`
                            );
                            break;
                    }
                    if (onSuccess) {
                        onSuccess(response?.data);
                    }
                })
                .catch((error) => {
                    const status = error?.response?.status;
                    let errorMessage = "Error: ";
                    switch (status) {
                        case 403:
                            errorMessage +=
                                "You are not allowed to upload yet.";
                            break;
                        default:
                            errorMessage += "Failed to upload";
                            break;
                    }
                    addError(errorMessage);
                    console.error(error);
                })
                .finally(() => {
                    setCurrentlyLoading(false);
                });
        },
        [authToken, addSuccessMessage, addError]
    );

    const patchData = useCallback(
        (url, formData) => {
            setCurrentlyLoading(true);
            axios
                .patch(url, formData, {
                    headers: {
                        ...(authToken
                            ? { Authorization: `Token ${authToken}` }
                            : {}),
                        "Content-Type": "application/json",
                    },
                })
                .then((response) => {
                    setData(response?.data);
                    switch (response?.status) {
                        case 200:
                            // If the user is updating dark mode, we don't want to show a success message
                            if (formData?.prefers_dark_mode !== undefined) {
                                break;
                            }
                            setTimeout(() => {
                                addSuccessMessage(
                                    "Item(s) updated successfully"
                                );
                            }, 250);
                            break;
                        default:
                            console.error(
                                `An unknown response status was received: ${response?.status}`
                            );
                            break;
                    }
                })
                .catch((error) => {
                    const status = error?.response?.status;
                    let errorMessage = "Error: ";
                    switch (status) {
                        case 403:
                            errorMessage += "Forbidden";
                            break;
                        default:
                            errorMessage += "Failed to update";
                            break;
                    }
                    addError(errorMessage);
                    console.error(error);
                })
                .finally(() => {
                    setCurrentlyLoading(false);
                });
        },
        [addError, addSuccessMessage, authToken]
    );

    const deleteData = useCallback((url, onSuccess) => {
        setCurrentlyLoading(true);
        axios
            .delete(url, {
                headers: authToken
                    ? { Authorization: `Token ${authToken}` }
                    : {},
            }).then((response) => {
                const status = response?.status;
                switch (status) {
                    case 204:
                        addSuccessMessage("Item deleted successfully");
                        break;
                    default:
                        console.error("An unknown response status was received: ", status);
                        break;
                }
                if (onSuccess) {
                    onSuccess();
                }
            }).catch((error) => {
                const status = error?.response?.status;
                let errorMessage = "Error: ";
                switch(status) {
                    case 403:
                        errorMessage += "Forbidden";
                        break;
                    case 404:
                        errorMessage += "Not found";
                        break;
                    default:
                        errorMessage += "Failed to delete";
                        break;
                }
                addError(errorMessage);
            }).finally(() => {
                setCurrentlyLoading(false);
            });
    }, [addError, addSuccessMessage, authToken]);

    return { data, currentlyLoading, fetchData, postData, patchData, deleteData };
};

export default useApiRequest;
