import React, { useEffect, useState } from "react";
import { Form, Button, Container } from "react-bootstrap";
import Loading from "./Loading";
import usePostData from "../hooks/usePostData";
import backendURL from "../utils/backendURL";

const NewPictureForm = () => {
    const [newPictures, setNewPictures] = useState([]);
    const { postData, loading } = usePostData(`${backendURL}/api/pictures/`);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();

        if (newPictures.length === 0) {
            alert("No pictures selected.");
            return;
        }

        const formData = new FormData();
        Array.from(newPictures).forEach((file) => {
            formData.append("image", file);
        });

        postData(formData);
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
