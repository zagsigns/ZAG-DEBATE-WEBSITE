// frontend/src/components/Debates/DebateList.jsx

import React, { useState, useEffect } from 'react';
import DebateCard from '../DebateCard'; // Adjust path if DebateCard is elsewhere
import axiosInstance from '../../api/axios'; // Import your configured Axios instance

// --- DUMMY DATA for initial testing (DELETE after successful API integration) ---
const DUMMY_DEBATES = [
    { id: 1, title: 'Future of AI in Education', creator: 'Alice Smith', participants: 154, is_active: true },
    { id: 2, title: 'Universal Basic Income Feasibility', creator: 'Bob Johnson', participants: 86, is_active: false },
    { id: 3, title: 'Climate Change Policy: Global vs. Local', creator: 'Charlie Brown', participants: 210, is_active: true },
    { id: 4, title: 'The Ethics of Genetic Editing', creator: 'Dr. Evelyn Reed', participants: 45, is_active: false },
];
// --- END DUMMY DATA ---

const DebateList = () => {
    const [debates, setDebates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDebates = async () => {
            try {
                // Adjust 'debates/' to your actual API endpoint for listing debates
                const response = await axiosInstance.get('debates/'); 
                setDebates(response.data); 
                setError(null);
            } catch (err) {
                console.error("Failed to fetch debates:", err);
                // Use dummy data on error for development, or show a proper error message
                setDebates(DUMMY_DEBATES); 
                setError("Could not fetch debates from the server. Showing demo data.");
            } finally {
                setLoading(false);
            }
        };

        fetchDebates();
    }, []);

    if (loading) return (
        <div className="text-center text-indigo-400 text-2xl font-semibold pt-20">
            <svg className="animate-spin h-8 w-8 text-indigo-400 mx-auto mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
            Loading Debates...
        </div>
    );
    
    return (
        <div>
            <h1 className="text-4xl font-extrabold text-white mb-8">
                Active & Upcoming Debates
            </h1>
            
            {error && (
                <p className="text-yellow-400 bg-yellow-900/40 p-3 rounded-lg border border-yellow-700 font-medium mb-6">
                    ⚠️ {error}
                </p>
            )}

            {/* Modern Grid Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {debates.length > 0 ? (
                    debates.map((debate) => (
                        <DebateCard key={debate.id} debate={debate} />
                    ))
                ) : (
                    <div className="md:col-span-3 text-center text-gray-500 text-lg py-10">
                        No active debates found. Be the first to start one!
                    </div>
                )}
            </div>
        </div>
    );
};

export default DebateList;