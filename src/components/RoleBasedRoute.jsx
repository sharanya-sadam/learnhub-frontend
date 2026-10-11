import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from './LoadingSpinner';

const RoleBasedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner fullPage message="Checking permissions..." />;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    // Redirect to the appropriate dashboard
    if (user.role === 'ROLE_ADMIN') {
      return <Navigate to="/admin/dashboard" replace />;
    } else if (user.role === 'ROLE_INSTRUCTOR') {
      return <Navigate to="/instructor/dashboard" replace />;
    } else {
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
};

export default RoleBasedRoute;
