import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import JobList from './components/JobList';
import 'antd/dist/reset.css';

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  const isAuthenticated = () => {
    return localStorage.getItem('token') !== null;
  };

  const PrivateRoute = ({ children }) => {
    return isAuthenticated() ? children : <Navigate to="/login" />;
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route 
            path="/jobs" 
            element={
              <ProtectedRoute>
                <JobList />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/" 
            element={<PrivateRoute>
              <JobList />
            </PrivateRoute>} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
