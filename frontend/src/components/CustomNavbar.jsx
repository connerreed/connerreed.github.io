import React from "react";
import { Navbar, Nav, Container } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../css/CustomNavbar.css"; // Import custom CSS
import ReedFamilyIcon from "../imgs/ReedFamilyIcon.png"; // Import image
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

function CustomNavbar() {
    const location = useLocation();
    const navigate = useNavigate();

    const showBackButton = !/^\/(recipes|pictures|videos|)$/.test( // Everything besides the navigation pages
        location.pathname
    );

    return (
        <>
            <Navbar
                fixed="top"
                bg="dark"
                variant="dark"
                className="navbar-dark"
            >
                <Container>
                    <img
                        src={ReedFamilyIcon}
                        alt=""
                        className="navbar-logo"
                        style={{ height: "40px", width: "auto" }}
                    />
                    <Nav className="navbar-scroll">
                        <LinkContainer to="/">
                            <Nav.Link>Home</Nav.Link>
                        </LinkContainer>
                        <LinkContainer to="/recipes">
                            <Nav.Link>Recipes</Nav.Link>
                        </LinkContainer>
                        <LinkContainer to="/pictures">
                            <Nav.Link>Pictures</Nav.Link>
                        </LinkContainer>
                        <LinkContainer to="/videos">
                            <Nav.Link>Videos</Nav.Link>
                        </LinkContainer>
                    </Nav>
                    <Nav>
                        <LinkContainer to="/login">
                            <Nav.Link>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    fill="currentColor"
                                    className="bi bi-person"
                                    viewBox="0 0 16 16"
                                >
                                    <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6m2-3a2 2 0 1 1-4 0 2 2 0 0 1 4 0m4 8c0 1-1 1-1 1H3s-1 0-1-1 1-4 6-4 6 3 6 4m-1-.004c-.001-.246-.154-.986-.832-1.664C11.516 10.68 10.289 10 8 10s-3.516.68-4.168 1.332c-.678.678-.83 1.418-.832 1.664z" />
                                </svg>
                            </Nav.Link>
                        </LinkContainer>
                        <LinkContainer to="/register">
                            <Nav.Link>
                                Register
                            </Nav.Link>
                        </LinkContainer>
                    </Nav>
                </Container>
            </Navbar>
            <Container className="mt-5 pt-4">
                {showBackButton && (
                    <Row>
                        <Col className="d-flex justify-content-start">
                            <Button
                                variant="primary"
                                onClick={() => navigate(-1)}
                                className="mb-3"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="16"
                                    height="16"
                                    fill="currentColor"
                                    class="bi bi-arrow-left"
                                    viewBox="0 0 16 16"
                                >
                                    <path
                                        fill-rule="evenodd"
                                        d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"
                                    />
                                </svg>
                                Back
                            </Button>
                        </Col>
                    </Row>
                )}
            </Container>
        </>
    );
}

export default CustomNavbar;
