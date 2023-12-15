import React, { useState, useEffect } from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import {
    BrowserRouter as Router,
    Route,
    Routes,
} from "react-router-dom";
import ReedNavbar from "./ReedNavbar"; // Navbar component
import Recipes from "./Recipes"; // Recipes homepage
import Home from "./Home"; // Homepage
import Pictures from "./Pictures"; // Pictures homepage
import RecipeDetail from "./RecipeDetail"; // Recipe Detail page

async function fetchPictureList() {
    try {
        const response = await fetch(
            "https://reed-family-backend-b01b489ec3fe.herokuapp.com/api/pictures"
        );
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Fetch error:", error);
        return [];
    }
}

async function fetchRecipeList() {
    try {
        const response = await fetch(
            "https://reed-family-backend-b01b489ec3fe.herokuapp.com/api/recipes"
        );
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Fetch error:", error);
        return [];
    }
}

function App() {
    const [pictureList, setPictureList] = useState([]);
    const [recipeList, setRecipeList] = useState([]);

    useEffect(() => {
        fetchPictureList().then((data) => setPictureList(data));
        fetchRecipeList().then((data) => setRecipeList(data));
    }, []);

    return (
        <Router>
            <div className="App">
                <ReedNavbar />
                <Routes>
                    <Route
                        path="/recipes/:recipeFolderName"
                        element={<RecipeDetail recipeList={recipeList} />}
                    />
                    <Route
                        path="/recipes"
                        element={<Recipes recipeList={recipeList} />}
                    />
                    <Route
                        path="/pictures"
                        element={<Pictures pictureList={pictureList} />}
                    />
                    <Route
                        path="/"
                        element={
                            <Home
                                pictureList={pictureList}
                                recipeList={recipeList}
                            />
                        }
                    />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
