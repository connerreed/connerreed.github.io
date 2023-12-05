import React from "react";
import { Navbar, Nav} from "react-bootstrap";

function ReedNavbar() {
	return (
		<Navbar
			className="bg-body-tertiary"
			fixed="top"
			data-bs-theme="dark"
			bg="dark"
			expand="lg"
		>
			<Navbar.Toggle aria-controls="basic-navbar-nav" />
			<Navbar.Collapse id="basic-navbar-nav">
				<Nav className="mr-auto">
					<Nav.Link href="#home">Home</Nav.Link>
					<Nav.Link href="#pictures">Pictures</Nav.Link>
					<Nav.Link href="#recipes">Recipes</Nav.Link>
				</Nav>
			</Navbar.Collapse>
			<Navbar.Brand href="#home">Welcome Reed Family!</Navbar.Brand>
		</Navbar>
	);
}

export default ReedNavbar;
