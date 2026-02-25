import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import TasksPage from "./pages/TasksPage";
import axiosInstance from "./api/axiosInstance";
import ProtectedRoute from "./components/ProtectedRoute";

// Layout & Core Components
import Layout from './components/Layout';
import LoginPage from './components/Login'; 

// Pages
import LeadsPage from './pages/LeadsPage';
import ClientsPage from './pages/ClientsPage';
import Pipeline from './pages/Pipeline';
import Journey from './pages/Journey';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard'; // <-- YOUR DASHBOARD IMPORT

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );

  const [selectedLead, setSelectedLead] = useState(null);
  const [searchTerm, setSearchTerm] = useState(''); // SEARCH STATE
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const token = localStorage.getItem("token");

    if (token && storedUser) {
      setIsAuthenticated(true);
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const [leads, setLeads] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await axiosInstance.get("/dashboard");
        setLeads(res.data);
      } catch (error) {
        console.error("Dashboard fetch error:", error.response?.data);
      }
    };

    if (localStorage.getItem("token")) {
      fetchDashboardData();
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setUser(null);
  };

  const filteredLeads = leads.filter(lead => 
    lead.company?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={
            !isAuthenticated 
              ? <LoginPage onLogin={handleLogin} /> 
              : <Navigate to="/" />
          } 
        />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Layout
                onLogout={handleLogout}
                user={user}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
              >
                <Routes>
                  {/* 👇 Your REAL Dashboard.js file! 👇 */}
                  <Route path="/" element={<Dashboard />} />
                 <Route 
  path="/leads" 
  element={
    <LeadsPage
      leads={filteredLeads} // Pass the filtered list here
      setLeads={setLeads}
      user={user}
    />
  }
/>
                   
                  <Route path="/clients" element={<ClientsPage leads={filteredLeads} />} />
                  <Route path="/pipeline" element={<Pipeline leads={filteredLeads} setLeads={setLeads} user={user} />} />
                  <Route path="/journey" element={<Journey selectedLead={selectedLead} />} />
                  <Route path="/profile" element={<Profile user={user} setUser={setUser} />} />
                  <Route path="/tasks" element={<TasksPage />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;