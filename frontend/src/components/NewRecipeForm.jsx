import { useState, useEffect } from "react";
import { Container, Form, InputGroup } from "react-bootstrap";
import useApiRequest from "../hooks/useApiRequest";
import Loading from "./Loading";
import backendURL from "../utils/backendURL";
import { useNavigate } from "react-router-dom";

const NewRecipeForm = () => {
    const { postData, fetchData, loading } = useApiRequest();
    const [mealTypes, setMealTypes] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        window.scrollTo(0, 0);

        const mealTypesApiEndpoint = `${backendURL}/api/meal-types/`;
        fetchData(mealTypesApiEndpoint, (data) => {
            setMealTypes(data);
        });
    }, [fetchData]);

    const handleSubmit = (e) => {
        e.preventDefault();

        const newRecipeApiEndpoint = `${backendURL}/api/recipes/`;
        const formData = new FormData(e.target);
        const onSuccess = () => {
            navigate("/recipes");
        };
        postData(newRecipeApiEndpoint, formData, onSuccess);
    };

    return (
        <>
            <h1 className="text-center">New Recipe</h1>
            <Container className="d-flex justify-content-center align-items-center">
                <Form className="w-50 mt-3" onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="title">
                        <Form.Label htmlFor="title-input">Title</Form.Label>
                        <Form.Control
                            id="title-input"
                            type="text"
                            name="title"
                            placeholder="Title"
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="description">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            name="description"
                            placeholder="Description"
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="recipeAuthor">
                        <Form.Label htmlFor="recipe-author-input">
                            Recipe Author
                        </Form.Label>
                        <Form.Control
                            id="recipe-author-input"
                            text="text"
                            name="author"
                            placeholder="Who created this recipe?"
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="mealType">
                        <Form.Label htmlFor="meal-type-input">
                            Meal Type
                        </Form.Label>
                        <InputGroup>
                            <InputGroup.Text>Select Meal Type</InputGroup.Text>
                            <Form.Select
                                id="meal-type-input"
                                name="mealType"
                                required
                            >
                                <option value=""></option>
                                {mealTypes.map((mealType) => {
                                    return (
                                        <option
                                            key={mealType.id}
                                            value={mealType.id}
                                        >
                                            {mealType.name}
                                        </option>
                                    );
                                })}
                                {/* TODO: Add new mealType option here*/}
                            </Form.Select>
                        </InputGroup>
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="thumbnail">
                        {/* TODO: Maybe add an automatically generated thumbnail based on title
                                    also give them option to generate new thumbnail
                                    also give them option to upload their own
                        */}
                        <Form.Label htmlFor="thumbnail-input">
                            Thumbnail
                        </Form.Label>
                        <Form.Control
                            id="thumbnail-input"
                            type="file"
                            accept="image/*"
                            name="thumbnail"
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="contentPictures">
                        <Form.Label htmlFor="content-pictures-input">
                            Recipe Images
                        </Form.Label>
                        <Form.Control
                            id="content-pictures-input"
                            type="file"
                            accept="image/*"
                            name="contentPictures"
                            multiple
                            required
                        />
                    </Form.Group>
                </Form>
            </Container>
            {loading && <Loading />}
        </>
    );
};

export default NewRecipeForm;
