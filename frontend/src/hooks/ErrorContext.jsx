import {
    createContext,
    useContext,
    useState,
    useCallback,
    useEffect,
} from "react";
import { v4 as uuidv4 } from "uuid";
//import ErrorMessage from "../components/ErrorMessage";
import { useLocation } from "react-router-dom";
import "../css/ErrorContext.css";
import { Alert } from "react-bootstrap";

const ErrorContext = createContext();

export const ErrorProvider = ({ children }) => {
    const [errorList, setErrorList] = useState([]);
    const location = useLocation();

    useEffect(() => {
        setErrorList([]);
    }, [location]);

    useEffect(() => {
        setErrorList([]);
    }, []);

    const addError = useCallback((message) => {
        const id = uuidv4();
        setErrorList((prevErrorList) => [...prevErrorList, { id, message }]);
    }, []);

    const dismissError = useCallback((id) => {
        setErrorList((prevErrorList) => {
            return prevErrorList.filter((error) => error.id !== id);
        });
    }, []);

    const variant = "danger"; // TODO: Abstract this to allow success messages as well

    return (
        <ErrorContext.Provider value={{ addError }}>
            {errorList.length > 0 && (
                <div className="error-container">
                    {errorList.map((error) => (
                        <Alert
                            key={error.id}
                            variant= {variant}
                            onClose={() => dismissError(error.id)}
                            dismissible
                        >
                            {error.message}
                        </Alert>
                    ))}
                </div>
            )}
            {children}
        </ErrorContext.Provider>
    );
};

export const useError = () => useContext(ErrorContext);
