import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";
import { useMessage } from "../contexts/MessageContext";

const usePostData = (url) => {
    const { authToken } = useAuth();
    const [loading, setLoading] = useState(false);
    const { addError, addSuccessMessage } = useMessage();
    const navigate = useNavigate();

    const postData = (formData) => {
        setLoading(true);

        axios
            .post(url, formData, {
                headers: {
                    Authorization: `Token ${authToken}`,
                    "Content-Type": "multipart/form-data",
                },
            })
            .then((response) => {
                let status = response?.status;
                switch (status) {
                    case 201:
                        console.log("Item created successfully");
                        
                        // Weird setup for the success message because the messages get cleared on location change
                        navigate("/pictures");
                        setTimeout(() => {
                            addSuccessMessage("Item(s) uploaded successfully");
                        }, 250);
                        break;
                    default:
                        console.error(
                            `An unknown response status was received: ${status}`
                        );
                        break;
                }
            })
            .catch((error) => {
                addError("Error: Failed to upload item");
                console.error(error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return { postData, loading };
};

export default usePostData;
