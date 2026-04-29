import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import CaregiverPanel from './pages/CaregiverPanel';
import AdminPanel from './pages/AdminPanel';
import Profile from './pages/Profile';
import PatientView from './pages/PatientView';
import Landing from './pages/Landing'; // Added Landing page
import './index.css';

// Protected Route wrapper
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { currentUser, userRole } = useAuth();

  if (!currentUser) {
    return <Navigate to="/login" />;
  }

  // If role is specified and user role doesn't match
  // For 'admin' role, only admin can access
  // For 'caregiver', admin and caregiver can access
  if (allowedRoles && userRole && !allowedRoles.includes(userRole)) {
    // Redirect to default dashboard based on their role
    if (userRole === 'patient') return <Navigate to="/dashboard" />;
    if (userRole === 'caregiver') return <Navigate to="/caregiver" />;
    if (userRole === 'admin') return <Navigate to="/admin" />;
  }

  return children;
};

// Main Router
function AppRoutes() {
  const { currentUser, userRole } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={currentUser ? <Navigate to="/" /> : <Login />} />
      <Route path="/register" element={currentUser ? <Navigate to="/" /> : <Register />} />
      
      <Route path="/dashboard" element={
        <ProtectedRoute allowedRoles={['patient', 'admin']}>
          <Dashboard />
        </ProtectedRoute>
      } />

      <Route path="/caregiver" element={
        <ProtectedRoute allowedRoles={['caregiver', 'admin']}>
          <CaregiverPanel />
        </ProtectedRoute>
      } />

      <Route path="/admin" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <AdminPanel />
        </ProtectedRoute>
      } />

      <Route path="/profile" element={
        <ProtectedRoute allowedRoles={['patient', 'caregiver', 'admin']}>
          <Profile />
        </ProtectedRoute>
      } />

      {/* Patient View for Caregivers */}
      <Route path="/patient/:patientId" element={
        <ProtectedRoute allowedRoles={['caregiver', 'admin']}>
          <PatientView />
        </ProtectedRoute>
      } />

      {/* Default Route Logic */}
      <Route path="/" element={
        !currentUser ? <Landing /> :
        userRole === 'caregiver' ? <Navigate to="/caregiver" /> :
        userRole === 'admin' ? <Navigate to="/admin" /> :
        <Navigate to="/dashboard" />
      } />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
