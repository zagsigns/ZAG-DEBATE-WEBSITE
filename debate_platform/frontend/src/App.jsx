import { Routes, Route } from 'react-router-dom';
import PrivateRoute from './components/PrivateRoute';
// Import pages you will create next:
import LoginPage from './pages/Auth/LoginPage'; 
import RegisterPage from './pages/Auth/RegisterPage'; 
import UserDashboard from './pages/Dashboard/UserDashboard'; 
// import Header from './components/Header'; // Create a simple header later

function App() {
  return (
    // <Header /> 
    <main className="min-h-screen bg-gray-100 p-4">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomeComponent />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Protected Routes (for all users) */}
        <Route path="/dashboard" element={<PrivateRoute><UserDashboard /></PrivateRoute>} />
        {/* Further protected routes for debates, payments, profile... */}
        
        {/* You will later add an AdminRoute wrapper for /admin-dashboard */}
      </Routes>
    </main>
  );
}

// Simple Home Component for demonstration
const HomeComponent = () => (
    <div className="flex items-center justify-center h-full pt-20">
        <h1 className="text-4xl font-extrabold text-indigo-700">ZAG Debate Platform - Home</h1>
    </div>
);

export default App;


// ... existing imports ...
import DebateDetailPage from './pages/Debates/DebateDetailPage'; // Import new component

function App() {
  return (
    // <Header /> 
    <main className="min-h-screen bg-gray-100 p-4">
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomeComponent />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Protected Routes (for all users) */}
        <Route path="/dashboard" element={<PrivateRoute><UserDashboard /></PrivateRoute>} />
        
        {/* Debate Routes (Protected) */}
        <Route path="/debates/:id" element={<PrivateRoute><DebateDetailPage /></PrivateRoute>} /> 
        {/* You will add /debates/create later */}
        
        {/* You will later add an AdminRoute wrapper for /admin-dashboard */}
      </Routes>
    </main>
  );
}
// ... HomeComponent and export ...


// ... existing imports ...
import CreateDebatePage from './pages/Debates/CreateDebatePage'; // Import new component

function App() {
  return (
    // ...
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomeComponent />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Protected Routes (for all users) */}
        <Route path="/dashboard" element={<PrivateRoute><UserDashboard /></PrivateRoute>} />
        
        {/* Debate Routes (Protected) */}
        <Route path="/debates/create" element={<PrivateRoute><CreateDebatePage /></PrivateRoute>} /> {/* NEW */}
        <Route path="/debates/:id" element={<PrivateRoute><DebateDetailPage /></PrivateRoute>} /> 
        
        {/* You will later add an AdminRoute wrapper for /admin-dashboard */}
      </Routes>
    </main>
  );
}
// ... HomeComponent and export ...

// ... existing imports ...
import ProfilePage from './pages/Auth/ProfilePage'; // NEW IMPORT

function App() {
  return (
    // ...
      <Routes>
        {/* ... existing public routes ... */}
        
        {/* Protected Routes (for all users) */}
        <Route path="/dashboard" element={<PrivateRoute><UserDashboard /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} /> {/* NEW */}
        
        {/* ... existing debate routes ... */}
      </Routes>
    </main>
  );
}
// ...

// ... existing imports ...
import AdminRoute from './components/AdminRoute'; // NEW IMPORT
import AdminDashboard from './pages/Dashboard/AdminDashboard'; // NEW IMPORT

function App() {
  return (
    // ...
      <Routes>
        {/* ... existing routes ... */}
        
        {/* Protected Admin Route */}
        <Route path="/admin-panel" element={<PrivateRoute><AdminRoute><AdminDashboard /></AdminRoute></PrivateRoute>} />
        
      </Routes>
    </main>
  );
}
// ...