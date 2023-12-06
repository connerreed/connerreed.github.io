import React from "react";
import { Navbar, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import "./ReedNavbar.css";
function ReedNavbar() {
	return (
		<Navbar
			fixed="top"
			data-bs-theme="dark"
			bg="dark"
			expand="lg"
			className="my-navbar"
		>
			<Navbar.Toggle aria-controls="basic-navbar-nav" />
			<Navbar.Collapse id="basic-navbar-nav">
				<Nav className="me-auto">
					<Link to="/" className="nav-link">
						Home
					</Link>
					<Link to="/pictures" className="nav-link">
						Pictures
					</Link>
					<Link to="/recipes" className="nav-link">
						Recipes
					</Link>
				</Nav>
			</Navbar.Collapse>

			<Link to="/" className="centered-navbar-brand">
				<Navbar.Brand className="centered-navbar-brand">
					Welcome Reed Family!
				</Navbar.Brand>
			</Link>
		</Navbar>
	);
}

export default ReedNavbar;
