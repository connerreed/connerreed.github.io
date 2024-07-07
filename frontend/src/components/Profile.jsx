// Profile.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Spinner from "react-bootstrap/Spinner";
import { useNavigate } from "react-router-dom";

const Profile = () => {
    const { authToken, logout } = useAuth();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
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

    const handleLogout = () => {
        logout();
        // Optionally, redirect to login
        navigate("/login");
    };

    if (loading) {
        return (
            <Container className="d-flex justify-content-center align-items-center vh-100">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </Container>
        );
    }

    if (!user) {
        return (
            <Container className="d-flex justify-content-center align-items-center vh-100">
                <p>Loading user data...</p>
            </Container>
        );
    }

    return (
        <Container>
            <h1>{user.first_name} {user.last_name}</h1>
            <p>Email: {user.email}</p>
            <Button onClick={handleLogout}>Logout</Button>
        </Container>
    );
};

export default Profile;
