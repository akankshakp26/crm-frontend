import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import LeadsPage from './pages/LeadsPage';
import ClientsPage from './pages/ClientsPage';

// Define the Dashboard inside App.js for now to keep it simple
const Dashboard = () => (
  <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
    <h1 className="text-3xl font-bold text-gray-800">Welcome to the CRM</h1>
    <p className="mt-2 text-gray-600">Valise's Workspace. Let's start managing those clients!</p>
  </div>
);

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