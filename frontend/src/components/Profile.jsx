//import React, { useState, useEffect } from "react";
//import axios from "axios";
import { useAuth } from "./AuthContext";
import { useTheme } from "./ThemeContext";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
//import Spinner from "react-bootstrap/Spinner";
import { useNavigate } from "react-router-dom";

const Profile = () => {
    const { logout, userData } = useAuth();
    const { darkMode, setDarkMode } = useTheme();
    //const [user, setUser] = useState(null);
    //const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    /*useEffect(() => {
        const fetchUser = async () => {
            setLoading(true);
            try {
                const response = await axios.get("http://127.0.0.1:8000/auth/users/me/", {
                    headers: { Authorization: `Token ${authToken}` },
                });
                setUser(response.data);
            } catch (error) {
                console.error("User fetch error: ", error);
            } finally {
                setLoading(false);
            }
        };

        if (authToken) {
            fetchUser();
        }
    }, [authToken]);
    */

    const handleLogout = () => {
        logout();
        // Optionally, redirect to login
        navigate("/login");
    };

    /*if (loading) {
        return (
            <Container className="d-flex justify-content-center align-items-center vh-100">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </Container>
        );
    }
    */

    if (!userData) {
        return (
            <Container className="d-flex justify-content-center align-items-center vh-100">
                <p>Something went wrong when loading user data...</p>
            </Container>
        );
    }

    return (
        <div>
            <h1>{userData.first_name} {userData.last_name}</h1>
            <p>Email: {userData.email}</p>
            <Button onClick={handleLogout}>Logout</Button>
            <Button onClick={() => {
                setDarkMode(!darkMode)
                //alert(prefersDarkMode)
            }}>Toggle Dark Mode</Button>
        </div>
    );
};

export default Profile;
