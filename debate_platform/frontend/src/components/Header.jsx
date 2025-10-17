import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  // Simple styling for a clean, lightweight look
  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 20px',
    borderBottom: '1px solid #eee',
    marginBottom: '20px',
    backgroundColor: 'white',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)' 
  };
  
  const navStyle = { 
    display: 'flex', 
    alignItems: 'center', // Align items vertically in the nav
    gap: '15px' 
  };
  
  const linkStyle = { 
    textDecoration: 'none', 
    color: '#0056b3', 
    fontWeight: '500' 
  };

  // Updated style for better visibility
  const buttonStyle = {
    textDecoration: 'none',
    color: 'white',
    fontWeight: 'bold',
    backgroundColor: '#dc3545', // Changed to a bright red for emphasis
    padding: '8px 15px',
    borderRadius: '5px',
    marginLeft: '10px', 
    boxShadow: '0 4px 8px rgba(220, 53, 69, 0.5)', // Added a stronger shadow
    transition: 'background-color 0.3s, transform 0.1s',
    cursor: 'pointer',
  };

  return (
    <header style={headerStyle}>
      <Link to="/" style={{ fontSize: '1.5em', fontWeight: 'bold', color: '#1a73e8', textDecoration: 'none' }}>
        ZAG Debate
      </Link>
      <nav style={navStyle}>
        <Link to="/dashboard" style={linkStyle}>Dashboard</Link>
        <Link to="/create-debate" style={linkStyle}>Create Debate</Link>
        <Link to="/login" style={linkStyle}>Login</Link>
        {/* Apply buttonStyle to make the Register link look like a button */}
        <Link to="/register" style={buttonStyle}>Register</Link>
      </nav>
    </header>
  );
};

export default Header;
