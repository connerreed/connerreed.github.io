import React from "react";
import Carousel from "react-bootstrap/Carousel";
import { Container } from "react-bootstrap";
import "./Slideshow.css";

function shuffleArray(array) {
	for(let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]] // Swap elements
	}
	return array;
}

// Read documentation on React Bootstrap Carousel here: https://react-bootstrap.github.io/components/carousel/
function Slideshow({ elementList, elementType }) {
	const interval = 5000; // ms
	const maxItemsToShow = 10;
	const shuffledItems = shuffleArray([...elementList]); // Create a shuffled copy
	const itemsToShow = shuffledItems.slice(0, maxItemsToShow);

	return (
		//TODO: Fix sizing differences of pictures in slideshows
		<Container>
			<Carousel interval={`${interval}`} className="custom-slideshow">
				{itemsToShow.map((element) => (
					<Carousel.Item key={element.id}>
						<img
							className="d-block w-100"
							src={elementType === "pictures" ? element.link : element.coverImg.link}
							alt={elementType === "pictures" ? element.link : element.coverImg.link}
						/>
					</Carousel.Item>
				))}
			</Carousel>
		</Container>
	);
}

export default Slideshow;
