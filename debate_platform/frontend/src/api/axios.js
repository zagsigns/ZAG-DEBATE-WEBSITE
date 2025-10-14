import axios from "axios";
// NOTE: This file assumes you import `jwtDecode` from `jwt-decode`
import { jwtDecode } from "jwt-decode"; 

const baseURL = "http://127.0.0.1:8000/api/";

const axiosInstance = axios.create({
  baseURL: baseURL,
  headers: { "Content-Type": "application/json" },
});

// Request Interceptor: Attach Access Token
axiosInstance.interceptors.request.use(async (config) => {
    const authTokens = localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null;

    if (authTokens) {
        const user = jwtDecode(authTokens.access);
        const isExpired = user.exp * 1000 < Date.now();

        // If token is NOT expired, attach it and continue
        if (!isExpired) {
            config.headers.Authorization = `Bearer ${authTokens.access}`;
            return config;
        }

        // If token IS expired, try to refresh it
        try {
            const refreshResponse = await axios.post(`${baseURL}accounts/token/refresh/`, {
                refresh: authTokens.refresh
            });
            
            const newTokens = refreshResponse.data;
            localStorage.setItem('authTokens', JSON.stringify(newTokens));
            
            // Set new token in header
            config.headers.Authorization = `Bearer ${newTokens.access}`;
            return config;
            
        } catch (error) {
            // Refresh failed (e.g., refresh token is also invalid)
            console.error("Token refresh failed. Logging out.");
            localStorage.removeItem('authTokens');
            // Redirect to login page (can't use React Router here, so rely on subsequent protected route checks)
            // Or, simply reject the request.
            return Promise.reject(error);
        }
    }
    
    // No tokens, continue request without auth header
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default axiosInstance;