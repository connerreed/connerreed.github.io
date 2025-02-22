import { useState, useRef } from "react";
import "../css/FileUpload.css";
import { Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faCloudArrowUp } from "@fortawesome/free-solid-svg-icons";

const FileUpload = () => {
    const [files, setFiles] = useState([]);
    const fileInputRef = useRef(null);
    const dragCounter = useRef(0);

    const handleContainerClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);

        e.target.value = ""; // Clear the file input value so the same files can be selected again later
    };

    const handleDragEnter = (e) => {
        e.preventDefault();
        dragCounter.current++;
        if (dragCounter.current === 1) {
            const fileUpload = document.querySelector(".file-upload");
            fileUpload.classList.add("bg-secondary");
            console.log("Drag enter");
        }
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        dragCounter.current--;
        if (dragCounter.current === 0) {
            const fileUpload = document.querySelector(".file-upload");
            fileUpload.classList.remove("bg-secondary");
            console.log("Drag leave");
        }
    };

    // Add onDragOver to prevent the default browser behavior
    const handleDragOver = (e) => {
        e.preventDefault();
    };

    const handleDrop = (e) => {
        e.preventDefault();
        dragCounter.current = 0;
        const fileUpload = document.querySelector(".file-upload");
        fileUpload.classList.remove("bg-secondary");

        // Retrieve files from the DataTransfer object
        const droppedFiles = Array.from(e.dataTransfer.files);
        if (droppedFiles.length) {
            setFiles((prevFiles) => [...prevFiles, ...droppedFiles]);
            console.log("Dropped files:", droppedFiles);
        }
    };

    const handleDeleteImage = (fileToDelete) => {
        setFiles(files.filter((file) => file !== fileToDelete));
    };

    return (
        <div className="file-upload-container">
            {/* Hidden file input */}
            <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
                multiple
            />

            <div
                className="file-upload"
                onClick={handleContainerClick}
                onDragEnter={handleDragEnter}
                onDragLeave={handleDragLeave}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
            >
                <div className="file-upload-icon">
                    <FontAwesomeIcon icon={faCloudArrowUp} />
                </div>
                <p className="file-upload-text">
                    Add image(s)
                </p>
            </div>

            {files.length > 0 && (
                <ul className="file-upload-preview">
                    {files.map((file) => (
                        <li
                            key={file.name}
                            className="file-upload-item"
                        >
                            <img
                                src={URL.createObjectURL(file)}
                                alt={file.name}
                                className="file-upload-image"
                            />
                            <div>
                                <Button
                                    className="bg-danger border-0 ms-2"
                                    onClick={() => handleDeleteImage(file)}
                                >
                                    <FontAwesomeIcon icon={faTrash} />
                                </Button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default FileUpload;
