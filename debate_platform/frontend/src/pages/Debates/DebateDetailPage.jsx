// frontend/src/pages/Debates/DebateDetailPage.jsx

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; 
import DebateChat from '../../components/Debates/DebateChat'; 
// --- IMPORT WEBRTC HANDLERS ---
import { startVoiceCall, endVoiceCall } from '../../utils/webRTCHandler'; 
// ------------------------------


// --- MODIFIED DebateCall COMPONENT TO INCLUDE VOICE BUTTON AND AUDIO ---
const DebateCall = ({ debateId, isVoiceActive, onToggleVoice }) => (
    <div className="h-[600px] bg-gray-900/50 border-2 border-indigo-500 p-4 rounded-xl flex flex-col items-center justify-center">
        <p className="text-xl font-bold text-indigo-300 mb-6">Voice/Call Interface for Debate #{debateId}</p>
        
        {/* The Voice Call Button - This is the button that triggers the new logic */}
        <button
            onClick={onToggleVoice}
            className={`px-8 py-3 text-lg font-bold rounded-full transition duration-300 ease-in-out 
                ${isVoiceActive ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'} text-white`}
        >
            {isVoiceActive ? 'End Voice Call' : 'Start Voice Call'}
        </button>

        {/* REQUIRED: The audio element for receiving remote audio. 
            The ID must match the one targeted in webRTCHandler.js
        */}
        <audio 
            id={`remote-audio-element-${debateId}`} 
            autoPlay 
            style={{ display: 'none' }} 
        />
        
        {isVoiceActive && <p className="mt-4 text-green-400">Voice call active. Check your microphone!</p>}
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
    // Note: If you are using React Router v6, 'id' comes from the route definition (:id)
    const { id } = useParams(); 
    const [debate, setDebate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    
    // --- NEW STATE FOR VOICE CALL ---
    const [isVoiceActive, setIsVoiceActive] = useState(false);
    // --------------------------------

    // --- TEMPORARY MOCK USERNAME ---
    const mockUsername = "DebateUser_" + Math.floor(Math.random() * 100); 
    // -------------------------------

    // --- VOICE CALL TOGGLE FUNCTION ---
    const handleVoiceToggle = async () => {
        const debateId = id; 
        
        if (!isVoiceActive) {
            try {
                // Call the WebRTC utility function
                await startVoiceCall(debateId); 
                setIsVoiceActive(true);
            } catch (err) {
                console.error("Error starting voice call:", err);
                // The alert is now descriptive, not the generic WebRTC one
                alert(`Voice call failed: ${err.message}. Please check your console and ensure the signaling server is running.`);
                setIsVoiceActive(false);
            }
        } else {
            endVoiceCall();
            setIsVoiceActive(false);
        }
    };
    // ----------------------------------

    // --- TEMPORARY DUMMY DATA LOOKUP ---
    useEffect(() => {
        const dummyDebates = [
            { id: '1', title: 'The Future of AI in Education', creator: 'Alice Smith', participants: 154, is_active: true, description: 'A deep dive into how AI will change classrooms.', debateType: 'chat' },
            { id: '2', title: 'Universal Basic Income Feasibility', creator: 'Bob Johnson', participants: 86, is_active: false, description: 'Economists debate the pros and cons of UBI.', debateType: 'call' },
            { id: '3', title: 'Climate Change Policy: Global vs. Local', creator: 'Charlie Brown', participants: 210, is_active: true, description: 'Examining effective policy at different scales.', debateType: 'video' },
        ];
        
        // Simulating a data fetch delay
        setTimeout(() => {
            const foundDebate = dummyDebates.find(d => d.id === id);
            if (foundDebate) {
                setDebate(foundDebate);
            } else {
                setError(true);
            }
            setLoading(false);
        }, 800);

        // --- Cleanup function to end call when leaving the page ---
        return () => {
            // Note: isVoiceActive check in cleanup is handled by React's closure/dependency array
            endVoiceCall();
        };
    }, [id]); // Removed isVoiceActive from deps to avoid re-running on state change

    // --- End TEMPORARY DUMMY DATA LOOKUP ---

    if (loading) return <div className="text-center text-indigo-400 text-xl pt-20">Loading Debate...</div>;
    if (error || !debate) return <div className="text-center text-red-500 text-xl pt-20">404: Debate Not Found.</div>;

    // --- MAIN RENDER ---
    return (
        <div className="py-10">
            {/* The title and status elements */}
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
                        <div className="h-[600px]">
                            <DebateChat debateId={debate.id} username={mockUsername} />
                        </div>
                    )}
                    {/* Render the DebateCall component for 'call' or 'video' debates */}
                    {(debate.debateType === 'call' || debate.debateType === 'video') && (
                        <div className="h-[600px]">
                            <DebateCall 
                                debateId={debate.id} 
                                isVoiceActive={isVoiceActive} 
                                onToggleVoice={handleVoiceToggle} 
                            />
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