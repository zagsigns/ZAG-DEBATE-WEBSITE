import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axios';

function CreateDebatePage() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        max_participants: 100,
        subscription_fee: 0,
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'number' ? parseFloat(value) : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await axiosInstance.post('debates/', formData);
            if (response.status === 201) {
                alert('Debate created successfully!');
                navigate(`/debates/${response.data.id}`); // Redirect to new debate page
            }
        } catch (err) {
            const errorMessage = err.response?.data?.detail || 'Failed to create debate.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mx-auto p-4 max-w-2xl">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">Create a New Debate</h1>
            
            {error && <p className="text-red-500 bg-red-100 p-3 rounded mb-4">{error}</p>}

            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-lg space-y-4">
                <div>
                    <label className="block text-lg font-medium text-gray-700">Title</label>
                    <input type="text" name="title" required onChange={handleChange} className="mt-1 w-full p-3 border rounded-md" maxLength="255" />
                </div>
                
                <div>
                    <label className="block text-lg font-medium text-gray-700">Description</label>
                    <textarea name="description" required onChange={handleChange} rows="5" className="mt-1 w-full p-3 border rounded-md"></textarea>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-lg font-medium text-gray-700">Max Participants</label>
                        <input type="number" name="max_participants" required onChange={handleChange} min="2" max="500" defaultValue="100" className="mt-1 w-full p-3 border rounded-md" />
                    </div>
                    <div>
                        <label className="block text-lg font-medium text-gray-700">Subscription Fee ($)</label>
                        <input type="number" name="subscription_fee" required onChange={handleChange} min="0" step="0.01" defaultValue="0" className="mt-1 w-full p-3 border rounded-md" />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition disabled:bg-indigo-400"
                >
                    {loading ? 'Creating...' : 'Launch Debate'}
                </button>
            </form>
        </div>
    );
}

export default CreateDebatePage;