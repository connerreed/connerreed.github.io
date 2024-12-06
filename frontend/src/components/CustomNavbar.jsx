import React from "react";
import { Navbar, Nav, Offcanvas } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import {useNavigate, useLocation} from "react-router-dom";
import { Row, Col, Button } from "react-bootstrap";
import { useTheme } from "../contexts/ThemeContext";

function CustomNavbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const { darkMode } = useTheme();

    const showBackButton = !/^\/(recipes|pictures|videos|login|profile|)$/.test(
        location.pathname
    );

    return (
        <>
            <Navbar
                variant={darkMode ? "dark" : "light"}
                className="navbar-container"
                expand="lg"
                collapseOnSelect
            >
                <Navbar.Toggle aria-controls="offcanvasNavbar" />
                <Navbar.Brand onClick={() => navigate("/")}>
                    <h1 className="navbar-title">Reed Family</h1>
                </Navbar.Brand>
                <Navbar.Offcanvas
                    id="offcanvasNavbar"
                    aria-labelledby="offcanvasNavbarLabel"
                    placement="start"
                >
                    <Offcanvas.Header closeButton>
                        <Offcanvas.Title id="offcanvasNavbarLabel">
                            Menu
                        </Offcanvas.Title>
                    </Offcanvas.Header>
                    <Offcanvas.Body>
                        <Nav className="justify-content-center flex-grow-1">
                            <LinkContainer
                                to="/"
                                id="nav-home"
                                className="navbar-element"
                            >
                                <Nav.Link>Home</Nav.Link>
                            </LinkContainer>
                            <LinkContainer
                                to="/recipes"
                                id="nav-recipes"
                                className="navbar-element"
                            >
                                <Nav.Link>Recipes</Nav.Link>
                            </LinkContainer>
                            <LinkContainer
                                to="/pictures"
                                id="nav-pictures"
                                className="navbar-element"
                            >
                                <Nav.Link>Pictures</Nav.Link>
                            </LinkContainer>
                            <LinkContainer
                                to="/videos"
                                id="nav-videos"
                                className="navbar-element"
                            >
                                <Nav.Link>Videos</Nav.Link>
                            </LinkContainer>
                        </Nav>
                    </Offcanvas.Body>
                </Navbar.Offcanvas>
                <Nav className="profile-container">
                    <LinkContainer to="/profile" id="nav-profile">
                        <Nav.Link>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                fill="currentColor"
                                className="bi bi-person"
                                viewBox="0 0 16 16"
                            >
                                <path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                                <path
                                    fillRule="evenodd"
                                    d="M8 9a6 6 0 0 0-6 6v1h12v-1a6 6 0 0 0-6-6z"
                                />
                            </svg>
                        </Nav.Link>
                    </LinkContainer>
                </Nav>
            </Navbar>
            {showBackButton && (
                <Row>
                    <Col>
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
                                className="bi bi-arrow-left"
                                viewBox="0 0 16 16"
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"
                                />
                            </svg>
                            Back
                        </Button>
                    </Col>
                </Row>
            )}
        </>
    );
}

export default CustomNavbar;
