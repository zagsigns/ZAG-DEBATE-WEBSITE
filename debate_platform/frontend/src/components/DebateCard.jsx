// frontend/src/components/DebateCard.jsx

import React from 'react';
import { Link } from 'react-router-dom';

const DebateCard = ({ debate }) => {
    
    // Determine the status and assign a color for the "WOW" visual
    let statusText = 'Starting Soon';
    let statusColor = 'bg-yellow-500'; // Upcoming/Starting

    // Assuming debate.participants is available and 'is_active' determines if it's currently running
    if (debate.participants > 100) {
        statusText = 'HOT TOPIC 🔥';
        statusColor = 'bg-red-600 animate-pulse'; // High engagement, use animation
    } else if (debate.is_active) {
        statusText = 'LIVE NOW';
        statusColor = 'bg-green-600'; // Active debate
    }

    return (
        <div className="bg-gray-800 rounded-xl shadow-2xl p-6 transition duration-300 ease-in-out hover:scale-[1.02] hover:shadow-indigo-500/50 border border-gray-700">
            
            {/* Header and Status */}
            <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-extrabold text-indigo-400">
                    {debate.title}
                </h2>
                <span className={`text-xs font-bold text-white px-3 py-1 rounded-full ${statusColor}`}>
                    {statusText}
                </span>
            </div>

            {/* Meta Information */}
            <div className="text-gray-400 space-y-1 text-sm mb-4">
                <p>Creator: <span className="text-white font-medium">{debate.creator || 'Admin'}</span></p>
                <p>
                    Participants: 
                    <span className="text-lg font-bold text-white ml-1">
                        {debate.participants ? debate.participants.toLocaleString() : 'N/A'}
                    </span>
                </p>
            </div>
            
            {/* Action Button */}
            <Link 
                to={`/debates/${debate.id}`} 
                className="inline-flex items-center justify-center w-full px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150"
            >
                View Debate & Join
                <svg className="ml-2 -mr-1 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </Link>
        </div>
    );
};

export default DebateCard;