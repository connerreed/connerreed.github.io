import React from "react";
import "./css/App.css";
import { HashRouter, Route, Routes } from "react-router-dom";
import CustomNavbar from "./components/CustomNavbar";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import Profile from "./components/Profile"; // Import Profile component
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
import { AuthProvider } from "./hooks/AuthContext";
import { ThemeProvider, useTheme } from "./hooks/ThemeContext";
import { ErrorProvider } from "./hooks/ErrorContext";
import ProtectedRoute from "./components/ProtectedRoute";

function AppContent() {
    const { darkMode } = useTheme();

    return (
        <div className={`App ${darkMode ? "DarkMode" : "LightMode"}`}>
            <div>
                <CustomNavbar />
            </div>
            <ErrorProvider>
                <div>
                    <Routes>
                        <Route path="/" element={<Home />} />

                        {/* Public Routes */}
                        <Route path="/recipes" element={<RecipeGallery />} />
                        <Route path="/recipes/:id" element={<Recipe />} />
                        <Route path="/pictures" element={<PictureGallery />} />
                        <Route path="/pictures/:id" element={<Picture />} />
                        <Route path="/videos" element={<VideoGallery />} />
                        <Route path="/videos/:id" element={<Video />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />

                        {/* Protected Routes */}
                        <Route
                            path="/recipes/new"
                            element={
                                <ProtectedRoute>
                                    <NewRecipeForm />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/pictures/new"
                            element={
                                <ProtectedRoute>
                                    <NewPictureForm />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/videos/new"
                            element={
                                <ProtectedRoute>
                                    <NewVideoForm />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/profile"
                            element={
                                <ProtectedRoute>
                                    <Profile />
                                </ProtectedRoute>
                            }
                        />
                    </Routes>
                </div>
            </ErrorProvider>
        </div>
    );
}

function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <HashRouter>
                    <AppContent />
                </HashRouter>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;
