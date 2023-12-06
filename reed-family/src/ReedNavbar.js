import React, { useState } from "react";
import { Navbar, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import { LinkContainer } from "react-router-bootstrap";
import "./ReedNavbar.css";
function ReedNavbar() {
	const [expanded, setExpanded] = useState(false); // state to allow for collapse onSelect of navbar links

	return (
		<Navbar
			expanded={expanded}
			fixed="top"
			data-bs-theme="dark"
			bg="dark"
			expand="lg"
			className="my-navbar"
			collapseOnSelect
			onToggle={setExpanded}
		>
			<Navbar.Toggle aria-controls="responsive-navbar-nav" />
			<Navbar.Collapse id="responsive-navbar-nav">
				<Nav className="me-auto" onSelect={() => setExpanded(false)}>
					<LinkContainer to="/">
						<Nav.Link>Home</Nav.Link>
					</LinkContainer>
					<LinkContainer to="/pictures">
						<Nav.Link>Pictures</Nav.Link>
					</LinkContainer>
					<LinkContainer to="/recipes">
						<Nav.Link>Recipes</Nav.Link>
					</LinkContainer>
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
