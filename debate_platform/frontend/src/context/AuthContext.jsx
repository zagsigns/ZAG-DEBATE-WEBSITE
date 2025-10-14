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
    const [user, setUser] = useState(() => 
        authTokens ? jwtDecode(authTokens.access) : null
    );
    const [loading, setLoading] = useState(true);

    const logoutUser = useCallback(() => {
        setAuthTokens(null);
        setUser(null);
        localStorage.removeItem('authTokens');
    }, []);

    const loginUser = async (username, password) => {
        const response = await axiosInstance.post('/accounts/login/', { username, password });
        
        if (response.status === 200) {
            const data = response.data;
            setAuthTokens(data);
            setUser(jwtDecode(data.access));
            localStorage.setItem('authTokens', JSON.stringify(data));
            return { success: true };
        }
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
                setAuthTokens(data);
                setUser(jwtDecode(data.access));
                localStorage.setItem('authTokens', JSON.stringify(data));
            } else {
                logoutUser();
            }
        } catch (error) {
            logoutUser();
        } finally {
            if (loading) setLoading(false);
        }
    }, [authTokens, logoutUser, loading]);

    // Set up token refresh interval
    useEffect(() => {
        const fiveMinutes = 1000 * 60 * 5; 
        let interval = setInterval(() => {
            if (authTokens) {
                updateToken();
            }
        }, fiveMinutes);

        if (loading) updateToken();

        return () => clearInterval(interval);
    }, [authTokens, loading, updateToken]);

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