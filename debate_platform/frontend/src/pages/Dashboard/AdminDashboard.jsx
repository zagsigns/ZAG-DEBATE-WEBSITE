import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, User, Edit, Settings, Clock, Activity, DollarSign, Filter } from 'lucide-react'; 
// IMPORTANT: Adjust the path below to correctly point to your AuthContext file.
import { useAuthContext } from '../../../context/AuthContext'; 

// --- MOCK DATA AND HELPER COMPONENTS ---

// Mock statistics object (Replace with actual data fetching in a real app)
const mockStats = {
    totalUsers: '1,200',
    pendingDeactivations: 5,
    maxParticipants: 100,
    commissionRate: '10%',
};

// StatCard Definition
const StatCard = ({ title, value, subtext, buttonText, buttonLink, buttonColor = 'indigo-500' }) => (
    // We remove the interpolation in border-color here to prevent potential Tailwind JIT issues with dynamic classes.
    <div className={`p-6 bg-gray-800 rounded-xl shadow-lg border-b-4 border-gray-700 hover:border-b-4 hover:border-${buttonColor} transition-all duration-300`}>
        <h3 className="text-lg font-semibold text-gray-300">{title}</h3>
        <p className="text-4xl font-extrabold text-white mt-1">{value}</p>
        <p className="text-sm text-gray-400 mt-2">{subtext}</p>
        <Link 
            to={buttonLink} 
            className={`mt-4 text-sm font-bold text-white px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 transition-colors inline-block`}
        >
            {buttonText} &rarr;
        </Link>
    </div>
);


// --- ADMIN DASHBOARD MAIN COMPONENT ---

function AdminDashboard() {
    // Assuming useAuthContext is correctly set up to provide the user object
    const { user } = useAuthContext();
    
    // Safety check - ensures only admins can see this content
    // NOTE: This MUST match the check in your AppContent.jsx router (user.role === 'admin')
    if (!user || user.role !== 'admin') {
        return null;
    }
    
    return (
        <div className="container mx-auto px-4 sm:px-6 py-8 space-y-8">
            {/* Dashboard Header - Should override any "Content coming soon..." placeholder */}
            <header className="py-8 bg-gray-800 rounded-xl shadow-lg border border-red-500/20 text-center">
                <h1 className="text-4xl font-extrabold text-red-400 mb-2 flex items-center justify-center">
                    <Lock className="w-8 h-8 mr-3 text-red-400" /> Admin Dashboard
                </h1>
                <p className="text-gray-400 text-center">
                    Welcome, {user.username}. Quick overview of system operations.
                </p>
            </header>

            {/* Stats Grid - Using the StatCard components */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard 
                    title="Financial Overview"
                    value={'12'}
                    subtext={`Pending Commissions to Payout`}
                    buttonText="View Transactions"
                    buttonLink="/admin/transactions"
                    buttonColor="red-500"
                />
                <StatCard 
                    title="User Management"
                    value={mockStats.totalUsers}
                    subtext={`${mockStats.pendingDeactivations} Pending Deactivations (Review Needed)`}
                    buttonText="Manage Users"
                    buttonLink="/admin/users"
                    buttonColor="blue-500"
                />
                <StatCard 
                    title="Site Settings"
                    value={`Rate: ${mockStats.commissionRate}`}
                    subtext={`Default Max Participants: ${mockStats.maxParticipants}`}
                    buttonText="Configure Site"
                    buttonLink="/admin/settings"
                    buttonColor="yellow-500"
                />
            </div>
            
            {/* Content Moderation Section */}
            <section className="mt-10 bg-gray-800 p-6 rounded-xl shadow-2xl border border-gray-700/50">
                <h2 className="text-2xl font-bold text-white border-b border-gray-700 pb-2 mb-4 flex items-center">
                    <Edit className="w-6 h-6 mr-2 text-yellow-400" /> Content Moderation Queue
                </h2>
                <ul className="space-y-3">
                    <li className="flex justify-between items-center text-gray-300 bg-gray-700 p-3 rounded-md hover:bg-gray-600 transition duration-300">
                        <span>New Debate Topic: "Should AI be regulated globally?"</span>
                        <Link to="/admin/moderate/123" className="text-blue-400 hover:text-blue-300 font-medium flex items-center">
                            Review <span className="ml-1 text-sm bg-indigo-500 px-2 py-0.5 rounded-full text-white">3 pending</span>
                        </Link>
                    </li>
                    <li className="flex justify-between items-center text-gray-300 bg-gray-700 p-3 rounded-md hover:bg-gray-600 transition duration-300">
                        <span>Reported Comment: "Hate speech in debate #456"</span>
                        <Link to="/admin/moderate/456" className="text-blue-400 hover:text-blue-300 font-medium flex items-center">
                            Review <span className="ml-1 text-sm bg-red-500 px-2 py-0.5 rounded-full text-white">1 pending</span>
                        </Link>
                    </li>
                </ul>
            </section>
        </div>
    );
};

export default AdminDashboard;
