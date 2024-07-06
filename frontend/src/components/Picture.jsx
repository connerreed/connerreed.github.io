import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Spinner from "react-bootstrap/Spinner";

const Picture = () => {
    const { id } = useParams();
    const [picture, setPicture] = useState(null);
    const [loading, setLoading] = useState(true);
    const url = `http://127.0.0.1:8000/api/pictures/${id}/`;
    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchPicture = async () => {
            setLoading(true);
            try {
                const pictureResponse = await fetch(url);
                if (!pictureResponse.ok) {
                    throw new Error(
                        `Failed to fetch picture: ${pictureResponse.status}`
                    );
                }
                const picture = await pictureResponse.json();
                setPicture(picture);
            } catch (error) {
                console.error("Error fetching picture: ", error);
            }
            setLoading(false);
        };
        fetchPicture();
    }, [id, url]);

    if (loading) {
        return (
            <Container className="d-flex justify-content-center align-items-center" style={{ height: "100vh" }}>
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                </Spinner>
            </Container>
        );
    }

    return (
        <Container className="w-50 mt-5">
            <Card bg="secondary">
                <Card.Img variant="top" src={picture.image} />
                <Card.Body>
                    <Card.Title>
                        Uploaded by:
                        <br />
                        {picture.user.first_name + " " + picture.user.last_name}
                    </Card.Title>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default Picture;
