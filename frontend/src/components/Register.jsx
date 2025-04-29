import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import { FaCheck, FaTimes } from "react-icons/fa";
import { useAuth } from "../contexts/AuthContext";
import backendURL from "../utils/backendURL";
import "../css/Register.css";
import useApiRequest from "../hooks/useApiRequest";
import Loading from "./Loading";

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
    const { postData, currentlyLoading: loading } = useApiRequest();

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
        const registerFormData = {
            email,
            password,
            first_name: firstName,
            last_name: lastName,
        };
        const onRegistrationSuccess = () => {
            const endpointForRetrievingToken = `${backendURL}/auth/token/login/`;
            const tokenFormData = {
                email,
                password,
            };
            const onTokenSuccess = (response) => {
                login(response.auth_token);
                //navigate("/profile");
                navigate("/");
            };
            postData(endpointForRetrievingToken, tokenFormData, onTokenSuccess);
        };

        const onRegistrationError = (error) => {
            // Returns error message to be used in the UI (passed to postData hook)
            const status = error?.response?.status;
            let errorMessage = "Error: ";
            switch(status) {
                case 400:
                    if (error?.response?.data?.email) {
                        errorMessage += error.response.data.email[0]; // Email already exists, and this is the error message
                    }
                    else {
                        errorMessage += "Bad Request";
                    }
                    break;
                default:
                    errorMessage += "An error has occurred";
                    break;
            }
            return errorMessage;
        };
        postData(profileApiEndpoint, registerFormData, onRegistrationSuccess, onRegistrationError);
    };

    return (
        <>
            {loading && <Loading blocking />}
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
                    <Button className="mt-3" variant="primary" type="submit">
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
