import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Slideshow from "./Slideshow"; // Slideshow component
import { Link } from "react-router-dom";
import developMode from "./developMode";

function Home() {
    const location = useLocation();
    const [isInitialized, setIsInitialized] = useState(false);
    const familySelection = location.state?.familySelection;
    const [error, setError] = useState(null);

    useEffect(() => {
        async function initialize() {
            try {
                const response = await fetch(
                    developMode
                        ? "http://localhost:3001/api/initialize"
                        : "https://reed-family-backend-b01b489ec3fe.herokuapp.com/api/initialize"
                );
                if (!response.ok) {
                    throw new Error("Failed to initialize data");
                }
                setIsInitialized(true);
            } catch (error) {
                setError(error.message);
            }
        }
        initialize();
    }, []);

    if (error) {
        return <div style={{ color: "white" }}>Error: {error}</div>;
    }

    if (!isInitialized) {
        return <div style={{ color: "white" }}>Loading...</div>;
    }
    return (
        <div className="container">
            <h1 style={{ color: "white" }}>
                Selected Family: {familySelection}
            </h1>
            <Link
                to="/pictures"
                className="slideshowLink"
                state={{ familySelection: { familySelection } }}
            >
                <h1 className="slideshowLabel">Pictures</h1>
                <Slideshow
                    className="slideshow"
                    elementType="pictures"
                    familySelection={familySelection}
                />
            </Link>
            <Link
                to="/recipes"
                className="slideshowLink"
                state={{ familySelection: { familySelection } }}
            >
                <h1 className="slideshowLabel">Recipes</h1>
                <Slideshow
                    className="slideshow"
                    elementType="recipes"
                    familySelection={familySelection}
                />
            </Link>
        </div>
    );
}

export default Home;
