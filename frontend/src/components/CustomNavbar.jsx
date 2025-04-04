import React, { useEffect } from "react";
import { Navbar, Nav, Offcanvas } from "react-bootstrap";
import { LinkContainer } from "react-router-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { useTheme } from "../contexts/ThemeContext";

function CustomNavbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const { theme } = useTheme();

    const navElements = Array.from(
        document.getElementsByClassName("navbar-element")
    );
    const profileElement = document.getElementById("nav-profile");
    useEffect(() => {
        // This useEffect hook allows proper highlighting of nav elements even though they are seperate navs
        // FIXME: This is a performance hit solution and should be refactored
        const profileCurrentlyActive =
            profileElement?.classList.contains("active");
        const navElementActive = Array.from(navElements).some((element) =>
            element.classList.contains("active")
        );

        if (profileCurrentlyActive && location.pathname !== "/profile") {
            profileElement.classList.remove("active");
        }
        if (navElementActive && location.pathname === "/profile") {
            navElements?.forEach((element) =>
                element.classList.remove("active")
            );
        }
    }, [location, navElements, profileElement]);

    return (
        <>
            <Navbar
                variant={theme === "dark" ? "dark" : "light"}
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
                    className={theme === "dark" ? "dark-theme" : ""}
                    data-bs-theme={theme === "dark" ? "dark" : "light"}
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
        </>
    );
}

export default CustomNavbar;
