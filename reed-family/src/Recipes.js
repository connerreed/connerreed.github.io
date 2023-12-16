import React from 'react';
import Gallery from './Gallery';
import UploadForm from './UploadForm';

function Recipes({recipeList}) {
	return (
		<div>
			<UploadForm formType="recipes"/>
			<Gallery elementList={recipeList} elementType="recipes"/>
		</div>
	);
}

export default Recipes;
