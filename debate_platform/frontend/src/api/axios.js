// frontend/src/api/axios.js

import axios from "axios";
import { jwtDecode } from "jwt-decode"; 

// 1. Define the Base URL for your Django Backend
// Make sure your Django server is running on this address!
const baseURL = "http://127.0.0.1:8000/api/"; 

// 2. Create the primary Axios Instance
const axiosInstance = axios.create({
    baseURL: baseURL,
    timeout: 5000,
    headers: {
        "Content-Type": "application/json",
        accept: "application/json",
    },
});

// 3. Request Interceptor for JWT Refresh (Professional Authentication Handling)
axiosInstance.interceptors.request.use(
    async (config) => {
        const token = localStorage.getItem("access_token");
        
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            
            // Check if the token is expired
            try {
                const user = jwtDecode(token);
                const isExpired = user.exp * 1000 < Date.now();
                
                if (!isExpired) return config; // Token is good

                // Token is expired, try to refresh it
                const refresh_token = localStorage.getItem("refresh_token");
                if (refresh_token) {
                    const response = await axios.post(`${baseURL}token/refresh/`, {
                        refresh: refresh_token,
                    });

                    // Update local storage with the new token
                    localStorage.setItem("access_token", response.data.access);
                    
                    // Update the header for the current request
                    config.headers.Authorization = `Bearer ${response.data.access}`;
                    return config;
                }
            } catch (error) {
                // If decoding or refresh fails, treat it as expired and force login
                console.error("Token refresh failed or token invalid:", error);
                localStorage.removeItem("access_token");
                localStorage.removeItem("refresh_token");
                // Redirect to the login page
                window.location.href = "/login"; 
                return Promise.reject(error);
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;