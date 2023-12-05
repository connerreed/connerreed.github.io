import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Slideshow from './Slideshow';
import React from 'react';
import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';

const pictureList = [ //TODO: Dynamically add pictures based on imgs/Pictures folder
  {id: 1, src: "./imgs/Pictures/FamilyPhoto1.png"},
  {id: 2, src: "./imgs/Pictures/FamilyPhoto2.png"},
  {id: 3, src: "./imgs/Pictures/FamilyPhoto3.png"}
];

const recipeList = [ //TODO: Dynamically add recipes based on imgs/Recipes folder
  {id: 1, src: "./imgs/Recipes/Recipe1.png"},
  {id: 2, src: "./imgs/Recipes/Recipe2.png"},
  {id: 3, src: "./imgs/Recipes/Recipe3.png"}
];

/*const elementList = [
  {id: 1, name: "Pictures", link: "#", images: pictureList}, // TODO: add link to picture landing page
  {id: 2, name: "Recipes", link: "#", images: recipeList}, // TODO: add link to recipe landing page
];
*/


function App() {
  return (
    <div className="App">
      <Navbar className="bg-body-tertiary" fixed="top" data-bs-theme="dark" bg="dark" expand="lg">
        <Container>
          <Navbar.Brand href="#home">Welcome Reed Family!</Navbar.Brand>
        </Container>
        <Navbar.Toggle aria-controls="basic-navbar-nav"/>
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link href="#home">Home</Nav.Link>
            <Nav.Link href="#link">Link</Nav.Link>
            <NavDropdown title="Dropdown" id="basic-nav-dropdown">
              <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">
                Another action
              </NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">
                Separated link
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <div className="container">
        <h1 className="slideshowLabel">Pictures</h1>
        <Slideshow className="slideshow" elementList={pictureList}/>
        <h1 className="slideshowLabel">Recipes</h1>
        <Slideshow className="slideshow" elementList={recipeList}/>
      </div>
    </div>
  );
  
}

export default App;
