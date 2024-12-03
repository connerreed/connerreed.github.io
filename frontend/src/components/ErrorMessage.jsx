import React from "react";
import Alert from "react-bootstrap/Alert";

const ErrorMessage = ({ message, onClose }) => {
    // TODO: Abstract this to allow success messages as well
    return (
        <Alert variant="danger" onClose={onClose} dismissible>
            {message}
        </Alert>
    );
};

export default ErrorMessage;
