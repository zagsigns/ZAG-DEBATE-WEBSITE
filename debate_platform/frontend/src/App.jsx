import { useState, useEffect, createContext, useContext } from 'react';
import { BrowserRouter as Router, useLocation, useNavigate, Link } from 'react-router-dom';
// Added ThumbsUp and Share2 to imports
import { LogOut, User, Home, Zap, PlusCircle, Settings, UserPlus, Send, Loader, Edit, Trash2, Mail, Lock, Key, Filter, Activity, Clock, CheckCircle, Gift, CreditCard, DollarSign, Users, Database, ClipboardList, TrendingUp, Cpu, MessageSquare, ThumbsUp, Share2 } from 'lucide-react';

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

    useEffect(() => {
        localStorage.setItem('debates', JSON.stringify(debates));
    }, [debates]);

    useEffect(() => {
        localStorage.setItem('userData', JSON.stringify(userData));
    }, [userData]);

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

    // New: Social Features
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
        // Note: navigator.clipboard.writeText might not work in all iframe environments, using alert for feedback
        // document.execCommand('copy') is sometimes preferred in iframes, but not supported everywhere.
        // For this demo, we mock the action.
        console.log(`Mock shared debate link: ${window.location.origin}/debate/${id}`);
        alert(`Link to debate ID ${id} copied (mock action)!`);
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
        likeDebate, shareDebate, // <-- Added new social functions
        userCredits, userMembership, buyCredits, subscribe
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

const Input = ({ label, type = 'text', value, onChange, placeholder, required = false, disabled = false }) => (
    <div className="mb-4">
        <label className="block text-sm font-medium text-gray-400 mb-1">{label}</label>
        <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            className={`w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
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

// --- New Debate Feed Card Component ---

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
                <Input label="Username/Email" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="admin or customer_name" required />
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
        if (window.confirm("Are you sure you want to delete this debate?")) {
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
        <Card title="Active Debates" icon={ClipboardList} className="col-span-1 lg:col-span-2">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-white">{isCustomer ? "My Hosted Debates (CRUD Access)" : "All Platform Debates"}</h3>
                <Button onClick={() => setIsCreating(true)} className="flex items-center">
                    <PlusCircle className="w-4 h-4 mr-1" /> Create New Debate
                </Button>
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
        alert(`Successfully subscribed to the ${plan} plan!`);
    };
    
    const handleBuyCredits = () => {
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
            
            <DebateList debates={debates} userId={user?.id} isCustomer={true} />
            
        </div>
    );
};


// 3. Admin Dashboard

const AdminDashboard = () => {
    const { debates } = useContext(DataContext);
    
    // Calculate commission statistics
    const commissionEligibleDebates = debates.filter(d => d.participants >= COMMISSION_THRESHOLD);
    const totalPotentialRevenue = debates.reduce((sum, d) => sum + (d.participants * 2), 0); // Mock revenue: $2 per participant
    const totalCommissionableRevenue = commissionEligibleDebates.reduce((sum, d) => sum + (d.participants * 2), 0); 
    const adminCommission = totalCommissionableRevenue * COMMISSION_SPLIT.admin;
    const creatorCommission = totalCommissionableRevenue * COMMISSION_SPLIT.creator;

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-3">
                <h1 className="text-3xl font-extrabold text-white mb-6 flex items-center">
                    <Cpu className="w-8 h-8 mr-3 text-red-500" /> Admin Control Panel
                </h1>
            </div>

            {/* Admin Overview Cards */}
            <Card title="Revenue & Commission" icon={TrendingUp}>
                <p className="text-2xl font-bold text-green-400">{formatCurrency(totalPotentialRevenue)}</p>
                <p className="text-sm text-gray-400 mt-1">Total Platform Revenue (Mock)</p>
                <div className="mt-4 border-t border-gray-700 pt-3">
                    <p className="text-gray-300">Admin Cut (25%): <span className="font-bold text-red-400">{formatCurrency(adminCommission)}</span></p>
                    <p className="text-gray-300">Creator Cut (75%): <span className="font-bold text-indigo-400">{formatCurrency(creatorCommission)}</span></p>
                    <p className="text-xs mt-2 text-gray-500">Threshold: {COMMISSION_THRESHOLD} Participants.</p>
                </div>
            </Card>

            <Card title="User & Membership Stats" icon={Users}>
                <p className="text-2xl font-bold text-indigo-400">4 / 15</p>
                <p className="text-sm text-gray-400 mt-1">Active / Total Users (Mock)</p>
                <div className="mt-4 border-t border-gray-700 pt-3 text-sm">
                    <p>Subscribed: 2</p>
                    <p>On Trial: 1</p>
                    <p>Credits Purchased (Mock): $500</p>
                </div>
            </Card>
            
            <Card title="System Settings" icon={Settings}>
                <div className="space-y-3">
                    <p className="text-gray-300 flex justify-between">
                        Commission Threshold: 
                        <span className="font-bold text-yellow-400">{COMMISSION_THRESHOLD}</span>
                    </p>
                    <p className="text-gray-300 flex justify-between">
                        Initial Trial Period: 
                        <span className="font-bold text-yellow-400">{INITIAL_TRIAL_WEEKS} Weeks</span>
                    </p>
                    <Button variant="secondary" className="w-full mt-2">Update Global Settings</Button>
                </div>
            </Card>

            {/* All Debates CRUD */}
            <DebateList debates={debates} isCustomer={false} />
            
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


const TempPage = ({ title = "Page Title", children }) => (
    <Card title={title} icon={CheckCircle}>
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
                // New: Default path is the General Home Page / Debate Feed
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
