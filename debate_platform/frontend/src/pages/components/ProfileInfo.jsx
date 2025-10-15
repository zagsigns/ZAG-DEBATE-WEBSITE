import React from 'react';
import { CreditCard, User } from 'lucide-react'; 

// This component uses hardcoded values for now, but will eventually take props for balance and status.
const ProfileInfo = () => {
  const creditBalance = 150;
  const subscriptionStatus = 'Pro'; // or 'Basic'

  return (
    <header className="bg-gray-900 shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
        
        {/* Logo/Platform Name */}
        <div className="text-2xl font-bold text-teal-400">
          DebateFlow
        </div>
        
        {/* User Status and Navigation */}
        <div className="flex items-center space-x-4">
          
          {/* Credits Badge (ProfileInfo) */}
          <div className="flex items-center space-x-1 p-2 bg-gray-800 rounded-full border border-gray-700">
            <CreditCard className="w-5 h-5 text-yellow-400" />
            <span className="text-sm font-semibold text-white hidden sm:inline">
              {creditBalance} Credits
            </span>
          </div>

          {/* Subscription Status (ProfileInfo) */}
          <span className={`px-3 py-1 text-sm font-bold rounded-full ${subscriptionStatus === 'Pro' ? 'bg-indigo-600 text-white' : 'bg-gray-600 text-gray-200'}`}>
            {subscriptionStatus.toUpperCase()}
          </span>

          {/* User Icon/Profile Link */}
          <button className="p-2 rounded-full bg-indigo-700 hover:bg-indigo-600 transition duration-150">
            <User className="w-6 h-6 text-white" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default ProfileInfo;