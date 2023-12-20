import React, { useState, useEffect } from "react";
import { Container, Carousel } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import "./Slideshow.css";
import developMode from "./developMode";

function Slideshow({ elementType }) {
    const [elementList, setElementList] = useState([]); // State to store the fetched list of elements
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const location = useLocation();
    const familySelection = location.state?.familySelection;
    const interval = 5000; // ms

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch(
                    developMode
                        ? `http://localhost:3001/api/items?type=${elementType}&family=${familySelection}&slideshow`
                        : `https://reed-family-backend-b01b489ec3fe.herokuapp.com/api/items?type=${elementType}&family=${familySelection}&slideshow`
                );
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                const data = await response.json();
                setElementList(data); // Update the state with the fetched data
                setIsLoading(false);
            } catch (error) {
                console.error("Fetch error:", error);
                setError(error);
                setIsLoading(false);
            }
        }

        fetchData();
    }, [elementType, familySelection]);

    if (isLoading) {
        return <div style={{ color: "white" }}>Loading...</div>;
    }

    if (error) {
        return (
            <div style={{ color: "white" }}>
                Error loading slideshow: {error.message}
            </div>
        );
    }

    if (!elementList) {
        return <div style={{ color: "white" }}>No elements found</div>;
    }

    return (
        <Container>
            <Carousel interval={interval} className="custom-slideshow">
                {elementList.map((element) => (
                    <Carousel.Item style={{ color: "white" }} key={element.id}>
                        <img
                            className="d-block w-100"
                            src={
                                elementType === "pictures"
                                    ? `data:${element.mimeType};base64,${element.image}`
                                    : `data:${element.coverImg.mimeType};base64,${element.coverImg.image}`
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
