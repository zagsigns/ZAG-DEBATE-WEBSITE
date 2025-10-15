// frontend/src/App.jsx

import React from 'react';
// You need to install React Router DOM if you haven't yet: npm install react-router-dom
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Layout/Header'; 
import DebateListPage from "./pages/Debates/DebateListPage"; 

// A simple component for placeholder pages
const TempPage = ({ title }) => <div className="p-10 text-white text-center text-3xl">{title}</div>;


function App() {
    // --- TEMPORARY STATE FOR TESTING THE HEADER WOW LOOK ---
    // Adjust these to test different user states!
    const isUserLoggedIn = true; 
    const isUserAdmin = false; 
    // -----------------------------------------------------

    return (
        <Router>
            {/* The Header is persistent across all routes */}
            <Header isLoggedIn={isUserLoggedIn} isAdmin={isUserAdmin} /> 
            
            {/* Main content wrapper with dark background */}
            <main className="min-h-screen bg-gray-900 text-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <Routes>
                        {/* Use the Debate List as the home page */}
                        <Route path="/" element={<DebateListPage />} /> 
                        
                        {/* Placeholder Routes */}
                        <Route path="/dashboard" element={<TempPage title="User Dashboard - Coming Soon!" />} />
                        <Route path="/create" element={<TempPage title="Create New Debate - Form Here" />} />
                        <Route path="/login" element={<TempPage title="Login / Register Forms Here" />} />
                        <Route path="/admin" element={<TempPage title="Admin Control Panel" />} />
                        {/* Add other crucial routes like /debates/:id */}
                        <Route path="*" element={<TempPage title="404 - Page Not Found" />} />
                    </Routes>
                </div>
            </main>
        </Router>
    );
}

export default App;