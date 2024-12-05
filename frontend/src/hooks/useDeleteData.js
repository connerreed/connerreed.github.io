import axios from "axios";
import { useMessage } from "../contexts/MessageContext";

const useDeleteData = (url, authToken = null) => {
    const { addError, addSuccessMessage } = useMessage();
    // TODO: Remove authToken from function signature and instead get it from authContext
    const handleDelete = (id) => {
        axios
            .delete(`${url}${id}/`, {
                headers: authToken
                    ? { Authorization: `Token ${authToken}` }
                    : {},
            })
            .then((response) => {
                let status = response?.status;
                switch (status) {
                    case 204:
                        console.log(`Deleted item with id: ${id}`);
                        addSuccessMessage("Item deleted successfully");
                        break;
                    default:
                        console.error(
                            `On delete of item id ${id}, an unknown response status was received: ${status}`
                        );
                }
            })
            .catch((error) => {
                addError("Error: Failed to delete item");
                console.error(error);
            });
    };

    return { handleDelete };
};

export default useDeleteData;
