import React, {useState, useEffect} from "react";
import Slideshow from "./Slideshow"; // Slideshow component
import { Link } from "react-router-dom";
import developMode from "./developMode";

function Home({pictureList, recipeList}) {
	const [isInitialized, setIsInitialized] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function initialize() {
            try {
                const response = await fetch(
                    developMode
                        ? "http://localhost:3001/api/initialize"
                        : "https://reed-family-backend-b01b489ec3fe.herokuapp.com/api/initialize"
                );
                if (!response.ok) {
                    throw new Error("Failed to initialize data");
                }
                setIsInitialized(true);
            } catch (error) {
                setError(error.message);
            }
        }
        initialize();
    }, []);

    if (error) {
        return <div style={{ color: "white" }}>Error: {error}</div>;
    }

    if (!isInitialized) {
        return <div style={{ color: "white" }}>Loading...</div>;
    }
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
