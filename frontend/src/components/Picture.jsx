import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Loading from "./Loading";
import backendURL from "../utils/backendURL";
import useFetchData from "../hooks/useFetchData";

const Picture = () => {
    const { id } = useParams();
    const {
        data: picture,
        currentlyLoading: loading,
        fetchData,
    } = useFetchData();

    useEffect(() => {
        window.scrollTo(0, 0);
        const pictureApiEndpoint = `${backendURL}/api/pictures/${id}/`;
        fetchData(pictureApiEndpoint);
    }, [id, fetchData]);

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
