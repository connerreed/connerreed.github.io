import React from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { useAuth } from './AuthContext';
import { Nav } from 'react-bootstrap';

const ProfileIcon = () => {
    const { authToken } = useAuth();
    return (
        <LinkContainer to={authToken ? "/profile" : "/login"}>
            <Nav.Link>
                <i className="fas fa-user"></i>
            </Nav.Link>
        </LinkContainer>
    );
}

export default ProfileIcon;