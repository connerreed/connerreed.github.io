import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";

const Recipes = () => {
    const [loading, setLoading] = useState(true);
    const [recipeList, setRecipeList] = useState([]);
    const url = "http://127.0.0.1:8000/api/recipes/";
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);
        const fetchRecipes = async () => {
            setLoading(true);
            try {
                const recipesResponse = await fetch(url);
                if (!recipesResponse.ok) {
                    throw new Error(
                        `Failed to fetch recipes: ${recipesResponse.status}`
                    );
                }
                const recipes = await recipesResponse.json();
                setRecipeList(recipes);
            } catch (error) {
                console.error("Error fetching recipes: ", error);
            }
            setLoading(false);
        };
        fetchRecipes();
    }, []);

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

    if (recipeList.length === 0) {
        return (
            <Container
                className="d-flex justify-content-center align-items-center"
                style={{ height: "100vh" }}
            >
                <h1>No recipes found</h1>
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
                    <h1>Recipes</h1>
                </Col>
                <Col className="d-flex justify-content-end mb-2 mb-md-0">
                    <Button
                        variant="success"
                        className="text-nowrap"
                        onClick={() => navigate("/recipes/new")}
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
                        New recipe
                    </Button>
                </Col>
            </Row>
            <Row>
                {recipeList.map((recipe) => (
                    <Col key={recipe.id} md={4} className="mb-4">
                        <Link
                            to={`/recipes/${recipe.id}`}
                            style={{ textDecoration: "none" }}
                        >
                            <Card bg="secondary">
                                <Card.Img
                                    variant="top"
                                    src={recipe.thumbnail}
                                />
                                <Card.Body>
                                    <Card.Title>{recipe.title}</Card.Title>
                                    <Card.Text>
                                        By: {recipe.recipeAuthor}
                                    </Card.Text>
                                </Card.Body>
                            </Card>
                        </Link>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default Recipes;
