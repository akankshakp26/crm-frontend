import React, { useState, useEffect } from 'react';
import TasksPage from "./pages/TasksPage";

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Layout & Core Components
import Layout from './components/Layout';
import LoginPage from './components/Login'; 

// Pages
import LeadsPage from './pages/LeadsPage';
import ClientsPage from './pages/ClientsPage';
import Pipeline from './pages/Pipeline';
import Journey from './pages/Journey';
import Profile from './pages/Profile';

// --- FULL DASHBOARD COMPONENT ---
const Dashboard = ({ leads }) => {
  const totalRevenue = leads.reduce((sum, l) => sum + (l.stage === 'Closed Won' ? (Number(l.value) || 0) : 0), 0);
  const activeLeadsCount = leads.filter(l => l.stage !== 'Closed Won').length;
  const allStages = ['Discovery', 'Proposal', 'Negotiation', 'Closed Won'];

  // Data to fill the "empty" space
  const activities = [
    { id: 1, user: "Akanksha", action: "updated pipeline for", target: "Alpha Corp", time: "2 mins ago" },
    { id: 2, user: "System", action: "synchronized leads with", target: "Main Server", time: "1 hour ago" },
    { id: 3, user: "Akanksha", action: "generated report for", target: "Q1 Forecast", time: "3 hours ago" },
  ];

  return (
    <div className="animate-in fade-in duration-700 text-left">
      <div className="mb-10">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Performance Overview</h1>
        <p className="text-slate-500 mt-2 text-lg italic tracking-tight">Valise CRM • Live System Status</p>
      </div>

      {/* TOP KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest text-center">Active Leads</p>
          <p className="text-5xl font-black text-slate-900 mt-3 text-center">{activeLeadsCount}</p>
        </div>
        <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest text-center">Revenue Forecast</p>
          <p className="text-5xl font-black text-slate-900 mt-3 text-center">${totalRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-slate-900 p-10 rounded-[2.5rem] text-white shadow-2xl relative overflow-hidden">
          <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest text-center">Market Status</p>
          <p className="text-5xl font-black mt-3 text-center text-blue-400">Bullish</p>
        </div>
      </div>

      {/* RECENT ACTIVITY & PIPELINE HEALTH */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <h3 className="text-xl font-black text-slate-900 mb-6">Recent Activity</h3>
          <div className="space-y-6">
            {activities.map(act => (
              <div key={act.id} className="flex items-center gap-4 border-b border-slate-50 pb-4 last:border-0">
                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 font-bold text-xs">{act.user[0]}</div>
                <div>
                  <p className="text-sm font-medium text-slate-600">
                    <span className="font-bold text-slate-900">{act.user}</span> {act.action} <span className="text-blue-600 font-bold">{act.target}</span>
                  </p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">{act.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white">
          <h3 className="text-xl font-black mb-6">Pipeline Health</h3>
          <div className="space-y-5">
            {allStages.map(stage => {
              const count = leads.filter(l => l.stage === stage).length;
              const percent = (leads.length > 0) ? (count / leads.length) * 100 : 0;
              return (
                <div key={stage}>
                  <div className="flex justify-between text-[10px] font-black uppercase tracking-widest mb-2 text-slate-400">
                    <span>{stage}</span>
                    <span>{count} Leads</span>
                  </div>
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-1000 ${stage === 'Closed Won' ? 'bg-emerald-400' : 'bg-blue-500'}`} 
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [searchTerm, setSearchTerm] = useState(''); // SEARCH STATE
  const [user, setUser] = useState({ name: "Akanksha", role: "Frontend Developer", initial: "A" });
  
  // Inside your App component in App.js
const [leads, setLeads] = useState([
  { id: 1, company: 'Alpha Corp', value: 15000, stage: 'Discovery', status: 'New' },
  { id: 2, company: 'Vertex Media', value: 8500, stage: 'Proposal', status: 'Contacted' },
  { id: 3, company: 'Skyline Ltd', value: 22000, stage: 'Negotiation', status: 'Contacted' },
  { id: 4, company: 'Global Solutions', value: 45000, stage: 'Closed Won', status: 'Active' },
  { id: 5, company: 'Nexus Systems', value: 12400, stage: 'Discovery', status: 'New' },
  { id: 6, company: 'Horizon Logistics', value: 31000, stage: 'Proposal', status: 'Contacted' },
]);

  const handleLogout = () => setIsAuthenticated(false);

  // Filter leads globally based on the search bar in the header
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
                  <Route path="/" element={<Dashboard leads={filteredLeads} />} />
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