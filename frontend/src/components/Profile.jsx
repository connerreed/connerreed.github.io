import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import Button from "react-bootstrap/Button";
import { useNavigate } from "react-router-dom";
import backendURL from "../utils/backendURL";
import useApiRequest from "../hooks/useApiRequest";
import Loading from "./Loading";

const Profile = () => {
    const { logout, userData, loading: authTokenLoading } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const { patchData } = useApiRequest();

    const profileApiEndpoint = `${backendURL}/auth/users/me/`;

    const toggleDarkMode = () => {
        const darkMode = theme === "dark";
        const formData = { prefers_dark_mode: !darkMode };
        patchData(profileApiEndpoint, formData);
        toggleTheme();
    };

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <>
            {authTokenLoading && <Loading />}
            {!authTokenLoading && (
                <div className="container">
                    <div className="d-flex flex-column align-items-center col-12">
                        <div>
                            {userData?.first_name && userData?.last_name && (
                                <h1>
                                    {userData?.first_name} {userData?.last_name}
                                </h1>
                            )}
                            {userData?.email && <p>Email: {userData.email}</p>}
                            <Button onClick={handleLogout}>Logout</Button>
                            <Button className="ms-2" onClick={toggleDarkMode}>
                                Toggle Dark Mode
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Profile;
