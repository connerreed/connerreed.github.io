import './App.css';
import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

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
  {id: 1, name: "Pictures", link: "#", images: pictureList}, // TODO: add picture list to object to display, and add link to picture landing page
  {id: 2, name: "Recipes", link: "#", images: recipeList}, // TODO: add recipe list to object to display, and add link to recipe landing page
];


function App() {
  return (
    <div className="App">
      <h1>Hello Reed Family!</h1>
      <div className="container">
        <div className="row">
          {elementList.map(element => (
            <div className="col-md-4 mb-4" key={element.id}> {/* Adjust grid column size as needed */}
              <HomeElement key={element.id} element={element} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
  
}

/*function HomeElement({ element }) {
  const [currentPictureIndex, setCurrentPictureIndex] = useState(0); // Initializes currentPictureIndex to 0
  const [opacity, setOpacity] = useState(1); // Initializes opacity to 1, which is fully opaque
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
  

  /*useEffect(() => {
    const interval = setInterval(() => {
      setOpacity(0); // Fade out
      setTimeout(() => {
        // Change image and fade in
        setCurrentPictureIndex(prevIndex =>
          prevIndex === element.list.length - 1 ? 0 : prevIndex + 1  
        );
        setOpacity(1);
      }, 500); // Half of transition time
    }, timerInterval);

    return () => clearInterval(interval);
  }, [element.list]);

  const currentPictureSrc = require(`${element.list[currentPictureIndex].src}`);

  return (
    <a href={element.link} className="card">
      <img src={currentPictureSrc} alt="Preview" className="card-img-top" style={{ opacity }}/>
      <div className="card-body">
        <h5 className="card-title">{element.name}</h5>
      </div>
    </a>
  );  
}
*/

const HomeElement = ({ element }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [nextIdx, setNextIdx] = useState(1);
  const [isSwiping, setIsSwiping] = useState(false); // New state to control the swipe

  useEffect(() => {
    const interval = setInterval(() => {
      setIsSwiping(true); // Start swiping

      setTimeout(() => {
        let newCurrentIdx = (currentIdx + 1) % element.images.length;
        setCurrentIdx(newCurrentIdx);

        let newNextIdx = (newCurrentIdx + 1) % element.images.length;
        setNextIdx(newNextIdx);

        setIsSwiping(false); // Reset swiping state after the swipe completes
      }, 1000); // This should match your CSS transition duration
    }, 3000);

    return () => clearInterval(interval);
  }, [currentIdx, element.images.length]);

  const currentPictureSrc = require(`${element.images[currentIdx].src}`);
  const nextPictureSrc = require(`${element.images[nextIdx].src}`);

  return (
    <a href={element.link} className="card">
      <div className="image-container">
        <img src={currentPictureSrc} alt="Current" className={`swipe-img current ${isSwiping ? 'slide-left' : ''}`} />
        <img src={nextPictureSrc} alt="Next" className={`swipe-img next ${isSwiping ? 'slide-left' : ''}`} />
      </div>
      <div className="card-body">
        <h5 className="card-title">{element.name}</h5>
      </div>
    </a>
  );
};


export default App;
