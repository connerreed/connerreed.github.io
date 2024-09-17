import React from 'react';
import Container from 'react-bootstrap/Container';
import Spinner from 'react-bootstrap/Spinner';

const Loading = () => {
    return (
        <Container
            className="d-flex justify-content-center align-items-center"
            style={{height: '100vh'}}
        >
            <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
            </Spinner>
        </Container>
    );
}

export default Loading;