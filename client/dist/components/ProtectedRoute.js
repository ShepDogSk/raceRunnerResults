import React from 'react';
import { Navigate } from 'react-router-dom';
var ProtectedRoute = function (_a) {
    var isAuthenticated = _a.isAuthenticated, children = _a.children;
    console.log('ProtectedRoute - Authentication status:', isAuthenticated);
    if (!isAuthenticated) {
        console.warn('Access to protected route denied - redirecting to login');
        return React.createElement(Navigate, { to: "/login", replace: true });
    }
    console.log('Access to protected route granted');
    return React.createElement(React.Fragment, null, children);
};
export default ProtectedRoute;
