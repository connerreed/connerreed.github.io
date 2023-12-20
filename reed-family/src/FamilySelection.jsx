import React from "react";
import { Link } from "react-router-dom";
import Slideshow from "./Slideshow";
import "./FamilySelection.css";

function FamilySelection() {
    return (
        <>
            <div style={{ marginTop: "20px" }}>Choose a family!</div>
            <div className="family-selection-container">
                <div className="slideshow-container">
                    <Link
                        style={{ textDecoration: "none" }}
                        to="/home"
                        state={{ familySelection: "Lemonade" }}
                    >
                        <h1 className="slideshow-label">Lemonade</h1>
                        <Slideshow
                            className="slideshow"
                            elementType="pictures"
                        />
                    </Link>
                </div>
                <div class="slideshow-container">
                    <Link
                        style={{ textDecoration: "none" }}
                        to="/home"
                        state={{ familySelection: "Lance & Ricque" }}
                    >
                        <h1 className="slideshow-label">Lance & Ricque</h1>
                        <Slideshow
                            className="slideshow"
                            elementType="pictures"
                        />
                    </Link>
                </div>
                <div className="slideshow-container">
                    <Link
                        style={{ textDecoration: "none" }}
                        to="/home"
                        state={{ familySelection: "Mike & Lisa" }}
                    >
                        <h1 className="slideshow-label">Mike & Lisa</h1>
                        <Slideshow
                            className="slideshow"
                            elementType="pictures"
                        />
                    </Link>
                </div>
                <div className="slideshow-container">
                    <Link
                        style={{ textDecoration: "none" }}
                        to="/home"
                        state={{ familySelection: "Lance & Kelly" }}
                    >
                        <h1 className="slideshow-label">Lane & Kelly</h1>
                        <Slideshow
                            className="slideshow"
                            elementType="pictures"
                        />
                    </Link>
                </div>
            </div>
        </>
    );
}

export default FamilySelection;
