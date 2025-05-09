import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import useAuth from "./AuthContext";

const ProtectedRoute = ({ children }) => {

    const location = useLocation();
    const { userData, isAdminRef, loading } = useAuth();

    if (loading === true) {
        return <div>Loading...</div>;
    }

    if (!userData && loading === false) {
        return <Navigate to="/Login" state={{ from: location }} replace />;
    }

    if (location.pathname === "/admin" && isAdminRef.current === false && loading === false) {
        return <Navigate to="/NotFound" replace />;
    }

    return children;
};

export default ProtectedRoute;
