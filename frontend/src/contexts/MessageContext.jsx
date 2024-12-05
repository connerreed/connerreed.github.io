import {
    createContext,
    useContext,
    useState,
    useCallback,
    useEffect,
} from "react";
import { v4 as uuidv4 } from "uuid";
import { useLocation } from "react-router-dom";
import "../css/MessageContext.css";
import { Alert } from "react-bootstrap";

const MessageContext = createContext();

export const MessageProvider = ({ children }) => {
    const [messageList, setMessageList] = useState([]);
    const location = useLocation();

    useEffect(() => {
        setMessageList([]);
    }, [location]);

    useEffect(() => {
        setMessageList([]);
    }, []);

    // Not exported to other files
    const addMessage = (message, variant) => {
        const id = uuidv4();
        setMessageList((prevMessageList) => [
            ...prevMessageList,
            { id, message, variant },
        ]);
    };

    const addError = useCallback((message) => {
        const variant = "danger";
        addMessage(message, variant);
    }, []);

    const addSuccessMessage = useCallback((message) => {
        const variant = "success";
        addMessage(message, variant);
    }, []);

    const dismissMessage = useCallback((id) => {
        setMessageList((prevErrorList) => {
            return prevErrorList.filter((error) => error.id !== id);
        });
    }, []);

    return (
        <MessageContext.Provider value={{ addError, addSuccessMessage }}>
            {messageList.length > 0 && (
                <div className="message-container">
                    {messageList.map((error) => (
                        <Alert
                            key={error.id}
                            variant={error.variant}
                            onClose={() => dismissMessage(error.id)}
                            dismissible
                        >
                            {error.message}
                        </Alert>
                    ))}
                </div>
            )}
            {children}
        </MessageContext.Provider>
    );
};

export const useMessage = () => useContext(MessageContext);
