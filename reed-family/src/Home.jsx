import React from "react";
import Slideshow from "./Slideshow"; // Slideshow component
import { Link } from "react-router-dom";

function Home({pictureList, recipeList}) {

	return (
		<div className="container">
			<Link to="/pictures" className="slideshowLink">
				<h1 className="slideshowLabel">Pictures</h1>
			</Link>
			<Slideshow className="slideshow" elementList={pictureList} elementType="pictures" />
            <Link to="/recipes" className="slideshowLink">
				<h1 className="slideshowLabel">Recipes</h1>
			</Link>
			<Slideshow className="slideshow" elementList={recipeList} elementType="recipes"/>
		</div>
	);
}

export default Home;
