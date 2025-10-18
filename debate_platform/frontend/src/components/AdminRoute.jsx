import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
// PrivateRoute import is not strictly needed here but should be in your router file

const AdminRoute = ({ children }) => {
    const { user, loading } = useAuth();
    
    // CRITICAL: We MUST wait for the user state to finish its initial check.
    if (loading) {
        return <div className="text-center py-20 text-indigo-500 font-semibold text-lg">Authenticating and Checking Permissions...</div>;
    }

    // Determine Admin status using the robust check we developed
    const isAdmin = user && (user.is_admin === true || user.role === 'admin');

    if (!isAdmin) {
        // If the user object is null (not logged in) or isAdmin is false,
        // we redirect based on their login status:
        
        if (user) {
            // Logged in but not admin: send to standard dashboard
            console.log("AdminRoute: User is logged in but not an admin. Redirecting to /dashboard.");
            return <Navigate to="/dashboard" replace />;
        }
        
        // Not logged in (but passed the loading check): send to home/login
        console.log("AdminRoute: No user token found. Redirecting to /.");
        return <Navigate to="/" replace />; 
    }

    // Success: Admin is verified. Render the children (AdminDashboard).
    return children;
};

export default AdminRoute;
