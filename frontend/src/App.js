import React from "react";
import "./css/App.css";
import { HashRouter, Route, Routes } from "react-router-dom";
import CustomNavbar from "./components/CustomNavbar";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import Profile from "./components/Profile"; // Import Profile component
import Picture from "./components/Picture";
import NewPictureForm from "./components/NewPictureForm";
import Recipe from "./components/Recipe";
import NewRecipeForm from "./components/NewRecipeForm";
import Video from "./components/Video";
import NewVideoForm from "./components/NewVideoForm";
import "bootstrap/dist/css/bootstrap.min.css";
import { AuthProvider } from "./contexts/AuthContext";
import { ThemeProvider, useTheme } from "./contexts/ThemeContext";
import { MessageProvider } from "./contexts/MessageContext";
import ProtectedRoute from "./components/ProtectedRoute";
import ElementGallery from "./components/ElementGallery";

function AppContent() {
    const { darkMode } = useTheme();

    return (
        <div className={`App ${darkMode ? "DarkMode" : "LightMode"}`}>
            <div>
                <CustomNavbar />
            </div>
            <div>
                <Routes>
                    <Route path="/" element={<Home />} />

                    {/* Public Routes */}
                    <Route
                        path="/recipes"
                        element={<ElementGallery elementType="recipe" />}
                    />
                    <Route path="/recipes/:id" element={<Recipe />} />
                    <Route
                        path="/pictures"
                        element={<ElementGallery elementType="picture" />}
                    />
                    <Route path="/pictures/:id" element={<Picture />} />
                    <Route
                        path="/videos"
                        element={<ElementGallery elementType="video" />}
                    />
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
        </div>
    );
}

function App() {
    return (
        <HashRouter>
            <ThemeProvider>
                <MessageProvider>
                    <AuthProvider>
                        <AppContent />
                    </AuthProvider>
                </MessageProvider>
            </ThemeProvider>
        </HashRouter>
    );
}

export default App;
