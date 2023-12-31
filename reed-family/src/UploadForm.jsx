import React, { useState, useRef } from "react";
import developMode from "./developMode";

function CustomDropdown({ label, children, isOpen, setIsOpen }) {
    const toggleRef = useRef(null);

    const toggleDropdown = () => setIsOpen(!isOpen);

    return (
        <div style={{ position: "relative" }}>
            <button
                ref={toggleRef}
                onClick={toggleDropdown}
                style={{
                    backgroundColor: "#28a745",
                    padding: "10px 15px",
                    border: "none",
                    borderRadius: "5px",
                    color: "white",
                }}
            >
                {`${label} ↓`}
            </button>
            {isOpen && (
                <div
                    style={{
                        position: "absolute",
                        left: "50%",
                        transform: "translateX(-50%)",
                        width: "50%",
                        backgroundColor: "#f8f9fa",
                        borderColor: "#dee2e6",
                        borderRadius: "0.25rem",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                        paddingTop: "5px",
                        zIndex: 1000,
                    }}
                >
                    {children}
                </div>
            )}
        </div>
    );
}

function UploadForm({ formType, familySelection }) {
    const hostURL = developMode
        ? "http://localhost:3001"
        : "https://reed-family-backend-b01b489ec3fe.herokuapp.com";
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [recipeName, setRecipeName] = useState("");
    const [message, setMessage] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const [authorName, setAuthorName] = useState(""); // New state for author's name
    const [selectedFamily, setSelectedFamily] = useState(familySelection);

    const handleFamilyChange = (event) => {
        setSelectedFamily(event.target.value);
    };

    const handleAuthorNameChange = (event) => {
        setAuthorName(event.target.value);
    };

    const handleFileChange = (event) => {
        const files = Array.from(event.target.files).filter(
            (file) => file.type.match("image.*") // Filter out non-image files
        );

        if (files.length !== event.target.files.length) {
            alert("Only image files are allowed.");
        }

        setSelectedFiles([...selectedFiles, ...files]);
    };

    const handleRecipeNameChange = (event) => {
        setRecipeName(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setMessage("Uploading... Please wait.");
        setIsOpen(false); // Close the dropdown

        const sanitizedRecipeName = recipeName.replace(/\s+/g, "_");
        const sanitizedAuthorName = authorName.replace(/\s+/g, "_");

        const formData = new FormData();
        selectedFiles.forEach((file) => {
            const sanitizedFileName = file.name.replace(/\s+/g, "_");
            const sanitizedFile = new File([file], sanitizedFileName, {
                type: file.type,
            });
            formData.append("files", sanitizedFile);
        });

        if (formType === "recipes") {
            formData.append("recipeName", sanitizedRecipeName);
            formData.append("authorName", sanitizedAuthorName);
        }

        try {
            const response = await fetch(
                `${hostURL}/api/upload/?type=${formType}&family=${selectedFamily}`,
                { method: "POST", body: formData }
            );

            if (response.ok) {
                setMessage("Files uploaded successfully!");
                setTimeout(() => {
                    // Force reload the page after showing the success message for 3 seconds
                    window.location.reload();
                }, 3000);
            } else {
                const errorMessage = await response.text();
                throw new Error(errorMessage);
            }
        } catch (error) {
            setMessage(
                "Failed to upload: " + error.message ||
                    "An unknown error occurred."
            );
        }
    };

    return (
        <div style={{ marginTop: "10px", textAlign: "center", color: "black" }}>
            <CustomDropdown
                label={formType === "pictures" ? "Add Pictures" : "Add Recipes"}
                isOpen={isOpen}
                setIsOpen={setIsOpen}
            >
                <form onSubmit={handleSubmit} style={{ padding: "10px" }}>
                    {/* Family dropdown */}
                    <div style={{ marginBottom: "10px" }}>
                        <label
                            htmlFor="familySelection"
                            style={{ marginRight: "5px" }}
                        >
                            Family:
                        </label>
                        <select
                            id="familySelection"
                            value={selectedFamily}
                            onChange={handleFamilyChange}
                        >
                            <option value="Lemonade">Lemonade</option>
                            <option value="Lance & Ricque">
                                Lance & Ricque
                            </option>
                            <option value="Mike & Lisa">Mike & Lisa</option>
                            <option value="Lance & Kelly">Lance & Kelly</option>
                        </select>
                    </div>
                    {formType === "recipes" && (
                        <>
                            <div style={{ marginBottom: "10px" }}>
                                <label
                                    htmlFor="recipeName"
                                    style={{ marginRight: "5px" }}
                                >
                                    Recipe Name:
                                </label>
                                <input
                                    type="text"
                                    id="recipeName"
                                    value={recipeName}
                                    onChange={handleRecipeNameChange}
                                />
                            </div>
                            <div style={{ marginBottom: "10px" }}>
                                <label
                                    htmlFor="authorName"
                                    style={{ marginRight: "5px" }}
                                >
                                    Your Name:
                                </label>
                                <input
                                    type="text"
                                    id="authorName"
                                    value={authorName}
                                    onChange={handleAuthorNameChange}
                                />
                            </div>
                        </>
                    )}
                    <div
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            marginBottom: "10px",
                        }}
                    >
                        <button
                            type="button"
                            onClick={() =>
                                document.getElementById("fileInput").click()
                            }
                            style={{ marginBottom: "10px" }}
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
                        {selectedFiles.map((file, index) => (
                            <div
                                key={index}
                                style={{
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                    maxWidth: "90%",
                                    marginBottom: "5px",
                                }}
                            >
                                {file.name}
                            </div>
                        ))}
                        <button type="submit">Upload</button>
                    </div>
                </form>
            </CustomDropdown>
            {message && (
                <div style={{ color: "white", marginTop: "10px" }}>
                    {message}
                </div>
            )}
        </div>
    );
}

export default UploadForm;
