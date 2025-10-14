import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import DebateChat from '../../components/DebateChat'; // Will create next

function DebateDetailPage() {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [debate, setDebate] = useState(null);
    const [loading, setLoading] = useState(true);
    const [joinStatus, setJoinStatus] = useState({ message: '', error: false, success: false });

    useEffect(() => {
        const fetchDebate = async () => {
            try {
                const response = await axiosInstance.get(`debates/${id}/`);
                setDebate(response.data);
            } catch (err) {
                setJoinStatus({ message: 'Error loading debate details.', error: true });
            } finally {
                setLoading(false);
            }
        };
        fetchDebate();
    }, [id]);

    const handleJoinDebate = async () => {
        setJoinStatus({ message: 'Processing...', error: false, success: false });
        try {
            const response = await axiosInstance.post(`debates/${id}/join/`);
            setJoinStatus({ message: response.data.detail || 'Successfully joined!', success: true });
            // Re-fetch debate data to update participant list
            const updatedResponse = await axiosInstance.get(`debates/${id}/`);
            setDebate(updatedResponse.data);
        } catch (err) {
            const errorMessage = err.response?.data?.detail || 'Failed to join debate.';
            setJoinStatus({ message: errorMessage, error: true });
        }
    };
    
    // Check if the current user is a participant
    const isParticipant = debate?.participants.includes(user.user_id);

    if (loading) return <div className="text-center p-8">Loading debate...</div>;
    if (!debate) return <div className="text-center p-8 text-red-600">Debate not found.</div>;

    return (
        <div className="container mx-auto p-4 grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Column: Debate Info & Actions */}
            <div className="lg:col-span-1 space-y-6">
                <div className="bg-white p-6 rounded-xl shadow-lg">
                    <h1 className="text-3xl font-bold text-indigo-700 mb-4">{debate.title}</h1>
                    <p className="text-gray-600 mb-4 whitespace-pre-line">{debate.description}</p>
                    
                    <p className="text-sm text-gray-500">Creator: {debate.creator_username}</p>
                    <p className="text-sm text-gray-500">Created: {new Date(debate.created_at).toLocaleDateString()}</p>
                    
                    <div className="mt-4 pt-4 border-t">
                        <p className="font-semibold text-lg">Participants: <span className="text-blue-600">{debate.participant_count}/{debate.max_participants}</span></p>
                        <p className="font-semibold text-lg">Fee: <span className="text-red-500">{debate.subscription_fee > 0 ? `$${debate.subscription_fee} (or Credits)` : 'Free'}</span></p>
                    </div>

                    {/* Action Button Area */}
                    <div className="mt-6">
                        {isParticipant ? (
                            <button className="w-full py-3 bg-green-500 text-white font-semibold rounded-lg cursor-not-allowed opacity-80">
                                ✅ Joined
                            </button>
                        ) : (
                            <button 
                                onClick={handleJoinDebate}
                                disabled={debate.participant_count >= debate.max_participants}
                                className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition disabled:bg-gray-400"
                            >
                                {debate.participant_count >= debate.max_participants ? 'Full' : 'Join Debate'}
                            </button>
                        )}
                        {joinStatus.message && (
                            <p className={`mt-2 text-sm text-center ${joinStatus.error ? 'text-red-500' : 'text-green-500'}`}>
                                {joinStatus.message}
                            </p>
                        )}
                    </div>
                </div>

                {/* Video Call Button (Future Step: WebRTC) */}
                {isParticipant && (
                    <button className="w-full py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition">
                        Start/Join Video Call 🎥
                    </button>
                )}
            </div>

            {/* Right Column: Chat/Real-Time Interaction */}
            <div className="lg:col-span-2">
                {isParticipant ? (
                    <DebateChat debateId={id} />
                ) : (
                    <div className="bg-gray-200 p-10 rounded-xl shadow-inner h-full flex items-center justify-center">
                        <p className="text-xl text-gray-700">Join the debate to access the live chat!</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default DebateDetailPage;


// frontend/src/pages/Debates/DebateDetailPage.jsx (Add this import)
import DebateCall from '../../components/DebateCall'; 

// ... inside the DebateDetailPage component's return statement, within the main grid ...

{/* Left Column: Debate Info & Actions */}
<div className="lg:col-span-1 space-y-6">
    {/* ... Debate Info Box ... */}
    
    {/* Video Call Component Area */}
    {isParticipant && <DebateCall debateId={id} isParticipant={isParticipant} />}
    
    {/* ... existing Join/Action Button ... */}
</div>

// ...