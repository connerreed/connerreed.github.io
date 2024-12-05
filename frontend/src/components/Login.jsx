import React, { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Form, Button, Container } from 'react-bootstrap';
import Loading from './Loading';
import useFormHandler from '../hooks/useFormHandler';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const { loading, handleSubmit } = useFormHandler(async () => {
    const response = await axios.post(
      `${process.env.REACT_APP_API_BASE_URL}/auth/token/login/`,
      { email, password }
    );
    login(response.data.auth_token);
    navigate('/profile');
  });

  const onSubmit = (e) => {
    e.preventDefault();
    handleSubmit();
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <h1 className="text-center">Login</h1>
      <Container className="d-flex justify-content-center align-items-center">
        <Form className="w-50" onSubmit={onSubmit}>
          <Form.Group className="mt-3" controlId="email">
            <Form.Label>Email</Form.Label>
            <Form.Control
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>
          <Form.Group className="mt-3" controlId="password">
            <Form.Label>Password</Form.Label>
            <Form.Control
              id="password"
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
