import React, { useState } from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faCircleDown } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../contexts/AuthContext";

const ElementCard = ({ element, handleShowModal, CardBody }) => {
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
                    to={`/pictures/${element.id}`}
                    style={{ textDecoration: "none" }}
                >
                    <Card.Img
                        variant="top"
                        src={element.thumbnail}
                        onLoad={() => setLoaded(true)}
                        onError={(e) => {
                            e.target.src =
                                "https://placehold.co/300/212529/white";
                        }}
                    />
                </Link>
                {
                    //!loaded && <Loading />
                }
                <Card.Body className="d-flex justify-content-between align-items-center">
                    {CardBody}
                    <a
                        href={element.image}
                        download={`picture_${element.id}.jpg`}
                        style={{ textDecoration: "none" }}
                    >
                        <Button variant="dark">
                            <FontAwesomeIcon icon={faCircleDown} />
                        </Button>
                    </a>

                    {userData &&
                        (userData.is_superuser ||
                            userData.id === element.user.id) && (
                            <Button
                                variant="dark"
                                onClick={() =>
                                    // Add popup asking for confirmation
                                    handleShowModal(element.id)
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
