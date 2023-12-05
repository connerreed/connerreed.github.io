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
					<Nav.Link href="#link">Link</Nav.Link>
					<NavDropdown title="Dropdown" id="basic-nav-dropdown">
						<NavDropdown.Item href="#action/3.1">
							Action
						</NavDropdown.Item>
						<NavDropdown.Item href="#action/3.2">
							Another action
						</NavDropdown.Item>
						<NavDropdown.Item href="#action/3.3">
							Something
						</NavDropdown.Item>
						<NavDropdown.Divider />
						<NavDropdown.Item href="#action/3.4">
							Separated link
						</NavDropdown.Item>
					</NavDropdown>
				</Nav>
			</Navbar.Collapse>
		</Navbar>
	);
}

export default ReedNavbar;
