import React, { useEffect, useState } from "react";
import { Form, Button, Container } from "react-bootstrap";
import { useAuth } from "../hooks/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Loading from "./Loading";

const NewPictureForm = () => {
    const { authToken } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [newPictures, setNewPictures] = useState([]);
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (newPictures.length === 0) {
            alert("No pictures selected.");
            setLoading(false);
            return;
        }

        const formData = new FormData();
        Array.from(newPictures).forEach((file) => {
            formData.append("image", file);
        });

        try {
            await axios.post(`${API_BASE_URL}/api/pictures/`, formData, {
                headers: {
                    Authorization: `Token ${authToken}`,
                    "Content-Type": "multipart/form-data",
                },
            });
            navigate("/pictures");
        } catch (error) {
            alert("Failed to upload pictures.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Loading />;

    return (
        <>
            <h1 className="text-center">New Pictures</h1>
            <Container className="d-flex justify-content-center align-items-center">
                <Form className="w-50 mt-3" onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Control
                            type="file"
                            accept="image/*"
                            onChange={(e) => setNewPictures(e.target.files)}
                            multiple
                            required
                        />
                        <Button className="mt-3" type="submit">
                            Submit
                        </Button>
                    </Form.Group>
                </Form>
            </Container>
        </>
    );
};

export default NewPictureForm;
