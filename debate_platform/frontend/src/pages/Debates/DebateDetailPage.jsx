// frontend/src/pages/Debates/DebateDetailPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; 
import DebateChat from '../../components/Debates/DebateChat'; // <-- IMPORT THE REAL CHAT COMPONENT
// import DebateCall from '../../components/Debates/DebateCall'; // <-- Import this when you create it

// --- PLACEHOLDER FOR DebateCall (Keep for now until actual component is built) ---
const DebateCall = ({ debateId }) => (
    <div className="h-[600px] bg-red-800/20 border-2 border-red-500 p-4 rounded-xl flex items-center justify-center text-red-300">
        <p className="text-xl font-bold">Video/Call component for Debate #{debateId} coming soon!</p>
    </div>
);
// ----------------------------------------------------------------------------------

// --- DebatePanel (No Change, used for displaying debate metadata) ---
const DebatePanel = ({ debate }) => (
    <div className="bg-gray-800 p-6 rounded-xl shadow-xl space-y-4 border border-gray-700">
        <h3 className="text-xl font-bold text-indigo-400">Debate Details</h3>
        <p className="text-gray-300"><span className="font-semibold">Creator:</span> {debate.creator}</p>
        <p className="text-gray-300"><span className="font-semibold">Participants:</span> {debate.participants}</p>
        <p className="text-gray-300"><span className="font-semibold">Type:</span> <span className="uppercase font-bold">{debate.debateType}</span></p>
        <p className="text-gray-400 pt-2 border-t border-gray-700">{debate.description}</p>
    </div>
);
// ----------------------------------------------------------------------------------


const DebateDetailPage = () => {
    const { id } = useParams(); 
    const [debate, setDebate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    // --- TEMPORARY MOCK USERNAME (MUST BE REPLACED WITH YOUR AUTH CONTEXT LATER) ---
    const mockUsername = "DebateUser_" + Math.floor(Math.random() * 100); 
    // --------------------------------------------------------------------------

    // --- TEMPORARY DUMMY DATA LOOKUP ---
    useEffect(() => {
        // Replace this entire block with your axios.get(`/api/debates/${id}/`) call later
        const dummyDebates = [
            { id: '1', title: 'Future of AI in Education', creator: 'Alice Smith', participants: 154, is_active: true, description: 'A deep dive into how AI will change classrooms.', debateType: 'chat' },
            { id: '2', title: 'Universal Basic Income Feasibility', creator: 'Bob Johnson', participants: 86, is_active: false, description: 'Economists debate the pros and cons of UBI.', debateType: 'call' },
            { id: '3', title: 'Climate Change Policy: Global vs. Local', creator: 'Charlie Brown', participants: 210, is_active: true, description: 'Examining effective policy at different scales.', debateType: 'video' },
        ];
        
        setTimeout(() => {
            const foundDebate = dummyDebates.find(d => d.id === id);
            if (foundDebate) {
                setDebate(foundDebate);
            } else {
                setError(true);
            }
            setLoading(false);
        }, 800);
    }, [id]);
    // --- END TEMPORARY DATA LOOKUP ---

    if (loading) return <div className="text-center text-indigo-400 text-xl pt-20">Loading Debate...</div>;
    if (error || !debate) return <div className="text-center text-red-500 text-xl pt-20">404: Debate Not Found.</div>;

    // --- MAIN RENDER ---
    return (
        <div className="py-10">
            <h1 className="text-4xl font-extrabold text-white mb-6">
                {debate.title}
                <span className={`ml-4 text-sm font-bold text-white px-3 py-1 rounded-full ${debate.is_active ? 'bg-green-600' : 'bg-yellow-500'}`}>
                    {debate.is_active ? 'LIVE' : 'UPCOMING'}
                </span>
            </h1>

            {/* Two-column layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Interaction Column (2/3 width) */}
                <div className="lg:col-span-2 space-y-6">
                    {debate.debateType === 'chat' && (
                        // Set a fixed height (e.g., h-[600px]) for the chat window 
                        // so it looks like a proper application panel.
                        <div className="h-[600px]">
                            <DebateChat debateId={debate.id} username={mockUsername} />
                        </div>
                    )}
                    {(debate.debateType === 'call' || debate.debateType === 'video') && (
                        // Use a fixed height for call/video interface as well
                        <div className="h-[600px]">
                            <DebateCall debateId={debate.id} />
                        </div>
                    )}
                </div>

                {/* Info Panel Column (1/3 width) */}
                <div className="lg:col-span-1">
                    <DebatePanel debate={debate} />
                </div>
                
            </div>
        </div>
    );
};

export default DebateDetailPage;