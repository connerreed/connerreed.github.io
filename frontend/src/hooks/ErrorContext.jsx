import {
    createContext,
    useContext,
    useState,
    useCallback,
    useEffect,
} from "react";
import ErrorMessage from "../components/ErrorMessage";
import { useLocation } from "react-router-dom";
import "../css/ErrorContext.css";

const ErrorContext = createContext();

export const ErrorProvider = ({ children }) => {
    const [errorList, setErrorList] = useState([]);

    const location = useLocation();

    useEffect(() => {
        setErrorList([]);
    }, [location]);

    const addError = useCallback((message) => {
        setErrorList((prevErrorList) => [...prevErrorList, message]);
    }, []);

    const dismissError = useCallback((index) => {
        setErrorList((prevErrorList) =>
            prevErrorList.filter((_, i) => i !== index)
        );
    }, []);

    return (
        <ErrorContext.Provider value={{ addError }}>
            {errorList.length > 0 && (
                <div className="error-container">
                    {errorList.map((message, index) => (
                        <ErrorMessage
                            key={index}
                            message={message}
                            onClose={() => dismissError(index)}
                        />
                    ))}
                </div>
            )}
            {children}
        </ErrorContext.Provider>
    );
};

export const useError = () => useContext(ErrorContext);
