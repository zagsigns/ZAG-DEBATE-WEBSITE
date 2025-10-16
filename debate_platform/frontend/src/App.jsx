import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Bolt, User, PlusCircle, ChevronRight, Users, MessageCircle, Zap, TrendingUp, ShieldCheck, Gem } from 'lucide-react'; 

// ===================================
// 1. Core Component: Header
// ===================================
const Header = ({ isLoggedIn, isAdmin }) => {
    const statusText = isLoggedIn ? 'Active' : 'Guest';
    const statusColor = isLoggedIn ? 'text-green-400' : 'text-yellow-400';

    const baseLinkClasses = "text-gray-300 hover:text-orange-400 font-medium transition duration-200";
    const navItems = [
        { name: 'Home', path: '/' },
        { name: 'Debates', path: '/debates' },
    ];

    return (
        <header className="fixed top-0 w-full bg-gray-900/95 backdrop-blur-md border-b border-gray-700 shadow-xl z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    
                    {/* Logo/Site Title - Vibrant Orange Accent */}
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center space-x-2 text-xl font-extrabold text-white hover:text-orange-400 transition">
                            <Bolt className="w-6 h-6 text-orange-400" />
                            <span>ZagDebate</span>
                        </Link>
                    </div>

                    {/* Main Navigation Links */}
                    <nav className="hidden md:flex space-x-8">
                        {navItems.map(item => (
                            <Link key={item.name} to={item.path} className={baseLinkClasses}>
                                {item.name}
                            </Link>
                        ))}
                        {isLoggedIn && (
                            <Link to="/create" className={baseLinkClasses}>
                                <PlusCircle className="w-5 h-5 inline mr-1" /> Create
                            </Link>
                        )}
                        {isAdmin && (
                            <Link to="/admin" className="text-red-400 hover:text-red-300 font-bold transition">
                                Admin
                            </Link>
                        )}
                    </nav>

                    {/* User Status and Dashboard Link */}
                    <div className="flex items-center space-x-4">
                        <span className={`text-sm font-semibold ${statusColor} hidden sm:block`}>
                            {statusText}
                        </span>
                        {isLoggedIn ? (
                            <Link 
                                to="/dashboard" 
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full shadow-lg text-gray-900 bg-indigo-500 hover:bg-indigo-600 transition duration-150"
                            >
                                <User className="w-4 h-4 mr-2" /> Dashboard
                            </Link>
                        ) : (
                            <Link 
                                to="/login" 
                                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-full shadow-lg text-white bg-teal-600 hover:bg-teal-700 transition duration-150"
                            >
                                Login
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

// ===================================
// 2. Page Component: HomePage
// ===================================
const HomePage = () => {
    return (
        <div className="min-h-screen bg-gray-900 text-white font-sans">
            {/* Hero Section */}
            <section className="relative h-screen flex items-center justify-center text-center overflow-hidden p-4 sm:p-8">
                <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-indigo-900 opacity-90 z-10"></div>
                
                <div className="relative z-20 max-w-4xl mx-auto">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-4 leading-tight drop-shadow-lg">
                        Elevate Your Voice. Engage in Insightful Debates.
                    </h1>
                    <p className="text-lg sm:text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
                        Join a vibrant community where informed opinions shape the future. Explore diverse perspectives on today's most pressing topics.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link 
                            to="/debates" 
                            className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-full shadow-lg text-gray-900 bg-orange-500 hover:bg-orange-600 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
                        >
                            Explore Debates <ChevronRight className="ml-2 -mr-1 h-5 w-5" />
                        </Link>
                        <Link 
                            to="/about" 
                            className="inline-flex items-center justify-center px-8 py-3 border border-gray-600 text-base font-medium rounded-full shadow-lg text-gray-300 bg-gray-800 hover:bg-gray-700 hover:border-gray-500 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
                        >
                            Learn More
                        </Link>
                    </div>
                </div>
            </section>

            {/* Feature Showcase Section */}
            <section className="py-16 sm:py-24 bg-gray-900 px-4 sm:px-8">
                <div className="max-w-6xl mx-auto text-center">
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-orange-400 mb-12">Why Participate in Debates?</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">
                        {/* Feature Card 1 */}
                        <div className="bg-gray-800 rounded-xl p-8 shadow-xl border border-gray-700 hover:border-indigo-500 transform hover:scale-105 transition duration-300">
                            <Users className="h-12 w-12 text-indigo-500 mx-auto mb-6 p-2 bg-gray-700 rounded-full" />
                            <h3 className="text-xl font-bold text-white mb-3">Connect & Collaborate</h3>
                            <p className="text-gray-400 leading-relaxed">
                                Engage with a global community of thinkers. Exchange ideas, challenge assumptions, and build connections.
                            </p>
                        </div>
                        {/* Feature Card 2 */}
                        <div className="bg-gray-800 rounded-xl p-8 shadow-xl border border-gray-700 hover:border-teal-500 transform hover:scale-105 transition duration-300">
                            <MessageCircle className="h-12 w-12 text-teal-500 mx-auto mb-6 p-2 bg-gray-700 rounded-full" />
                            <h3 className="text-xl font-bold text-white mb-3">Sharpen Your Arguments</h3>
                            <p className="text-gray-400 leading-relaxed">
                                Develop critical thinking and communication skills. Learn to articulate your views persuasively and respectfully.
                            </p>
                        </div>
                        {/* Feature Card 3 */}
                        <div className="bg-gray-800 rounded-xl p-8 shadow-xl border border-gray-700 hover:border-amber-500 transform hover:scale-105 transition duration-300">
                            <TrendingUp className="h-12 w-12 text-amber-500 mx-auto mb-6 p-2 bg-gray-700 rounded-full" />
                            <h3 className="text-xl font-bold text-white mb-3">Influence & Innovate</h3>
                            <p className="text-gray-400 leading-relaxed">
                                Contribute to meaningful discussions that can lead to new insights and even influence real-world change.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* How It Works / Value Proposition Section */}
            <section className="py-16 sm:py-24 bg-gray-800 px-4 sm:px-8">
                <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    <div className="lg:order-2">
                        {/* Placeholder for visual */}
                        <div className="bg-gray-700 h-64 sm:h-80 rounded-xl flex items-center justify-center text-gray-400 text-lg shadow-2xl border border-gray-600">
                            <Zap className="h-16 w-16 mr-4 text-orange-400 animate-pulse" /> Engaging Visual Here
                        </div>
                    </div>
                    <div className="lg:order-1 text-center lg:text-left">
                        <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-6 leading-tight">
                            Seamlessly Engage in Structured Discussions.
                        </h2>
                        <p className="text-lg text-gray-300 mb-6">
                            Our platform provides a fair and moderated environment, ensuring every voice is heard and every argument is considered. From trending topics to niche subjects, find your debate.
                        </p>
                        <ul className="space-y-4 text-left inline-block lg:block">
                            <li className="flex items-start text-gray-300">
                                <ShieldCheck className="h-6 w-6 text-teal-400 mr-3 mt-1 flex-shrink-0" />
                                <p>Moderated discussions ensure respect and focus.</p>
                            </li>
                            <li className="flex items-start text-gray-300">
                                <Gem className="h-6 w-6 text-indigo-400 mr-3 mt-1 flex-shrink-0" />
                                <p>Structured formats for clear, concise arguments.</p>
                            </li>
                            <li className="flex items-start text-gray-300">
                                <Users className="h-6 w-6 text-amber-400 mr-3 mt-1 flex-shrink-0" />
                                <p>Community voting and sentiment analysis features.</p>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-16 sm:py-24 bg-gray-900 px-4 sm:px-8">
                <div className="max-w-6xl mx-auto text-center">
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-orange-400 mb-12">What Our Debaters Say</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12">
                        {/* Testimonial Card 1 */}
                        <div className="bg-gray-800 rounded-xl p-8 shadow-xl border border-gray-700">
                            <p className="text-lg italic text-gray-300 mb-6">
                                "This platform has transformed how I engage with complex topics. The quality of discussion is unparalleled, and I've learned so much!"
                            </p>
                            <div className="flex items-center justify-center">
                                <img 
                                    src="https://via.placeholder.com/50/4ade80/FFFFFF?text=A" 
                                    alt="Avatar" 
                                    className="rounded-full h-12 w-12 mr-4 border-2 border-teal-500" 
                                />
                                <div>
                                    <p className="font-bold text-white">Alex Johnson</p>
                                    <p className="text-sm text-gray-400">Policy Analyst</p>
                                </div>
                            </div>
                        </div>
                        {/* Testimonial Card 2 */}
                        <div className="bg-gray-800 rounded-xl p-8 shadow-xl border border-gray-700">
                            <p className="text-lg italic text-gray-300 mb-6">
                                "Finally, a place for thoughtful debate without the noise. The moderation is excellent, and the community is genuinely insightful."
                            </p>
                            <div className="flex items-center justify-center">
                                <img 
                                    src="https://via.placeholder.com/50/8b5cf6/FFFFFF?text=M" 
                                    alt="Avatar" 
                                    className="rounded-full h-12 w-12 mr-4 border-2 border-indigo-500" 
                                />
                                <div>
                                    <p className="font-bold text-white">Maria Rodriguez</p>
                                    <p className="text-sm text-gray-400">Student & Researcher</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Final Call to Action */}
            <section className="py-16 sm:py-24 bg-gradient-to-r from-indigo-800 to-purple-900 px-4 sm:px-8 text-center">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-6 leading-tight">
                        Ready to Dive into the Discussion?
                    </h2>
                    <p className="text-lg text-indigo-200 mb-8">
                        Your perspective matters. Join the conversation and explore hundreds of active debates today.
                    </p>
                    <Link 
                        to="/debates" 
                        className="inline-flex items-center justify-center px-10 py-4 border border-transparent text-lg font-semibold rounded-full shadow-2xl text-gray-900 bg-orange-500 hover:bg-orange-600 transition duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105"
                    >
                        Start Debating Now <ChevronRight className="ml-2 -mr-1 h-6 w-6" />
                    </Link>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-950 text-gray-400 py-8 px-4 sm:px-8 text-center border-t border-gray-800">
                <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center">
                    <p className="mb-4 sm:mb-0">&copy; {new Date().getFullYear()} DebatePlatform. All rights reserved.</p>
                    <nav className="flex space-x-6">
                        <Link to="/privacy" className="hover:text-white transition duration-200">Privacy Policy</Link>
                        <Link to="/terms" className="hover:text-white transition duration-200">Terms of Service</Link>
                        <Link to="/contact" className="hover:text-white transition duration-200">Contact Us</Link>
                    </nav>
                </div>
            </footer>
        </div>
    );
};

// ===================================
// 3. Page Component: DebateList
// ===================================
const DebateList = () => {
    return (
        <div className="min-h-screen pt-20 flex items-center justify-center bg-gray-900 text-white">
            <div className="p-10 text-center text-3xl bg-gray-800 rounded-xl shadow-2xl border border-gray-700">
                Debate List Page (Needs Content)
            </div>
        </div>
    );
};


// ===================================
// 4. Placeholder Component
// ===================================
// TEMP Placeholder for all other pages
const TempPage = ({ title }) => (
    <div className="min-h-screen pt-20 flex items-center justify-center bg-gray-900 text-white">
        <div className="p-10 text-center text-3xl bg-gray-800 rounded-xl shadow-2xl border border-gray-700">
            {title}
        </div>
    </div>
);


// ===================================
// 5. Main App Component
// ===================================
function App() {
    // --- TEMPORARY STATE FOR TESTING USER ROLES ---
    const isUserLoggedIn = true; 
    const isUserAdmin = true; 
    // ---------------------------------------------

    return (
        <Router>
            {/* The Header component is used here */}
            <Header isLoggedIn={isUserLoggedIn} isAdmin={isUserAdmin} /> 
            
            {/* Main content area: Accounts for fixed header height (pt-20 is safer than pt-16) */}
            <main className="bg-gray-900 text-white min-h-screen pt-20">
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
            
            {/* Footer component logic is now within HomePage for its specific section,
                but for a complex app, a shared Footer component would go here. */}
        </Router>
    );
}

export default App;
