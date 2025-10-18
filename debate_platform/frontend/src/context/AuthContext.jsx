import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axiosInstance from '../api/axios';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    // Initialize tokens and user from local storage
    const [authTokens, setAuthTokens] = useState(() => 
        localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null
    );
    // Decode user info from the access token
    // We now rely on 'user' being null initially, and setting it in useEffect/login/updateToken
    const [user, setUser] = useState(null); 
    const [loading, setLoading] = useState(true);

    const logoutUser = useCallback(() => {
        setAuthTokens(null);
        setUser(null);
        localStorage.removeItem('authTokens');
    }, []);

    // Helper function to set user data correctly
    const setDecodedUser = (data, is_admin_flag) => {
        const decodedToken = jwtDecode(data.access);
        
        // **CRITICAL FIX:** Merge the decoded token data with the is_admin flag.
        // The router checks for `user.is_admin` or `user.role === 'admin'`.
        // We set both here, using the is_admin_flag provided by the backend.
        const mergedUser = {
            ...decodedToken,
            is_admin: is_admin_flag,
            role: is_admin_flag ? 'admin' : 'user'
        };

        setUser(mergedUser);
        setAuthTokens(data);
        localStorage.setItem('authTokens', JSON.stringify(data));
    }


    const loginUser = async (username, password) => {
        const response = await axiosInstance.post('/accounts/login/', { username, password });
        
        if (response.status === 200) {
            const data = response.data;
            
            // ASSUMPTION: The Django view /accounts/login/ returns the 'is_admin' field 
            // directly in the response data, e.g., response.data.is_admin
            const is_admin_from_api = data.is_admin || false; 

            setDecodedUser(data, is_admin_from_api);
            
            return { success: true };
        }
        // Use error response from server if available
        return { success: false, error: response.data.detail || "Login failed" };
    };

    // Auto-refresh the JWT token before it expires
    const updateToken = useCallback(async () => {
        if (!authTokens?.refresh) {
            setLoading(false);
            return;
        }

        try {
            const response = await axiosInstance.post('/accounts/token/refresh/', {
                refresh: authTokens.refresh
            });

            if (response.status === 200) {
                const data = response.data;
                
                // ISSUE: Refresh response typically only gives a new access token, not user details.
                // We must rely on the existing user state to know if they are an admin.
                // To be safe, we rely on the access token for primary identity, but keep the role.
                const decodedToken = jwtDecode(data.access);

                // **CRITICAL FIX FOR TOKEN REFRESH:** // Preserve the existing admin status if it exists. 
                const existingIsAdmin = user?.is_admin || false; 

                setUser({
                    ...decodedToken,
                    is_admin: existingIsAdmin, // Keep the existing admin status
                    role: existingIsAdmin ? 'admin' : 'user'
                });
                
                setAuthTokens(data);
                localStorage.setItem('authTokens', JSON.stringify(data));
            } else {
                logoutUser();
            }
        } catch (error) {
            logoutUser();
        } finally {
            if (loading) setLoading(false);
        }
    }, [authTokens, logoutUser, loading, user]); // Added 'user' to dependency array

    // Initial check on load
    useEffect(() => {
        if (authTokens) {
            // Check if token is valid and set user initially from localStorage
            try {
                 const decodedToken = jwtDecode(authTokens.access);
                 // We cannot infer is_admin from the token if it wasn't added by Django
                 // We assume that the initial login request handles setting 'is_admin' on first load
                 // For now, we rely on updateToken logic to handle the initial check as well.
                 updateToken();

            } catch(e) {
                 logoutUser();
            }
        } else {
            setLoading(false);
        }
        // We only want this to run once on mount (or when authTokens change on load)
    }, []); 

    // Set up token refresh interval
    useEffect(() => {
        const fiveMinutes = 1000 * 60 * 5; 
        let interval = setInterval(() => {
            if (authTokens) {
                updateToken();
            }
        }, fiveMinutes);

        // Remove initial updateToken() call from here and put it in the [] useEffect above
        // if (loading) updateToken(); 

        return () => clearInterval(interval);
    }, [authTokens, updateToken]);

    const contextData = {
        user,
        authTokens,
        loginUser,
        logoutUser,
        loading,
    };

    return (
        <AuthContext.Provider value={contextData}>
            {loading ? <div className="text-center p-4">Loading application...</div> : children}
        </AuthContext.Provider>
    );
};
