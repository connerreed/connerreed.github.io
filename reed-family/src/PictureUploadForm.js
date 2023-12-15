import React, { useState } from "react";
import { Dropdown } from "react-bootstrap";

function PictureUploadForm() {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [successMessage, setSuccessMessage] = useState("");

    const handleFileChange = (event) => {
        setSelectedFiles([...selectedFiles, ...Array.from(event.target.files)]);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = new FormData();
        selectedFiles.forEach((file) => {
            formData.append("files", file);
        });

        try {
            const response = await fetch(
                "https://reed-family-backend-b01b489ec3fe.herokuapp.com/upload/pictures",
                {
                    method: "POST",
                    body: formData,
                }
            );

            if (response.ok) {
                setSelectedFiles([]); // Clear the file list
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
                    Upload Pictures
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    <form onSubmit={handleSubmit}>
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
                                Add Picture
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
                <div className="success-message">{successMessage}</div>
            )}
        </div>
    );
}

export default PictureUploadForm;
