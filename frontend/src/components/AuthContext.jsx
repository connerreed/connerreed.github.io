import { createContext, useContext, useState, useEffect } from "react";
import { useTheme } from "./ThemeContext";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [authToken, setAuthToken] = useState(localStorage.getItem("authToken"));
    const { prefersDarkMode, setPrefersDarkMode } = useTheme();
    const login = (token) => {
        setAuthToken(token);
        localStorage.setItem("authToken", token);
    };

    const logout = () => {
        setAuthToken(null);
        localStorage.removeItem("authToken");
        setPrefersDarkMode(false);
    };

    useEffect(() => {
        // Optionally, add any side effects here
    }, [authToken]);

    return (
        <AuthContext.Provider value={{ authToken, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
