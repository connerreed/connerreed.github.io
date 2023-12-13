import React from "react";
import Carousel from "react-bootstrap/Carousel";
import { Container } from "react-bootstrap";
import "./Slideshow.css";

// Read documentation on React Bootstrap Carousel here: https://react-bootstrap.github.io/components/carousel/
function Slideshow({ elementList, elementType }) {
	const interval = 5000; // ms

	return (
		//TODO: Fix sizing differences of pictures in slideshows
		<Container>
			<Carousel interval={`${interval}`} className="custom-slideshow">
				{elementList.map((element) => (
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
