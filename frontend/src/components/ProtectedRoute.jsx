import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ProtectedRoute = ({ children }) => {
    const { authToken } = useAuth();
    const location = useLocation();
    return authToken ? children : <Navigate to="/login" state={{ callbackUrl: location }} />;
};

export default ProtectedRoute;
