import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ element }: { element: JSX.Element }) => {
  const isAdmin = localStorage.getItem("adminToken");  // Replace with your real authentication system
  return isAdmin ? element : <Navigate to="/admin/login" />;
};

export default ProtectedRoute;
