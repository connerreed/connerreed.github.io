import {
    createContext,
    useContext,
    useState,
    useCallback,
    useEffect,
    useRef,
} from "react";
import { v4 as uuidv4 } from "uuid";
import { useLocation } from "react-router-dom";
import "../css/MessageContext.css";
import { Alert } from "react-bootstrap";

const MessageContext = createContext();

export const MessageProvider = ({ children }) => {
    const [messageList, setMessageList] = useState([]);
    const [progress, setProgress] = useState(0);
    const location = useLocation();
    const timerRef = useRef(null);

    useEffect(() => {
        setMessageList([]);
    }, [location]);

    useEffect(() => {
        setMessageList([]);
    }, []);

    const startTimer = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
        }
        setProgress(100);
        timerRef.current = setInterval(() => {
            setProgress((prevProgress) => {
                if (prevProgress <= 0) {
                    clearInterval(timerRef.current);
                    setMessageList([]);
                    return 0;
                }
                return prevProgress - 1;
            });
        }, 50);
    };

    // Not exported to other files
    const addMessage = useCallback((message, variant) => {
        const id = uuidv4();
        setMessageList((prevMessageList) => [
            ...prevMessageList,
            { id, message, variant},
        ]);
        startTimer();
    }, []);

    const addError = useCallback((message) => {
        const variant = "danger";
        addMessage(message, variant);
    }, [addMessage]);

    const addSuccessMessage = useCallback((message) => {
        const variant = "success";
        addMessage(message, variant);
    }, [addMessage]);

    const dismissMessage = useCallback((id) => {
        setMessageList((prevMessageList) => {
            return prevMessageList.filter((message) => message.id !== id);
        });
    }, []);

    return (
        <MessageContext.Provider value={{ addError, addSuccessMessage }}>
            {messageList.length > 0 && (
                <div className={`message-container`}>
                    {messageList.map((msg) => (
                        <Alert
                            key={msg.id}
                            variant={msg.variant}
                            onClose={() => dismissMessage(msg.id)}
                            dismissible
                            className={"fade-in message"}
                        >
                            {msg.message}
                        </Alert>
                    ))}
                    <div className="progress-meter" style={{ width: `${progress}%` }}></div>
                </div>
            )}
            {children}
        </MessageContext.Provider>
    );
};

export const useMessage = () => useContext(MessageContext);
