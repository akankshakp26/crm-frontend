// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard'; // Import the dedicated Dashboard page
import LeadsPage from './pages/LeadsPage';
import ClientsPage from './pages/ClientsPage';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/leads" element={<LeadsPage />} />
          <Route path="/clients" element={<ClientsPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;