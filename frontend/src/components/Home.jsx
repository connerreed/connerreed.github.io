import React, { useEffect } from "react";
import "../css/Home.css";
import ReedFamiyPicture from "../imgs/ReedFamilyPicture.jpeg";

const Home = () => {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <>
            <div>
                <h1 className="home-title">Welcome Reed Family!</h1>
            </div>
            <div className="d-flex justify-content-center">
                <img
                    src={ReedFamiyPicture}
                    className="family-picture"
                    onError={(e) => {
                        e.target.style.display = "none"; // Removes broken image icon
                    }}
                    alt="Reed Family"
                />
            </div>
            <div>{/* TODO: Add a frame for family tree */}</div>
            <div>
                {/* TODO: Add a carousel for each content type on this div */}
            </div>
        </>
    );
};

export default Home;
