import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { useAuth } from "../hooks/AuthContext";
import useFetchData from "../hooks/useFetchData";
import Loading from "./Loading";
import ErrorMessage from "./ErrorMessage";
//import Modal from "react-bootstrap/Modal";

import ConfirmModal from "./ConfirmModal";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

const Pictures = () => {
    //const [error, setError] = useState("");
    //const [pictureList, setPictureList] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [dataFetched, setDataFetched] = useState(false);
    const [pictureIdToDelete, setPictureIdToDelete] = useState(null);
    
    const navigate = useNavigate();
    const { authToken, userData } = useAuth();
    const {
        data: pictureList,
        isLoading,
        error,
    } = useFetchData(
        `${process.env.REACT_APP_API_BASE_URL}/api/pictures/`,
        authToken
    );

    useEffect(() => {
        if (!isLoading && pictureList) {
            setDataFetched(true);
        }
    }, [isLoading, pictureList]);

    const confirmDelete = () => {
        handleDelete(pictureIdToDelete);
        handleCloseModal();
    };

    const handleDelete = async (id) => {
        try {
            console.log("Delete picture with id:", id);
            const response = await fetch(
                `${process.env.REACT_APP_API_BASE_URL}/api/pictures/${id}/`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Token ${authToken}`,
                    },
                }
            );
            if (response.ok) {
                console.log("Deleted picture with id:", id);
                //setPictureList(pictureList.filter((picture) => picture.id !== id));
            } else {
                throw new Error(`Failed to delete picture with id: ${id}\n
                Response: ${response.statusText}`);
            }
        } catch (error) {
            //setError("Failed to delete picture");
            console.error(error);
        }
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
            {error && <ErrorMessage message={error} />}
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
                {!dataFetched && <Loading />}
                {dataFetched && pictureList && pictureList.length === 0 && (
                    <h1>No Pictures Found</h1>
                )}
                {pictureList &&
                    pictureList.length > 0 &&
                    pictureList.map((picture) => (
                        <Col
                            key={picture.id}
                            lg={4}
                            xs={12}
                            className="mb-4 d-flex align-items-end"
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

export default Pictures;
