import React, { useState } from "react";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faCircleDown } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../contexts/AuthContext";

const ElementCard = ({ element, elementType, handleShowModal, CardBody }) => {
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
                    to={`/${elementType}/${element.id}`}
                    style={{ textDecoration: "none" }}
                >
                    <Card.Img
                        variant="top"
                        src={elementType === "picture" ? element.thumbnail : element.thumbnail_transformed}
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
                <Card.Body>
                    {CardBody}
                    <div className="d-flex justify-content-between align-items-center">
                        <div className="d-inline">
                            <Card.Title className="mb-0">
                                {elementType === "recipe"
                                    ? element.recipeAuthor
                                    : `${element.user.first_name} ${element.user.last_name}`}
                            </Card.Title>
                        </div>
                        <div className="d-inline ms-2">
                            <a
                                href={element.image}
                                download={`picture_${element.id}.jpg`}
                                style={{ textDecoration: "none" }}
                            >
                                {elementType !== "recipe" && (
                                    <Button variant="dark">
                                        <FontAwesomeIcon icon={faCircleDown} />
                                    </Button>
                                )}
                            </a>

                            {userData &&
                                (userData.is_superuser ||
                                    userData.id === element.user.id) && (
                                    <Button
                                        className="ms-2"
                                        variant="dark"
                                        onClick={() =>
                                            // Add popup asking for confirmation
                                            handleShowModal(element.id)
                                        }
                                    >
                                        <FontAwesomeIcon icon={faTrash} />
                                    </Button>
                                )}
                        </div>
                    </div>
                </Card.Body>
            </Card>
        </>
    );
};

export default ElementCard;
