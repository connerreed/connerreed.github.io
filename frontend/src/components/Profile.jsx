import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import backendURL from "../utils/backendURL";

const Profile = () => {
    const { logout, userData, authToken } = useAuth();
    const { darkMode, setDarkMode } = useTheme();
    const navigate = useNavigate();

    const profileApiEndpoint = `${backendURL}/auth/users/me/`;

    const toggleDarkMode = async () => {
        setDarkMode(!darkMode);
        try {
            await axios.patch(
                profileApiEndpoint,
                { prefers_dark_mode: !darkMode },
                {
                    headers: { Authorization: `Token ${authToken}` },
                }
            );
        } catch (error) {
            console.error("Failed to update dark mode preference: ", error);
        }
    };

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <div>
            <h1>
                {userData?.first_name} {userData?.last_name}
            </h1>
            <p>Email: {userData?.email}</p>
            <Button onClick={handleLogout}>Logout</Button>
            <Button onClick={toggleDarkMode}>Toggle Dark Mode</Button>
        </div>
    );
};

export default Profile;
