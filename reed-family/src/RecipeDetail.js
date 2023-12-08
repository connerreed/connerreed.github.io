import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import recipeList from './recipeData'; // Import your recipe data

function RecipeDetail() {
  const { recipeId } = useParams();
  const [recipe, setRecipe] = useState(null);

  useEffect(() => {
    // Find the recipe in the recipeList by id
    const foundRecipe = recipeList.find(r => r.id.toString() === recipeId);
    setRecipe(foundRecipe);
  }, [recipeId]);

  if (!recipe) {
    return <div>Loading...</div>;
  }

  return (
    <div>
        <h1 style={{color: 'white'}}>{recipe.title}</h1>
      {/* Display the cover image */}
      <img src={require(`${recipe.coverSrc}`)} alt={`Cover of Recipe ${recipeId}`} />

      {/* Display additional recipe images if they exist */}
      {recipe.additionalImages && recipe.additionalImages.map((image, index) => (
        <img key={index} src={require(`${image}`)} alt={`Recipe Detail ${index + 1}`} />
      ))}
    </div>
  );
}

export default RecipeDetail;
