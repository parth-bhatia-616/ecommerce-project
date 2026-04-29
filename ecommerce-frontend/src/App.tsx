import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import Navbar from './components/Navbar';
import Login from './components/Login';
import Register from './components/Register';
import Main from './components/Main';
import Products from './components/Products';
import Cart from './components/Cart';
import Profile from './components/Profile';
import ApiTest from './components/ApiTest';
import './styles/globals.css';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const token = localStorage.getItem('vertexToken');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

// Public Route Component (hide navbar for auth pages)
const PublicRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="App">
          {/* Routes with Navbar */}
          <Routes>
            <Route 
              path="/main" 
              element={
                <>
                  <Navbar />
                  <ProtectedRoute>
                    <Main />
                  </ProtectedRoute>
                </>
              } 
            />
            <Route 
              path="/products" 
              element={
                <>
                  <Navbar />
                  <ProtectedRoute>
                    <Products />
                  </ProtectedRoute>
                </>
              } 
            />
            <Route 
              path="/cart" 
              element={
                <>
                  <Navbar />
                  <ProtectedRoute>
                    <Cart />
                  </ProtectedRoute>
                </>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <>
                  <Navbar />
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                </>
              } 
            />
            <Route 
              path="/test" 
              element={
                <>
                  <Navbar />
                  <ApiTest />
                </>
              } 
            />
            
            {/* Routes without Navbar */}
            <Route 
              path="/login" 
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              } 
            />
            <Route 
              path="/register" 
              element={
                <PublicRoute>
                  <Register />
                </PublicRoute>
              } 
            />
            
            {/* Default redirect */}
            <Route path="/" element={<Navigate to="/main" replace />} />
          </Routes>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;
