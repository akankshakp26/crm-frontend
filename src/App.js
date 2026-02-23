import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import TasksPage from "./pages/TasksPage";

// Layout & Core Components
import Layout from './components/Layout';
import LoginPage from './components/Login'; 

// Pages
import LeadsPage from './pages/LeadsPage';
import ClientsPage from './pages/ClientsPage';
import Pipeline from './pages/Pipeline';
import Journey from './pages/Journey';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard'; // <-- WE ADDED THIS IMPORT!

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [searchTerm, setSearchTerm] = useState(''); 
  const [user, setUser] = useState({ name: "Akanksha", role: "Frontend Developer", initial: "A" });
  
  const [leads, setLeads] = useState([
    { id: 1, company: 'Alpha Corp', value: 15000, stage: 'Discovery', status: 'New' },
    { id: 2, company: 'Vertex Media', value: 8500, stage: 'Proposal', status: 'Contacted' },
    { id: 3, company: 'Skyline Ltd', value: 22000, stage: 'Negotiation', status: 'Contacted' },
    { id: 4, company: 'Global Solutions', value: 45000, stage: 'Closed Won', status: 'Active' },
    { id: 5, company: 'Nexus Systems', value: 12400, stage: 'Discovery', status: 'New' },
    { id: 6, company: 'Horizon Logistics', value: 31000, stage: 'Proposal', status: 'Contacted' },
  ]);

  const handleLogout = () => setIsAuthenticated(false);

  const filteredLeads = leads.filter(lead => 
    lead.company?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!isAuthenticated ? <LoginPage onLogin={() => setIsAuthenticated(true)} /> : <Navigate to="/" />} />
        <Route path="/*" element={
            isAuthenticated ? (
              <Layout onLogout={handleLogout} user={user} searchTerm={searchTerm} setSearchTerm={setSearchTerm}>
                <Routes>
                  {/* 👇 Now it uses your REAL Dashboard.js file! 👇 */}
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/leads" element={<LeadsPage leads={filteredLeads} setLeads={setLeads} setSelectedLead={setSelectedLead} />} />
                  <Route path="/clients" element={<ClientsPage leads={filteredLeads} />} />
                  <Route path="/pipeline" element={<Pipeline leads={filteredLeads} setLeads={setLeads} user={user} />} />
                  <Route path="/journey" element={<Journey selectedLead={selectedLead} />} />
                  <Route path="/profile" element={<Profile user={user} setUser={setUser} />} />
                  <Route path="/tasks" element={<TasksPage />} />
                </Routes>
              </Layout>
            ) : <Navigate to="/login" />
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;