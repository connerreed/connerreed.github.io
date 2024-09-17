import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useTheme } from "./ThemeContext";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authToken, setAuthToken] = useState(
        localStorage.getItem("authToken")
    );
    const [userData, setUserData] = useState(null);
    const { setDarkMode } = useTheme();
    const login = (token) => {
        setAuthToken(token);
        localStorage.setItem("authToken", token);
    };

    const logout = () => {
        setAuthToken(null);
        localStorage.removeItem("authToken");
        setDarkMode(false);
        setUserData(null);
    };

    const updateUser = useCallback(async () => {
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_API_BASE_URL}/auth/users/me/`,
                {
                    headers: { Authorization: `Token ${authToken}` },
                }
            );
            setDarkMode(response.data.prefers_dark_mode);
            localStorage.setItem("darkMode", response.data.prefers_dark_mode);
            setUserData(response.data);
        } catch (error) {
            if (error.response && error.response.status === 401) {
                logout();
            } else {
                console.error("User fetch error: ", error);
            }
        }
    }, [authToken, setDarkMode, logout]);

    useEffect(() => {
        if (authToken) {
            updateUser();
        }
    }, [authToken, updateUser]);

    return (
        <AuthContext.Provider value={{ authToken, login, logout, userData, updateUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
