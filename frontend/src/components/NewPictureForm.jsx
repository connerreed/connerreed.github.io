import React, { useEffect, useState } from "react";

import { Form, Button, Container } from "react-bootstrap";
//import { useAuth } from "./AuthContext";

const NewPictureForm = () => {
    //const { authToken, userData } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [newPictures, setNewPictures] = useState([]);
    const url = "http://127.0.0.1:8000";

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (newPictures.length === 0) {
            setError("No pictures selected.");
            setLoading(false);
            return;
        }

        console.log(newPictures);

        setLoading(false);
    };

    return (
        <>
            {loading && <p>Loading...</p>}
            {error && <p>Error: {error.message}</p>}
            <h1 className="text-center">New Pictures</h1>
            <Container className="d-flex justify-content-center align-items-center">
                <Form className="w-50 mt-3" onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        {//<Form.Label>Add Pictures</Form.Label>
                        }
                        <Form.Control
                            type="file"
                            accept="image/*"
                            value={newPictures}
                            onChange={(e) => {
                                setNewPictures(e.target.value);
                            }}
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
