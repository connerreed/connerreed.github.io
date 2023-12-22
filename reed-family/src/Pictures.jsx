import React from "react";
import Gallery from "./Gallery";
import UploadForm from "./UploadForm";
import { useLocation } from "react-router-dom";

function Pictures({ pictureList }) {
    const location = useLocation();
    const familySelection = location.state?.familySelection;
    return (
        <div style={{ position: "relative" }}>
            
            <UploadForm formType="pictures" familySelection={familySelection} />
            <Gallery
                elementList={pictureList}
                elementType="pictures"
                familySelection={familySelection}
            />
        </div>
    );
}

export default Pictures;
