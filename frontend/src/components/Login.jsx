import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { authToken, user, login, logout } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://127.0.0.1:8000/auth/token/login/', { username, password });
            const { auth_token } = response.data;

            // Fetch user details
            const userResponse = await axios.get('http://127.0.0.1:8000/auth/users/me/', {
                headers: {
                    Authorization: `Token ${auth_token}`
                }
            });
            console.log('Auth token:', auth_token);
            console.log('User details:', userResponse.data);

            // Use the login function to set the token and user
            login(auth_token, userResponse.data);

            // Optionally, navigate to another page
            navigate('/');
        } catch (error) {
            alert('Login failed');
            console.error('Login error:', error);
        }
    };

    if (authToken) {
        return (
            <div>
                <p>You are already logged in as {user.username}</p>
                <Button onClick={logout}>Logout</Button>
            </div>
        );
    }

    return (
        <Form onSubmit={handleSubmit}>
            <Form.Group controlId="username">
                <Form.Label>Username</Form.Label>
                <Form.Control type="text" value={username} onChange={(e) => setUsername(e.target.value)} required />
            </Form.Group>
            <Form.Group controlId="password">
                <Form.Label>Password</Form.Label>
                <Form.Control type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </Form.Group>
            <Button variant="primary" type="submit">Login</Button>
        </Form>
    );
};

export default Login;
