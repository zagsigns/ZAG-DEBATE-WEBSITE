import React from 'react';
import { useAuth } from '../../context/AuthContext';
import DebateList from '../../components/DebateList'; // Will create next
import ProfileInfo from '../../components/ProfileInfo'; // Will create next
import { useNavigate } from 'react-router-dom';

function UserDashboard() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const isAdmin = user?.is_admin;
  
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">
        {isAdmin ? "Admin Dashboard Overview" : `Welcome back, ${user.username}!`}
      </h1>
      
      <div className="flex justify-between items-center mb-6 border-b pb-4">
        <p className="text-lg text-gray-600">Your Current Status</p>
        <button
          onClick={logoutUser}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
        >
          Logout
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile/Quick Info Card (e.g., Credits, Subscription Status) */}
        <div className="md:col-span-1">
          <ProfileInfo />
          
          {isAdmin && (
            <div className="mt-4 p-4 bg-indigo-100 rounded-lg shadow-md">
              <h3 className="font-semibold text-xl text-indigo-700">Admin Panel</h3>
              <p className="text-sm text-indigo-600">Access full site controls.</p>
              <button 
                onClick={() => navigate('/admin-panel')}
                className="mt-2 w-full py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Go to Admin View
              </button>
            </div>
          )}
          
          <button 
            onClick={() => navigate('/debates/create')}
            className="mt-4 w-full py-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition"
          >
            + Create New Debate
          </button>
        </div>
        
        {/* Debate List (Main Content) */}
        <div className="md:col-span-2">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Upcoming Debates</h2>
          <DebateList />
        </div>
      </div>
    </div>
  );
}

export default UserDashboard;