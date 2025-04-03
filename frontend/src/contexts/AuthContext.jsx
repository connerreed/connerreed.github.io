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
import backendURL from "../utils/backendURL";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authToken, setAuthToken] = useState(
        localStorage.getItem("authToken")
    );
    const [userData, setUserData] = useState(null);
    const { theme, toggleTheme } = useTheme();
    const setToken = (token) => {
        setAuthToken(token);
        localStorage.setItem("authToken", token);
    };
    const { addError, addSuccessMessage } = useMessage();

    const logout = useCallback(() => {
        setAuthToken(null);
        localStorage.removeItem("authToken");
        if (theme === "dark") {
            toggleTheme();
        }
        setUserData(null);
        addSuccessMessage("Logged out successfully.");
    }, [theme, toggleTheme, addSuccessMessage]);

    const updateUser = useCallback(() => {
        const profileApiEndpoint = `${backendURL}/auth/users/me/`;
        axios
            .get(
                profileApiEndpoint,
                {
                    headers: { Authorization: `Token ${authToken}` },
                }
            )
            .then((response) => {
                const prefersDarkMode = response?.data?.prefers_dark_mode;
                if ((prefersDarkMode && theme === "light") || (!prefersDarkMode && theme === "dark")) {
                    toggleTheme();
                }
                setUserData(response?.data);
            })
            .catch((error) => {
                const status = error?.response?.status;
                let errorMessage = "";
                if (status === 401) {
                    logout();
                    errorMessage = "Session expired. Please login again.";
                } else {
                    console.error("User fetch error: ", error);
                    errorMessage = "Something went wrong.";
                }
                addError(errorMessage);
            });
    }, [authToken, theme, toggleTheme, logout, addError]);

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
