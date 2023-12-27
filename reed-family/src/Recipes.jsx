import React from 'react';
import Gallery from './Gallery';
import UploadForm from './UploadForm';
import {useLocation, Link} from 'react-router-dom';

function Recipes({recipeList}) {
	const location = useLocation();
	const familySelection = location.state?.familySelection;
	return (
		<div style={{position: 'relative'}}>
			<Link to="/recipeUploadForm">Upload a Recipe</Link>
			<UploadForm formType="recipes" familySelection={familySelection}/>
			<Gallery elementList={recipeList} elementType="recipes" familySelection={familySelection}/>
		</div>
	);
}

export default Recipes;
