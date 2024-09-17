import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { useAuth } from "./AuthContext";
import useFetchData from "../hooks/useFetchData";
import Loading from "./Loading";
import ErrorMessage from "./ErrorMessage";

const Pictures = () => {
    //const [loading, setLoading] = useState(true);
    //const [error, setError] = useState("");
    //const [pictureList, setPictureList] = useState([]);
    const url = `${process.env.REACT_APP_API_BASE_URL}/api/pictures/`;
    const navigate = useNavigate();
    const { authToken } = useAuth();
    const { data: pictureList, loading, error } = useFetchData(
        `${process.env.REACT_APP_API_BASE_URL}/api/pictures/`,
        authToken
    )

    useEffect(() => {
        window.scrollTo(0, 0);
        /*const fetchPictures = async () => {
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
                setError(error.message);
            }
            setLoading(false);
        };
        fetchPictures();
        */
    }, [authToken, url]);

    if (loading) return <Loading />;

    if (error) return <ErrorMessage message={error} />;

    if (!pictureList || pictureList.length === 0) {
        return (
            <Container className="text-center mt-5">
                <h1>No Pictures Found</h1>
            </Container>
        );
    }

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
