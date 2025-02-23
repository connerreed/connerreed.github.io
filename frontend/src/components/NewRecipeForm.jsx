import { useState, useEffect } from "react";
import { Container, Form, InputGroup, Button } from "react-bootstrap";
import useApiRequest from "../hooks/useApiRequest";
import Loading from "./Loading";
import backendURL from "../utils/backendURL";
import { useNavigate } from "react-router-dom";
import FileUpload from "./FileUpload";
import "../css/NewRecipeForm.css";

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
                <Form className="recipe-form" onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="title-input">Title</Form.Label>
                        <Form.Control
                            id="title-input"
                            type="text"
                            name="title"
                            placeholder="Title"
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Description</Form.Label>
                        <Form.Control
                            as="textarea"
                            name="description"
                            placeholder="Description"
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="recipe-author-input">
                            Recipe Author
                        </Form.Label>
                        <Form.Control
                            id="recipe-author-input"
                            text="text"
                            name="recipeAuthor"
                            placeholder="Who created this recipe?"
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
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
                                            value={mealType.name}
                                        >
                                            {mealType.name}
                                        </option>
                                    );
                                })}
                                {/* TODO: Add option to add new mealType here*/}
                            </Form.Select>
                        </InputGroup>
                    </Form.Group>
                    <Form.Group className="mb-3">
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
                    
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="content-pictures-input">
                            Recipe Instruction Images
                        </Form.Label>
                        {/* <Form.Control
                            id="content-pictures-input"
                            type="file"
                            accept="image/*"
                            name="images"
                            onChange={handleAddImages}
                            multiple
                            required
                        /> */}
                        {/* <FileUpload/> */}
                        <FileUpload/>
                    </Form.Group>
                    <Button className="mt-3" type="submit">
                        Submit
                    </Button>
                </Form>
            </Container>
            {loading && <Loading />}
        </>
    );
};

export default NewRecipeForm;
