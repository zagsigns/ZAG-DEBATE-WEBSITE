import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axios';
import { useAuth } from '../../context/AuthContext';

function ProfilePage() {
    const { user, logoutUser } = useAuth();
    const [profile, setProfile] = useState({});
    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState('');
    const [file, setFile] = useState(null);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const response = await axiosInstance.get('accounts/profile/');
                setProfile(response.data);
            } catch (err) {
                setMessage('Failed to load profile.');
            } finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setProfile({
            ...profile,
            [name]: type === 'checkbox' ? checked : value,
        });
    };
    
    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        
        const formData = new FormData();
        
        // Append all fields, checking for file upload
        Object.keys(profile).forEach(key => {
            // Skip email update as it's read-only in the serializer
            if (key !== 'email') { 
                formData.append(key, profile[key]);
            }
        });
        
        if (file) {
            formData.append('profile_pic', file);
        }

        try {
            // Note: Use 'PATCH' for partial updates and adjust headers for file uploads
            await axiosInstance.patch('accounts/profile/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            setMessage('Profile updated successfully!');
            // Re-fetch profile to show updated data immediately
            const updatedResponse = await axiosInstance.get('accounts/profile/');
            setProfile(updatedResponse.data);
            setFile(null); // Clear file input after successful upload
        } catch (err) {
            const errorDetail = err.response?.data?.detail || JSON.stringify(err.response?.data);
            setMessage(`Update failed: ${errorDetail}`);
        }
    };

    if (loading) return <div className="text-center p-8">Loading Profile...</div>;

    return (
        <div className="container mx-auto p-4 max-w-3xl">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-2">My Profile Settings</h1>
            
            {message && <p className={`p-3 rounded mb-4 ${message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{message}</p>}

            <form onSubmit={handleSubmit} className="bg-white p-8 rounded-xl shadow-lg space-y-6">
                
                {/* Profile Picture */}
                <div className="flex items-center space-x-4">
                    <img 
                        src={profile.profile_pic || 'https://via.placeholder.com/100'} 
                        alt="Profile" 
                        className="w-24 h-24 rounded-full object-cover border-4 border-indigo-200"
                    />
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Change Profile Picture</label>
                        <input type="file" onChange={handleFileChange} className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"/>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                    {/* Name & Username */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700">First Name</label>
                        <input type="text" name="first_name" value={profile.first_name || ''} onChange={handleChange} className="mt-1 w-full p-2 border rounded-md"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Username</label>
                        <input type="text" name="username" value={profile.username || ''} onChange={handleChange} required className="mt-1 w-full p-2 border rounded-md"/>
                    </div>
                </div>

                {/* Contact Info */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Email (Read-Only)</label>
                    <input type="email" value={profile.email || ''} readOnly className="mt-1 w-full p-2 border rounded-md bg-gray-50"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                    <input type="text" name="phone_number" value={profile.phone_number || ''} onChange={handleChange} className="mt-1 w-full p-2 border rounded-md"/>
                </div>
                
                {/* Visibility Toggles */}
                <div className="space-y-3 pt-4 border-t">
                    <div className="flex items-center">
                        <input type="checkbox" name="show_email" checked={profile.show_email || false} onChange={handleChange} className="h-4 w-4 text-indigo-600 border-gray-300 rounded"/>
                        <label className="ml-2 block text-sm text-gray-900">Show email publicly</label>
                    </div>
                    <div className="flex items-center">
                        <input type="checkbox" name="show_phone" checked={profile.show_phone || false} onChange={handleChange} className="h-4 w-4 text-indigo-600 border-gray-300 rounded"/>
                        <label className="ml-2 block text-sm text-gray-900">Show phone number publicly</label>
                    </div>
                </div>

                <button type="submit" className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition">
                    Save Changes
                </button>
            </form>
        </div>
    );
}

export default ProfilePage;