import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const result = await loginUser(username, password);

    if (result.success) {
      navigate('/dashboard'); // Redirect to dashboard on success
    } else {
      // Handle known login errors (e.g., 401 Unauthorized)
      setError(result.error || 'Invalid credentials or connection error.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-2xl">
        <h2 className="text-3xl font-extrabold text-center text-indigo-700">
          Sign In
        </h2>
        {error && <p className="text-red-600 text-center font-medium">{error}</p>}
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <input
              type="text"
              required
              className="mt-1 w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              required
              className="mt-1 w-full p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Log in
          </button>
        </form>
        <div className="text-sm text-center">
          <Link to="/register" className="font-medium text-indigo-600 hover:text-indigo-500">
            Don't have an account? Register
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;