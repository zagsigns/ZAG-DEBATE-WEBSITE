import React, { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter as Router, useLocation, useNavigate, Link } from 'react-router-dom';
import { LogOut, User, Home, Zap, PlusCircle, Settings, UserPlus, Send, Loader, Edit, Trash2 } from 'lucide-react';

// --- CONTEXT & HOOKS ---
// 1. Auth Context for global state management
const AuthContext = createContext(null);

// 2. Mock authentication hook (simulating API calls with localStorage)
const useAuth = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Retrieve user state from local storage on initial load
        const storedUser = localStorage.getItem('debate_user');
        if (storedUser) {
            setUser({ 
                username: storedUser, 
                role: storedUser === 'admin' ? 'admin' : 'user'
            });
        }
        setLoading(false);
    }, []);

    const login = (username) => {
        setLoading(true);
        // Simulate a successful login
        localStorage.setItem('debate_user', username);
        setUser({ 
            username, 
            role: username === 'admin' ? 'admin' : 'user'
        });
        setLoading(false);
    };

    const logout = () => {
        setLoading(true);
        // Simulate a successful logout
        localStorage.removeItem('debate_user');
        setUser(null);
        setLoading(false);
    };

    return {
        user,
        isLoggedIn: !!user,
        loading,
        login,
        logout,
    };
};

const AuthProvider = ({ children }) => {
    const auth = useAuth();
    return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

const useAuthContext = () => useContext(AuthContext);

// --- COMPONENTS ---

// 3. Common Components
const NavLink = ({ to, children }) => (
    <Link 
        to={to} 
        className="text-gray-300 hover:text-white transition-colors duration-200 px-3 py-2 rounded-lg font-medium"
    >
        {children}
    </Link>
);

const Header = () => {
    const { user, logout } = useAuthContext();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="sticky top-0 z-50 bg-gray-900 shadow-lg border-b border-indigo-500/20">
            <div className="container mx-auto px-4 sm:px-6">
                <div className="flex justify-between items-center h-16">
                    {/* Logo and App Name */}
                    <Link to="/" className="flex items-center space-x-2 text-xl font-extrabold text-white">
                        <Zap className="w-6 h-6 text-indigo-400" />
                        <span>ZAG Debate</span>
                    </Link>

                    {/* Navigation Links (Center) */}
                    <nav className="hidden sm:flex space-x-4">
                        <NavLink to="/home"><Home className="w-4 h-4 inline mr-1" /> Home</NavLink>
                        <NavLink to="/debates"><Zap className="w-4 h-4 inline mr-1" /> Debates</NavLink>
                        <NavLink to="/create"><PlusCircle className="w-4 h-4 inline mr-1" /> Create</NavLink>
                        {/* Conditional Admin Link */}
                        {user && user.role === 'admin' && (
                            <NavLink to="/admin">Admin</NavLink>
                        )}
                    </nav>

                    {/* Auth Actions (Right) */}
                    <div className="flex items-center space-x-4">
                        {user ? (
                            <>
                                <span className="text-sm font-medium text-gray-300 hidden sm:block">
                                    Hi, <span className="text-indigo-400 font-bold">{user.username}</span>
                                </span>
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center px-3 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                                >
                                    <LogOut className="w-4 h-4 mr-1" /> Logout
                                </button>
                            </>
                        ) : (
                            <Link 
                                to="/login" 
                                className="flex items-center px-3 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-colors"
                            >
                                <User className="w-4 h-4 mr-1" /> Sign In
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

const Footer = () => {
    return (
        <footer className="bg-gray-900 border-t border-indigo-500/20 mt-8">
            <div className="container mx-auto px-4 sm:px-6 py-6 text-center">
                <div className="flex justify-center items-center space-x-2 text-gray-400 mb-2">
                    <Zap className="w-4 h-4 text-indigo-400" />
                    <p className="text-sm">&copy; {new Date().getFullYear()} ZAG Debate Platform. All rights reserved.</p>
                </div>
                <div className="text-xs space-x-4">
                    <a href="/about" className="text-gray-500 hover:text-indigo-400 transition-colors">About</a>
                    <a href="/terms" className="text-gray-500 hover:text-indigo-400 transition-colors">Terms of Service</a>
                    <a href="/privacy" className="text-gray-500 hover:text-indigo-400 transition-colors">Privacy Policy</a>
                </div>
            </div>
        </footer>
    );
};

const TempPage = ({ title }) => {
    return (
        <div className="text-center py-20 bg-gray-800 rounded-xl shadow-lg border border-indigo-500/20">
            <h2 className="text-4xl font-extrabold text-white mb-4">{title}</h2>
            <p className="text-lg text-gray-400">Content coming soon...</p>
        </div>
    );
};

// 4. Debate Components
const DebateCard = ({ debate }) => {
    const statusColor = debate.status === 'Active' ? 'bg-green-600' : 
                        debate.status === 'Pending' ? 'bg-yellow-600' : 'bg-red-600';

    return (
        <div className="bg-gray-800 p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow border border-gray-700/50 hover:border-indigo-500/50">
            <div className="flex justify-between items-start mb-3">
                <h3 className="text-xl font-bold text-white leading-tight pr-4">{debate.title}</h3>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full text-white ${statusColor} whitespace-nowrap`}>
                    {debate.status}
                </span>
            </div>
            <p className="text-sm text-gray-400 mb-4">Created by: {debate.createdBy}</p>
            
            <div className="flex justify-between items-center text-sm font-medium">
                <div className="flex items-center text-green-400">
                    <PlusCircle className="w-4 h-4 mr-1" />
                    Pros: {debate.pros}
                </div>
                <div className="flex items-center text-red-400">
                    <Trash2 className="w-4 h-4 mr-1" />
                    Cons: {debate.cons}
                </div>
                <Link to={`/debate/${debate.id}`} className="text-indigo-400 hover:text-indigo-300 font-semibold transition-colors flex items-center">
                    Join / View
                </Link>
            </div>
        </div>
    );
};

const DebateList = ({ debates }) => {
    if (debates.length === 0) {
        return (
            <div className="text-center py-10">
                <p className="text-lg text-gray-400">No debates available in this category.</p>
                <Link to="/create" className="text-indigo-400 hover:text-indigo-300 mt-2 inline-block">
                    Be the first to create one!
                </Link>
            </div>
        );
    }
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {debates.map(debate => (
                <DebateCard key={debate.id} debate={debate} />
            ))}
        </div>
    );
};

const CreateDebateForm = ({ onSubmit }) => {
    const [formData, setFormData] = useState({
        title: '',
        max_participant: 100,
        subscription_fee: 0,
        debate_type: 'chat',
        show_contact_info: false,
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        let newValue;
        if (type === 'number') {
            newValue = parseInt(value) || 0;
        } else if (type === 'checkbox') {
            newValue = checked;
        } else {
            newValue = value;
        }

        setFormData(prevData => ({
            ...prevData,
            [name]: newValue
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!formData.title.trim()) {
            setError('The debate title is required.');
            return;
        }

        setLoading(true);
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        try {
            onSubmit(formData);
        } catch (err) {
            setError('Failed to create debate. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="p-8 bg-gray-800 rounded-xl shadow-2xl border border-indigo-500/30 space-y-6">
            
            {error && (
                <p className="text-red-500 text-center font-medium bg-red-900/30 p-3 rounded-lg">{error}</p>
            )}

            {/* Basic Info: Title */}
            <div>
                <label htmlFor="title" className="block text-sm font-bold text-gray-300 mb-2">
                    Debate Topic / Title
                </label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-500 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                    placeholder="e.g., Is pineapple a valid pizza topping?"
                />
            </div>

            <h2 className="text-xl font-bold text-indigo-400 border-b border-indigo-500/50 pb-2 flex items-center">
                <Settings className="w-5 h-5 mr-2" /> Advanced Settings
            </h2>

            {/* Participants & Fee */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label htmlFor="max_participant" className="block text-sm font-bold text-gray-300 mb-2">
                        Max Participants (per side)
                    </label>
                    <input
                        type="number"
                        id="max_participant"
                        name="max_participant"
                        value={formData.max_participant}
                        onChange={handleChange}
                        min="1"
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">Set the maximum number of people allowed on the Pros and Cons side.</p>
                </div>
                <div>
                    <label htmlFor="subscription_fee" className="block text-sm font-bold text-gray-300 mb-2">
                        Subscription Fee (ZAG Credits)
                    </label>
                    <input
                        type="number"
                        id="subscription_fee"
                        name="subscription_fee"
                        value={formData.subscription_fee}
                        onChange={handleChange}
                        min="0"
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-indigo-500 focus:border-indigo-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">Cost for a user to join this debate (0 for free).</p>
                </div>
            </div>

            {/* Debate Type */}
            <div>
                <label className="block text-sm font-bold text-gray-300 mb-2 flex items-center">
                    <Zap className="w-4 h-4 mr-2" /> Debate Format
                </label>
                <div className="flex flex-wrap gap-4">
                    {['chat', 'call', 'video'].map(type => (
                        <label key={type} className={`cursor-pointer px-4 py-2 rounded-full border-2 transition-all text-sm font-semibold ${
                            formData.debate_type === type 
                                ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg'
                                : 'bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600'
                        }`}>
                            <input
                                type="radio"
                                name="debate_type"
                                value={type}
                                checked={formData.debate_type === type}
                                onChange={handleChange}
                                className="hidden"
                            />
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                        </label>
                    ))}
                </div>
                <p className="text-xs text-gray-500 mt-1">Choose the primary communication method for the debate.</p>
            </div>

            {/* Contact Info Checkbox */}
            <div className="flex items-center pt-4">
                <input
                    type="checkbox"
                    id="show_contact_info"
                    name="show_contact_info"
                    checked={formData.show_contact_info}
                    onChange={handleChange}
                    className="h-5 w-5 text-indigo-600 border-gray-600 rounded focus:ring-indigo-500 bg-gray-700"
                />
                <label htmlFor="show_contact_info" className="ml-3 text-sm font-medium text-gray-300 flex items-center">
                    <UserPlus className="w-4 h-4 mr-1" />
                    Allow participants to see my contact info (Email/Phone)
                </label>
            </div>

            {/* Submission Button */}
            <button
                type="submit"
                disabled={loading}
                className={`w-full flex items-center justify-center py-4 mt-8 text-lg font-bold rounded-lg shadow-xl transition-all transform ${
                    loading ? 'bg-gray-600 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 hover:scale-[1.01]'
                }`}
            >
                {loading ? (
                    'Creating Debate...'
                ) : (
                    <>
                        <Send className="w-5 h-5 mr-3" /> Create Debate
                    </>
                )}
            </button>
        </form>
    );
};

// --- PAGES (Components used for routing) ---

/**
 * 5. LoginPage Component
 * Handles user login and redirecting upon successful authentication.
 */
const LoginPage = () => {
    const { login, isLoggedIn } = useAuthContext();
    const navigate = useNavigate();
    
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
            login(username.trim()); 
        } else {
            setError('Both username and password are required.');
        }
    };

    return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-sm p-8 bg-gray-800 rounded-xl shadow-2xl border border-indigo-500/30">
                <h1 className="text-3xl font-extrabold text-white text-center mb-6">Welcome Back</h1>
                <p className="text-center text-gray-400 mb-8">Sign in to start debating.</p>

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
                        <LogOut className="w-5 h-5 mr-2 transform rotate-180" /> Sign In
                    </button>
                </form>
            </div>
        </div>
    );
};

/**
 * 6. HomePage Component
 * Displays active and completed debates.
 */
const HomePage = ({ debates }) => {
    // Note: useAuthContext is imported via the main AppContent scope
    const activeDebates = debates.filter(d => d.status === 'Active' || d.status === 'Pending');
    const completedDebates = debates.filter(d => d.status === 'Completed');

    return (
        <div className="space-y-12">
            <header className="text-center py-16 bg-gray-800 rounded-xl shadow-lg border border-indigo-500/20">
                <h1 className="text-5xl font-extrabold text-white mb-4">
                    Welcome to ZAG Debate
                </h1>
                <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
                    Join the conversation. Explore heated topics, take a side, and contribute your arguments in structured, time-limited debates.
                </p>
                <Link to="/create">
                    <button className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-bold rounded-full shadow-lg text-white bg-indigo-600 hover:bg-indigo-700 transition-all transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50">
                        <PlusCircle className="w-5 h-5 mr-2" /> Start a New Debate
                    </button>
                </Link>
            </header>

            {/* Active Debates Section */}
            <section>
                <h2 className="text-3xl font-bold text-white border-b-2 border-indigo-500 pb-2 mb-6">
                    Active Debates
                </h2>
                <DebateList debates={activeDebates} />
            </section>

            {/* Completed Debates Section */}
            <section>
                <h2 className="text-3xl font-bold text-white border-b-2 border-indigo-500 pb-2 mb-6">
                    Completed Debates
                </h2>
                {completedDebates.length > 0 ? (
                    <DebateList debates={completedDebates} />
                ) : (
                    <p className="text-gray-400">No debates have been completed yet.</p>
                )}
            </section>
        </div>
    );
};

/**
 * 7. CreateDebatePage Component
 * Displays the form to create a new debate. Requires authentication.
 */
const CreateDebatePage = ({ addDebate }) => {
    const { user } = useAuthContext();
    const navigate = useNavigate();

    // Protection: User must be logged in to create a debate
    if (!user) {
        return (
            <div className="text-center py-20 bg-gray-800 rounded-xl shadow-lg border border-red-500/20">
                <h2 className="text-3xl font-bold text-red-400 mb-4">Access Denied</h2>
                <p className="text-lg text-gray-400 mb-6">
                    You must be logged in to create a new debate.
                </p>
                <button 
                    onClick={() => navigate('/login')}
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-bold rounded-lg shadow-md text-white bg-red-600 hover:bg-red-700 transition-colors"
                >
                    Go to Login
                </button>
            </div>
        );
    }

    const handleNewDebate = (debateData) => {
        addDebate(debateData);
        navigate('/'); // Redirect to home page after creation
    };

    return (
        <div className="max-w-3xl mx-auto space-y-8">
            <header className="text-center">
                <h1 className="text-4xl font-extrabold text-white mb-2 flex items-center justify-center">
                    <PlusCircle className="w-8 h-8 mr-3 text-indigo-400" /> Start a New Debate
                </h1>
                <p className="text-gray-400">Define the topic and settings for your structured debate.</p>
            </header>
            
            <CreateDebateForm onSubmit={handleNewDebate} />
        </div>
    );
};

// --- MAIN APP COMPONENT ---

// Sample debate data to manage application state
const initialDebates = [
    { id: 1, title: "The use of AI in education should be limited.", createdBy: "Alice", status: "Active", pros: 15, cons: 12 },
    { id: 2, title: "Remote work is permanently better than office work.", createdBy: "Bob", status: "Active", pros: 20, cons: 25 },
    { id: 3, title: "Universal Basic Income is a viable economic strategy.", createdBy: "Charlie", status: "Pending", pros: 8, cons: 5 },
    { id: 4, title: "Cryptocurrency is a passing fad.", createdBy: "Diana", status: "Completed", pros: 30, cons: 35 },
];

const AppContent = () => {
    const location = useLocation();
    const [debates, setDebates] = useState(initialDebates);
    const [content, setContent] = useState(null);

    // Function to add a new debate
    const addDebate = (newDebateData) => {
        const newDebate = {
            id: debates.length + 1,
            ...newDebateData,
            createdBy: 'Admin', // Placeholder
            status: 'Pending',
            pros: 0,
            cons: 0,
        };
        setDebates(prevDebates => [...prevDebates, newDebate]);
    };

    // Simple router implementation using useLocation
    useEffect(() => {
        const path = location.pathname;
        let currentPage;

        // Custom Routing Logic
        switch (path) {
            case '/':
            case '/home':
                currentPage = <HomePage debates={debates} />;
                break;
            case '/debates':
                // Currently redirects to home
                currentPage = <HomePage debates={debates} />;
                break;
            case '/create':
                currentPage = <CreateDebatePage addDebate={addDebate} />;
                break;
            case '/admin':
                currentPage = <TempPage title="Admin Dashboard" />;
                break;
            case '/login':
                currentPage = <LoginPage />;
                break;
            // Add other pages here (e.g., DebateDetailPage)
            default:
                currentPage = <TempPage title="404 - Page Not Found" />;
                break;
        }
        setContent(currentPage);
    }, [location.pathname, debates]);

    return (
        <div className="min-h-screen flex flex-col bg-gray-900 text-white font-sans">
            <Header />
            <main className="flex-grow container mx-auto px-4 sm:px-6 py-8">
                {content}
            </main>
            <Footer />
        </div>
    );
};

// The default export wraps AppContent in the Router and AuthProvider
const App = () => (
    <Router>
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    </Router>
);

export default App;
