import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  isAuthenticated: boolean;
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ isAuthenticated, children }) => {
  console.log('ProtectedRoute - Authentication status:', isAuthenticated);
  
  if (!isAuthenticated) {
    console.warn('Access to protected route denied - redirecting to login');
    return <Navigate to="/login" replace />;
  }

  console.log('Access to protected route granted');
  return <>{children}</>;
};

export default ProtectedRoute;
