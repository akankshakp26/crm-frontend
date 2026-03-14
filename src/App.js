import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import axiosInstance from "./api/axiosInstance";
import Layout from './components/Layout';
import LoginPage from './components/Login';
import ProtectedRoute from "./components/ProtectedRoute";
import ClientProtectedRoute from "./components/ClientProtectedRoute";
import ClientDashboard from './pages/ClientDashboard';
import Profile from './pages/Profile';
import Dashboard from './pages/Dashboard';
import LeadsPage from './pages/LeadsPage';
import Pipeline from './pages/Pipeline';
import ClientsPage from './pages/ClientsPage';
import Journey from './pages/Journey';
import TasksPage from './pages/TasksPage';
import ProjectsPage from './pages/ProjectsPage';
import ProjectDetailsPage from './pages/ProjectDetailsPage';


function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user") || "null"));
  const [leads, setLeads] = useState([]);
  const [selectedLead, setSelectedLead] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [isClientAuthenticated, setIsClientAuthenticated] = useState(!!localStorage.getItem("clientToken"));

  const fetchLeads = async () => {
    try {
      const res = await axiosInstance.get("/leads");
      // ✅ amounts come from backend (calculated from projects)
      const formatted = res.data.map(l => ({
        id: l._id,
        company: l.company || l.name,
        email: l.email,
        username: l.username || "",
        password: l.password || "",
        totalAmount: l.totalAmount || 0,
        amountPaid: l.amountPaid || 0,
        remaining: l.remaining || 0,
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

        <Route
          path="/login"
          element={
            isAuthenticated
              ? <Navigate to="/" />
              : isClientAuthenticated
                ? <Navigate to="/client/dashboard" />
                : <LoginPage
                    onLogin={(u) => { setUser(u); setIsAuthenticated(true); }}
                    onClientLogin={() => { setIsClientAuthenticated(true); }}
                  />
          }
        />

        <Route
          path="/client/dashboard"
          element={
            <ClientProtectedRoute>
              <ClientDashboard
                onClientLogout={() => {
                  localStorage.removeItem("clientToken");
                  localStorage.removeItem("clientUser");
                  setIsClientAuthenticated(false);
                }}
              />
            </ClientProtectedRoute>
          }
        />

        <Route path="/*" element={
          <ProtectedRoute>
            <Layout
              onLogout={() => { localStorage.clear(); setIsAuthenticated(false); }}
              user={user}
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
            >
              <Routes>
                <Route path="/" element={<Dashboard leads={leads} />} />
                <Route path="/leads" element={
                  <LeadsPage
                    leads={filteredLeads}
                    setLeads={setLeads}
                    setSelectedLead={setSelectedLead}
                    user={user}
                    refresh={fetchLeads}
                  />}
                />
                <Route path="/pipeline" element={
                  <Pipeline setSelectedProject={setSelectedProject} />}
                />
                <Route path="/clients" element={<ClientsPage />} />
                <Route path="/projects/:clientId" element={<ProjectsPage />} />
                <Route path="/project/:projectId" element={<ProjectDetailsPage />} />
                <Route path="/journey" element={
                  <Journey
                    selectedLead={selectedLead}
                    selectedProject={selectedProject}
                  />}
                />
                <Route path="/tasks" element={<TasksPage />} />
                <Route path="/profile" element={<Profile user={user} setUser={setUser} />} />
              </Routes>
            </Layout>
          </ProtectedRoute>
        } />

      </Routes>
    </Router>
  );
}

export default App;
