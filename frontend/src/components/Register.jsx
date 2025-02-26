import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import { FaCheck, FaTimes } from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";
import backendURL from "../utils/backendURL";
import "../css/Register.css";

const Register = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [error, setError] = useState("");
    const [passwordValidations, setPasswordValidations] = useState({
        minLength: false,
        hasUpperCase: false,
        hasLowerCase: false,
        hasNumber: false,
        hasSpecialChar: false,
    });
    const navigate = useNavigate();
    const { login } = useAuth();

    const profileApiEndpoint = `${backendURL}/auth/users/`;

    const handlePasswordChange = (e) => {
        const password = e.target.value;
        setPassword(password);
        validatePassword(password);
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
    };

    const validatePassword = (password) => {
        const minLength = password.length >= 8;
        const hasUpperCase = /[A-Z]/.test(password);
        const hasLowerCase = /[a-z]/.test(password);
        const hasNumber = /[0-9]/.test(password);
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

        setPasswordValidations({
            minLength,
            hasUpperCase,
            hasLowerCase,
            hasNumber,
            hasSpecialChar,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }
        const {
            minLength,
            hasUpperCase,
            hasLowerCase,
            hasNumber,
            hasSpecialChar,
        } = passwordValidations;
        if (
            !(
                minLength &&
                hasUpperCase &&
                hasLowerCase &&
                hasNumber &&
                hasSpecialChar
            )
        ) {
            setError("Password does not meet all the requirements.");
            return;
        }
        try {
            await axios.post(profileApiEndpoint, {
                email,
                password,
                first_name: firstName,
                last_name: lastName,
            });
            const getTokenApiEndpoint = `${backendURL}/auth/token/login/`;
            const response = await axios.post(getTokenApiEndpoint, {
                email,
                password,
            });

            login(response.data.auth_token);
            navigate("/profile");
        } catch (error) {
            handleAxiosError(error);
        }
    };

    const handleAxiosError = (error) => {
        if (axios.isAxiosError(error)) {
            if (error.response) {
                if (error.response.data.email) {
                    setError(
                        "Registration failed: " + error.response.data.email
                    );
                    return;
                }
                setError(
                    "Registration failed: " +
                        (JSON.stringify(error.response.data) || "Invalid data")
                );
            } else if (error.request) {
                setError("Registration failed: No response from server");
            } else {
                setError("Registration failed: " + error.message);
            }
        } else {
            setError("Registration failed: An unexpected error occurred");
        }
    };

    return (
        <>
            <h1 className="form-title">Register</h1>
            <Container className="form-container">
                <Form onSubmit={handleSubmit}>
                    {error && <div className="alert alert-danger">{error}</div>}
                    <Form.Group controlId="firstName" className="form-group">
                        <Form.Label>First Name</Form.Label>
                        <Form.Control
                            type="text"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="lastName" className="form-group">
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control
                            type="text"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="email" className="form-group">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="password" className="form-group">
                        <Form.Label>Password</Form.Label>
                        <Form.Control
                            type="password"
                            value={password}
                            onChange={handlePasswordChange}
                            required
                        />
                        <div className="mt-1 text-left">
                            <div className="form-password-validation">
                                {passwordValidations.minLength ? (
                                    <FaCheck className="text-success" />
                                ) : (
                                    <FaTimes className="text-danger" />
                                )}{" "}
                                <span className="ms-2">
                                    At least 8 characters long
                                </span>
                            </div>
                            <div className="form-password-validation">
                                {passwordValidations.hasUpperCase ? (
                                    <FaCheck className="text-success" />
                                ) : (
                                    <FaTimes className="text-danger" />
                                )}{" "}
                                <span className="ms-2">
                                    Contains an uppercase letter
                                </span>
                            </div>
                            <div className="form-password-validation">
                                {passwordValidations.hasLowerCase ? (
                                    <FaCheck className="text-success" />
                                ) : (
                                    <FaTimes className="text-danger" />
                                )}{" "}
                                <span className="ms-2">
                                    Contains a lowercase letter
                                </span>
                            </div>
                            <div className="form-password-validation">
                                {passwordValidations.hasNumber ? (
                                    <FaCheck className="text-success" />
                                ) : (
                                    <FaTimes className="text-danger" />
                                )}{" "}
                                <span className="ms-2">Contains a number</span>
                            </div>
                            <div className="form-password-validation">
                                {passwordValidations.hasSpecialChar ? (
                                    <FaCheck className="text-success" />
                                ) : (
                                    <FaTimes className="text-danger" />
                                )}{" "}
                                <span className="ms-2">
                                    Contains a special character
                                </span>
                            </div>
                        </div>
                    </Form.Group>
                    <Form.Group
                        controlId="confirmPassword"
                        className="form-group"
                    >
                        <Form.Label>Confirm Password</Form.Label>
                        <Form.Control
                            type="password"
                            value={confirmPassword}
                            onChange={handleConfirmPasswordChange}
                            required
                        />
                    </Form.Group>
                    <Button
                        className="mt-3"
                        variant="primary"
                        type="submit"
                    >
                        Register
                    </Button>
                    <Button
                        className="mt-3 ms-2"
                        variant="secondary"
                        type="button"
                        onClick={() => navigate(-1)}
                    >
                        Cancel
                    </Button>
                </Form>
            </Container>
        </>
    );
};

export default Register;
