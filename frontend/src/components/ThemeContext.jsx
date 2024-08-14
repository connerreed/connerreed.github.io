import React, { createContext, useState, useEffect } from 'react'
import axios from 'axios';

export const ThemeContext = createContext();

export const ThemeProvider = ( { children } ) => {
    const [theme, setTheme] = useState('light');

    const toggleTheme = () => {
        setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');

        // Save then new theme preference to the server
        axios.put('http://', { theme: theme })
            .catch(error => {
                console.error('Error saving theme: ', error);
            });
    };

    useEffect(() => {
        // Fetch the user's theme preference from the server
        axios.get('http://')
            .then(response => {
                setTheme(response.data.theme);
            })
            .catch(error => {
                console.error('Error fetching theme: ', error);
            });
    }, []);

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};