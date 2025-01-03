import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import JobList from './components/JobList';
import AddJob from './components/AddJob';
import EditJob from './components/EditJob';
import Login from './components/Login';
import CreateUser from './components/CreateUser';
import './App.css';

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || 'null');
    
    if (token && user) {
      setIsAuthenticated(true);
      setCurrentUser(user);
    } else {
      setIsAuthenticated(false);
      setCurrentUser(null);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setCurrentUser(null);
    window.location.href = '/login';
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow-sm">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center">
              {/* Left section */}
              <div className="w-1/3">
                {currentUser?.userType === 1 && (
                  <Link
                    to="/create-user"
                    className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700"
                  >
                    Manage Users
                  </Link>
                )}
              </div>

              {/* Center section */}
              <div className="w-1/3 flex justify-center">
                <Link 
                  to="/" 
                  className="text-2xl font-bold text-gray-900 hover:text-blue-600 transition-colors text-center"
                >
                  Job Applications Tracker
                </Link>
              </div>

              {/* Right section */}
              <div className="w-1/3 flex justify-end">
                {isAuthenticated && currentUser && (
                  <div className="flex items-center space-x-4">
                    <span className="text-gray-600">
                      Welcome, {currentUser.username}
                      {currentUser.userType === 1 ? ' (Admin)' : ''}
                    </span>
                    <button
                      onClick={handleLogout}
                      className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>
        
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Routes>
            <Route 
              path="/login" 
              element={
                <Login 
                  setIsAuthenticated={setIsAuthenticated} 
                  setCurrentUser={setCurrentUser}
                />
              } 
            />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <JobList />
                </ProtectedRoute>
              }
            />
            <Route
              path="/add-job"
              element={
                <ProtectedRoute>
                  <AddJob />
                </ProtectedRoute>
              }
            />
            <Route
              path="/edit-job/:id"
              element={
                <ProtectedRoute>
                  <EditJob />
                </ProtectedRoute>
              }
            />
            <Route
              path="/create-user"
              element={
                <ProtectedRoute>
                  {currentUser?.userType === 1 ? <CreateUser /> : <Navigate to="/" replace />}
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
