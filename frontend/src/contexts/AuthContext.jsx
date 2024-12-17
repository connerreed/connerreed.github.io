import {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback,
} from "react";
import { useTheme } from "./ThemeContext";
import axios from "axios";
import { useMessage } from "./MessageContext";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authToken, setAuthToken] = useState(
        localStorage.getItem("authToken")
    );
    const [userData, setUserData] = useState(null);
    const { setDarkMode } = useTheme();
    const setToken = (token) => {
        setAuthToken(token);
        localStorage.setItem("authToken", token);
    };
    const { addError, addSuccessMessage } = useMessage();

    const logout = useCallback(() => {
        setAuthToken(null);
        localStorage.removeItem("authToken");
        setDarkMode(false);
        setUserData(null);
        addSuccessMessage("Logged out successfully.");
    }, [setDarkMode, addSuccessMessage]);

    const updateUser = useCallback(() => {
        axios
            .get(`${process.env.REACT_APP_API_BASE_URL}/auth/users/me/`, {
                headers: { Authorization: `Token ${authToken}` },
            })
            .then((response) => {
                setDarkMode(response?.data?.prefers_dark_mode);
                localStorage.setItem(
                    "darkMode",
                    response?.data?.prefers_dark_mode
                );
                setUserData(response?.data);
            })
            .catch((error) => {
                let errorMessage = "";
                if (error?.response?.status === 401) {
                    logout();
                    errorMessage = "Session expired. Please login again.";
                } else {
                    console.error("User fetch error: ", error);
                    errorMessage = "Failed to fetch user data.";
                }
                addError(errorMessage);
            });
    }, [authToken, setDarkMode, logout, addError]);

    useEffect(() => {
        if (authToken) {
            updateUser();
        }
    }, [authToken, updateUser]);

    return (
        <AuthContext.Provider
            value={{ authToken, login: setToken, logout, userData, updateUser }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
