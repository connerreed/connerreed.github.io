import React, { useEffect, useState } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { HashRouter, Route, Routes } from "react-router-dom";
import ReedNavbar from "./ReedNavbar"; // Navbar component
import Recipes from "./Recipes"; // Recipes homepage
import Home from "./Home"; // Homepage
import Pictures from "./Pictures"; // Pictures homepage
import RecipeDetail from "./RecipeDetail"; // Recipe Detail page
import developMode from "./developMode";

function App() {
    const [isInitialized, setIsInitialized] = useState(false);
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
        <HashRouter>
            <div className="App">
                <ReedNavbar />
                <Routes>
                    <Route
                        path="/recipes/:recipeFolderName"
                        element={<RecipeDetail />}
                    />
                    <Route path="/recipes" element={<Recipes />} />
                    <Route path="/pictures" element={<Pictures />} />
                    <Route path="/" element={<Home />} />
                </Routes>
            </div>
        </HashRouter>
    );
}

export default App;
