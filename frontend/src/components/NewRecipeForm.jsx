import { useState, useEffect, useRef } from "react";
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
    const [page, setPage] = useState(1);
    const navigate = useNavigate();
    const { addError } = useMessage();
    const hiddenInputRef = useRef();

    useEffect(() => {
        window.scrollTo(0, 0);

        const mealTypesApiEndpoint = `${backendURL}/api/meal-types/`;
        fetchData(mealTypesApiEndpoint, (data) => {
            setMealTypes(data);
        });
    }, [fetchData]);

    // Form validation
    useEffect(() => {
        if (images.length > 0) {
            hiddenInputRef.current.setCustomValidity("");
            hiddenInputRef.current.value = "images uploaded";
        } else {
            hiddenInputRef.current.setCustomValidity(
                "Please upload at least one image for the recipe."
            );
            hiddenInputRef.current.value = "";
        }
        console.log("Images changed:", images);
    }, [images]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const postRecipeApiEndpoint = `${backendURL}/api/recipes/`;
        const formData = new FormData(e.target);
        formData.delete("thumbnail");
        // Add images from FileUpload component to the formData
        images.forEach((image) => {
            formData.append("images", image);
        });

        const onFetchThumbnailFileSuccess = (data) => {
            const thumbnailFile = data;
            if (!thumbnailFile) {
                addError("Error: Thumbnail not found.");
                console.error("Thumbnail fetch error: No file returned");
                return;
            }
            formData.append(
                "thumbnail",
                thumbnailFile,
                formData.get("title") + ".jpg"
            );

            const onPostSuccess = () => {
                navigate("/recipes");
            };
            postData(postRecipeApiEndpoint, formData, onPostSuccess);
        };

        const getThumbnailErrorMessage = (error) => {
            return "Error: Failed to download thumbnail. Please try a different one.";
        };

        fetchData(
            `${backendURL}/api/download-image/?url=${selectedThumbnail}`,
            onFetchThumbnailFileSuccess,
            "blob",
            getThumbnailErrorMessage
        );
    };

    const handleGenerateThumbnail = () => {
        const maxItems = 5;
        const recipeTitle = document.getElementById("title-input").value;
        if (!recipeTitle) {
            addError(
                "Please enter a title for the recipe before generating a thumbnail."
            );
            return;
        }
        const generateThumbnailApiEndpoint = `${backendURL}/api/recipes/generate-thumbnail/?q=${recipeTitle}&num=${maxItems}`;
        const onGenerateThumbnailSuccess = (data) => {
            if (data?.images?.length === 0) {
                console.error(
                    "Generate Thumbnail Error: No image returned from server."
                );
                addError("Error: No thumbnail generated. Please try again.");
                return;
            }
            setSelectedThumbnail(data.images[0]);
            setThumbnailSelectionList(data.images);
            setPage((prevPage) => prevPage + 1);
        };

        const getGenerateThumbnailErrorMessage = (error) => {
            const status = error?.response?.status;
            switch (status) {
                case 400:
                    return "Error: Please check your input.";
                case 403:
                    return "Error: Cannot generate thumbnail for this recipe. Please try a different title.";
                case 500:
                    return `Error: ${error?.response?.data?.error || "Server error. Please try again later."}`;
                default:
                    return `Error: ${error?.response?.data?.error || "Failed to generate thumbnail."}`;
            }
        };

        if (selectedThumbnail && thumbnailSelectionList?.length > 0) {
            if (selectedThumbnail === thumbnailSelectionList[maxItems - 1]) {
                // We've cycled through all thumbnails. Fetch more images
                const getNextPageEndpoint = `${generateThumbnailApiEndpoint}&page=${page}`;
                fetchData(getNextPageEndpoint, onGenerateThumbnailSuccess, "json", getGenerateThumbnailErrorMessage);
            } else {
                const index = thumbnailSelectionList.findIndex(
                    (image) => image === selectedThumbnail
                );
                if (index !== -1) {
                    setSelectedThumbnail(thumbnailSelectionList[index + 1]);
                } else {
                    setSelectedThumbnail(thumbnailSelectionList[0]);
                }
            }
            return;
        }
        setSelectedThumbnail(null);
        const thumbnailFileInput = document.getElementById("thumbnail-input");
        thumbnailFileInput.value = null;
        fetchData(generateThumbnailApiEndpoint, onGenerateThumbnailSuccess, "json", getGenerateThumbnailErrorMessage);
    };

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
                            onChange = {(e) => {
                                // Reset thumbnail selection when title changes
                                setSelectedThumbnail(null);
                                setThumbnailSelectionList([]);
                                setPage(1);
                            }}
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
                                        setPage(1);
                                        setThumbnailSelectionList([]);
                                        setSelectedThumbnail(
                                            URL.createObjectURL(file)
                                        );
                                    }
                                }}
                            />
                            <p className="thumbnail-input-text">OR</p>
                            <Button
                                className="thumbnail-generate-button"
                                onClick={handleGenerateThumbnail}
                            >
                                Generate
                            </Button>
                        </div>
                        {selectedThumbnail && (
                            <ul>
                                <img
                                    src={selectedThumbnail}
                                    alt="Recipe Thumbnail"
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
                        <input
                            ref={hiddenInputRef}
                            required
                            style={{
                                opacity: 0,
                                position: "absolute",
                                pointerEvents: "none",
                                height: 0,
                                width: 0,
                                marginLeft: "10%",
                            }}
                            tabIndex={-1}
                            aria-hidden="true"
                            defaultValue={"testing"}
                        />
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
