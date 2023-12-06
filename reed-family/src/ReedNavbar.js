import React from "react";
import { Navbar, Nav } from "react-bootstrap";
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
					<Nav.Link href="#home">Home</Nav.Link>
					<Nav.Link href="#pictures">Pictures</Nav.Link>
					<Nav.Link href="#recipes">Recipes</Nav.Link>
				</Nav>
			</Navbar.Collapse>

			<Navbar.Brand
				href="#home"
				className="centered-navbar-brand"
			>
				Welcome Reed Family!
			</Navbar.Brand>
		</Navbar>
	);
}

export default ReedNavbar;
