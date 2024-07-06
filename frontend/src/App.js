import React from "react";
import "./css/App.css";
import { HashRouter, Route, Routes } from "react-router-dom";
import CustomNavbar from "./components/CustomNavbar";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import PictureGallery from "./components/PictureGallery";
import Picture from "./components/Picture";
import NewPictureForm from "./components/NewPictureForm";
import RecipeGallery from "./components/RecipeGallery";
import Recipe from "./components/Recipe";
import NewRecipeForm from "./components/NewRecipeForm";
import VideoGallery from "./components/VideoGallery";
import Video from "./components/Video";
import NewVideoForm from "./components/NewVideoForm";
import "bootstrap/dist/css/bootstrap.min.css";
import { AuthProvider } from "./components/AuthContext";

function App() {
    return (
        <AuthProvider>
            <HashRouter>
                <div className="App bg-dark">
                    <CustomNavbar />
                    <div className="content p-0">
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route
                                path="/recipes"
                                element={<RecipeGallery />}
                            />
                            <Route path="/recipes/:id" element={<Recipe />} />
                            <Route
                                path="/recipes/new"
                                element={<NewRecipeForm />}
                            />
                            <Route
                                path="/pictures"
                                element={<PictureGallery />}
                            />
                            <Route path="/pictures/:id" element={<Picture />} />
                            <Route
                                path="/pictures/new"
                                element={<NewPictureForm />}
                            />
                            <Route path="/videos" element={<VideoGallery />} />
                            <Route path="/videos/:id" element={<Video />} />
                            <Route
                                path="/videos/new"
                                element={<NewVideoForm />}
                            />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                        </Routes>
                    </div>
                </div>
            </HashRouter>
        </AuthProvider>
    );
}

export default App;
