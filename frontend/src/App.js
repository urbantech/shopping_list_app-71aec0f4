import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate } from 'react-router-dom';
import { AINativeProvider, useAINativeAuth } from '@ainative/react-sdk';
import ItemCreation from './components/ItemCreation';
import ItemCheckOff from './components/ItemCheckOff';
import ItemDeletion from './components/ItemDeletion';
import ListItems from './components/ListItems';
import Login from './components/Login';

const App = () => {
  const [loading, setLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('ainative_token');
    if (token) {
      setIsLoggedIn(true);
    }
    setLoading(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('ainative_token');
    setIsLoggedIn(false);
  };

  const ProtectedRoute = ({ children }) => {
    if (loading) return <div>Loading...</div>;
    if (!isLoggedIn) return <Navigate to="/login" replace />;
    return children;
  };

  return (
    <AINativeProvider apiKey={process.env.REACT_APP_AINATIVE_API_KEY || ''}>
      <BrowserRouter>
        <nav className="bg-dark-navy text-white p-4">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-xl font-bold">Shopping List App</h1>
            <ul className="flex space-x-4">
              {isLoggedIn && (
                <>
                  <li>
                    <Link to="/create" className="hover:text-gray-200">Create Item</Link>
                  </li>
                  <li>
                    <Link to="/check-off" className="hover:text-gray-200">Check Off Items</Link>
                  </li>
                  <li>
                    <Link to="/delete" className="hover:text-gray-200">Delete Items</Link>
                  </li>
                  <li>
                    <Link to="/list" className="hover:text-gray-200">List Items</Link>
                  </li>
                  <li>
                    <button onClick={handleLogout} className="hover:text-gray-200">Logout</button>
                  </li>
                </>
              )}
            </ul>
          </div>
        </nav>
        <main className="p-4">
          <Routes>
            <Route path="/login" element={<Login onLoginSuccess={() => setIsLoggedIn(true)} />} />
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/create" element={<ProtectedRoute><ItemCreation /></ProtectedRoute>} />
            <Route path="/check-off" element={<ProtectedRoute><ItemCheckOff /></ProtectedRoute>} />
            <Route path="/delete" element={<ProtectedRoute><ItemDeletion /></ProtectedRoute>} />
            <Route path="/list" element={<ProtectedRoute><ListItems /></ProtectedRoute>} />
          </Routes>
        </main>
      </BrowserRouter>
    </AINativeProvider>
  );
};

export default App;