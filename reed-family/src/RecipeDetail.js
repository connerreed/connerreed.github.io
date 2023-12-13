import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

function RecipeDetail({ recipeList }) {
	const { recipeFolderName } = useParams();
	const [recipe, setRecipe] = useState(null);

	useEffect(() => {
		// Find the recipe in the recipeList by id
		const foundRecipe = recipeList.find(
			(r) => r.folderName === recipeFolderName
		);
		setRecipe(foundRecipe);
	}, [recipeFolderName, recipeList]);

	if (!recipe) {
		return <div>Loading...</div>;
	}

	return (
		<div>
			<h1 style={{ color: "white" }}>{recipe.coverImg.name}</h1>
			{/* Display the cover image */}
			<img
				src={recipe.coverImg.link}
				alt={`Cover of Recipe ${recipe.coverImg.name}`}
			/>

			{/* TODO: Display additional recipe images if they exist */}
			{/*recipe.additionalImages && recipe.additionalImages.map((image, index) => (
        <img key={index} src={require(`${image}`)} alt={`Recipe Detail ${index + 1}`} />
      ))*/}
		</div>
	);
}

export default RecipeDetail;
