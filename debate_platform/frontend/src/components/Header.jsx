// frontend/src/components/Header.jsx

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
  const navStyle = { display: 'flex', gap: '15px' };
  const linkStyle = { textDecoration: 'none', color: '#0056b3', fontWeight: '500' };

  return (
    <header style={headerStyle}>
      <Link to="/" style={{ fontSize: '1.5em', fontWeight: 'bold', color: '#1a73e8', textDecoration: 'none' }}>
        ZAG Debate
      </Link>
      <nav style={navStyle}>
        <Link to="/dashboard" style={linkStyle}>Dashboard</Link>
        <Link to="/create-debate" style={linkStyle}>Create Debate</Link>
        <Link to="/login" style={linkStyle}>Login</Link>
        <Link to="/register" style={linkStyle}>Register</Link>
      </nav>
    </header>
  );
};

export default Header;