import { useState, useEffect } from "react";
import { Container, Form, InputGroup, Button } from "react-bootstrap";
import useApiRequest from "../hooks/useApiRequest";
import Loading from "./Loading";
import backendURL from "../utils/backendURL";
import { useNavigate } from "react-router-dom";
import FileUpload from "./FileUpload";
import "../css/NewRecipeForm.css";
import { useMessage } from "../contexts/MessageContext";

const NewRecipeForm = () => {
    const { postData, fetchData, currentlyLoading: loading } = useApiRequest();
    const [mealTypes, setMealTypes] = useState([]);
    const [images, setImages] = useState([]);
    const [selectedThumbnail, setSelectedThumbnail] = useState(null);
    const [thumbnailSelectionList, setThumbnailSelectionList] = useState([]);
    const navigate = useNavigate();
    const {addError} = useMessage();
    useEffect(() => {
        window.scrollTo(0, 0);

        const mealTypesApiEndpoint = `${backendURL}/api/meal-types/`;
        fetchData(mealTypesApiEndpoint, (data) => {
            setMealTypes(data);
        });
    }, [fetchData]);

    const handleSubmit = (e) => {
        e.preventDefault();

        const postRecipeApiEndpoint = `${backendURL}/api/recipes/`;
        const formData = new FormData(e.target);
        formData.delete('thumbnail');
        // Add images from FileUpload component to the formData
        images.forEach((image) => {
            formData.append("images", image);
        });
        formData.append("thumbnail", selectedThumbnail);
        const onSuccess = () => {
            navigate("/recipes");
        };
        postData(postRecipeApiEndpoint, formData, onSuccess);
    };

    const handleGenerateThumbnail = () => {
        const maxItems = 5;
        if (selectedThumbnail && thumbnailSelectionList?.length > 0) {
            if (selectedThumbnail === thumbnailSelectionList[maxItems - 1]) {
                // TODO: Fetch more images
            } else {
                const index = thumbnailSelectionList.findIndex((image) => image === selectedThumbnail);
                if (index !== -1) {
                    setSelectedThumbnail(thumbnailSelectionList[index + 1]);
                } else {
                    setSelectedThumbnail(thumbnailSelectionList[0]);
                }
            }
            return;
        }
        const recipeTitle = document.getElementById("title-input").value;
        if (!recipeTitle) {
            //alert("Please enter a title for the recipe before generating a thumbnail.");
            addError("Please enter a title for the recipe before generating a thumbnail.");
            return;
        }
        setSelectedThumbnail(null);
        const thumbnailFileInput = document.getElementById("thumbnail-input");
        thumbnailFileInput.value = null;
        const onSuccess = (data) => {
            if (data?.images?.length === 0) {
                console.error("Generate Thumbnail Error: No image returned from server.");
                addError("Error: No thumbnail generated. Please try again.");
                return;
            }
            setSelectedThumbnail(data.images[0]);
            console.log(selectedThumbnail);
            setThumbnailSelectionList(data.images);
        }
        const generateThumbnailApiEndpoint = `${backendURL}/api/recipes/generate-thumbnail/?q=${recipeTitle}&num=${maxItems}`;
        fetchData(generateThumbnailApiEndpoint, onSuccess);
    }

    return (
        <>
            {loading && <Loading blocking />}
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
                        <div className="thumbnail-input-container">
                            <Form.Control
                                id="thumbnail-input"
                                type="file"
                                accept="image/*"
                                name="thumbnail"
                                onChange={(e) => {
                                    const file = e.target.files[0];
                                    if (file) {
                                        setSelectedThumbnail(file);
                                    }

                                }}
                            />
                            <p className="thumbnail-input-text">OR</p>
                            <Button className="thumbnail-generate-button" onClick={handleGenerateThumbnail}>Generate</Button>
                        </div>
                        {selectedThumbnail && (
                            <ul>
                                <img
                                    src={selectedThumbnail}
                                    alt="Thumbnail"
                                    className="thumbnail-preview"
                                />
                            </ul>
                        )}
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="content-pictures-input">
                            Recipe Instruction Images
                        </Form.Label>

                        <FileUpload files={images} setFiles={setImages} />
                    </Form.Group>
                    <Button className="mt-3" type="submit">
                        Submit
                    </Button>
                </Form>
            </Container>
        </>
    );
};

export default NewRecipeForm;
