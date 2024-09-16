import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";
import { useAuth } from "./AuthContext";

const Pictures = () => {
    const [loading, setLoading] = useState(true);
    const [pictureList, setPictureList] = useState([]);
    const url = "http://127.0.0.1:8000/api/pictures/";
    const navigate = useNavigate();
    const { authToken } = useAuth();

    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchPictures = async () => {
            setLoading(true);
            try {
                const picturesResponse = await fetch(url);
                if (!picturesResponse.ok) {
                    throw new Error(
                        `Failed to fetch pictures: $response.status`
                    );
                }
                const pictures = await picturesResponse.json();
                setPictureList(pictures);
            } catch (error) {
                console.error("Error fetching pictures", error);
            }
            setLoading(false);
        };
        fetchPictures();
    }, [authToken]);

    if (loading) {
        return (
            <Container
                className="d-flex justify-content-center align-items-center"
                style={{ height: "100vh" }}
            >
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </Container>
        );
    }

    /*if (pictureList.length === 0) {
        return (
            <Container
                className="d-flex justify-content-center align-items-center"
                style={{ height: "100vh" }}
            >
                <h1>No pictures found</h1>
            </Container>
        );
    }
    */

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
            {pictureList.length === 0 && (
                    <Row className="mt-5">
                        <Col className="text-center mb-2 mb-md-0">
                            <h1>No Pictures Found</h1>
                        </Col>
                    </Row>
                )}
            <Row>
                {pictureList.map((picture) => (
                    <Col key={picture.id} md={4} className="mb-4">
                        <Link
                            to={`/pictures/${picture.id}`}
                            style={{ textDecoration: "none" }}
                        >
                            <Card bg="secondary">
                                <Card.Img variant="top" src={picture.image} />
                                <Card.Body>
                                    <Card.Title>
                                        Uploaded by:
                                        <br />
                                        {picture.user.first_name +
                                            " " +
                                            picture.user.last_name}
                                    </Card.Title>
                                </Card.Body>
                            </Card>
                        </Link>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default Pictures;
