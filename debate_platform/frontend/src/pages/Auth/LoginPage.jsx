import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
// The relative path is corrected to go up two levels (out of 'auth' and 'pages')
// since the file structure is /pages/auth/LoginPage.jsx
import useAuth from '../../hooks/useAuth.jsx';

const LoginPage = () => {
    const { login, isLoggedIn } = useAuth();
    const navigate = useNavigate();
    
    // State management for username and password
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (isLoggedIn) {
            navigate('/');
        }
    }, [isLoggedIn, navigate]);

    const handleLogin = (e) => {
        e.preventDefault();
        setError('');

        if (username.trim() && password.trim()) {
            // Note: Currently, the mock 'login' function in useAuth only uses the username for tracking.
            login(username.trim()); 
        } else {
            setError('Both username and password are required.');
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-sm p-8 bg-gray-800 rounded-xl shadow-2xl border border-indigo-500/30">
                <h1 className="text-3xl font-extrabold text-white text-center mb-6">Welcome Back</h1>
                <p className="text-center text-gray-400 mb-8">Sign in to start debating.</p>

                {/* Display Error Message */}
                {error && (
                    <p className="text-red-500 text-center font-medium mb-4">{error}</p>
                )}

                <form onSubmit={handleLogin} className="space-y-6">
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-300">
                            Username
                        </label>
                        <input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="mt-1 w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                            placeholder="e.g., debate_master_99"
                        />
                    </div>

                    {/* Password Field */}
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="mt-1 w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-md text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
                    >
                        <LogIn className="w-5 h-5 mr-2" /> Sign In
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
