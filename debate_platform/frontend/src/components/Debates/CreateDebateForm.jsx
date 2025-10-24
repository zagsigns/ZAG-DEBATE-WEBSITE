// frontend/src/components/Debates/CreateDebateForm.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Loader, DollarSign, Users, MessageSquare } from 'lucide-react';
import axiosInstance from '../../api/axios'; // Import the configured axios instance

const CreateDebateForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        subscription_fee: 0, // Default to 0 (free)
        max_participants: 100, // Default value
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            // Convert to number for numerical fields
            [name]: (name === 'subscription_fee' || name === 'max_participants') 
                        ? Number(value) 
                        : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        // Basic validation
        if (!formData.title || !formData.description) {
            setError("Title and Description are required.");
            return;
        }

        setLoading(true);
        
        try {
            // API call to the DebateListCreateView endpoint: POST /api/debates/
            const response = await axiosInstance.post('/debates/', formData);
            
            setSuccess('Debate created successfully!');
            console.log('Debate Created:', response.data);
            
            // Redirect to the newly created debate page (or debate list)
            navigate(`/debate/${response.data.id}`);

        } catch (err) {
            console.error('Debate Creation Error:', err.response ? err.response.data : err.message);
            setError(err.response?.data?.detail || 'Failed to create debate. Check your input.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-800 p-8 rounded-xl shadow-2xl border border-indigo-700">
            <h2 className="text-3xl font-extrabold text-indigo-400 mb-6 flex items-center">
                <PlusCircle className="w-7 h-7 mr-3" />
                Create New Debate
            </h2>
            <p className="text-gray-400 mb-8">
                Set up your debate topic, rules, and entry requirements.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Title */}
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
                        Title <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="text"
                        name="title"
                        id="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:ring-indigo-500 focus:border-indigo-500 text-white"
                        placeholder="e.g., Is AI a net positive for humanity?"
                        maxLength={255}
                    />
                </div>

                {/* Description */}
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
                        Description <span className="text-red-500">*</span>
                    </label>
                    <textarea
                        name="description"
                        id="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        rows="4"
                        className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:ring-indigo-500 focus:border-indigo-500 text-white"
                        placeholder="A detailed explanation of the debate's scope and rules."
                    ></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Subscription Fee */}
                    <div>
                        <label htmlFor="subscription_fee" className="block text-sm font-medium text-gray-300 mb-1 flex items-center">
                            <DollarSign className="w-4 h-4 mr-1 text-green-400" />
                            Entry Fee (Credits)
                        </label>
                        <input
                            type="number"
                            name="subscription_fee"
                            id="subscription_fee"
                            value={formData.subscription_fee}
                            onChange={handleChange}
                            min="0"
                            step="1"
                            className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:ring-indigo-500 focus:border-indigo-500 text-white"
                        />
                        <p className="mt-1 text-xs text-gray-400">Set 0 for a free debate.</p>
                    </div>

                    {/* Max Participants */}
                    <div>
                        <label htmlFor="max_participants" className="block text-sm font-medium text-gray-300 mb-1 flex items-center">
                            <Users className="w-4 h-4 mr-1 text-yellow-400" />
                            Max Participants
                        </label>
                        <input
                            type="number"
                            name="max_participants"
                            id="max_participants"
                            value={formData.max_participants}
                            onChange={handleChange}
                            min="2"
                            step="1"
                            className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 focus:ring-indigo-500 focus:border-indigo-500 text-white"
                        />
                    </div>
                </div>

                {/* Status/Error Messages */}
                {error && (
                    <div className="p-3 bg-red-800 text-red-300 rounded-lg border border-red-500">
                        Error: {error}
                    </div>
                )}

                {success && (
                    <div className="p-3 bg-green-800 text-green-300 rounded-lg border border-green-500">
                        Success: {success}
                    </div>
                )}

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white transition duration-200 ${
                        loading 
                            ? 'bg-indigo-500 cursor-not-allowed' 
                            : 'bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-500 focus:ring-opacity-50'
                    }`}
                >
                    {loading ? (
                        <>
                            <Loader className="w-5 h-5 mr-2 animate-spin" />
                            Creating Debate...
                        </>
                    ) : (
                        <>
                            <MessageSquare className="w-5 h-5 mr-2" />
                            Launch Debate
                        </>
                    )}
                </button>
            </form>
        </div>
    );
};

export default CreateDebateForm;