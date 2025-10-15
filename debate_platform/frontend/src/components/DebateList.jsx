import React, { useState, useEffect } from 'react';
// Assuming you will create an API service for fetching data later
// For now, we use mock data.
// import { fetchDebates } from '../services/api'; 
import { Link } from 'react-router-dom';

// --- Mock Data for Testing ---
const mockDebates = [
  { id: 1, title: "Future of AI in Education", participants: 154, creator: "Alice Smith" },
  { id: 2, title: "Universal Basic Income Feasibility", participants: 88, creator: "Bob Johnson" },
  { id: 3, title: "Climate Change Policy: Global vs. Local", participants: 210, creator: "Charlie Brown" },
];

/**
 * DebateList Component
 * Fetches and displays a list of debates with links to their detail pages.
 */
const DebateList = () => {
  const [debates, setDebates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // In a real application, you would replace this with a call to your Python backend:
    // fetchDebates() 
    //   .then(data => { setDebates(data); setLoading(false); })
    //   .catch(err => { setError(err.message); setLoading(false); });

    // Simulate API call delay with mock data
    setTimeout(() => {
      setDebates(mockDebates);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="debate-list-loading">
        <p>Loading debates... (This is a lightweight component!) </p>
        {/* Placeholder for a simple, attractive loading spinner */}
        <div className="spinner"></div> 
      </div>
    );
  }

  if (error) {
    return <div className="debate-list-error">Error fetching debates: {error}</div>;
  }

  return (
    <div className="debate-list-container">
      <h2>Active Debates</h2>
      {debates.length === 0 ? (
        <p>No active debates at the moment. Be the first to create one!</p>
      ) : (
        <ul className="debate-list">
          {debates.map((debate) => (
            <li key={debate.id} className="debate-list-item">
              {/* Uses the Link component to enable fast, client-side navigation */}
              <Link to={`/debates/${debate.id}`} className="debate-link">
                <h3 className="debate-title">{debate.title}</h3>
                <p className="debate-meta">
                  Creator: {debate.creator} | Participants: 
                  <span className={debate.participants > 100 ? 'high-participants' : ''}>
                    {debate.participants}
                  </span>
                </p>
                <span className="view-details-btn">View Debate →</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default DebateList;