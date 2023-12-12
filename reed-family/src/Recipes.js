import React from 'react';
import Gallery from './Gallery';

function Recipes({recipeList}) {
	return (
		<div>
			<Gallery elementList={recipeList} elementType="recipes"/>
		</div>
	);
}

export default Recipes;
