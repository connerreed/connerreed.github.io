// App.jsx
import React from "react";
import "../css/App.css";
import { HashRouter, Route, Routes } from "react-router-dom";
import CustomNavbar from "./CustomNavbar";
import Home from "./Home";
import Login from "./Login";
import Register from "./Register";
import Profile from "./Profile"; // Import Profile component
import PictureGallery from "./PictureGallery";
import Picture from "./Picture";
import NewPictureForm from "./NewPictureForm";
import RecipeGallery from "./RecipeGallery";
import Recipe from "./Recipe";
import NewRecipeForm from "./NewRecipeForm";
import VideoGallery from "./VideoGallery";
import Video from "./Video";
import NewVideoForm from "./NewVideoForm";
import "bootstrap/dist/css/bootstrap.min.css";
import { AuthProvider } from "./AuthContext";
import { ThemeProvider } from "./ThemeContext";

function App() {
    return (
        <AuthProvider>
            <ThemeProvider>
                <HashRouter>
                    <div className="App">
                        <CustomNavbar />
                        <div className="content p-0">
                            <Routes>
                                <Route path="/" element={<Home />} />
                                <Route
                                    path="/recipes"
                                    element={<RecipeGallery />}
                                />
                                <Route
                                    path="/recipes/:id"
                                    element={<Recipe />}
                                />
                                <Route
                                    path="/recipes/new"
                                    element={<NewRecipeForm />}
                                />
                                <Route
                                    path="/pictures"
                                    element={<PictureGallery />}
                                />
                                <Route
                                    path="/pictures/:id"
                                    element={<Picture />}
                                />
                                <Route
                                    path="/pictures/new"
                                    element={<NewPictureForm />}
                                />
                                <Route
                                    path="/videos"
                                    element={<VideoGallery />}
                                />
                                <Route path="/videos/:id" element={<Video />} />
                                <Route
                                    path="/videos/new"
                                    element={<NewVideoForm />}
                                />
                                <Route path="/login" element={<Login />} />
                                <Route
                                    path="/register"
                                    element={<Register />}
                                />
                                <Route path="/profile" element={<Profile />} />
                            </Routes>
                        </div>
                    </div>
                </HashRouter>
            </ThemeProvider>
        </AuthProvider>
    );
}

export default App;
