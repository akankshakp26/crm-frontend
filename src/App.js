import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Layout & Core Components
import Layout from './components/Layout';
import LoginPage from './components/Login'; 

// Pages
import LeadsPage from './pages/LeadsPage';
import ClientsPage from './pages/ClientsPage';
import Pipeline from './pages/Pipeline';
import Journey from './pages/Journey';

// --- IMPROVED DASHBOARD COMPONENT ---
const Dashboard = ({ leads }) => {
  const totalRevenue = leads.reduce((sum, l) => sum + (l.stage === 'Closed Won' ? (Number(l.value) || 0) : 0), 0);
  const activeLeadsCount = leads.filter(l => l.stage !== 'Closed Won').length;

  // Tracking all 4 stages now including Closed Won
  const allStages = ['Discovery', 'Proposal', 'Negotiation', 'Closed Won'];

  const activities = [
    { id: 1, user: "Akanksha", action: "moved Alpha Corp to", target: "Negotiation", time: "2 mins ago" },
    { id: 2, user: "System", action: "auto-assigned new lead", target: "Beta Tech", time: "1 hour ago" },
    { id: 3, user: "Akanksha", action: "closed deal with", target: "Omega Inc", time: "3 hours ago" },
  ];

  return (
    <div className="animate-in fade-in duration-700 text-left">
      <div className="mb-10">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Performance Overview</h1>
        <p className="text-slate-500 mt-2 text-lg italic tracking-tight">Valise CRM • Live System Status</p>
      </div>

      {/* TOP CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest text-center">Active Leads</p>
          <p className="text-5xl font-black text-slate-900 mt-3 text-center">{activeLeadsCount}</p>
        </div>
        <div className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm">
          <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest text-center">Revenue Forecast</p>
          <p className="text-5xl font-black text-slate-900 mt-3 text-center">${totalRevenue.toLocaleString()}</p>
        </div>
        <div className="bg-slate-900 p-10 rounded-[2.5rem] text-white shadow-2xl shadow-slate-200 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full -mr-16 -mt-16"></div>
          <p className="text-slate-400 font-bold text-[10px] uppercase tracking-widest text-center">Market Status</p>
          <p className="text-5xl font-black mt-3 text-center text-blue-400">Bullish</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* RECENT ACTIVITY FEED */}
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

        {/* PIPELINE HEALTH - UPDATED TO INCLUDE CLOSED WON */}
        <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white">
          <h3 className="text-xl font-black mb-6">Pipeline Health</h3>
          <div className="space-y-5">
            {allStages.map(stage => {
              const count = leads.filter(l => l.stage === stage).length;
              const percent = (count / (leads.length || 1)) * 100;
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
          <button className="w-full mt-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-xs font-black uppercase tracking-widest transition-all">
            View Full Analytics
          </button>
        </div>
      </div>
    </div>
  );
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [user, setUser] = useState({ name: "Akanksha", role: "Frontend Developer", initial: "A" });
  
  // Example data with one Closed Won lead to test the UI
  const [leads, setLeads] = useState([
    { id: 1, company: 'Alpha Corp', value: 5000, stage: 'Discovery', status: 'New' },
    { id: 2, company: 'Vertex Media', value: 3000, stage: 'Discovery', status: 'New' },
    { id: 3, company: 'Skyline Ltd', value: 7000, stage: 'Proposal', status: 'Contacted' },
    { id: 4, company: 'Global Solutions', value: 12000, stage: 'Closed Won', status: 'Active' },
  ]);

  return (
    <Router>
      <Routes>
        <Route path="/login" element={!isAuthenticated ? <LoginPage onLogin={() => setIsAuthenticated(true)} /> : <Navigate to="/" />} />
        <Route path="/*" element={
            isAuthenticated ? (
              <Layout onLogout={() => setIsAuthenticated(false)} user={user}>
                <Routes>
                  <Route path="/" element={<Dashboard leads={leads} />} />
                  <Route path="/leads" element={<LeadsPage leads={leads} setLeads={setLeads} setSelectedLead={setSelectedLead} />} />
                  <Route path="/clients" element={<ClientsPage leads={leads} />} />
                  <Route path="/pipeline" element={<Pipeline leads={leads} setLeads={setLeads} />} />
                  <Route path="/journey" element={<Journey selectedLead={selectedLead} />} />
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