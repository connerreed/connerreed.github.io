import React, { useState } from "react";
import "./RecipeUploadForm.css";

function RecipeUploadForm() {
    const folderNames = ["Lebanese", "Italian", "Mexican", "Greek", "Grill"];
    const [recipeName, setRecipeName] = useState("");
    const [uploaderName, setUploaderName] = useState("");
    const [recipeAuthor, setRecipeAuthor] = useState("");
    const [mealType, setMealType] = useState("dinner");
    const [madeRecipe, setMadeRecipe] = useState(true);
    const [addToFolder, setAddToFolder] = useState(false);
    const [selectedFolders, setSelectedFolders] = useState([]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log("Recipe Name: ", recipeName);
        console.log("Uploader Name: ", uploaderName);
        if (!madeRecipe) console.log("Recipe Author: ", recipeAuthor);
        console.log("Meal Type: ", mealType);
        console.log("Made Recipe: ", madeRecipe);
        if (addToFolder) console.log("Selected Folders: ", selectedFolders);
    };

    const toggleFolderSelection = (folderName) => {
        if (selectedFolders.includes(folderName)) {
            // If the folder is already selected, remove it from the list of selected folders
            setSelectedFolders(selectedFolders.filter(item => item !== folderName));
        } else {
            // If the folder is not already selected, add it to the list of selected folders
            setSelectedFolders([...selectedFolders, folderName]);
        }
    }

    return (
        <>
            <h1>Recipe Upload Form</h1>
            <div className="formContainer">
                <form onSubmit={handleSubmit}>
                    <div className="formElement">
                        <label htmlFor="recipeName">Recipe Name:</label>
                        <input
                            id="recipeName"
                            value={recipeName}
                            type="text"
                            placeholder="Recipe Name"
                            required
                            onChange={(e) => setRecipeName(e.target.value)}
                        />
                    </div>
                    <div className="formElement">
                        <label htmlFor="uploaderName">Your Name:</label>
                        <input
                            id="uploaderName"
                            value={uploaderName}
                            type="text"
                            placeholder="Your name"
                            required
                            onChange={(e) => setUploaderName(e.target.value)}
                        />
                    </div>
                    <div className="formElement">
                        <label htmlFor="madeRecipe">
                            Is this someone else's recipe?
                        </label>
                        <input
                            id="madeRecipe"
                            value={madeRecipe}
                            type="checkbox"
                            onClick={(e) => setMadeRecipe(!e.target.checked)}
                        />
                    </div>
                    {!madeRecipe && (
                        <div className="formElement">
                            <label htmlFor="recipeAuthor">Recipe Author:</label>
                            <input
                                id="recipeAuthor"
                                value={recipeAuthor}
                                type="text"
                                placeholder="Recipe Author"
                                required
                                onChange={(e) =>
                                    setRecipeAuthor(e.target.value)
                                }
                            />
                        </div>
                    )}
                    <div className="formElement">
                        <label htmlFor="mealType">Meal Type:</label>
                        <select
                            id="mealType"
                            value={mealType}
                            required
                            onChange={(e) => setMealType(e.target.value)}
                        >
                            <option value="breakfast">Breakfast</option>
                            <option value="lunch">Lunch</option>
                            <option value="dinner">Dinner</option>
                            <option value="dessert">Dessert</option>
                            <option value="snack">Snack</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    <div className="formElement">
                        <label htmlFor="addToFolder">Add to folder(s): </label>
                        <input
                            id="addToFolder"
                            type="checkbox"
                            value={addToFolder}
                            onClick={(e) => setAddToFolder(e.target.checked)}
                        />
                    </div>
                    {addToFolder && (
                        <div className="formElement">
                            <label htmlFor="foldersToAddTo">
                                Choose Folders:
                            </label>
                            <select id="foldersToAddTo" value={selectedFolders} required multiple onChange={(e) => toggleFolderSelection(e.target.value)}>
                                {folderNames.map((folderName) => (
                                    <option key={folderName} value={folderName}>{folderName}</option>
                                ))}
                            </select>
                        </div>
                    )}
                    <div className="formElement">
                        <button type="submit">Submit</button>
                    </div>
                </form>
            </div>
        </>
    );
}

export default RecipeUploadForm;
