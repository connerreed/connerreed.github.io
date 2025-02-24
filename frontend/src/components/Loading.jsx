import React from "react";
import Container from "react-bootstrap/Container";
import Spinner from "react-bootstrap/Spinner";
import "../css/Loading.css";

/*
    Props:
        - Blocking: boolean / blocks events on page while loading if true
*/
const Loading = ({ blocking }) => {
    return (
        <Container className={`loading-overlay ${blocking ? "blocking" : ""}`}>
            <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
            </Spinner>
        </Container>
    );
};

export default Loading;
