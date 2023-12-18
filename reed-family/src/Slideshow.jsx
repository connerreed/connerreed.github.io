import React, { useState, useEffect } from "react";
import { Container, Carousel } from "react-bootstrap";
import "./Slideshow.css";
import developMode from "./developMode";


function Slideshow({ elementType }) {
    const [elementList, setElementList] = useState([]); // State to store the fetched list of elements
    const interval = 5000; // ms

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch(
                    developMode
                        ? `http://localhost:3001/api/items?type=${elementType}&slideshow`
                        : `https://reed-family-backend-b01b489ec3fe.herokuapp.com/api/items?type=${elementType}&slideshow`
                );
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                setElementList(data); // Update the state with the fetched data
            } catch (error) {
                console.error("Fetch error:", error);
            }
        }

        fetchData();
    }, [elementType]);

    return (
        <Container>
            <Carousel interval={interval} className="custom-slideshow">
                {elementList.map((element) => (
                    <Carousel.Item key={element.id}>
                        <img
                            className="d-block w-100"
                            src={
                                elementType === "pictures"
                                    ? element.link
                                    : element.coverImg.link
                            }
                            alt={
                                elementType === "pictures"
                                    ? element.name
                                    : element.coverImg.name
                            }
                        />
                    </Carousel.Item>
                ))}
            </Carousel>
        </Container>
    );
}

export default Slideshow;
