import React, { useState, useEffect } from 'react';
import { Users, Clock } from 'lucide-react'; // Icons

// Sample demo data (for when the server fails to connect)
const demoDebates = [
  { 
    id: 1, 
    title: "Future of AI in Education", 
    creator: "Alice Smith", 
    participants: 154, 
    status: "HOT TOPIC", 
    link: "/debate/1" 
  },
  { 
    id: 2, 
    title: "Universal Basic Income Feasibility", 
    creator: "Bob Johnson", 
    participants: 86, 
    status: "Starting Soon", 
    link: "/debate/2" 
  },
  { 
    id: 3, 
    title: "Climate Change: Policy vs. Innovation", 
    creator: "Carla Diaz", 
    participants: 99, 
    status: "Active", 
    link: "/debate/3" 
  },
  { 
    id: 4, 
    title: "The Ethics of Digital Privacy", 
    creator: "David Lee", 
    participants: 210, 
    status: "HOT TOPIC", 
    link: "/debate/4" 
  },
];

const DebateList = () => {
  const [debates, setDebates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // This is where your actual API call to the backend will go
    const fetchDebates = async () => {
      try {
        // Simulating the fetch failure that you saw in your image:
        throw new Error('Could not fetch debates from the server.');
        
      } catch (err) {
        // On error, show the warning and use demo data
        setError(err.message);
        setDebates(demoDebates);
        setLoading(false);
      }
    };

    fetchDebates();
  }, []);

  // Helper function to determine the style of the status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case 'HOT TOPIC':
        return 'bg-red-600 text-white';
      case 'Starting Soon':
        return 'bg-yellow-500 text-gray-900';
      case 'Active':
        return 'bg-teal-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-8 pt-20">
      
      <h1 className="text-4xl font-extrabold text-teal-400 mb-6 border-b border-gray-700 pb-2">
        Active & Upcoming Debates
      </h1>
      
      {/* Error Message from the image */}
      {error && (
        <div className="bg-red-800 border-l-4 border-red-500 text-white p-4 mb-6 rounded shadow-lg" role="alert">
          <p className="font-bold">Connection Warning</p>
          <p>{error} Showing demo data.</p>
        </div>
      )}

      {/* Debate Grid (Responsive Layout: 1 column on mobile, 2 on tablet, 3 on desktop) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {debates.map((debate) => (
          
          /* Debate Card */
          <div 
            key={debate.id} 
            className="bg-gray-800 rounded-lg shadow-xl hover:shadow-2xl transition duration-300 overflow-hidden border border-gray-700"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                {/* Topic Title */}
                <h2 className="text-xl font-bold text-white leading-tight pr-4">
                  {debate.title}
                </h2>
                {/* Status Badge */}
                <span className={`px-3 py-1 text-xs font-semibold rounded-full flex-shrink-0 ${getStatusBadge(debate.status)}`}>
                  {debate.status.toUpperCase()}
                </span>
              </div>

              {/* Debate Details */}
              <p className="text-sm text-gray-400 mb-4">Creator: <span className="font-medium text-teal-300">{debate.creator}</span></p>

              {/* Participant Count */}
              <div className="flex items-center text-gray-400 text-sm mb-6">
                <Users className="w-4 h-4 mr-2 text-indigo-400" />
                <span>Participants: <span className="font-semibold text-white">{debate.participants}</span></span>
              </div>
              
              {/* Action Button */}
              <a 
                href={debate.link} 
                className="block w-full text-center py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition duration-200 shadow-lg"
              >
                View Debate & Join
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DebateList;