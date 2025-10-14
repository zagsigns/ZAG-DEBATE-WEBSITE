import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axios';

function ProfileInfo() {
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch credit balance (Subscription status will be similar)
    const fetchCreditBalance = async () => {
      try {
        const response = await axiosInstance.get('payments/credits/balance/', {
          // You need to manually attach the token for Axios instance. 
          // Best practice is to modify axios.js to automatically attach JWT.
          // For now, assume auth is handled by a token interceptor if you didn't set one up.
        });
        setBalance(response.data.balance);
      } catch (error) {
        console.error("Failed to fetch credit balance:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCreditBalance();
  }, []);

  if (loading) return <div className="p-4 bg-white rounded-lg shadow-md">Loading Profile...</div>;

  return (
    <div className="p-4 bg-white rounded-lg shadow-xl mb-4">
      <h3 className="font-semibold text-xl border-b pb-2 text-indigo-600">Your Status</h3>
      
      <div className="mt-3">
        <p className="text-gray-700 font-medium">Credits Balance:</p>
        <span className="text-3xl font-extrabold text-green-500">{balance !== null ? balance : 'N/A'}</span>
      </div>
      
      <div className="mt-4">
        <p className="text-gray-700 font-medium">Subscription:</p>
        <span className="text-lg font-semibold text-yellow-600">Free Trial Active</span> {/* Placeholder */}
      </div>
      
      <button className="mt-4 w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition">
        Manage Subscriptions/Credits
      </button>
    </div>
  );
}

export default ProfileInfo;