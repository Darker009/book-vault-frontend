import React from 'react';
import { Navigate } from 'react-router-dom';
import AuthService from '../../service/AuthService';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const user = AuthService.getCurrentUser();
  
  // Convert to uppercase for consistent comparison
  const userRole = user?.role?.toUpperCase();
  const allowedRolesUpper = allowedRoles.map(role => role.toUpperCase());

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRolesUpper.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;