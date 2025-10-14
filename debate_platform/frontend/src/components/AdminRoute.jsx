import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import PrivateRoute from './PrivateRoute'; // Ensure this is imported

const AdminRoute = ({ children }) => {
    const { user } = useAuth();
    
    // 1. Must be logged in (handled by PrivateRoute wrapper)
    // 2. Must be an admin
    if (!user || !user.is_admin) {
        // Redirect non-admins to their regular dashboard
        return <Navigate to="/dashboard" replace />;
    }

    // Pass through if they are an admin
    return children;
};

// NOTE: You must also wrap this in PrivateRoute in App.jsx for token check
export default AdminRoute;