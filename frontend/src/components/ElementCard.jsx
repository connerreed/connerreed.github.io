import React, { useState } from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../contexts/AuthContext";
//import Placeholder from "react-bootstrap/Placeholder";
//import Loading from "./Loading";

const ElementCard = ({ picture, handleShowModal }) => {
    const [loaded, setLoaded] = useState(false);
    const { userData } = useAuth();

    return (
        <>
            {
                //!loaded && <Loading />
            }

            {/* {!loaded && (
                <Placeholder as={Card} bg="secondary" animation="wave">
                    <Placeholder xs={6} bg="dark" />
                </Placeholder>
            )} */}
            <Card bg="secondary" hidden={!loaded}>
                <Link
                    to={`/pictures/${picture.id}`}
                    style={{ textDecoration: "none" }}
                >
                    <Card.Img
                        variant="top"
                        src={picture.image}
                        onLoad={() => setLoaded(true)}
                        //hidden={!loaded}
                        onError={(e) => {
                            e.target.src = "https://placehold.co/400/212529/white";
                        }}
                    />
                </Link>
                {
                //!loaded && <Loading />
                }
                <Card.Body className="d-flex justify-content-between align-items-center">
                    <Card.Title className="mb-0">
                        Uploaded by:
                        <br />
                        {picture.user.first_name + " " + picture.user.last_name}
                    </Card.Title>
                    {userData &&
                        (userData.is_superuser ||
                            userData.id === picture.user.id) && (
                            <Button
                                variant="dark"
                                onClick={() =>
                                    // Add popup asking for confirmation
                                    handleShowModal(picture.id)
                                }
                            >
                                <FontAwesomeIcon icon={faTrash} />
                            </Button>
                        )}
                </Card.Body>
            </Card>
        </>
    );
};

export default ElementCard;
