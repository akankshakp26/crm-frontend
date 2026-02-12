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
import InteractionLogs from './components/InteractionLogs';
import RecentActivity from './components/RecentActivity';

// --- 1. DASHBOARD COMPONENT ---
// This is the inner view that shows your charts and stats
const Dashboard = () => {
  return (
    <div className="animate-in fade-in duration-700">
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Performance Overview</h1>
        <p className="text-slate-500 mt-2 text-lg italic">Valise CRM • Live System Status</p>
      </div>
      
      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <p className="text-slate-400 font-bold text-xs uppercase tracking-widest text-center">Active Leads</p>
          <p className="text-4xl font-black text-slate-900 mt-2 text-center">2,842</p>
        </div>
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <p className="text-slate-400 font-bold text-xs uppercase tracking-widest text-center">Lead-to-Client Rate</p>
          <p className="text-4xl font-black text-slate-900 mt-2 text-center">32.4%</p>
        </div>
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
          <p className="text-slate-400 font-bold text-xs uppercase tracking-widest text-center">Revenue Forecast</p>
          <p className="text-4xl font-black text-slate-900 mt-2 text-center">$42,500</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white h-full relative overflow-hidden flex flex-col justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-4">Strategic Insights</h2>
              <p className="text-slate-400 text-lg leading-relaxed">
                Your high-priority leads have increased by 12% this week. Focus on the "Negotiation" stage in your pipeline to hit Q1 targets.
              </p>
            </div>
            <div className="mt-10">
               <InteractionLogs />
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <RecentActivity />
        </div>
      </div>
    </div>
  );
};

// --- 2. MAIN APP COMPONENT ---
function App() {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <Routes>
        {/* PUBLIC ROUTE: Sliding Login Page */}
        {/* If logged in, automatically redirects to home (/) */}
        <Route 
          path="/login" 
          element={!isAuthenticated ? <LoginPage onLogin={handleLogin} /> : <Navigate to="/" />} 
        />

        {/* PROTECTED ROUTES: Wrapped in Layout */}
        <Route 
          path="/*" 
          element={
            isAuthenticated ? (
              <Layout onLogout={handleLogout}>
                <Routes>
                  {/* Dashboard - Central performance hub */}
                  <Route path="/" element={<Dashboard />} />
                  
                  {/* Core Lifecycle Management Pages */}
                  <Route path="/leads" element={<LeadsPage />} />
                  <Route path="/clients" element={<ClientsPage />} />
                  <Route path="/pipeline" element={<Pipeline />} />
                  <Route path="/journey" element={<Journey />} />
                  
                  {/* Fallback 404 route */}
                  <Route path="*" element={
                    <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-400 bg-white rounded-[2rem] border-2 border-dashed border-slate-200">
                      <p className="text-xl font-bold">404 - Module Under Development</p>
                      <p className="mt-2 text-sm">Feature scheduled for the next implementation sprint.</p>
                    </div>
                  } />
                </Routes>
              </Layout>
            ) : (
              // Not authenticated? Kick back to login
              <Navigate to="/login" />
            )
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;