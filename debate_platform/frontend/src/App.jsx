// frontend/src/App.jsx

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Your existing components
import DebateList from './components/DebateList'; 
import ProfileInfo from './components/ProfileInfo'; 
import Header from './components/Header';

// Placeholder Pages (we will add code to these later)
const LoginPage = () => <div><Header /><h2 style={{ padding: '20px' }}>User Login</h2></div>;
const RegisterPage = () => <div><Header /><h2 style={{ padding: '20px' }}>User Registration</h2></div>;
const DebateDetailPage = () => <div><Header /><h2 style={{ padding: '20px' }}>Debate Detail (ID:...)</h2></div>;
const AdminDashboard = () => <div><Header /><h2 style={{ padding: '20px' }}>Admin Dashboard (Full Control)</h2></div>;
const CreateDebatePage = () => <div><Header /><h2 style={{ padding: '20px' }}>Create New Debate</h2></div>;

// Main Pages combining components
const HomePage = () => (
  <div>
    <Header />
    <div style={{ padding: '22px' }}>
      <h1>Welcome to ZAG Debate</h1>
      <p>Join or start a professional debate now.</p>
      <DebateList />
    </div>
  </div>
);

const UserDashboard = () => (
  <div>
    <Header />
    <div style={{ padding: '22px' }}>
      <h1>User Dashboard</h1>
      <ProfileInfo /> 
      <h2 style={{ marginTop: '20px' }}>My Active Debates</h2>
    </div>
  </div>
);

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/debates/:id" element={<DebateDetailPage />} />
          <Route path="/create-debate" element={<CreateDebatePage />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;