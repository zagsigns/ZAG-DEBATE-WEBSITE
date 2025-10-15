import React, { useState, useEffect } from 'react';
import { Users, Clock, Zap, MessageCircle } from 'lucide-react'; // Added Zap and MessageCircle icons

// Sample demo data (for when the server fails to connect)
const demoDebates = [
  { 
    id: 1, 
    title: "Future of AI in Education: Threat or Opportunity?", 
    creator: "Alice Smith", 
    participants: 154, 
    status: "HOT TOPIC", // Red
    link: "/debate/1",
    time: "2h 30m ago"
  },
  { 
    id: 2, 
    title: "Universal Basic Income: Feasibility and Societal Impact", 
    creator: "Bob Johnson", 
    participants: 86, 
    status: "Starting Soon", // Yellow
    link: "/debate/2",
    time: "Today, 7:00 PM IST"
  },
  { 
    id: 3, 
    title: "Climate Change: Policy Intervention vs. Technological Innovation", 
    creator: "Carla Diaz", 
    participants: 99, 
    status: "Active", // Teal
    link: "/debate/3",
    time: "Live Now"
  },
  { 
    id: 4, 
    title: "The Ethics of Digital Privacy in a Connected World", 
    creator: "David Lee", 
    participants: 210, 
    status: "HOT TOPIC", 
    link: "/debate/4",
    time: "5 days ago"
  },
  { 
    id: 5, 
    title: "Cryptocurrency: The Future of Finance or a Bubble?", 
    creator: "Eva Mendez", 
    participants: 45, 
    status: "Upcoming", // Default/Gray
    link: "/debate/5",
    time: "Tomorrow, 10:00 AM EST"
  },
];

const DebateList = () => {
  const [debates, setDebates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // This is where your actual API call to the backend will go
    const fetchDebates = async () => {
      // Simulating a delay for the loading state
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 800)); 

      try {
        // Simulating the fetch failure
        throw new Error('Could not fetch debates from the main server. Please try again later.');
        
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
        return 'bg-amber-500 text-gray-900'; // Changed to amber for better contrast
      case 'Active':
        return 'bg-teal-500 text-white';
      default:
        return 'bg-indigo-500 text-white'; // Default for Upcoming/Other
    }
  };

  // Improved Loading State Component
  const LoadingCard = () => (
    <div className="bg-gray-800 rounded-xl p-6 h-64 shadow-xl animate-pulse border border-gray-700">
      <div className="h-6 bg-gray-700 rounded w-3/4 mb-4"></div>
      <div className="h-4 bg-gray-700 rounded w-1/2 mb-8"></div>
      <div className="h-4 bg-gray-700 rounded w-full mb-3"></div>
      <div className="h-4 bg-gray-700 rounded w-5/6 mb-3"></div>
      <div className="h-12 bg-gray-700 rounded-lg mt-8"></div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-8 pt-20">
        <h1 className="text-4xl font-extrabold text-teal-400 mb-6 border-b border-gray-700 pb-2">
          Active & Upcoming Debates
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <LoadingCard /><LoadingCard /><LoadingCard />
          <LoadingCard /><LoadingCard /><LoadingCard />
        </div>
      </div>
    );
  }

  return (
    // Added a subtle texture to the background for depth
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-8 pt-20">
      
      <h1 className="text-3xl sm:text-4xl font-extrabold text-teal-400 mb-8 sm:mb-10">
        Active & Upcoming Debates 🗣️
      </h1>
      
      {/* Error Message with a subtle drop shadow */}
      {error && (
        <div className="bg-red-800 border-l-4 border-red-500 text-white p-4 mb-8 rounded-lg shadow-2xl" role="alert">
          <p className="font-bold flex items-center"><Zap className="w-5 h-5 mr-2" /> Connection Warning</p>
          <p className="text-sm mt-1">{error} Displaying cached demo data to keep you going.</p>
        </div>
      )}

      {/* Debate Grid (Responsive Layout: 1 column on mobile, 2 on tablet, 3 on desktop) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
        {debates.map((debate) => (
          
          /* Debate Card: Enhanced for Pro look */
          <div 
            key={debate.id} 
            className="group bg-gray-800 rounded-xl shadow-2xl hover:shadow-teal-500/30 transition duration-300 transform hover:-translate-y-1 overflow-hidden border border-gray-700 hover:border-teal-500"
          >
            <div className="p-6 flex flex-col h-full">
              
              {/* Status & Participants */}
              <div className="flex justify-between items-center mb-4">
                {/* Status Badge */}
                <span className={`px-4 py-1 text-xs font-bold rounded-full uppercase tracking-wider ${getStatusBadge(debate.status)} shadow-md`}>
                  {debate.status}
                </span>
                {/* Participant Count */}
                <div className="flex items-center text-sm text-gray-400">
                  <Users className="w-4 h-4 mr-1 text-indigo-400" />
                  <span className="font-semibold text-white">{debate.participants}</span>
                </div>
              </div>

              {/* Topic Title */}
              <h2 className="text-xl sm:text-2xl font-extrabold text-white leading-snug mb-3 line-clamp-2 group-hover:text-teal-400 transition duration-300">
                {debate.title}
              </h2>

              {/* Debate Metadata */}
              <p className="text-sm text-gray-400 mb-6 flex-grow">
                <span className="font-light">Created by:</span> <span className="font-medium text-teal-300 hover:text-teal-200 transition">{debate.creator}</span>
              </p>
              
              {/* Time/Schedule */}
              <div className="flex items-center text-sm text-gray-500 mb-6 pt-4 border-t border-gray-700">
                <Clock className="w-4 h-4 mr-2" />
                <span>{debate.time}</span>
              </div>
              
              {/* Action Button */}
              <a 
                href={debate.link} 
                className="mt-auto block w-full text-center py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-500 active:bg-indigo-700 transition duration-200 shadow-xl transform group-hover:scale-[1.02] flex items-center justify-center"
              >
                <MessageCircle className="w-5 h-5 mr-2" />
                View & Join Debate
              </a>
            </div>
          </div>
        ))}
      </div>
      
      {/* Footer Space for a clean look */}
      <div className="mt-12 text-center text-gray-600 text-sm">
        <p>Your platform for informed discussion. Find your next debate.</p>
      </div>
    </div>
  );
};

export default DebateList;