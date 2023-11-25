import './App.css';
import React, { useState, useEffect } from 'react';

const pictureList = [
  {id: 1, src: "./imgs/Pictures/FamilyPhoto1.png"},
  {id: 2, src: "./imgs/Pictures/FamilyPhoto2.png"},
  {id: 3, src: "./imgs/Pictures/FamilyPhoto3.png"}
];

const recipeList = [
  {id: 1, src: "./imgs/Recipes/Recipe1.png"},
  {id: 2, src: "./imgs/Recipes/Recipe2.png"},
  {id: 3, src: "./imgs/Recipes/Recipe3.png"}
];

const elementList = [
  {id: 1, name: "Pictures", link: "#", list: pictureList}, // TODO: add picture list to object to display, and add link to picture landing page
  {id: 2, name: "Recipes", link: "#", list: recipeList}, // TODO: add recipe list to object to display, and add link to recipe landing page
];


function App() {
  return (
    <div className="App">
      <h1>Hello Reed Family!</h1>
      <div className="HomeElementList">
        {elementList.map(element => (
          <HomeElement key={element.id} element={element} />
        ))}
      </div>
    </div>
  );
}

function HomeElement({ element }) {
  const [currentPictureIndex, setCurrentPictureIndex] = useState(0); // Initializes currentPictureIndex to 0
  const timerInterval = 5000; // milliseconds

  // useEffect hook runs after every render, and will re-run if element.list changes
  useEffect(() => { // Sets up an interval that updates currentPictureIndex every 3 seconds. Index resets to 0 when it reaches the end of list, creating a loop
    const timer = setInterval(() => {
      setCurrentPictureIndex(prevIndex => 
        prevIndex === element.list.length - 1 ? 0 : prevIndex + 1
      );
    }, timerInterval); // Change image every timerInterval amount of milliseconds

    return () => clearInterval(timer); // Clean up the interval on component unmount, prevents memory leaks
  }, [element.list]);

  const currentPictureSrc = require(`${element.list[currentPictureIndex].src}`);

  return (
    <a href={element.link}>
      <div className="HomeElement">
        <img src={currentPictureSrc} alt="Preview" style={{ width: '100px', height: '100px' }} />
        <h2>{element.name}</h2>
      </div>
    </a>
  );
}

export default App;
