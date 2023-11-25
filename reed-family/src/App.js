import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Slideshow from './Slideshow';

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
      <div className="header">
        <h1 id="title">Reed Family Website</h1>
      </div>
      <div className="container">
        <Slideshow elementList={pictureList}/>
        <h1>Pictures</h1>
        <Slideshow elementList={recipeList}/>
        <h1>Recipes</h1>
      </div>
    </div>
  );
  
}

export default App;
