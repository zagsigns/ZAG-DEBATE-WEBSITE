import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axios';

function RegisterPage() {
  const [formData, setFormData] = useState({
    username: '', email: '', password: '', password2: '',
    first_name: '', last_name: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      // Use the registration API endpoint created earlier
      const response = await axiosInstance.post('accounts/register/', formData);
      
      if (response.status === 201) {
        setSuccess('Registration successful! Redirecting to login...');
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (err) {
      if (err.response && err.response.data) {
        const errors = err.response.data;
        // Display validation errors clearly
        const errorMessages = Object.keys(errors)
          .map(key => `${key.charAt(0).toUpperCase() + key.slice(1)}: ${errors[key].join(' ')}`)
          .join(' | ');
        setError(errorMessages || 'Registration failed due to an unexpected error.');
      } else {
        setError('Network error or server is unavailable.');
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="w-full max-w-lg p-8 space-y-6 bg-white rounded-xl shadow-2xl">
        <h2 className="text-3xl font-extrabold text-center text-indigo-700">
          Create Account
        </h2>
        {error && <p className="text-red-600 text-center font-medium">{error}</p>}
        {success && <p className="text-green-600 text-center font-medium">{success}</p>}

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* ... Input Fields (truncated for brevity) ... */}
           {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input type="text" name="username" required onChange={handleChange} className="mt-1 w-full p-3 border border-gray-300 rounded-md" />
          </div>
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input type="email" name="email" required onChange={handleChange} className="mt-1 w-full p-3 border border-gray-300 rounded-md" />
          </div>
          {/* First Name */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">First Name</label>
              <input type="text" name="first_name" required onChange={handleChange} className="mt-1 w-full p-3 border border-gray-300 rounded-md" />
            </div>
            {/* Last Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Last Name</label>
              <input type="text" name="last_name" required onChange={handleChange} className="mt-1 w-full p-3 border border-gray-300 rounded-md" />
            </div>
          </div>
          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input type="password" name="password" required onChange={handleChange} className="mt-1 w-full p-3 border border-gray-300 rounded-md" />
          </div>
          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
            <input type="password" name="password2" required onChange={handleChange} className="mt-1 w-full p-3 border border-gray-300 rounded-md" />
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            Register
          </button>
        </form>
        <div className="text-sm text-center">
          <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
            Already have an account? Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;