import React from "react";
import "./css/App.css";
import "./css/theme.css";
import { HashRouter, Route, Routes, useNavigate, useLocation } from "react-router-dom";
import CustomNavbar from "./components/CustomNavbar";
import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import Profile from "./components/Profile"; // Import Profile component
import Picture from "./components/Picture";
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
import { Button } from "react-bootstrap";

function AppContent() {
    const { darkMode } = useTheme();
    const location = useLocation();
    const navigate = useNavigate();
    const showBackButton = !/^\/(recipes|pictures|videos|login|profile|)$/.test(
        location.pathname
    );

    return (
        <div className={`App ${darkMode ? "dark-theme" : ""}`}>
            <div>
                <CustomNavbar />
            </div>
            {showBackButton && (
                <div className="back-button-container">
                    <Button
                        variant="primary"
                        onClick={() => navigate(-1)}
                        className="mb-3"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            fill="currentColor"
                            className="bi bi-arrow-left"
                            viewBox="0 0 16 16"
                        >
                            <path
                                fillRule="evenodd"
                                d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"
                            />
                        </svg>
                        Back
                    </Button>
                </div>
            )}
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
