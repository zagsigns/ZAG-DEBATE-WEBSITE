import { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter as Router, useLocation, useNavigate, Link } from 'react-router-dom';
// Added BarChart and Clock for new stats
import { LogOut, User, Home, Zap, PlusCircle, Settings, UserPlus, Send, Loader, Edit, Trash2, Mail, Lock, Key, Filter, Activity, Clock, CheckCircle, Gift, CreditCard, DollarSign, Users, Database, ClipboardList, TrendingUp, Cpu, MessageSquare, ThumbsUp, Share2, CornerRightUp, BarChart } from 'lucide-react';

// --- Global Constants & Mock Data Setup ---
const COMMISSION_SPLIT = { admin: 0.25, creator: 0.75 };
const COMMISSION_THRESHOLD = 100; // Customizable by admin
const INITIAL_TRIAL_WEEKS = 4;
// Updated DEFAULT_DEBATES with likes and shares
const DEFAULT_DEBATES = [
    { id: 1, title: "The Future of AI in Education", hostId: 'user1', participants: 150, topic: 'Technology', status: 'Live', createdAt: '2024-10-01', likes: 45, shares: 12 },
    { id: 2, title: "Universal Basic Income Feasibility", hostId: 'admin', participants: 55, topic: 'Economics', status: 'Upcoming', createdAt: '2024-10-15', likes: 22, shares: 5 },
    { id: 3, title: "Climate Policy Efficacy", hostId: 'user3', participants: 300, topic: 'Environment', status: 'Live', createdAt: '2024-10-18', likes: 89, shares: 35 },
    { id: 4, title: "Mandatory Four-Day Work Week", hostId: 'user2', participants: 10, topic: 'Society', status: 'Upcoming', createdAt: '2024-10-20', likes: 15, shares: 3 },
    { id: 5, title: "Should Pluto be a Planet?", hostId: 'user1', participants: 50, topic: 'Science', status: 'Completed', createdAt: '2024-09-01', likes: 110, shares: 20 },
];

// Mock data for new analytics features (inspired by the image)
const MOCK_ANALYTICS = {
    totalUsers: 4892,
    newUsersLastMonth: 356,
    activeUsersToday: 1245,
    growthRate: 7.8, // %
    userRolesBreakdown: {
        admin: 1,
        customer: 4800,
        trial: 91,
    }
};

// --- CONTEXT & HOOKS (Simulating Firebase Authentication and Firestore Data) ---
const AuthContext = createContext(null);
const DataContext = createContext(null);

// Custom hook for Auth simulation
const useAuth = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const storedUser = localStorage.getItem('debate_user');
        if (storedUser) {
            const role = storedUser === 'admin' ? 'admin' : 'customer';
            setUser({ username: storedUser, role, id: storedUser, email: `${storedUser}@debate.com` });
        }
        setLoading(false);
    }, []);

    const login = (username) => {
        setLoading(true);
        // Basic role assignment based on username
        const role = username === 'admin' ? 'admin' : 'customer';
        localStorage.setItem('debate_user', username);
        setUser({ username, role, id: username, email: `${username}@debate.com` });
        setLoading(false);
    };

    const logout = () => {
        setLoading(true);
        localStorage.removeItem('debate_user');
        setUser(null);
        setLoading(false);
    };

    return { user, login, logout, loading };
};

// Custom hook for Data simulation (Debates, Subscriptions, Credits)
const useData = (userId) => {
    // Debates state
    const [debates, setDebates] = useState(() => {
        const storedDebates = localStorage.getItem('debates');
        return storedDebates ? JSON.parse(storedDebates) : DEFAULT_DEBATES;
    });

    // User data (membership and credits)
    const [userData, setUserData] = useState(() => {
        const storedUserData = localStorage.getItem('userData');
        return storedUserData ? JSON.parse(storedUserData) : { 
            admin: { credits: 9999, membership: 'admin' }, 
            user1: { credits: 50, membership: 'trial', trialEndDate: new Date(Date.now() + INITIAL_TRIAL_WEEKS * 7 * 24 * 60 * 60 * 1000).toISOString() },
            user2: { credits: 200, membership: 'monthly' },
            user3: { credits: 100, membership: 'annual' }
        };
    });

    // System settings state
    const [systemSettings, setSystemSettings] = useState(() => {
        const storedSettings = localStorage.getItem('systemSettings');
        return storedSettings ? JSON.parse(storedSettings) : {
            commissionThreshold: COMMISSION_THRESHOLD,
            trialWeeks: INITIAL_TRIAL_WEEKS,
        };
    });
    
    // Analytics state (new)
    const [analytics, setAnalytics] = useState(() => {
        const storedAnalytics = localStorage.getItem('analytics');
        return storedAnalytics ? JSON.parse(storedAnalytics) : MOCK_ANALYTICS;
    });
    
    useEffect(() => {
        localStorage.setItem('debates', JSON.stringify(debates));
    }, [debates]);

    useEffect(() => {
        localStorage.setItem('userData', JSON.stringify(userData));
    }, [userData]);
    
    useEffect(() => {
        localStorage.setItem('systemSettings', JSON.stringify(systemSettings));
    }, [systemSettings]);
    
    useEffect(() => {
        localStorage.setItem('analytics', JSON.stringify(analytics));
    }, [analytics]);


    const userCredits = userId && userData[userId] ? userData[userId].credits : 0;
    const userMembership = userId && userData[userId] ? userData[userId].membership : 'free';

    // Debate CRUD Operations
    const createDebate = (newDebate) => {
        const newId = debates.length + 1;
        setDebates([...debates, { ...newDebate, id: newId, hostId: userId, participants: 0, status: 'Upcoming', createdAt: new Date().toISOString().slice(0, 10), likes: 0, shares: 0 }]);
    };
    
    const updateDebate = (id, updates) => {
        setDebates(debates.map(d => d.id === id ? { ...d, ...updates } : d));
    };
    
    const deleteDebate = (id) => {
        setDebates(debates.filter(d => d.id !== id));
    };

    // Social Features
    const likeDebate = (id) => {
        setDebates(prev => prev.map(d => 
            d.id === id ? { ...d, likes: d.likes + 1 } : d
        ));
    };

    const shareDebate = (id) => {
        setDebates(prev => prev.map(d => 
            d.id === id ? { ...d, shares: d.shares + 1 } : d
        ));
        // Mock: Copy link to clipboard
        console.log(`Mock shared debate link: ${window.location.origin}/debate/${id}`);
        // Using console.log instead of alert for non-critical mock features
    };

    // Admin User Management Functions
    const getAllUsers = () => {
        return Object.keys(userData).map(id => ({
            id: id,
            role: id === 'admin' ? 'admin' : (id.startsWith('user') ? 'customer' : 'unknown'),
            membership: userData[id]?.membership || 'free',
            credits: userData[id]?.credits || 0
        }));
    };

    const updateUserRole = (id, newRole) => {
        if (id === 'admin' && newRole !== 'admin') {
            // Use a toast/modal later, for now, use a safer confirmation
            console.error("Admin cannot demote self in this mock environment.");
            return;
        }
        // In a real app, this would update the user's role in the Auth system.
        alert(`MOCK: Changing role for user ${id} to ${newRole}. (Data update simulated)`);
        // We'll also update the mock analytics for role breakdown simulation
        setAnalytics(prev => {
            const newBreakdown = { ...prev.userRolesBreakdown };
            // Simple mock: assumes user was 'customer' before change
            if (newRole === 'admin') {
                newBreakdown.customer = Math.max(0, newBreakdown.customer - 1);
                newBreakdown.admin = (newBreakdown.admin || 0) + 1;
            }
            return { ...prev, userRolesBreakdown: newBreakdown };
        });
    };

    // Admin System Settings Functions
    const updateSystemSettings = (updates) => {
        setSystemSettings(prev => ({
            ...prev,
            ...updates
        }));
    };
    
    // Admin Analytics Function
    const getAnalytics = () => {
        // Return a deep copy to ensure immutability
        return JSON.parse(JSON.stringify(analytics));
    };

    // Credit & Membership Management
    const buyCredits = (amount) => {
        setUserData(prev => ({
            ...prev,
            [userId]: { ...prev[userId], credits: (prev[userId]?.credits || 0) + amount }
        }));
    };

    const subscribe = (plan) => {
        setUserData(prev => ({
            ...prev,
            [userId]: { ...prev[userId], membership: plan, trialEndDate: undefined }
        }));
    };

    return { 
        debates, createDebate, updateDebate, deleteDebate, 
        likeDebate, shareDebate, 
        userCredits, userMembership, buyCredits, subscribe,
        // Admin Control
        systemSettings, updateSystemSettings,
        getAllUsers, updateUserRole,
        getAnalytics, // New
    };
};

const AuthProvider = ({ children }) => {
    const auth = useAuth();
    return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>;
};

const DataProvider = ({ children }) => {
    const { user, loading } = useContext(AuthContext);
    const data = useData(user?.id);
    return <DataContext.Provider value={{ ...data, loading: loading }}>{children}</DataContext.Provider>;
};

// --- UTILITY FUNCTIONS ---

function getIconClass(pageTitle) { 
    if (pageTitle.includes("Access Denied")) return "text-red-600";
    if (pageTitle.includes("404")) return "text-yellow-600";
    return "text-indigo-600";
}

function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

// --- COMPONENTS ---

const Card = ({ children, title, icon: Icon, className = "" }) => (
    <div className={`bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-700 ${className}`}>
        {title && (
            <div className="flex items-center mb-4 border-b border-gray-700 pb-2">
                {Icon && <Icon className="w-6 h-6 mr-3 text-indigo-400" />}
                <h2 className="text-xl font-semibold text-white">{title}</h2>
            </div>
        )}
        {children}
    </div>
);

const Button = ({ children, onClick, variant = 'primary', className = '', type='button', disabled = false, icon: Icon = null }) => {
    const baseStyle = 'px-4 py-2 font-medium rounded-lg transition duration-200 shadow-md flex items-center justify-center';
    const variants = {
        primary: 'bg-indigo-600 hover:bg-indigo-700 text-white',
        secondary: 'bg-gray-600 hover:bg-gray-700 text-white',
        danger: 'bg-red-600 hover:bg-red-700 text-white',
        success: 'bg-green-600 hover:bg-green-700 text-white',
        ghost: 'bg-transparent text-indigo-400 hover:bg-indigo-900/50'
    };
    return (
        <button 
            type={type} 
            onClick={onClick} 
            disabled={disabled}
            className={`${baseStyle} ${variants[variant]} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
            {Icon && <Icon className="w-4 h-4 mr-1" />}
            {children}
        </button>
    );
};

const Input = ({ label, type = 'text', value, onChange, placeholder, required = false, disabled = false, className = '' }) => (
    <div className="mb-4">
        <label className="block text-sm font-medium text-gray-400 mb-1">{label}</label>
        <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            className={`w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500 ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
        />
    </div>
);

const Header = () => {
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    
    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="bg-gray-800 shadow-xl border-b border-indigo-600/50">
            <div className="container mx-auto px-4 sm:px-6 py-3 flex justify-between items-center">
                {/* Logo always links to the General Home Page */}
                <Link to="/" className="flex items-center text-2xl font-bold text-indigo-400 hover:text-indigo-300 transition duration-150">
                    <Zap className="w-7 h-7 mr-2" />
                    DebateSphere
                </Link>
                <nav className="flex items-center space-x-4">
                    {/* Home link visible when logged in */}
                    {user && (
                        <Link to="/" className="text-gray-300 hover:text-white transition duration-150 flex items-center">
                            <Home className="w-5 h-5 mr-1" /> Home
                        </Link>
                    )}
                    
                    {user ? (
                        <>
                            {user.role === 'admin' && (
                                <Link to="/admin" className="text-red-400 hover:text-red-300 transition duration-150 flex items-center font-semibold">
                                    <Cpu className="w-5 h-5 mr-1" /> Admin
                                </Link>
                            )}
                            <Link to="/profile" className="text-gray-300 hover:text-white transition duration-150 flex items-center">
                                <User className="w-5 h-5 mr-1" /> {user.username}
                            </Link>
                            <Button onClick={handleLogout} variant="secondary" className="flex items-center">
                                <LogOut className="w-4 h-4 mr-1" /> Logout
                            </Button>
                        </>
                    ) : (
                        <>
                            <Link to="/login" className="text-gray-300 hover:text-white transition duration-150">Login</Link>
                            <Link to="/register">
                                <Button variant="primary" className="flex items-center">
                                    <UserPlus className="w-4 h-4 mr-1" /> Register
                                </Button>
                            </Link>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
};

const Footer = () => (
    <footer className="bg-gray-900 border-t border-gray-700 py-6 text-center text-gray-500 text-sm">
        <div className="container mx-auto px-4 sm:px-6">
            &copy; {new Date().getFullYear()} DebateSphere. All rights reserved. | <a href="#" className="hover:text-indigo-400">Privacy Policy</a>
        </div>
    </footer>
);

// --- Debate Feed Card Component ---

const DebateFeedCard = ({ debate }) => {
    const navigate = useNavigate();
    const { likeDebate, shareDebate, userMembership } = useContext(DataContext);
    const { user } = useContext(AuthContext);

    const getStatusStyle = (status) => {
        switch (status) {
            case 'Live': return 'bg-red-600 text-white';
            case 'Upcoming': return 'bg-yellow-500 text-gray-900';
            case 'Completed': return 'bg-green-600 text-white';
            default: return 'bg-gray-500 text-white';
        }
    };

    const handleViewJoin = () => {
        if (!user) {
            alert("You must log in or register to join a debate!");
            navigate('/login');
        } else {
            navigate(`/debate/${debate.id}`);
        }
    };
    
    // Logic to disable view/join for free/trial members on premium debates (mock logic)
    const isPremium = debate.participants > 100;
    const isAccessDisabled = !user || (!['monthly', 'annual', 'admin'].includes(userMembership) && isPremium);


    return (
        <Card className="shadow-2xl hover:shadow-indigo-500/30 transition-shadow duration-300">
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center">
                    <User className="w-8 h-8 p-1 rounded-full bg-indigo-600 text-white mr-3" />
                    <div>
                        <h3 className="text-lg font-bold text-white leading-tight">{debate.title}</h3>
                        <p className="text-sm text-gray-400">Hosted by: <span className="font-semibold text-indigo-300">{debate.hostId}</span></p>
                    </div>
                </div>
                <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusStyle(debate.status)}`}>
                    {debate.status}
                </span>
            </div>

            {/* Body */}
            <p className="text-gray-300 mb-4">{debate.topic} | Started: {debate.createdAt}</p>
            
            <div className="flex justify-between items-center text-sm mb-4 border-y border-gray-700 py-3">
                <p className="text-indigo-400 flex items-center">
                    <Users className="w-4 h-4 mr-1" /> 
                    {debate.participants} Participants
                </p>
                <p className="text-yellow-400 flex items-center">
                    <TrendingUp className="w-4 h-4 mr-1" /> 
                    {isPremium ? 'Premium Access' : 'Open Access'}
                </p>
            </div>
            
            {/* Actions */}
            <div className="flex justify-between items-center space-x-2">
                <Button 
                    onClick={handleViewJoin} 
                    variant={isAccessDisabled ? 'secondary' : 'primary'}
                    className="flex-grow"
                    disabled={isAccessDisabled}
                >
                    {isAccessDisabled ? 'Upgrade to Join' : 'View / Join Debate'}
                </Button>

                <Button 
                    onClick={() => likeDebate(debate.id)} 
                    variant="ghost" 
                    className="p-2 border border-gray-700 hover:bg-gray-700"
                    icon={ThumbsUp}
                >
                    {debate.likes}
                </Button>
                
                <Button 
                    onClick={() => shareDebate(debate.id)} 
                    variant="ghost" 
                    className="p-2 border border-gray-700 hover:bg-gray-700"
                    icon={Share2}
                >
                    {debate.shares}
                </Button>
            </div>
            {isAccessDisabled && <p className="text-xs text-red-400 mt-2">Requires login or premium membership.</p>}
        </Card>
    );
};

// Refactored General Home Page Component (Now a Debate Feed)
const GeneralHomePage = () => {
    const { debates } = useContext(DataContext);

    return (
        <div className="py-8">
            <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-8 text-center border-b border-indigo-600/50 pb-4">
                Global Debate Feed
            </h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
                {debates.length > 0 ? (
                    debates
                        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Sort newest first
                        .map(debate => (
                            <DebateFeedCard key={debate.id} debate={debate} />
                        ))
                ) : (
                    <p className="text-center text-gray-400 md:col-span-2 lg:col-span-3">No debates are currently running or scheduled.</p>
                )}
            </div>
        </div>
    );
};


// 1. Authentication Pages (Login / Register)

const LoginPage = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const { login, user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            // After successful login, navigate to the specific user's page
            navigate(user.role === 'admin' ? '/admin' : '/dashboard');
        }
    }, [user, navigate]);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Mocking login for any non-empty username
        if (username) {
            login(username);
        }
    };

    return (
        <Card title="Login to DebateSphere" icon={Key} className="max-w-md mx-auto">
            <form onSubmit={handleSubmit}>
                <Input label="Username/Email" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="admin or customer_name (e.g., user1)" required />
                <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="secret" required />
                <Button type="submit" className="w-full mt-4">Login</Button>
            </form>
            <p className="text-center mt-4 text-gray-400">
                Don't have an account? <Link to="/register" className="text-indigo-400 hover:text-indigo-300">Register</Link>
            </p>
        </Card>
    );
};

const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login, user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (user) {
            navigate(user.role === 'admin' ? '/admin' : '/dashboard');
        }
    }, [user, navigate]);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Mock registration, immediately logs the user in
        if (username) {
            login(username);
        }
    };

    return (
        <Card title="Join DebateSphere" icon={UserPlus} className="max-w-md mx-auto">
            <form onSubmit={handleSubmit}>
                <Input label="Username" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Your unique name" required />
                <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@example.com" required />
                <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Choose a secure password" required />
                <Button type="submit" className="w-full mt-4">Register and Start Trial</Button>
            </form>
            <p className="text-center mt-4 text-gray-400">
                Already registered? <Link to="/login" className="text-indigo-400 hover:text-indigo-300">Login</Link>
            </p>
        </Card>
    );
};

// 2. Customer Dashboard & Core Pages

const DebateList = ({ debates, userId, isCustomer = true }) => {
    const navigate = useNavigate();
    const { deleteDebate, createDebate } = useContext(DataContext);
    const [isCreating, setIsCreating] = useState(false);
    const [newTitle, setNewTitle] = useState('');
    const [newTopic, setNewTopic] = useState('');

    const handleDelete = (id) => {
        // Replace with custom modal/toast later
        if (window.confirm(`Are you sure you want to delete debate ID ${id}?`)) {
            deleteDebate(id);
        }
    };
    
    const handleCreate = (e) => {
        e.preventDefault();
        createDebate({ title: newTitle, topic: newTopic });
        setIsCreating(false);
        setNewTitle('');
        setNewTopic('');
    };

    // Filter debates: Customers see only their own, Admin sees all
    const debatesToDisplay = debates.filter(d => isCustomer ? d.hostId === userId : true);

    return (
        <Card title={isCustomer ? "My Hosted Debates (CRUD Access)" : "All Platform Debates (Admin)"} icon={ClipboardList} className="col-span-1 lg:col-span-3">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-white">{isCustomer ? "Your Debates" : "Full List"}</h3>
                {isCustomer && (
                    <Button onClick={() => setIsCreating(true)} className="flex items-center">
                        <PlusCircle className="w-4 h-4 mr-1" /> Create New Debate
                    </Button>
                )}
            </div>

            {isCreating && (
                <div className="mb-4 p-4 bg-gray-700 rounded-lg">
                    <h4 className="font-semibold mb-2">Create New Debate</h4>
                    <form onSubmit={handleCreate} className="space-y-2">
                        <Input label="Title" value={newTitle} onChange={e => setNewTitle(e.target.value)} required placeholder="e.g., The Ethics of Self-Driving Cars" />
                        <Input label="Topic" value={newTopic} onChange={e => setNewTopic(e.target.value)} required placeholder="e.g., Technology, Philosophy, Economics" />
                        <div className="flex space-x-2 pt-2">
                            <Button type="submit" variant="success">Save Debate</Button>
                            <Button onClick={() => setIsCreating(false)} variant="secondary">Cancel</Button>
                        </div>
                    </form>
                </div>
            )}

            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
                {debatesToDisplay.length > 0 ? debatesToDisplay.map(debate => (
                    <div key={debate.id} className="p-3 bg-gray-700 rounded-lg flex justify-between items-center hover:bg-gray-600 transition duration-150">
                        <div>
                            <p className="font-semibold text-indigo-300 cursor-pointer hover:underline" onClick={() => navigate(`/debate/${debate.id}`)}>{debate.title}</p>
                            <span className="text-sm text-gray-400">Host: {debate.hostId} | {debate.topic} | {debate.participants} Participants</span>
                        </div>
                        <div className="space-x-2 flex items-center">
                            <Button variant="secondary" onClick={() => navigate(`/debate/${debate.id}`)} className="text-xs py-1 px-2">
                                View/Chat
                            </Button>
                            <Button variant="secondary" className="text-xs py-1 px-2">
                                <Edit className="w-4 h-4" />
                            </Button>
                            <Button variant="danger" onClick={() => handleDelete(debate.id)} className="text-xs py-1 px-2">
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </div>
                    </div>
                )) : <p className="text-gray-400">No debates found.</p>}
            </div>
        </Card>
    );
};

const MembershipAndCredits = ({ userId, userCredits, userMembership, buyCredits, subscribe }) => {
    const trialEndDate = userId && localStorage.getItem('userData') && JSON.parse(localStorage.getItem('userData'))[userId]?.trialEndDate;
    const daysLeft = trialEndDate ? Math.ceil((new Date(trialEndDate) - new Date()) / (1000 * 60 * 60 * 24)) : 0;

    const handleSubscribe = (plan) => {
        subscribe(plan);
        // Replace with custom modal/toast later
        alert(`Successfully subscribed to the ${plan} plan!`);
    };
    
    const handleBuyCredits = () => {
        // Replace with custom modal/toast later
        const amount = parseInt(prompt("Enter amount of credits to buy (e.g., 50):"));
        if (amount && !isNaN(amount) && amount > 0) {
            buyCredits(amount);
            alert(`${amount} credits purchased!`);
        } else {
            alert("Invalid amount.");
        }
    };

    return (
        <Card title="Account Overview" icon={CreditCard}>
            <div className="space-y-4">
                <p className="text-gray-300 flex items-center">
                    <Zap className="w-5 h-5 mr-2 text-yellow-400" />
                    <span className="font-semibold">Credits Balance:</span> {userCredits}
                </p>
                <p className="text-gray-300 flex items-center">
                    <Activity className="w-5 h-5 mr-2 text-green-400" />
                    <span className="font-semibold">Membership:</span> 
                    <span className={`ml-2 font-bold uppercase ${userMembership === 'trial' ? 'text-indigo-400' : 'text-green-400'}`}>
                        {userMembership}
                    </span>
                </p>

                {userMembership === 'trial' && daysLeft > 0 && (
                    <div className="p-3 bg-indigo-900/50 rounded-lg text-indigo-300 text-sm flex items-center">
                        <Clock className="w-4 h-4 mr-2" />
                        Free Trial ends in **{daysLeft} days**.
                    </div>
                )}
                
                <div className="pt-2 border-t border-gray-700 space-y-3">
                    <Button onClick={handleBuyCredits} variant="secondary" className="w-full flex justify-center items-center">
                        <DollarSign className="w-4 h-4 mr-2" /> Buy Credits
                    </Button>
                    {userMembership !== 'annual' && (
                        <Button onClick={() => handleSubscribe('annual')} variant="primary" className="w-full flex justify-center items-center">
                            <Gift className="w-4 h-4 mr-2" /> Upgrade to Annual Plan
                        </Button>
                    )}
                </div>
            </div>
        </Card>
    );
};

const CustomerDashboard = () => {
    const { user } = useContext(AuthContext);
    const { debates, userCredits, userMembership, buyCredits, subscribe } = useContext(DataContext);
    
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-3">
                <h1 className="text-3xl font-extrabold text-white mb-6 flex items-center">
                    <Home className="w-8 h-8 mr-3 text-indigo-400" /> Welcome, {user?.username}!
                </h1>
            </div>
            
            <MembershipAndCredits 
                userId={user?.id} 
                userCredits={userCredits} 
                userMembership={userMembership} 
                buyCredits={buyCredits} 
                subscribe={subscribe} 
            />
            
            <DebateList debates={debates} userId={user?.id} isCustomer={true} className="lg:col-span-2" />
            
        </div>
    );
};


// --- New: Admin Components for Full Control ---

// New Component: Displays key user growth metrics
const GrowthMetricsCard = () => {
    const { getAnalytics } = useContext(DataContext);
    const analytics = getAnalytics();

    const StatItem = ({ title, value, icon: Icon, colorClass }) => (
        <div className="flex items-center space-x-3 p-3 bg-gray-700/50 rounded-lg">
            <Icon className={`w-6 h-6 ${colorClass}`} />
            <div>
                <p className="text-lg font-bold text-white leading-tight">{value}</p>
                <p className="text-xs text-gray-400">{title}</p>
            </div>
        </div>
    );

    return (
        <Card title="User Growth Metrics" icon={BarChart}>
            <div className="grid grid-cols-2 gap-4">
                <StatItem 
                    title="Total Users" 
                    value={analytics.totalUsers.toLocaleString()} 
                    icon={Users} 
                    colorClass="text-indigo-400" 
                />
                <StatItem 
                    title="Active Today" 
                    value={analytics.activeUsersToday.toLocaleString()} 
                    icon={Activity} 
                    colorClass="text-green-400" 
                />
                <StatItem 
                    title="New Last Month" 
                    value={analytics.newUsersLastMonth.toLocaleString()} 
                    icon={UserPlus} 
                    colorClass="text-yellow-400" 
                />
                <StatItem 
                    title="Monthly Growth Rate" 
                    value={`${analytics.growthRate.toFixed(1)}%`} 
                    icon={TrendingUp} 
                    colorClass="text-red-400" 
                />
            </div>
            
            <div className="mt-4 pt-4 border-t border-gray-700">
                <h4 className="text-md font-semibold text-gray-300 mb-2">Role Breakdown</h4>
                <div className="space-y-1 text-sm text-gray-400">
                    <p>Admins: <span className="text-white font-semibold">{analytics.userRolesBreakdown.admin}</span></p>
                    <p>Customers: <span className="text-white font-semibold">{analytics.userRolesBreakdown.customer}</span></p>
                    <p>Trial Members: <span className="text-white font-semibold">{analytics.userRolesBreakdown.trial}</span></p>
                </div>
            </div>
        </Card>
    );
};

const UserManagementTable = () => {
    const { getAllUsers, updateUserRole } = useContext(DataContext);
    const users = getAllUsers();
    
    const handleRoleChange = (userId) => {
        // Use a prompt for simplicity in this mock environment
        const newRole = prompt(`Enter new role for ${userId} (e.g., 'admin', 'customer', 'moderator'):`);
        if (newRole) {
            updateUserRole(userId, newRole.toLowerCase());
        }
    };

    return (
        <Card title="User Management" icon={Users} className="lg:col-span-3">
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                    <thead className="bg-gray-700">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">User ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Role</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Membership</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Credits</th>
                            <th className="px-6 py-3 text-center text-xs font-medium text-gray-300 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-gray-800 divide-y divide-gray-700">
                        {users.map(user => (
                            <tr key={user.id} className="hover:bg-gray-700 transition duration-150">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{user.id}</td>
                                <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${user.role === 'admin' ? 'text-red-400' : 'text-indigo-400'}`}>
                                    {user.role}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">{user.membership}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-400">{user.credits}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                                    <Button 
                                        onClick={() => handleRoleChange(user.id)}
                                        variant="secondary"
                                        className="text-xs py-1 px-2"
                                        icon={CornerRightUp}
                                        disabled={user.id === 'admin'} // Prevent admin from demoting self
                                    >
                                        Change Role
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};

const SystemSettingsControl = () => {
    const { systemSettings, updateSystemSettings } = useContext(DataContext);
    
    const [threshold, setThreshold] = useState(systemSettings.commissionThreshold);
    const [trial, setTrial] = useState(systemSettings.trialWeeks);

    const handleSave = (e) => {
        e.preventDefault();
        const newThreshold = parseInt(threshold);
        const newTrial = parseInt(trial);

        if (isNaN(newThreshold) || newThreshold < 0 || isNaN(newTrial) || newTrial < 0) {
            alert("Please enter valid positive numbers.");
            return;
        }

        updateSystemSettings({
            commissionThreshold: newThreshold,
            trialWeeks: newTrial,
        });
        // Replace with custom modal/toast later
        alert("System Settings Updated (Mock Save)!");
    };

    return (
        <Card title="System Configuration" icon={Settings}>
            <form onSubmit={handleSave}>
                <Input 
                    label="Commission Threshold (Participants)" 
                    type="number" 
                    value={threshold} 
                    onChange={(e) => setThreshold(e.target.value)} 
                    required 
                    className="mb-2"
                />
                <p className="text-xs text-gray-500 mb-4">Min participants for commission eligibility.</p>

                <Input 
                    label="Initial Free Trial Period (Weeks)" 
                    type="number" 
                    value={trial} 
                    onChange={(e) => setTrial(e.target.value)} 
                    required 
                    className="mb-4"
                />
                
                <Button type="submit" variant="success" className="w-full">
                    <Database className="w-4 h-4 mr-1" /> Commit Global Settings
                </Button>
            </form>
        </Card>
    );
};


// 3. Admin Dashboard (Refactored to include Analytics)

const AdminDashboard = () => {
    const { debates, systemSettings } = useContext(DataContext);
    
    // Calculate commission statistics using current system settings
    const commissionThreshold = systemSettings.commissionThreshold || COMMISSION_THRESHOLD;
    const commissionEligibleDebates = debates.filter(d => d.participants >= commissionThreshold);
    const totalPotentialRevenue = debates.reduce((sum, d) => sum + (d.participants * 2), 0); // Mock revenue: $2 per participant
    const totalCommissionableRevenue = commissionEligibleDebates.reduce((sum, d) => sum + (d.participants * 2), 0); 
    const adminCommission = totalCommissionableRevenue * COMMISSION_SPLIT.admin;
    const creatorCommission = totalCommissionableRevenue * COMMISSION_SPLIT.creator;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-4">
                <h1 className="text-3xl font-extrabold text-white mb-6 flex items-center">
                    <Cpu className="w-8 h-8 mr-3 text-red-500" /> Admin Control Panel
                </h1>
            </div>

            {/* Row 1: Key Metrics (2/4 wide) and Settings (1/4 wide) */}
            <div className="lg:col-span-2">
                <GrowthMetricsCard />
            </div>

            {/* Revenue Card (1/4 wide) */}
            <div className="lg:col-span-1">
                <Card title="Revenue Summary" icon={TrendingUp} className="h-full">
                    <p className="text-2xl font-bold text-green-400">{formatCurrency(totalPotentialRevenue)}</p>
                    <p className="text-sm text-gray-400 mt-1">Total Mock Revenue</p>
                    <div className="mt-4 border-t border-gray-700 pt-3">
                        <p className="text-gray-300 text-sm">Admin Cut (25%): <span className="font-bold text-red-400">{formatCurrency(adminCommission)}</span></p>
                        <p className="text-gray-300 text-sm">Creator Cut (75%): <span className="font-bold text-indigo-400">{formatCurrency(creatorCommission)}</span></p>
                        <p className="text-xs mt-2 text-gray-500">Threshold: {commissionThreshold} Participants.</p>
                    </div>
                </Card>
            </div>
            
            {/* System Settings Card (1/4 wide) */}
            <div className="lg:col-span-1">
                <SystemSettingsControl />
            </div>

            {/* Row 2: Full-width User and Debate Control */}
            <div className="lg:col-span-4 space-y-8">
                {/* User Management */}
                <UserManagementTable />

                {/* All Debates Control (Acts as Content Control) */}
                <DebateList debates={debates} isCustomer={false} className="lg:col-span-4" />
            </div>
            
        </div>
    );
};


// 4. Other Core Pages

const ProfileSettings = () => {
    const { user } = useContext(AuthContext);
    const [name, setName] = useState(user?.username || '');
    const [email, setEmail] = useState(user?.email || '');
    const [password, setPassword] = useState('');
    const [showEmail, setShowEmail] = useState(true);
    const [showPhone, setShowPhone] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Replace with custom modal/toast later
        alert("Profile updated! (Mock save to DB)");
    };

    if (!user) {
        return <TempPage title="Access Denied" />;
    }

    return (
        <Card title="Profile Settings" icon={Settings} className="max-w-xl mx-auto">
            <form onSubmit={handleSubmit} className="space-y-4">
                <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} required />
                <Input label="Username" value={user.username} disabled />
                <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                <Input label="New Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Leave blank to keep current password" />
                
                <div className="pt-4 border-t border-gray-700">
                    <h3 className="text-lg font-semibold mb-2 text-white">Contact Visibility</h3>
                    <label className="flex items-center space-x-2 text-gray-400">
                        <input type="checkbox" checked={showEmail} onChange={() => setShowEmail(!showEmail)} className="form-checkbox h-5 w-5 text-indigo-600 bg-gray-700 border-gray-600 rounded" />
                        <span>Display email in debates</span>
                    </label>
                    <label className="flex items-center space-x-2 text-gray-400 mt-2">
                        <input type="checkbox" checked={showPhone} onChange={() => setShowPhone(!showPhone)} className="form-checkbox h-5 w-5 text-indigo-600 bg-gray-700 border-gray-600 rounded" />
                        <span>Display phone number in debates (Mock)</span>
                    </label>
                </div>

                <Button type="submit" className="w-full mt-6">Save Profile</Button>
            </form>
        </Card>
    );
};

const DebateRoom = () => {
    const location = useLocation();
    const debateId = location.pathname.split('/debate/')[1];
    const { debates } = useContext(DataContext);
    const debate = debates.find(d => d.id === parseInt(debateId));

    if (!debate) {
        return <TempPage title="Debate Not Found" />;
    }

    // Mock functions for real-time features
    const startCall = (type) => alert(`Starting ${type} call for Debate #${debateId}! (Requires WebRTC implementation)`);

    return (
        <Card title={`Debate: ${debate.title}`} icon={Send} className="h-full">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Chat/Video Area */}
                <div className="lg:col-span-2 flex flex-col h-[60vh] min-h-[400px] bg-gray-700 rounded-xl shadow-inner">
                    <div className="p-4 border-b border-gray-600 flex justify-between items-center">
                        <p className="text-gray-300 font-medium">Topic: <span className="text-indigo-300">{debate.topic}</span></p>
                        {/* Real-Time Call Controls */}
                        <div className="flex space-x-2">
                            <Button onClick={() => startCall('Voice')} variant="secondary" className="p-1.5"><Zap className='w-4 h-4' /> Voice</Button>
                            <Button onClick={() => startCall('Video')} variant="secondary" className="p-1.5"><Zap className='w-4 h-4' /> Video</Button>
                        </div>
                    </div>
                    
                    {/* Chat Window Mock */}
                    <div className="flex-grow overflow-y-auto p-4 bg-gray-800 space-y-3">
                        <div className="bg-indigo-900/40 p-2 rounded-lg max-w-sm">Host ({debate.hostId}): Welcome everyone! Please be respectful.</div>
                        <div className="bg-gray-600/50 p-2 rounded-lg max-w-sm ml-auto text-right">User2: Excited to debate this topic!</div>
                    </div>

                    {/* Chat Input */}
                    <div className="flex p-4 border-t border-gray-600">
                        <Input placeholder="Type your message..." className="flex-grow mb-0" />
                        <Button className="ml-2">Send</Button>
                    </div>
                </div>

                {/* Participant List/Debate Info */}
                <div className="lg:col-span-1 bg-gray-700 rounded-xl p-4">
                    <h3 className="text-lg font-semibold mb-3 border-b border-gray-600 pb-2">Debate Info & Participants ({debate.participants})</h3>
                    <p className="text-sm text-gray-400 mb-4">Hosted by: <span className='font-bold text-white'>{debate.hostId}</span></p>
                    <ul className="space-y-2 text-sm text-gray-300 max-h-[300px] overflow-y-auto">
                        <li className="font-bold text-indigo-400 flex items-center"><User className='w-4 h-4 mr-1' /> {debate.hostId} (Host)</li>
                        <li><User className='w-4 h-4 mr-1 inline' /> user2</li>
                        <li><User className='w-4 h-4 mr-1 inline' /> user3</li>
                        <li className='text-gray-500'>... and {debate.participants - 3} others.</li>
                    </ul>
                </div>
            </div>
        </Card>
    );
};


const TempPage = ({ title = "Page Title", children, icon: Icon = CheckCircle }) => (
    <Card title={title} icon={Icon} className="max-w-3xl mx-auto">
        <p className="text-gray-400 mb-4">
            This is a placeholder page for the "{title}" route. The logic is defined in the router, but the full UI is yet to be built.
        </p>
        {children}
    </Card>
);

// --- MAIN APPLICATION ROUTER LOGIC ---

const AppContent = () => {
    const { user, loading } = useContext(AuthContext);
    const { debates, loading: dataLoading } = useContext(DataContext);
    const location = useLocation();
    const navigate = useNavigate();
    const [content, setContent] = useState(null);
    const path = location.pathname;

    // Use combined loading state
    const isLoading = loading || dataLoading;

    // Route Logic (handles the routing without using <Route> components inside AppContent)
    useEffect(() => {
        if (isLoading) {
            setContent(<div className="text-center py-20"><Loader className="w-10 h-10 animate-spin mx-auto text-indigo-500" /> <p className="mt-2 text-gray-400">Loading...</p></div>);
            return;
        }

        let currentPage = null;
        
        // Define paths that require authentication
        const protectedPaths = ['/dashboard', '/admin', '/profile', '/debate']; 
        
        // If not logged in, but trying to access a protected path, redirect to login
        if (!user && protectedPaths.some(p => path.startsWith(p))) {
            navigate('/login');
            return;
        }

        switch (path) {
            case '/':
                // Default path is the General Home Page / Debate Feed
                currentPage = <GeneralHomePage />;
                break;
            case '/login':
                currentPage = <LoginPage />;
                break;
            case '/register':
                currentPage = <RegisterPage />;
                break;
            case '/dashboard':
                // Protected route: must be logged in, must NOT be admin
                if (user?.role !== 'customer') {
                    // Redirect non-customer/logged-in users (like admins) away from customer dashboard
                    navigate(user?.role === 'admin' ? '/admin' : '/login');
                    return;
                }
                currentPage = <CustomerDashboard />;
                break;
            case '/admin':
                // Highly protected route: must be logged in AND must be admin
                if (user?.role !== 'admin') {
                    currentPage = <TempPage title="Access Denied" icon={Lock}><p className="text-red-400">You must be an Administrator to access this page.</p></TempPage>;
                } else {
                    // Render the enhanced Admin Dashboard
                    currentPage = <AdminDashboard />;
                }
                break;
            case '/profile':
                currentPage = <ProfileSettings />;
                break;
            default:
                // Dynamic debate route handling: /debate/:id
                if (path.startsWith('/debate/')) {
                    const debateId = parseInt(path.split('/')[2]);
                    const debate = debates.find(d => d.id === debateId);
                    
                    if (user) {
                        currentPage = debate
                            ? <DebateRoom />
                            : <TempPage title="Debate Not Found" icon={Filter} />;
                    } else {
                        // This case is already handled by the early redirect above, but included for safety
                        navigate('/login');
                        return;
                    }
                } else {
                    // 404 handler
                    currentPage = (
                        <TempPage title="404 - Page Not Found" icon={Mail} >
                            <p className={`text-xl font-bold ${getIconClass("404")}`}>
                                The URL path was not recognized.
                            </p>
                        </TempPage>
                    );
                }
                break;
        }
        
        setContent(currentPage);

    }, [location.pathname, user, isLoading, navigate, debates]); 

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
            <DataProvider>
                <AppContent />
            </DataProvider>
        </AuthProvider>
    </Router>
);

export default App;
