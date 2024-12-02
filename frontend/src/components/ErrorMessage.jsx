import React from "react";
import Alert from "react-bootstrap/Alert";

const ErrorMessage = ({ message, onClose }) => {
    return (
        <Alert variant="danger" onClose={onClose} dismissible>
            {message}
        </Alert>
    );
};

export default ErrorMessage;
