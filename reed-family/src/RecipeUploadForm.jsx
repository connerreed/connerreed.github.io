/*  
    TODO: Add implementation for generating recipe image & regeneration (regenerated image should be a different image each time)
    TODO: Fix cases in initial image generation where recipeName is whitespace or random gibberish
    TODO: Maybe position generated image under generatedImage radio instead of above (below might look better, but how it is now is 
                                                                                        keeping both kinds of file input in one spot
                                                                                        in the code)
*/

import React, { useState } from "react";
import "./RecipeUploadForm.css";

function RecipeUploadForm() {
	const folderNames = ["Lebanese", "Italian", "Mexican", "Greek", "Grill"];
	const [recipeName, setRecipeName] = useState("");
	const [uploaderName, setUploaderName] = useState("");
	const [recipeAuthor, setRecipeAuthor] = useState("");
	const [mealType, setMealType] = useState("Dinner");
	const [uploaderMadeRecipe, setUploaderMadeRecipe] = useState(true);
	const [addToFolderSelected, setAddToFolderSelected] = useState(false);
	const [selectedFolders, setSelectedFolders] = useState([]);
	const [submitted, setSubmitted] = useState(false);
	const [previewImageType, setPreviewImageType] = useState("generatedImage"); // ownImage || generatedImage
	// For generatedImageLoaded: null = no image request, false = image requested and is loading, true = image requested and has loaded
	const [generatedImageLoaded, setGeneratedImageLoaded] = useState(null); // TODO: add loading implementation to api call for generated image
	const [currentGeneratedImageLink, setCurrentGeneratedImageLink] = useState(""); // TODO: add implementation to api call for generated image
	const [inputFile, setInputFile] = useState(null); // State for user uploaded file

	const handleSubmit = async (event) => {
		// TODO: handle previewImage file transfer to backend (either generated image or user uploaded file)
		event.preventDefault(); // ensures form submission is handled by this function instead of the default way: being handled by HTML
		if (!validateForm()) return;
		console.log("Recipe Name: ", recipeName);
		console.log("Uploader Name: ", uploaderName);
		if (!uploaderMadeRecipe) console.log("Recipe Author: ", recipeAuthor);
		console.log("Meal Type: ", mealType);
		console.log("Made Recipe: ", uploaderMadeRecipe);
		if (addToFolderSelected)
			console.log("Selected Folders: ", selectedFolders);
		setSubmitted(true);
		if (previewImageType === "ownImage")
			console.log("Uploaded file name: ", inputFile);
		else
			console.log("Generated file link: ", currentGeneratedImageLink)
	};

	const validateForm = () => {
		if (addToFolderSelected && selectedFolders.length === 0) {
			alert("Please select at least one folder to add the recipe to.");
			return false;
		}
		return true;
	};

	const toggleFolderSelection = (folderName) => {
		if (selectedFolders.includes(folderName)) {
			// If the folder is already selected, remove it from the list of selected folders
			setSelectedFolders(
				selectedFolders.filter((item) => item !== folderName) // keep all items that are not folderName
			);
		} else {
			// If the folder is not already selected, add it to the list of selected folders
			setSelectedFolders([...selectedFolders, folderName]);
		}
	};

	const generateImage = () => {
		if (
			recipeName !== "" && // don't generate image if recipeName field is blank (TODO: fix cases where recipeName is gibberish or whitespace)
			generatedImageLoaded !== true // don't generate image if there's already an image generated (that's what the regenerate button is for)
		) {
			handleGeneratedImageGrab();
		}
	};

	const handleGeneratedImageGrab = () => {
		// TODO: use recipeName state for name of image search
		setGeneratedImageLoaded(false); // image requested and is loading
		// set currentImageLink to something
		setCurrentGeneratedImageLink(
			"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRH4TP-O3KE3_sLs1sbH_uNo4vBnwEccSbOGeIfOm2-R17Ezi_QN_g0p4D7tR56ihTU96k&usqp=CAU"
		); // stock lasagna picture for testing
		setTimeout(() => setGeneratedImageLoaded(true), 2000); // image has been grabbed, turn off loading
	};

	// TODO: finish this method with real API call
	const regenerateImage = () => {
		setGeneratedImageLoaded(false);
		// change currentImageLink to new image link
		setTimeout(() => setGeneratedImageLoaded(true), 2000);
	};

	const handleFileChange = (event) => {
		setInputFile(event.target.files[0]);
	};

	if (submitted)
		return (
			<div>
				<div>Recipe Name: {recipeName}</div>
				<div>Uploader Name: {uploaderName}</div>
				{!uploaderMadeRecipe && (
					<div>Recipe Author: {recipeAuthor}</div>
				)}
				<div>Meal Type: {mealType}</div>
				{addToFolderSelected && (
					<div>Selected Folders: {selectedFolders.join(", ")}</div>
				)}
				{previewImageType === "ownImage" && (
					<div>Uploaded image name: {inputFile.name}</div>
				)}
				{previewImageType === "generatedImage" && (
					<div>Generated image link: {currentGeneratedImageLink}</div>
				)}
			</div>
		);

	return (
		<>
			<h1 class="formTitle">Recipe Upload Form</h1>
			<div className="formContainer">
				<form class="form" onSubmit={handleSubmit}>
					<div className="formElement">
						<label htmlFor="recipeName">Recipe Name:</label>
						<input
							id="recipeName"
							value={recipeName}
							type="text"
							placeholder="Recipe Name"
							required
							onChange={(e) => {
								setRecipeName(e.target.value);
								setGeneratedImageLoaded(null);
							}}
							onBlur={() => {
								// when someone clicks off of this field
								if (previewImageType === "generatedImage")
									// don't generate if previewImageType === "ownImage"
									generateImage();
							}}
						/>
					</div>
					<div className="formElement">
						<label htmlFor="uploaderName">Your Name:</label>
						<input
							id="uploaderName"
							value={uploaderName}
							type="text"
							placeholder="Your Name"
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
							value={uploaderMadeRecipe}
							type="checkbox"
							onClick={(e) =>
								setUploaderMadeRecipe(!e.target.checked)
							}
						/>
					</div>
					{!uploaderMadeRecipe && (
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
							<option value="Breakfast">Breakfast</option>
							<option value="Lunch">Lunch</option>
							<option value="Dinner">Dinner</option>
							<option value="Dessert">Dessert</option>
							<option value="Snack">Snack</option>
							<option value="Misc">Misc</option>
						</select>
					</div>
					<div className="formElement">
						<label htmlFor="addToFolder">Add to folder(s): </label>
						<input
							id="addToFolder"
							type="checkbox"
							checked={addToFolderSelected}
							onChange={(e) =>
								setAddToFolderSelected(e.target.checked)
							}
						/>
					</div>
					{addToFolderSelected && (
						<div className="formElement">
							<div>Choose Folders:</div>
							<div
								className="scrollableCheckboxList" // custom CSS class in 'RecipeUploadForm.css'
								id="foldersToAddTo"
							>
								{folderNames.map((folderName) => (
									<div
										key={folderName}
										className="folderListItem"
									>
										<input
											type="checkbox"
											id={folderName}
											checked={selectedFolders.includes(
												folderName
											)}
											onChange={() =>
												toggleFolderSelection(
													folderName
												)
											}
										/>
										<label htmlFor={folderName}>
											{folderName}
										</label>
									</div>
								))}
							</div>
						</div>
					)}
					<div className="formElement">
						Choose Preview Image Type:
					</div>
					<div
						className="formElement"
						style={{ display: "flex", flexDirection: "column" }}
					>
						<div>
							<label htmlFor="ownImage">Upload Image:</label>
							<input
								id="ownImage"
								type="radio"
								name="previewImageType"
								value="ownImage"
								checked={previewImageType === "ownImage"}
								onChange={() => setPreviewImageType("ownImage")}
							/>
						</div>
						<div className="imageInput">
							{previewImageType === "ownImage" && (
								<input
									type="file"
									onChange={handleFileChange}
									accept="image/*"
									required
								/>
							)}
							{previewImageType === "generatedImage" && (
								<>
									{generatedImageLoaded === false && (
										<div>Loading...</div>
									)}
									{generatedImageLoaded && (
										<div>
											<img
												src={currentGeneratedImageLink}
												alt="generated preview"
											/>
											<button
												type="button"
												onClick={regenerateImage}
											>
												Regenerate Image
											</button>
										</div>
									)}
								</>
							)}
						</div>
						<div>
							<label htmlFor="generatedImage">
								Generated Image:
							</label>
							<input
								id="generatedImage"
								type="radio"
								name="previewImageType"
								value="generatedImage"
								checked={previewImageType === "generatedImage"}
								onChange={() => {
									setPreviewImageType("generatedImage");
									generateImage();
								}}
							/>
						</div>
					</div>

					<div className="formElement">
						<button type="submit">Submit</button>
					</div>
				</form>
			</div>
		</>
	);
}

export default RecipeUploadForm;
