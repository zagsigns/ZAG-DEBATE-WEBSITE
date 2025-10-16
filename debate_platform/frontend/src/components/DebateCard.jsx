// frontend/src/components/DebateCard.jsx

import React from 'react';
import { Link } from 'react-router-dom';
import { Users, Clock, Zap } from 'lucide-react'; // Assuming you have lucide-react or similar icons installed

// IMPORTANT: Assuming your 'debate' object has these (or similar) properties:
// debate.title, debate.creator, debate.participants, debate.is_active, debate.pro_count, debate.con_count, debate.end_time

const DebateCard = ({ debate }) => {
    
    // --- 1. Dynamic Status Logic ---
    let statusText = 'STARTING SOON';
    let statusColor = 'bg-yellow-500'; // Upcoming/Starting

    // Fallback counts for the visual bar
    const proCount = debate.pro_count || 50; 
    const conCount = debate.con_count || 50;
    const totalVotes = proCount + conCount;
    // Calculate percentage, default to 50% if no votes
    const proPercent = totalVotes > 0 ? (proCount / totalVotes) * 100 : 50;

    if (debate.participants > 100) {
        statusText = 'HOT TOPIC 🔥';
        statusColor = 'bg-red-600 animate-pulse'; // High engagement, use animation
    } else if (debate.is_active) {
        statusText = 'LIVE NOW';
        statusColor = 'bg-green-600'; // Active debate
    }

    return (
        // Refined card container: sleek dark theme with a cool hover effect
        <div className="bg-gray-800 rounded-xl shadow-2xl p-6 transition duration-300 ease-in-out hover:scale-[1.02] hover:shadow-indigo-500/50 border border-gray-700 relative overflow-hidden">
            
            {/* Top-Right Status Badge */}
            <span className={`absolute top-0 right-0 ${statusColor} text-white text-xs font-bold px-3 py-1 rounded-bl-xl`}>
                {statusText}
            </span>

            {/* Title and Icon */}
            <div className="flex items-center mb-3">
                <Zap className="h-6 w-6 text-indigo-400 mr-3" />
                <h2 className="text-xl font-extrabold text-white">
                    {debate.title}
                </h2>
            </div>
            
            {/* Meta Information (Creator, Participants) */}
            <div className="text-gray-400 space-y-2 text-sm mb-5">
                <div className="flex items-center">
                    <Users className="h-4 w-4 mr-2 text-indigo-300" />
                    <p>Participants: 
                        <span className="text-lg font-bold text-indigo-200 ml-1">
                            {debate.participants ? debate.participants.toLocaleString() : '0'}
                        </span>
                    </p>
                </div>
                <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-indigo-300" />
                    <p>Ends: {debate.end_time || 'Next Week'}</p>
                </div>
            </div>

            {/* --- 2. Visual Score Split Bar (New Feature) --- */}
            <div className="mb-5">
                <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-green-400">PRO ({proPercent.toFixed(0)}%)</span>
                    <span className="text-red-400">CON ({ (100 - proPercent).toFixed(0)}%)</span>
                </div>
                <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div 
                        className="h-full bg-green-500 transition-all duration-500" 
                        style={{ width: `${proPercent}%` }}
                    ></div>
                </div>
            </div>

            {/* Action Button - Vibrant and Clear */}
            <Link 
                to={`/debates/${debate.id}`} 
                // Using a brighter, more distinct color for the CTA in dark mode
                className="inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium rounded-lg shadow-md text-gray-900 bg-orange-400 hover:bg-orange-500 transition duration-150 focus:outline-none focus:ring-4 focus:ring-orange-500 focus:ring-opacity-50"
            >
                View Debate & Join
                <svg className="ml-2 -mr-1 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </Link>
        </div>
    );
};

export default DebateCard;