import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button, Modal } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import "./Gallery.css";
import developMode from "./developMode";

function Gallery({ elementType }) {
    const [elementList, setElementList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedImage, setSelectedImage] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [maxPageNumber, setMaxPageNumber] = useState(1); // New state for max page number [1
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
        async function fetchData() {
            try {
                const response = await fetch(
                    developMode
                        ? `http://localhost:3001/api/items?type=${elementType}&page=${currentPage}`
                        : `https://reed-family-backend-b01b489ec3fe.herokuapp.com/api/items?type=${elementType}&page=${currentPage}`
                );
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                setElementList(data); // Update the state with the fetched data
            } catch (error) {
                console.error("Fetch error:", error);
            }
        }

        fetchData();
    }, [elementType, currentPage]); // Re-run the effect whenever the type or page number changes

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
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNext = () => {
        if (currentPage < maxPageNumber) {
            setCurrentPage(currentPage + 1);
        }
    };

    return (
        <Container>
            <Row>
                {elementList.map((element) => (
                    <Col md={4} sm={6} xs={12} key={element.id}>
                        <Card
                            className="position-relative custom-card"
                            onClick={() => handleImageClick(element)}
                        >
                            <Card.Img
                                variant="top"
                                src={
                                    elementType === "pictures"
                                        ? element.link
                                        : element.coverImg.link
                                }
                            />
                            {elementType === "recipes" && ( // Adds caption for recipe names
                                <Card.Body style={{ borderTop: "1px solid" }}>
                                    <>
                                        <div>{element.coverImg.name}</div>
                                        <div>By: {element.coverImg.author}</div>
                                    </>
                                </Card.Body>
                            )}
                            {elementType === "pictures" && ( // Adds download button for pictures (not on mobile)
                                <Button
                                    variant="primary"
                                    href={element.link}
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
                            src={selectedImage.link}
                            alt="Selected"
                            className="img-fluid custom-modal-image"
                        />
                    )}
                </Modal.Body>
            </Modal>
            {currentPage !== 1 && (
                <button
                    class="page-control-button"
                    onClick={handlePrevious}
                    disabled={currentPage === 1}
                >
                    Previous Page
                </button>
            )}
            {currentPage !== maxPageNumber && (
                <button
                    class="page-control-button"
                    onClick={handleNext}
                    disabled={currentPage === maxPageNumber}
                >
                    Next Page
                </button>
            )}
        </Container>
    );
}

export default Gallery;
