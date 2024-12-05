import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Loading from "./Loading";

const NewVideoForm = () => {
    const [title, setTitle] = useState("");
    const [videoFile, setVideoFile] = useState(null);
    const [fileError, setFileError] = useState("");
    const { authToken } = useAuth();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        const validVideoTypes = [
            "video/mp4",
            "video/avi",
            "video/mkv",
            "video/mov",
        ];
        if (file && validVideoTypes.includes(file.type)) {
            setVideoFile(file);
            setFileError("");
        } else {
            setVideoFile(null);
            setFileError("Please upload a valid video file.");
        }
    };

    const submitForm = async (e) => {
        e.preventDefault(); // Prevent the form from submitting the default way
        if (!videoFile) {
            setFileError("Please upload a valid video file.");
            return;
        }

        setLoading(true);

        const formData = new FormData();
        formData.append("title", title);
        formData.append("video", videoFile);

        try {
            const response = await fetch(
                `${process.env.REACT_APP_BASE_API_URL}/api/videos/`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Token ${authToken}`,
                    },
                    body: formData,
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.video[0]);
            }

            navigate("/videos");
        } catch (error) {
            alert("Failed to submit form\n" + error.message);
            console.error("Error submitting form", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Loading />;

    return (
        <Container>
            <Row className="justify-content-center mt-1">
                <Col xs={12} md={12} className="mb-4">
                    <h1>New Video Form</h1>
                </Col>
                <Col xs={12} md={6}>
                    <Form onSubmit={submitForm}>
                        <Form.Group className="mb-4">
                            <Form.Label>Title</Form.Label>
                            <Form.Control
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                            />
                            <Form.Control.Feedback type="invalid">
                                Please provide a title.
                            </Form.Control.Feedback>
                        </Form.Group>
                        <Form.Group className="mb-4">
                            <Form.Label>Video File</Form.Label>
                            <Form.Control
                                type="file"
                                onChange={handleFileChange}
                                required
                            />
                            {fileError && (
                                <div className="text-danger">{fileError}</div>
                            )}
                        </Form.Group>
                        <Button variant="success" type="submit">
                            Submit
                        </Button>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
};

export default NewVideoForm;
