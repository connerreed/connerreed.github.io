import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Spinner from "react-bootstrap/Spinner";
import CardGroup from "react-bootstrap/CardGroup";
import ListGroup from "react-bootstrap/ListGroup";

const Recipe = () => {
    const { id } = useParams();
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(true);
    const url = `http://127.0.0.1:8000/api/recipes/${id}/`;

    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchRecipe = async () => {
            setLoading(true);
            try {
                const recipeResponse = await fetch(url);
                if (!recipeResponse.ok) {
                    throw new Error(
                        `Failed to fetch recipe: ${recipeResponse.status}`
                    );
                }
                const recipe = await recipeResponse.json();
                setRecipe(recipe);
            } catch (error) {
                console.error("Error fetching recipe: ", error);
            }
            setLoading(false);
        };
        fetchRecipe();
    }, [id, url]);

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

    return (
        <Container className="mt-5">
            <Row>
                <Col>
                    <Card data-bs-theme="dark" className="mb-3 mt-3">
                        <Card.Body>
                            <Card.Title>
                                <h1>{recipe.title}</h1>
                            </Card.Title>
                            <Card.Subtitle className="mt-3">
                                <h3>
                                    Recipe Author: {recipe.recipeAuthor} &emsp;
                                    Uploaded By: {recipe.user.first_name}{" "}
                                    {recipe.user.last_name}
                                </h3>
                            </Card.Subtitle>
                        </Card.Body>
                        
                    </Card>
                </Col>
            </Row>
            
            {recipe.description !== "" && (<Row>
                <Col>
                    <Card bg="secondary" className="mb-3">
                        <Card.Body>
                            <CardGroup>
                                <Card.Title>Description</Card.Title>
                            </CardGroup>
                            <CardGroup>
                                <Card.Text>{recipe.description}</Card.Text>
                            </CardGroup>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>)}
            <Row>
                <Col>
                    <Card bg="secondary" className="mb-3">
                        <ListGroup variant="flush" data-bs-theme="dark">
                            <ListGroup.Item>
                            <Card.Title>
                                <strong>{recipe.title}</strong>
                            </Card.Title>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                Test
                            </ListGroup.Item>
                        </ListGroup>
                        <Card.Body>
                            <Card.Title>
                                <strong>{recipe.title}</strong>
                            </Card.Title>
                            <Card.Subtitle className="text-muted">
                                Uploaded By: {recipe.user.first_name + " " + recipe.user.last_name} <br />
                                Recipe Source: {recipe.recipeAuthor}
                            </Card.Subtitle>
                            {recipe.description !== "" && (<Card.Text><u>Description</u>: {recipe.description}</Card.Text>)}
                        </Card.Body>
                        <Card.Img variant="top" src={recipe.thumbnail} />
                    </Card>
                </Col>
            </Row>
            <Row>
                {recipe.images.map((image, index) => (
                    <Col md={4} className="mb-4" key={index}>
                        <Card bg="secondary" className="mt-3 shadow-sm">
                            <Card.Img variant="top" src={image.image} />
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default Recipe;
