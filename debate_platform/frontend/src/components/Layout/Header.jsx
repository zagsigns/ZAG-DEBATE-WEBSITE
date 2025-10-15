// frontend/src/components/Layout/Header.jsx

import React from 'react';
// We'll use Link for navigation. Assuming you use React Router DOM.
// If you don't have it installed: npm install react-router-dom
import { Link } from 'react-router-dom';

// Placeholder for your ProfileInfo component (User's Credits/Status)
// Replace this with the actual import later.
const ProfileInfo = () => (
    <div className="text-sm font-medium text-green-300 border border-green-300 px-3 py-1 rounded-full hover:bg-green-700 transition duration-300">
        150 Credits | Pro
    </div>
);

const Header = ({ isLoggedIn = false, isAdmin = false }) => {

    // Define navigation links
    const navLinks = [
        { name: 'Dashboard', path: '/dashboard', show: isLoggedIn },
        { name: 'Create Debate', path: '/create', show: isLoggedIn },
        { name: 'Admin Panel', path: '/admin', show: isLoggedIn && isAdmin },
        { name: 'Login', path: '/login', show: !isLoggedIn },
        { name: 'Register', path: '/register', show: !isLoggedIn },
    ];

    return (
        <header className="bg-gray-800 shadow-xl sticky top-0 z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    
                    {/* Logo/Brand */}
                    <Link to="/" className="text-2xl font-extrabold text-indigo-400 tracking-wider">
                        ZAG Debate
                    </Link>

                    {/* Navigation Links */}
                    <nav className="hidden md:flex space-x-6 items-center">
                        {navLinks.map((link) => (
                            link.show && (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    // Professional, clean link styling
                                    className="text-gray-300 hover:text-indigo-400 font-medium transition duration-150 ease-in-out"
                                >
                                    {link.name}
                                </Link>
                            )
                        ))}
                    </nav>

                    {/* Profile Info / Actions */}
                    <div className="flex items-center space-x-4">
                        {isLoggedIn ? (
                            <ProfileInfo />
                        ) : (
                            // Placeholder for login/register if not using the nav links above
                            null
                        )}
                        {/* Mobile Menu Icon would go here */}
                        <button className="md:hidden text-gray-300 hover:text-indigo-400">
                            {/* SVG for a hamburger icon */}
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" /></svg>
                        </button>
                    </div>

                </div>
            </div>
        </header>
    );
};

export default Header;