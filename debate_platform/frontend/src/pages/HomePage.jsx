import React from 'react';
import { Link } from 'react-router-dom';
import { Zap } from 'lucide-react';
// FIX: Corrected the path from one level up (../) to two levels up (../../) to ensure proper resolution 
// from the pages directory to the components directory structure.
import DebateList from '../../components/Debates/DebateList.jsx'; 

const HomePage = ({ debates }) => {
    // Filter the debates based on status
    const activeAndPending = debates.filter(d => d.status === 'Active' || d.status === 'Pending');
    const completed = debates.filter(d => d.status === 'Completed');

    return (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <section className="text-center mb-16">
                <h1 className="text-5xl font-extrabold text-white mb-4">
                    Welcome to <span className="text-indigo-400">ZAG Debate</span>
                </h1>
                <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                    Join the conversation. Explore heated topics, take a side, and contribute your arguments in structured, time-limited debates.
                </p>
                <Link 
                    to="/create" 
                    className="mt-8 inline-flex items-center px-8 py-3 border border-transparent text-lg font-bold rounded-full shadow-2xl text-white bg-indigo-600 hover:bg-indigo-700 transition-colors transform hover:scale-[1.02]"
                >
                    <Zap className="w-6 h-6 mr-2" /> Start a New Debate
                </Link>
            </section>

            <section>
                <h2 className="text-3xl font-bold text-white mb-8 border-b border-gray-700 pb-3">Active Debates</h2>
                <DebateList debates={activeAndPending} />
            </section>

            <section className="mt-16">
                <h2 className="text-3xl font-bold text-white mb-8 border-b border-gray-700 pb-3">Completed Debates</h2>
                <DebateList debates={completed} />
            </section>
        </main>
    );
};

export default HomePage;
