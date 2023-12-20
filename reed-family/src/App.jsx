import React from "react";
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { HashRouter, Route, Routes } from "react-router-dom";
import ReedNavbar from "./ReedNavbar"; // Navbar component
import Recipes from "./Recipes"; // Recipes homepage
import Home from "./Home"; // Homepage
import Pictures from "./Pictures"; // Pictures homepage
import RecipeDetail from "./RecipeDetail"; // Recipe Detail page

function App() {
    return (
        <HashRouter>
            <div className="App">
                <ReedNavbar />
                <Routes>
                    <Route
                        path="/recipes/:recipeFolderName"
                        element={<RecipeDetail />}
                    />
                    <Route path="/recipes" element={<Recipes />} />
                    <Route path="/pictures" element={<Pictures />} />
                    <Route path="/" element={<Home />} />
                </Routes>
            </div>
        </HashRouter>
    );
}

export default App;
