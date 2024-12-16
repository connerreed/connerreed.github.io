import React from "react";
import { useAuth } from "../contexts/AuthContext";
import { useTheme } from "../contexts/ThemeContext";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Profile = () => {
    const { logout, userData, authToken } = useAuth();
    const { darkMode, setDarkMode } = useTheme();
    //const [user, setUser] = useState(null);
    //const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const toggleDarkMode = async () => {
        setDarkMode(!darkMode);
        try {
            await axios.patch(
                `${process.env.REACT_APP_API_BASE_URL}/auth/users/me/`,
                { prefers_dark_mode: !darkMode },
                {
                    headers: { Authorization: `Token ${authToken}` },
                }
            );
        } catch (error) {
            console.error("Failed to update dark mode preference: ", error);
        }
    };

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

    if (!userData) { // FIXME: on login this shows up briefly
        return (
            <Container className="d-flex justify-content-center align-items-center vh-100">
                <p>Something went wrong when loading user data...</p>
            </Container>
        );
    }

    return (
        <div>
            <h1>
                {userData.first_name} {userData.last_name}
            </h1>
            <p>Email: {userData.email}</p>
            <Button onClick={handleLogout}>Logout</Button>
            <Button onClick={toggleDarkMode}>Toggle Dark Mode</Button>
        </div>
    );
};

export default Profile;
