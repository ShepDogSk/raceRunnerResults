import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Categories from './pages/Categories';
import CategoryForm from './pages/CategoryForm';
import Runners from './pages/Runners';
import RunnerForm from './pages/RunnerForm';
import TagAssignment from './pages/TagAssignment';
import NfcLogs from './pages/NfcLogs';
import RaceResults from './pages/RaceResults';
import Header from './components/Header';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  
  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem('token');
    console.log('App initialization - Token exists:', !!token);
    
    if (token) {
      setIsAuthenticated(true);
      console.log('User authenticated on app load');
    } else {
      console.log('No authentication token found on app load');
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
  };

  return (
    <div className="app">
      <Header isAuthenticated={isAuthenticated} onLogout={handleLogout} />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<RaceResults />} />
          <Route path="/results" element={<RaceResults />} />
          <Route path="/login" element={
            isAuthenticated ? <Navigate to="/admin/dashboard" /> : <Login setIsAuthenticated={setIsAuthenticated} />
          } />
          <Route path="/admin/dashboard" element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/categories" element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Categories />
            </ProtectedRoute>
          } />
          <Route path="/admin/categories/new" element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <CategoryForm />
            </ProtectedRoute>
          } />
          <Route path="/admin/categories/edit/:id" element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <CategoryForm />
            </ProtectedRoute>
          } />
          <Route path="/admin/runners" element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Runners />
            </ProtectedRoute>
          } />
          <Route path="/admin/runners/new" element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <RunnerForm />
            </ProtectedRoute>
          } />
          <Route path="/admin/runners/edit/:id" element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <RunnerForm />
            </ProtectedRoute>
          } />
          <Route path="/admin/tags" element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <TagAssignment />
            </ProtectedRoute>
          } />
          <Route path="/admin/nfc-logs" element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <NfcLogs />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

export default App;
