// frontend/src/App.jsx

import React from 'react';
// Import routing utilities
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// ===================================
// 1. Layout & Core Components
// ===================================

// TEMP Header Placeholder (Keep this simple until you build Header.jsx)
const Header = ({ isLoggedIn, isAdmin }) => (
    <div className="fixed top-0 w-full bg-gray-800/90 backdrop-blur-sm shadow-lg z-50 p-4 text-center text-teal-400">
        <span className="font-bold text-xl">DebatePlatform Nav - {isLoggedIn ? 'Logged In' : 'Logged Out'}</span> 
    </div>
);

// TEMP Placeholder for all other pages
const TempPage = ({ title }) => (
    <div className="min-h-screen pt-20 flex items-center justify-center bg-gray-900 text-white">
        <div className="p-10 text-center text-3xl bg-gray-800 rounded-xl shadow-2xl border border-gray-700">
            {title}
        </div>
    </div>
);


// ===================================
// 2. Page Imports (CORRECTED PATH BELOW)
// ===================================
import HomePage from './pages/HomePage';
// *** CORRECTED LINE ***: The path now points to the 'components' subdirectory.
import DebateList from './pages/components/DebateList'; 


function App() {
    // --- TEMPORARY STATE FOR TESTING USER ROLES ---
    const isUserLoggedIn = true; 
    const isUserAdmin = true; 
    // ---------------------------------------------

    return (
        <Router>
            {/* The Header is persistent across all routes */}
            <Header isLoggedIn={isUserLoggedIn} isAdmin={isUserAdmin} /> 
            
            {/* Main content area: accounts for fixed header height (pt-16) */}
            <main className="bg-gray-900 text-white min-h-screen pt-16">
                <Routes>
                    
                    {/* === PUBLIC ROUTES === */}
                    <Route path="/" element={<HomePage />} /> 
                    <Route path="/debates" element={<DebateList />} />
                    <Route path="/debate/:id" element={<TempPage title="Debate Detail Page - ID: :id" />} />
                    <Route path="/login" element={<TempPage title="Login / Register Forms Here" />} />
                    <Route path="/register" element={<TempPage title="Login / Register Forms Here" />} />
                    
                    {/* === PROTECTED USER/CREATOR ROUTES === */}
                    <Route 
                        path="/dashboard" 
                        element={isUserLoggedIn 
                            ? <TempPage title="User Dashboard: Profile, Credits, Subscriptions" /> 
                            : <TempPage title="Access Denied. Please Login." />}
                    />
                    <Route 
                        path="/create" 
                        element={isUserLoggedIn 
                            ? <TempPage title="Create New Debate Form" /> 
                            : <TempPage title="Access Denied. Please Login." />}
                    />

                    {/* === PROTECTED ADMIN ROUTES === */}
                    <Route 
                        path="/admin" 
                        element={isUserAdmin 
                            ? <TempPage title="Admin Control Panel: Users, Debates, Commissions" /> 
                            : <TempPage title="Admin Access Denied." />}
                    />
                    
                    {/* === FALLBACK ROUTE === */}
                    <Route path="*" element={<TempPage title="404 - Page Not Found" />} />
                </Routes>
            </main>
            
            {/* Footer component goes here */}
        </Router>
    );
}

export default App;