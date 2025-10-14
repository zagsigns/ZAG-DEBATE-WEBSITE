import React from 'react';

function AdminDashboard() {
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-4xl font-extrabold text-red-700 mb-6 border-b-4 border-red-500 pb-2">
                👑 Super Admin Control Panel
            </h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* 1. Analytics & Revenue */}
                <div className="bg-white p-6 rounded-xl shadow-2xl border-l-4 border-red-500">
                    <h2 className="text-2xl font-semibold mb-3 text-red-700">Financial Overview</h2>
                    <p className="text-gray-600">Total Revenue: $XXX,XXX</p>
                    <p className="text-gray-600">Pending Commissions: $X,XXX</p>
                    <button className="mt-3 text-sm py-2 px-4 bg-red-500 text-white rounded">View Transactions</button>
                </div>

                {/* 2. User Management */}
                <div className="bg-white p-6 rounded-xl shadow-2xl border-l-4 border-red-500">
                    <h2 className="text-2xl font-semibold mb-3 text-red-700">User Management</h2>
                    <p className="text-gray-600">Total Users: X,XXX</p>
                    <p className="text-gray-600">Pending Deactivations: XX</p>
                    <button className="mt-3 text-sm py-2 px-4 bg-red-500 text-white rounded">Manage Users</button>
                </div>
                
                {/* 3. Site Settings */}
                <div className="bg-white p-6 rounded-xl shadow-2xl border-l-4 border-red-500">
                    <h2 className="text-2xl font-semibold mb-3 text-red-700">Site Settings</h2>
                    <p className="text-gray-600">Commission Rate: 25%</p>
                    <p className="text-gray-600">Default Max Participants: 100</p>
                    <button className="mt-3 text-sm py-2 px-4 bg-red-500 text-white rounded">Configure Site</button>
                </div>
            </div>
            
            {/* ... Admin Tools UI (To be built out with more APIs) ... */}
        </div>
    );
}

export default AdminDashboard;