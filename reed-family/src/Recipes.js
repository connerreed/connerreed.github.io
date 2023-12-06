import React from 'react';
import Gallery from './Gallery';
import recipeList from './recipeData';

function Recipes() {
	return (
		<div>
			<Gallery elementList={recipeList} />
		</div>
	);
}

export default Recipes;
