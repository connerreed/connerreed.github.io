import React from "react";
import { Navbar, Nav, NavDropdown, Container } from "react-bootstrap";

function ReedNavbar() {
	return (
		<Navbar
			className="bg-body-tertiary"
			fixed="top"
			data-bs-theme="dark"
			bg="dark"
			expand="lg"
		>
			<Container>
				<Navbar.Brand href="#home">Welcome Reed Family!</Navbar.Brand>
			</Container>
			<Navbar.Toggle aria-controls="basic-navbar-nav" />
			<Navbar.Collapse id="basic-navbar-nav">
				<Nav className="mr-auto">
					<Nav.Link href="#home">Home</Nav.Link>
					<Nav.Link href="#pictures">Pictures</Nav.Link>
					<Nav.Link href="#recipes">Recipes</Nav.Link>
				</Nav>
			</Navbar.Collapse>
		</Navbar>
	);
}

export default ReedNavbar;
