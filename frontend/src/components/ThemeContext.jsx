import React, { createContext, useState, useContext, useEffect } from 'react'
export const ThemeContext = createContext();

export const ThemeProvider = ( { children } ) => {
    const [darkMode, setDarkMode] = useState((localStorage.getItem('darkMode') === 'true') || false);

    useEffect(() => {
        localStorage.setItem('darkMode', darkMode);
    }, [darkMode]);

    return (
        <ThemeContext.Provider value={{ darkMode, setDarkMode }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);