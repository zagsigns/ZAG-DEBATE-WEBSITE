import React from 'react';
import { Link } from 'react-router-dom';

// Note: Replace this placeholder with the actual import of your ProfileInfo component
const ProfileInfo = () => (
    <div className="text-sm font-medium text-green-300 border border-green-300 px-3 py-1 rounded-full hover:bg-green-700 transition duration-300">
        150 Credits | Pro
    </div>
);

// Assuming default props for demonstration; adjust based on your Auth context
const Header = ({ isLoggedIn = true, isAdmin = false }) => {

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
                    {/* Logo/Site Name */}
                    <div className="flex-shrink-0">
                        <Link to="/" className="text-2xl font-extrabold text-indigo-400">
                            DebateSphere
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex space-x-6">
                        {navLinks.map((link) => (
                            link.show && (
                                <Link
                                    key={link.name}
                                    to={link.path}
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
                            null
                        )}
                        <button className="md:hidden text-gray-300 hover:text-indigo-400">
                            <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" /></svg>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;