import React, { createContext, useState, useContext } from 'react'

export const ThemeContext = createContext();

export const ThemeProvider = ( { children } ) => {
    const [darkMode, setDarkMode] = useState(false);

    /*useEffect(() => {
        // Fetch the user's theme preference from the server
        axios.get('http://')
            .then(response => {
                setTheme(response.data.prefers_dark_mode);
            })
            .catch(error => {
                console.error('Error fetching theme: ', error);
            });
    }, []); */

    return (
        <ThemeContext.Provider value={{ darkMode, setDarkMode }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);