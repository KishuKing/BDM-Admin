import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import DoctorVerification from './pages/DoctorVerification';
import VendorVerification from './pages/VendorVerification';
import UserProfile from './pages/UserProfile';
import Analytics from './pages/Analytics';
import ApprovedUsers from './pages/ApprovedUsers';
import Layout from './components/Layout';
import VendorProfile from './pages/VendorProfile';

// Simple PrivateRoute wrapper
const PrivateRoute = ({ children }) => {
  const userInfo = localStorage.getItem('userInfo');
  return userInfo ? children : <Navigate to="/login" replace />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        {/* Protected Dashboard Routes wrapped in Layout */}
        <Route 
          path="/" 
          element={
            <PrivateRoute>
              <Layout title="Dashboard" />
            </PrivateRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="doctors" element={<DoctorVerification />} />
          <Route path="vendors" element={<VendorVerification />} />
          <Route path="doctor/:id" element={<UserProfile />} />
          <Route path="vendor/:id" element={<VendorProfile />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="users/approved" element={<ApprovedUsers />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
