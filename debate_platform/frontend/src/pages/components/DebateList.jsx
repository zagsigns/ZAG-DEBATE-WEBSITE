import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axios';
import { useNavigate } from 'react-router-dom';

function DebateList() {
  const [debates, setDebates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDebates = async () => {
      try {
        const response = await axiosInstance.get('debates/');
        setDebates(response.data);
      } catch (err) {
        setError("Failed to load debates. Please check server connection.");
      } finally {
        setLoading(false);
      }
    };
    fetchDebates();
  }, []);

  if (loading) return <div className="text-center p-8">Loading debates...</div>;
  if (error) return <div className="text-center p-8 text-red-600">{error}</div>;
  if (debates.length === 0) return <div className="text-center p-8 text-gray-500">No debates are currently available. Be the first to create one!</div>;

  return (
    <div className="space-y-4">
      {debates.map((debate) => (
        <div 
          key={debate.id} 
          className="p-5 bg-white rounded-lg shadow-lg hover:shadow-xl transition duration-300 border-l-4 border-indigo-500 cursor-pointer"
          onClick={() => navigate(`/debates/${debate.id}`)}
        >
          <h3 className="text-xl font-bold text-gray-800">{debate.title}</h3>
          <p className="text-sm text-gray-500 mt-1">
            Created by: {debate.creator_username} | Participants: {debate.participant_count}/{debate.max_participants}
          </p>
          <p className="mt-2 text-gray-600 line-clamp-2">{debate.description}</p>
          <div className="mt-3 flex justify-between items-center">
            <span className={`px-3 py-1 text-sm font-semibold rounded-full ${debate.subscription_fee > 0 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
              Fee: {debate.subscription_fee > 0 ? `$${debate.subscription_fee} (or Credits)` : 'Free'}
            </span>
            <button 
                className="px-4 py-2 bg-indigo-600 text-white text-sm rounded-md hover:bg-indigo-700"
                onClick={(e) => { e.stopPropagation(); navigate(`/debates/${debate.id}`); }}
            >
                View Details
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default DebateList;