import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./RecipeDetail.css";
import developMode from "./developMode";

function RecipeDetail() {
    const hostURL = developMode
        ? "http://localhost:3001"
        : "https://reed-family-backend-b01b489ec3fe.herokuapp.com";
    const { recipeFolderName } = useParams();
    const [recipe, setRecipe] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Find the recipe in the recipeList by id
        async function fetchRecipe() {
            const recipeName = encodeURIComponent(recipeFolderName);
            try {
                const url = `${hostURL}/api/recipes?name=${recipeName}`;
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                setRecipe(data);
                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching recipe:", error);
                setError(error);
                setIsLoading(false);
            }
        }
        fetchRecipe();
    }, [recipeFolderName, hostURL]);

    if (isLoading) {
        return <div style={{ color: "white" }}>Loading...</div>;
    }

    if (error) {
        return (
            <div style={{ color: "white" }}>
                Error loading recipe: {error.message}
            </div>
        );
    }

    if (!recipe) {
        return <div style={{ color: "white" }}>Recipe not found</div>;
    }

    return (
        <div>
            <h1>
                {recipe.coverImg.name
                    .replace(/_/g, " ")
                    .replace(/\.[^.]+$/, "")}
            </h1>
            {/* Display the cover image */}
            <img
                src={`${hostURL}/image/${recipe.coverImg.name}`}
                alt={`Cover of Recipe ${recipe.coverImg.name}`}
            />

            <h1>Instructions</h1>
            {recipe.descriptionImgs.map((image, index) => (
                <img
                    key={index}
                    src={`${hostURL}/image/${image.name}`}
                    alt={`Recipe Detail ${index + 1}`}
                    className="detail-img"
                />
            ))}
        </div>
    );
}

export default RecipeDetail;
