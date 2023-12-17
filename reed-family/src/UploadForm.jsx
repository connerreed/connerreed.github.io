import React, { useState, useRef } from 'react';

function CustomDropdown({ label, children, isOpen, setIsOpen }) {
    const toggleRef = useRef(null);

    const toggleDropdown = () => setIsOpen(!isOpen);

    return (
        <div style={{ position: 'relative' }}>
            <button
                ref={toggleRef}
                onClick={toggleDropdown}
                style={{ backgroundColor: '#28a745', color: 'white', padding: '10px 15px', border: 'none', borderRadius: '5px' }}
            >
                {`${label} ↓`}
            </button>
            {isOpen && (
                <div
                    style={{
                        position: 'absolute',
                        left: '50%',
                        transform: 'translateX(-50%)',
                        width: '50%',
                        backgroundColor: '#f8f9fa',
                        borderColor: '#dee2e6',
                        borderRadius: '0.25rem',
                        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                        paddingTop: '5px',
                        zIndex: 1000,
                    }}
                >
                    {children}
                </div>
            )}
        </div>
    );
}

function UploadForm({ formType }) {
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [recipeName, setRecipeName] = useState("");
    const [message, setMessage] = useState("");
    const [isOpen, setIsOpen] = useState(false);
    const developMode = false; // Set to true if running locally, false if running on Heroku

    const handleFileChange = (event) => {
        const files = Array.from(event.target.files).filter(file => 
            file.type.match('image.*') // Filter out non-image files
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

        const formData = new FormData();
        selectedFiles.forEach((file) => {
            formData.append("files", file);
        });

        if (formType === "recipes") {
            formData.append("recipeName", recipeName);
        }

        try {
            const response = await fetch(
                developMode ? `http://localhost:3001/upload/${formType}` : `https://reed-family-backend-b01b489ec3fe.herokuapp.com/upload/${formType}`,
                { method: "POST", body: formData }
            );

            if (response.ok) {
                setMessage("Files uploaded successfully!");
                setSelectedFiles([]);
                setRecipeName("");
                setTimeout(() => setMessage(""), 3000);
            } else {
                const errorData = await response.json();
                setMessage("Failed to upload: " + errorData.message);
            }
        } catch (error) {
            setMessage("Failed to upload: " + error.message);
        }
    };

    return (
        <div style={{ marginTop: '10px', textAlign: 'center' }}>
            <CustomDropdown label={formType === "pictures" ? "Add Pictures" : "Add Recipes"} isOpen={isOpen} setIsOpen={setIsOpen}>
                <form onSubmit={handleSubmit} style={{ padding: '10px' }}>
                    {formType === "recipes" && (
                        <div style={{ marginBottom: '10px' }}>
                            <label htmlFor="recipeName" style={{ marginRight: '5px' }}>Recipe Name:</label>
                            <input type="text" id="recipeName" value={recipeName} onChange={handleRecipeNameChange} />
                        </div>
                    )}
                    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: '10px' }}>
                        <button type="button" onClick={() => document.getElementById("fileInput").click()} style={{ marginBottom: '10px' }}>
                            Add Picture(s)
                        </button>
                        <input type="file" id="fileInput" style={{ display: "none" }} onChange={handleFileChange} multiple />
                        {selectedFiles.map((file, index) => (
                            <div key={index} style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "90%", marginBottom: '5px' }}>
                                {file.name}
                            </div>
                        ))}
                        <button type="submit">Upload</button>
                    </div>
                </form>
            </CustomDropdown>
            {message && (
                <div style={{ color: "white", marginTop: '10px' }}>{message}</div>
            )}
        </div>
    );
}

export default UploadForm;
