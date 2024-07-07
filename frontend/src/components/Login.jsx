// Login.jsx
import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "./AuthContext";
import { useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Spinner from "react-bootstrap/Spinner";
import { Link } from "react-router-dom";

const Login = () => {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const response = await axios.post(
                "http://127.0.0.1:8000/auth/token/login/",
                { email, password }
            );
            login(response.data.auth_token);
            setEmail("");
            setPassword("");
            navigate("/profile"); // Navigate to profile page after login
        } catch (error) {
            handleAxiosError(error);
        } finally {
            setLoading(false);
        }
    };

    const handleAxiosError = (error) => {
        if (axios.isAxiosError(error)) {
            if (error.response) {
                setError(
                    "Login failed: " +
                        (error.response.data.detail || "Invalid credentials")
                );
            } else if (error.request) {
                setError("Login failed: No response from server");
            } else {
                setError("Login failed: " + error.message);
            }
        } else {
            setError("Login failed: An unexpected error occurred");
        }
    };

    if (loading) {
        return (
            <Container
                className="d-flex justify-content-center align-items-center"
                style={{ height: "100vh" }}
            >
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </Container>
        );
    }

    return (
        <>
            <h1 className="text-center">Login</h1>
            <Container className="d-flex justify-content-center align-items-center">
                <Form className="w-50" onSubmit={handleSubmit}>
                    {error && <div className="alert alert-danger">{error}</div>}
                    <Form.Group className="mt-3" controlId="email">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mt-3" controlId="password">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Button className="mt-3" variant="primary" type="submit">
                        Login
                    </Button>
                    <Link to="/forgot-password" className="d-block mt-3">
                        Forgot password?
                    </Link>
                    <Link to="/register" className="d-block mt-3">
                        Register an account
                    </Link>
                </Form>
            </Container>
        </>
    );
};

export default Login;
