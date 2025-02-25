import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { Form, Button, Container } from "react-bootstrap";
import Loading from "./Loading";
import backendURL from "../utils/backendURL";
import useApiRequest from "../hooks/useApiRequest";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login } = useAuth();
    const navigate = useNavigate();
    const { postData, currentlyLoading: loading } = useApiRequest();

    const onSubmit = (e) => {
        e.preventDefault();
        const tokenApiEndpoint = `${backendURL}/auth/token/login/`;
        const formData = { email, password };
        const onSuccess = (response) => {
            login(response.auth_token);
            navigate("/profile");
        }
        postData(tokenApiEndpoint, formData, onSuccess);
    };

    return (
        <>
            {loading && <Loading blocking />}
            <h1 className="text-center">Login</h1>
            <Container className="d-flex justify-content-center align-items-center">
                <Form className="w-50" onSubmit={onSubmit}>
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
