// frontend/src/components/ProfileInfo.jsx (Update the last button)
// ... (imports and component logic) ...

// ... (Inside the return statement) ...
    <button 
        onClick={() => navigate('/profile')} // Use navigate from react-router-dom
        className="mt-4 w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition"
    >
        Manage Profile & Settings
    </button>
// ...