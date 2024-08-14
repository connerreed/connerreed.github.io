import React, { createContext, useState, useEffect, useContext } from 'react'
import axios from 'axios';

export const ThemeContext = createContext();

export const ThemeProvider = ( { children } ) => {
    const [prefersDarkMode, setPrefersDarkMode] = useState(false);

    const toggleTheme = () => {
        setPrefersDarkMode(!prefersDarkMode);

        // Save then new theme preference to the server
        axios.put('http://', { prefers_dark_mode: prefersDarkMode })
            .catch(error => {
                console.error('Error saving theme: ', error);
            });
    };

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
        <ThemeContext.Provider value={{ prefersDarkMode, setPrefersDarkMode }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);