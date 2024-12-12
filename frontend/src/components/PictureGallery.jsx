import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import ElementCard from "./ElementCard";
import { useAuth } from "../contexts/AuthContext";
import useFetchData from "../hooks/useFetchData";
import useDeleteData from "../hooks/useDeleteData";
import ConfirmModal from "./ConfirmModal";

const PictureGallery = () => {
    const [showModal, setShowModal] = useState(false);
    const [pictureIdToDelete, setPictureIdToDelete] = useState(null);
    const navigate = useNavigate();
    const { authToken } = useAuth();

    const apiURL = `${process.env.REACT_APP_API_BASE_URL}/api/pictures/`;

    const {
        data: pictureList,
        loading,
        idToTriggerNextFetch,
        initializeData,
        appendNextPage,
    } = useFetchData(apiURL, authToken);

    useEffect(() => {
        let observer;

        const handleObservation = (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    appendNextPage();
                    if (observer) observer.disconnect();
                }
            });
        };

        const setupObserver = () => {
            if (!idToTriggerNextFetch || loading) return;

            const elementToTriggerNextFetch = document.getElementById(
                `picture-${idToTriggerNextFetch}`
            );
            if (elementToTriggerNextFetch) {
                observer = new IntersectionObserver(handleObservation);
                observer.observe(elementToTriggerNextFetch);
            }
        };

        setupObserver();

        return () => {
            if (observer) observer.disconnect();
        };
    }, [idToTriggerNextFetch, loading, appendNextPage]);

    const { handleDelete: deletePicture } = useDeleteData(apiURL, authToken);

    const confirmDelete = () => {
        deletePicture(pictureIdToDelete);
        handleCloseModal();
        // wait for the delete to complete before refreshing the data
        setTimeout(() => {
            initializeData();
        }, 500);
    };

    const handleShowModal = (id) => {
        setPictureIdToDelete(id);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setPictureIdToDelete(null);
        setShowModal(false);
    };

    return (
        <Container>
            {/* TODO: Add static banner across screen to hide initial picture loading? */}
            <Row className="align-items-center mb-4">
                <Col className="d-flex justify-content-start mb-2 mb-md-0">
                    {/* Empty column to maintain spacing */}
                </Col>
                <Col className="text-center mb-2 mb-md-0">
                    <h1>Pictures</h1>
                </Col>
                <Col className="d-flex justify-content-end mb-2 mb-md-0">
                    <Button
                        variant="success"
                        className="text-nowrap"
                        onClick={() => navigate("/pictures/new")}
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            className="bi bi-plus"
                            viewBox="0 0 16 16"
                        >
                            <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
                        </svg>
                        New picture
                    </Button>
                </Col>
            </Row>
            <Row>
                {/* Content Area */}
                {!loading && pictureList?.length === 0 && (
                    <div className="d-flex justify-content-center">
                        <h1>No Pictures Found</h1>
                    </div>
                )}
                {pictureList?.length > 0 &&
                    pictureList.map((picture) => (
                        <Col
                            id={`picture-${picture.id}`}
                            key={picture.id}
                            lg={4}
                            xs={12}
                            className="mb-4 d-flex align-items-end justify-content-center"
                        >
                            <ElementCard
                                picture={picture}
                                handleShowModal={handleShowModal}
                            />
                        </Col>
                    ))}
            </Row>

            <ConfirmModal
                show={showModal}
                onClose={handleCloseModal}
                onCancel={handleCloseModal}
                onConfirm={confirmDelete}
            />
        </Container>
    );
};

export default PictureGallery;
