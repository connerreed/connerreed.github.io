import React from "react";
import Slideshow from "./Slideshow"; // Slideshow component
import { Link } from "react-router-dom";
import pictureList from './pictureData';
import recipeList from './recipeData';

/*const elementList = [
  {id: 1, name: "Pictures", link: "#", images: pictureList}, // TODO: add link to picture landing page
  {id: 2, name: "Recipes", link: "#", images: recipeList}, // TODO: add link to recipe landing page
];
*/

function Home() {
	return (
		<div className="container">
			<Link to="/pictures" className="slideshowLink">
				<h1 className="slideshowLabel">Pictures</h1>
			</Link>
			<Slideshow className="slideshow" elementList={pictureList} />
            <Link to="/recipes" className="slideshowLink">
				<h1 className="slideshowLabel">Recipes</h1>
			</Link>
			<Slideshow className="slideshow" elementList={recipeList} />
		</div>
	);
}

export default Home;
