import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Loading from "./Loading";
import backendURL from "../utils/backendURL";

const Picture = () => {
    const { id } = useParams();
    const [picture, setPicture] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchPicture = async () => {
            setLoading(true);
            const pictureApiEndpoint = `${backendURL}/api/pictures/${id}/`;
            try {
                const pictureResponse = await fetch(
                    pictureApiEndpoint
                );
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
    }, [id]);

    if (loading) return <Loading />;

    return (
        <Container className="w-50 mt-5">
            <Card bg="secondary">
                <Card.Img variant="top" src={picture?.image} />
                <Card.Body>
                    <Card.Title>
                        Uploaded by:
                        <br />
                        {picture?.user.first_name +
                            " " +
                            picture?.user.last_name}
                    </Card.Title>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default Picture;
