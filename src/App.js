import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import axiosInstance from "./api/axiosInstance";
import Layout from './components/Layout';
import LoginPage from './components/Login';
import ProtectedRoute from "./components/ProtectedRoute";

import Dashboard from './pages/Dashboard';
import LeadsPage from './pages/LeadsPage';
import Pipeline from './pages/Pipeline';
import ClientsPage from './pages/ClientsPage';
import Journey from './pages/Journey';
import TasksPage from './pages/TasksPage';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user") || "null"));
  const [leads, setLeads] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchLeads = async () => {
    try {
      const res = await axiosInstance.get("/leads");
      const formatted = res.data.map(l => ({
        id: l._id,
        company: l.name,
        email: l.email,
        value: l.value || 0,
        status: l.status || "New",
        history: l.history || []
      }));
      setLeads(formatted);
    } catch (err) { console.error("Sync Error", err); }
  };

  useEffect(() => { if (isAuthenticated) fetchLeads(); }, [isAuthenticated]);

  const filteredLeads = leads.filter(l => l.company?.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <Router>
      <Toaster position="top-right" />
      <Routes>
        <Route path="/login" element={!isAuthenticated ? <LoginPage onLogin={(u) => {setUser(u); setIsAuthenticated(true);}} /> : <Navigate to="/" />} />
        <Route path="/*" element={
          <ProtectedRoute>
            <Layout onLogout={() => {localStorage.clear(); setIsAuthenticated(false);}} user={user} searchTerm={searchTerm} setSearchTerm={setSearchTerm}>
              <Routes>
                <Route path="/" element={<Dashboard leads={leads} />} />
                <Route path="/leads" element={<LeadsPage leads={filteredLeads} setLeads={setLeads} setSelectedLead={setSelectedLead} user={user} refresh={fetchLeads} />} />
                <Route path="/pipeline" element={<Pipeline leads={leads} setLeads={setLeads} refresh={fetchLeads} />} />
                <Route path="/clients" element={<ClientsPage leads={leads.filter(l => l.status === 'Confirmed')} />} />
                <Route path="/journey" element={<Journey selectedLead={selectedLead} />} />
                <Route path="/tasks" element={<TasksPage />} />
              </Routes>
            </Layout>
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}
export default App;