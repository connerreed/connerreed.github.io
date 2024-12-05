import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { useAuth } from "../hooks/AuthContext";
import useFetchData from "../hooks/useFetchData";
import useDeleteData from "../hooks/useDeleteData";
import Loading from "./Loading";

import ConfirmModal from "./ConfirmModal";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

const PictureGallery = () => {
    const [showModal, setShowModal] = useState(false);
    const [pictureIdToDelete, setPictureIdToDelete] = useState(null);

    const navigate = useNavigate();
    const { authToken, userData } = useAuth();
    const {
        data: pictureList,
        loading,
        refreshData: refreshPictures,
    } = useFetchData(
        `${process.env.REACT_APP_API_BASE_URL}/api/pictures/`,
        authToken
    );
    const {handleDelete: deletePicture } =
        useDeleteData(
            `${process.env.REACT_APP_API_BASE_URL}/api/pictures/`,
            authToken
        );

    const confirmDelete = async () => {
        await deletePicture(pictureIdToDelete);
        handleCloseModal();
        // wait for the delete to complete before refreshing the data
        setTimeout(() => {
            refreshPictures();
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
                {loading && <Loading />}
                {!loading && (!pictureList || pictureList.length === 0) && (
                    <div className="d-flex justify-content-center">
                        <h1>No Pictures Found</h1>
                    </div>
                )}
                {pictureList?.length > 0 &&
                    pictureList.map((picture) => (
                        <Col
                            key={picture.id}
                            lg={4}
                            xs={12}
                            className="mb-4 d-flex align-items-end justify-content-center"
                        >
                            <Card bg="secondary">
                                <Link
                                    to={`/pictures/${picture.id}`}
                                    style={{ textDecoration: "none" }}
                                >
                                    <Card.Img
                                        variant="top"
                                        src={picture.image}
                                    />
                                </Link>
                                <Card.Body className="d-flex justify-content-between align-items-center">
                                    <Card.Title className="mb-0">
                                        Uploaded by:
                                        <br />
                                        {picture.user.first_name +
                                            " " +
                                            picture.user.last_name}
                                    </Card.Title>
                                    {userData &&
                                        (userData.is_superuser ||
                                            userData.id ===
                                                picture.user.id) && (
                                            <Button
                                                variant="dark"
                                                onClick={() =>
                                                    // Add popup asking for confirmation
                                                    handleShowModal(picture.id)
                                                }
                                            >
                                                <FontAwesomeIcon
                                                    icon={faTrash}
                                                />
                                            </Button>
                                        )}
                                </Card.Body>
                            </Card>
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
