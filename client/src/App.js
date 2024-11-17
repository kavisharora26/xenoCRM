import React, { useState, useEffect, createContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/Layout/MainLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import CustomerList from './pages/CustomerList';
import SegmentList from './components/Segments/SegmentList';
import SegmentDetail from './components/Segments/SegmentDetail';
import CreateSegment from './components/Segments/CreateSegment';
import EditSegment from './components/Segments/EditSegment';
import CampaignList from './components/Campaigns/CampaignList';
import CreateCampaign from './components/Campaigns/CreateCampaign';
import CampaignDetails from './components/Campaigns/CampaignDetail';

export const AuthContext = createContext(null);

const App = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const response = await fetch('https://crm-gc6q.onrender.com/auth/status', {
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Auth check failed');
      }

      const data = await response.json();
      
      if (data.authenticated && data.user) {
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
      } else {
        setUser(null);
        localStorage.removeItem('user');
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setUser(null);
      localStorage.removeItem('user');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      const response = await fetch('https://crm-gc6q.onrender.com/auth/logout', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Logout failed');
      }

      setUser(null);
      localStorage.removeItem('user');
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const ProtectedRoute = ({ children }) => {
    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-screen">
          <div className="loading-spinner"></div>
          <p className="ml-2">Loading...</p>
        </div>
      );
    }
    
    if (!user) {
      return <Navigate to="/login" replace />;
    }
    
    return <MainLayout>{children}</MainLayout>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loading-spinner"></div>
        <p className="ml-2">Loading application...</p>
      </div>
    );
  }

  return (
    <AuthContext.Provider value={{ user, setUser, checkAuth, handleLogout }}>
      <Router>
        <Routes>
          
          <Route 
            path="/login" 
            element={user ? <Navigate to="/dashboard" replace /> : <Login />} 
          />


          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/customers"
            element={
              <ProtectedRoute>
                <CustomerList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/segments"
            element={
              <ProtectedRoute>
                <SegmentList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/segments/create"
            element={
              <ProtectedRoute>
                <CreateSegment />
              </ProtectedRoute>
            }
          />
          <Route
            path="/campaigns"
            element={
              <ProtectedRoute>
                <CampaignList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/campaigns/create"
            element={
              <ProtectedRoute>
                <CreateCampaign />
              </ProtectedRoute>
            }
          />
          <Route
            path="/segments/:id"
            element={
              <ProtectedRoute>
                <SegmentDetail />
              </ProtectedRoute>
            }
          />
          <Route path="/segments/edit/:id" element={<EditSegment />} />
          <Route path="/campaigns/:id" element={<CampaignDetails />} />
          <Route
            path="/"
            element={
              <Navigate to={user ? "/dashboard" : "/login"} replace />
            }
          />

          <Route
            path="*"
            element={
              <div className="flex flex-col items-center justify-center min-h-screen">
                <h1 className="text-2xl font-bold mb-4">404 - Page Not Found</h1>
                <button 
                  onClick={() => window.history.back()}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Go Back
                </button>
              </div>
            }
          />
        </Routes>
      </Router>
    </AuthContext.Provider>
  );
};

export default App;