import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const location = useLocation();

  return localStorage.getItem('token') ? 
    children : 
    <Navigate to="/" state={{ from: location }} replace />;
};

export default ProtectedRoute;