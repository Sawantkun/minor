import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import useAuth from "./AuthContext";

const ProtectedRoute = ({ children }) => {

    const location = useLocation();
    const { userData, isAdmin, loading } = useAuth();

    if (loading === true) {
        return <div>Loading...</div>;
    }

    if (!userData && loading === false) {
        return <Navigate to="/Login" state={{ from: location }} replace />;
    }

    if (location.pathname === "/admin" && isAdmin === false) {
        return <Navigate to="/NotFound" replace />;
    }

    return children;
};

export default ProtectedRoute;
