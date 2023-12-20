import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Modal } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import "./Gallery.css";
import developMode from "./developMode";

function Gallery({ elementType }) {
    const [elementList, setElementList] = useState([]);
    const [cachedPages, setCachedPages] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [maxPageNumber, setMaxPageNumber] = useState(1);
    const [selectedImage, setSelectedImage] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchMaxPageNumber() {
            try {
                const url = developMode
                    ? `http://localhost:3001/api/itemCount?type=${elementType}`
                    : `https://reed-family-backend-b01b489ec3fe.herokuapp.com/api/itemCount?type=${elementType}`;
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                setMaxPageNumber(data.totalPages);
            } catch (error) {
                console.error("Error fetching max page number:", error);
            }
        }

        fetchMaxPageNumber();
    }, [elementType]);

    useEffect(() => {
        if (!cachedPages[currentPage]) {
            async function fetchData() {
                try {
                    const response = await fetch(
                        developMode
                            ? `http://localhost:3001/api/items?type=${elementType}&page=${currentPage}`
                            : `https://reed-family-backend-b01b489ec3fe.herokuapp.com/api/items?type=${elementType}&page=${currentPage}`
                    );
                    if (!response.ok) {
                        throw new Error(
                            `HTTP error! Status: ${response.status}`
                        );
                    }
                    const data = await response.json();
                    setCachedPages((prev) => ({
                        ...prev,
                        [currentPage]: data,
                    }));
                    setElementList(data);
                } catch (error) {
                    console.error("Fetch error:", error);
                }
            }

            fetchData();
        } else {
            // Load from cache
            setElementList(cachedPages[currentPage]);
        }
    }, [elementType, currentPage, cachedPages]);

    const handleImageClick = (image) => {
        if (elementType === "pictures") {
            setSelectedImage(image);
            setShowModal(true);
        } else if (elementType === "recipes") {
            navigate(`/recipes/${image.folderName}`);
        }
    };

    const handlePrevious = () => {
        if (currentPage > 1) {
            setCurrentPage((prev) => prev - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < maxPageNumber) {
            setCurrentPage((prev) => prev + 1);
        }
    };

    return (
        <Container>
            <Row>
                {elementList.map((image) => (
                    <Col md={4} sm={6} xs={12} key={image.id}>
                        <Card
                            className="position-relative custom-card"
                            onClick={() => handleImageClick(image)}
                        >
                            <Card.Img
                                variant="top"
                                src={
                                    elementType === "pictures"
                                        ? `data:${image.mimeType};base64,${image.image}`
                                        : `data:${image.coverImg.mimeType};base64,${image.coverImg.image}`
                                }
                                alt={
                                    elementType === "pictures"
                                        ? image.name
                                        : image.coverImg.name
                                }
                            />
                            {elementType === "recipes" && (
                                <Card.Body style={{ borderTop: "1px solid" }}>
                                    <div>{image.coverImg.name}</div>
                                    <div>By: {image.coverImg.author}</div>
                                </Card.Body>
                            )}
                            {elementType === "pictures" && (
                                <Button
                                    variant="primary"
                                    href={image.link}
                                    download
                                    className="download-button"
                                >
                                    <FontAwesomeIcon icon={faDownload} />
                                </Button>
                            )}
                        </Card>
                    </Col>
                ))}
            </Row>

            <Modal
                show={showModal}
                onHide={() => setShowModal(false)}
                centered
                className="custom-modal"
            >
                <Modal.Body>
                    {selectedImage && (
                        <img
                            style={{ color: "white" }}
                            src={`data:${selectedImage.mimeType};base64,${selectedImage.image}`}
                            alt={`Selected: ${selectedImage.name}`}
                            className="img-fluid custom-modal-image"
                        />
                    )}
                </Modal.Body>
            </Modal>
            {currentPage !== 1 && (
                <button
                    className="page-control-button"
                    onClick={handlePrevious}
                >
                    Previous Page
                </button>
            )}
            {currentPage !== maxPageNumber && (
                <button className="page-control-button" onClick={handleNext}>
                    Next Page
                </button>
            )}
        </Container>
    );
}

export default Gallery;
