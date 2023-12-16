import React, { useState } from "react";
import { Dropdown } from "react-bootstrap";

function UploadForm({ formType }) {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [recipeName, setRecipeName] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const handleFileChange = (event) => {
        setSelectedFiles([...selectedFiles, ...Array.from(event.target.files)]);
    };

    const handleRecipeNameChange = (event) => {
        setRecipeName(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if(successMessage) setSuccessMessage(""); // Clear the success message if it's still showing
        const formData = new FormData();
        selectedFiles.forEach((file) => {
            formData.append("files", file);
        });

        // Include the recipe name if this is a recipe upload
        if (formType === "recipes") {
            formData.append("recipeName", recipeName);
        }

        try {
            const response = await fetch(
                `https://reed-family-backend-b01b489ec3fe.herokuapp.com/upload/${formType}`,
                {
                    method: "POST",
                    body: formData,
                }
            );

            if (response.ok) {
                setSelectedFiles([]); // Clear the file list
                setRecipeName(""); // Clear the recipe name
                setSuccessMessage("Files uploaded successfully!");
                // Optionally, clear the message after a few seconds
                setTimeout(() => setSuccessMessage(""), 3000);
            } else {
                const errorData = await response.json(); // Assuming the server sends JSON with error details
                console.error("Upload failed:", errorData.message); // Log detailed error message
                alert("Failed to upload: " + errorData.message); // Show an alert to the user with the error message
                // Additional error handling based on specific error types can be added here
            }
        } catch (error) {
            console.error("Upload error:", error);
        }
    };

    return (
        <div>
            <Dropdown>
                <Dropdown.Toggle variant="success" id="dropdown-basic">
                    {formType === "pictures" ? "Add Pictures" : "Add Recipes"}
                </Dropdown.Toggle>

                <Dropdown.Menu style={{ width: "50%" }}>
                    <form onSubmit={handleSubmit}>
                        {formType === "recipes" && (
                            <div>
                                <label htmlFor="recipeName">Recipe Name:</label>
                                <input
                                    type="text"
                                    id="recipeName"
                                    value={recipeName}
                                    onChange={handleRecipeNameChange}
                                />
                            </div>
                        )}
                        <div
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                            }}
                        >
                            <button
                                type="button"
                                onClick={() =>
                                    document.getElementById("fileInput").click()
                                }
                            >
                                Add Picture(s)
                            </button>
                            <input
                                type="file"
                                id="fileInput"
                                style={{ display: "none" }}
                                onChange={handleFileChange}
                                multiple
                            />
                            <div>
                                {selectedFiles.map((file, index) => (
                                    <div key={index}>{file.name}</div>
                                ))}
                            </div>
                            <button onClick={handleSubmit}>Upload</button>
                        </div>
                    </form>
                </Dropdown.Menu>
            </Dropdown>
            {successMessage && (
                <div style={{ color: "white" }}>{successMessage}</div>
            )}
        </div>
    );
}

export default UploadForm;
