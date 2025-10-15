// frontend/src/components/Debates/CreateDebateForm.jsx

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
// Ensure this path is correct based on your file structure!
import axiosInstance from '../../api/axios'; 

const CreateDebateForm = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        max_participants: 100,
        subscription_fee: 0,
        // --- ADDED ADVANCED FIELDS ---
        debate_type: 'chat', // 'chat', 'call', 'video'
        show_contact_info: false,
        // is_commission_eligible would be determined by the backend based on user status
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        
        // Handle number/text/checkbox inputs
        let newValue;
        if (type === 'number') {
            newValue = parseFloat(value);
        } else if (type === 'checkbox') {
            newValue = checked;
        } else {
            newValue = value;
        }

        setFormData(prev => ({
            ...prev,
            [name]: newValue,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Your API endpoint for creating a debate
            const response = await axiosInstance.post('debates/', formData);
            
            if (response.status === 201) {
                alert('Debate created successfully!');
                // Redirect to the new debate page using its ID
                navigate(`/debates/${response.data.id}`); 
            }
        } catch (err) {
            console.error("API Error:", err.response || err);
            const errorMessage = err.response?.data?.detail || 
                                 err.response?.data?.[Object.keys(err.response.data)[0]]?.[0] || // Catch Django field errors
                                 'Failed to create debate. Check server logs.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };
    
    // NOTE: In a real app, commission eligibility should be calculated by the server 
    // or fetched from the user's profile API. This is a frontend placeholder.
    const isCommissionEligible = true; 

    return (
        <form onSubmit={handleSubmit} className="space-y-8 p-8 bg-gray-800 rounded-xl shadow-2xl border border-gray-700">
            <h2 className="text-3xl font-extrabold text-indigo-400 border-b pb-4 border-gray-700">
                Launch a New Debate
            </h2>

            {/* Error Message */}
            {error && (
                <p className="text-red-400 bg-red-900/40 p-3 rounded-lg border border-red-700 font-medium">
                    <span className="font-bold">Error:</span> {error}
                </p>
            )}

            {/* --- SECTION 1: CORE DETAILS (Your original fields + WoW Styling) --- */}
            <div className="space-y-6">
                <h3 className="text-xl font-semibold text-white">1. Core Topic & Pricing</h3>

                {/* Debate Title */}
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-300 mb-1">
                        Title
                    </label>
                    <input
                        type="text"
                        name="title"
                        id="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="A captivating and clear debate topic"
                        maxLength="255"
                    />
                </div>

                {/* Debate Description */}
                <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-300 mb-1">
                        Description / Rules
                    </label>
                    <textarea
                        name="description"
                        id="description"
                        rows="4"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Provide background and main points of contention."
                    />
                </div>
                
                {/* Max Participants & Subscription Fee (Grid) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="max_participants" className="block text-sm font-medium text-gray-300 mb-1">
                            Max Participants (100+ for commission)
                        </label>
                        <input
                            type="number"
                            name="max_participants"
                            id="max_participants"
                            value={formData.max_participants}
                            onChange={handleChange}
                            required
                            min="2" max="500"
                            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="subscription_fee" className="block text-sm font-medium text-gray-300 mb-1">
                            Debate Fee (Credits or $0 for Free)
                        </label>
                        <input
                            type="number"
                            name="subscription_fee"
                            id="subscription_fee"
                            value={formData.subscription_fee}
                            onChange={handleChange}
                            required
                            min="0" step="0.01"
                            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                </div>
            </div>

            {/* --- SECTION 2: ADVANCED SETTINGS (Wow Look for custom features) --- */}
            <div className="space-y-6 pt-4 border-t border-gray-700">
                <h3 className="text-xl font-semibold text-white">2. Communication & Visibility</h3>

                {/* Debate Type (Radio Buttons) */}
                <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                        Communication Method
                    </label>
                    <div className="flex space-x-6">
                        {['chat', 'call', 'video'].map(type => (
                            <label key={type} className="inline-flex items-center cursor-pointer">
                                <input
                                    type="radio"
                                    name="debate_type"
                                    value={type}
                                    checked={formData.debate_type === type}
                                    onChange={handleChange}
                                    className="form-radio h-4 w-4 text-indigo-500 focus:ring-indigo-500 bg-gray-700 border-gray-600"
                                />
                                <span className="ml-2 text-white capitalize font-medium">
                                    {type}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Show/Hide Contact Info (Toggle) */}
                <div className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                    <span className="text-sm font-medium text-white">
                        Show Personal Contact Info to Participants
                    </span>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            name="show_contact_info"
                            checked={formData.show_contact_info}
                            onChange={handleChange}
                            className="sr-only peer"
                        />
                        {/* Tailwind Toggle Switch Styling (WOW factor) */}
                        <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:border-gray-300 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        <span className="ml-3 text-sm font-medium text-gray-300">
                            {formData.show_contact_info ? 'Visible' : 'Hidden'}
                        </span>
                    </label>
                </div>
                
                {/* Commission Eligibility Info */}
                <div className={`p-4 rounded-lg ${isCommissionEligible ? 'bg-green-800/30' : 'bg-red-800/30'} border ${isCommissionEligible ? 'border-green-700' : 'border-red-700'}`}>
                    <p className="text-sm font-medium text-white">
                        Earning Potential: 
                        <span className="ml-2 font-bold text-lg text-green-400">
                            25% Commission Eligible 
                        </span>
                    </p>
                    <p className="text-xs text-gray-300 mt-1">
                        *You will earn 25% commission if the debate exceeds 100 participants.
                    </p>
                </div>

            </div>

            {/* --- SUBMIT BUTTON --- */}
            <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center items-center py-3 px-4 border border-transparent text-lg font-bold rounded-lg shadow-lg transition duration-300 ${
                    loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/50'
                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
            >
                {loading ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        Creating Debate...
                    </>
                ) : (
                    'Launch Debate Now'
                )}
            </button>
        </form>
    );
};

export default CreateDebateForm;