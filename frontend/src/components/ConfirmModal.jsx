import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

const ConfirmModal = ({show, onClose, onCancel, onConfirm}) => {
    return <Modal show={show} onHide={onClose}>
        <Modal.Header closeButton>
            <Modal.Title>Confirm Delete</Modal.Title>
            <Modal.Body>Are you sure you want to delete?</Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={onCancel}>
                    Cancel
                </Button>
                <Button variant="danger" onClick={onConfirm}>
                    Delete
                </Button>
            </Modal.Footer>
        </Modal.Header>
    </Modal>;
};

export default ConfirmModal;
