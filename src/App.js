import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Global Layout & Components
import Layout from './components/Layout';
import RecentActivity from './components/RecentActivity';

// Feature Pages (Ensure these files exist in your 'src/pages' folder)
import LeadsPage from './pages/LeadsPage';
import ClientsPage from './pages/ClientsPage';
import Pipeline from './pages/Pipeline';
import Journey from './pages/Journey';

/**
 * Integrated Dashboard Component
 * Fulfills requirements for: Admin Dashboard, Client performance reports, 
 * and Audit logs for client activity.
 */
const Dashboard = () => {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      <div className="mb-10">
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Performance Overview</h1>
        <p className="text-slate-500 mt-2 text-lg italic">Welcome back! Here's a summary of Valise's CRM activities.</p>
      </div>
      
      {/* Performance Stats - High-level metrics for managers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300">
          <p className="text-slate-400 font-bold text-xs uppercase tracking-widest text-center">Active Leads</p>
          <p className="text-4xl font-black text-slate-900 mt-2 tracking-tighter text-center">2,842</p>
          <div className="mt-4 mx-auto text-sm font-bold text-green-500 bg-green-50 w-fit px-3 py-1 rounded-full text-center">↑ 14% Growth</div>
        </div>
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300">
          <p className="text-slate-400 font-bold text-xs uppercase tracking-widest text-center">Lead-to-Client Rate</p>
          <p className="text-4xl font-black text-slate-900 mt-2 tracking-tighter text-center">32.4%</p>
          <div className="mt-4 mx-auto text-sm font-bold text-blue-500 bg-blue-50 w-fit px-3 py-1 rounded-full text-center text-center">Target: 35%</div>
        </div>
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-300">
          <p className="text-slate-400 font-bold text-xs uppercase tracking-widest text-center">Revenue Forecast</p>
          <p className="text-4xl font-black text-slate-900 mt-2 tracking-tighter text-center">$42,500</p>
          <div className="mt-4 mx-auto text-sm font-bold text-amber-500 bg-amber-50 w-fit px-3 py-1 rounded-full text-center">5 Pending Deals</div>
        </div>
      </div>

      {/* Analytics & Activity Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left: Strategic Overview Card */}
        <div className="lg:col-span-2">
          <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white h-full min-h-[350px] relative overflow-hidden flex flex-col justify-end">
            <div className="relative z-10">
              <h2 className="text-3xl font-bold mb-2 tracking-tight">Revenue Trends & AI Insights</h2>
              <p className="text-slate-400 max-w-lg text-lg leading-relaxed">
                Your high-priority leads have increased by 12% this week. Focus on the "Negotiation" stage in your pipeline to hit Q1 targets.
              </p>
            </div>
            {/* Design accents */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/30 blur-[120px] rounded-full -mr-20 -mt-20"></div>
            <div className="absolute bottom-0 left-0 w-40 h-40 bg-indigo-600/20 blur-[80px] rounded-full -ml-10 -mb-10"></div>
          </div>
        </div>
        
        {/* Right: Interaction Audit Feed */}
        <div className="lg:col-span-1">
          <RecentActivity />
        </div>
      </div>
    </div>
  );
};

/**
 * Main App Container
 * Manages the routing architecture and layout persistence.
 */
function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Dashboard - Central performance hub */}
          <Route path="/" element={<Dashboard />} />
          
          {/* Core Lifecycle Management Pages */}
          <Route path="/leads" element={<LeadsPage />} />
          <Route path="/clients" element={<ClientsPage />} />
          
          {/* Sales Pipeline - Kanban stages */}
          <Route path="/pipeline" element={<Pipeline />} />
          
          {/* Client Journey - Milestone visualization */}
          <Route path="/journey" element={<Journey />} />
          
          {/* Fallback route */}
          <Route path="*" element={
            <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-400 bg-white rounded-3xl border border-dashed border-slate-200">
              <p className="text-xl font-bold">404 - Module Under Development</p>
              <p className="mt-2 text-sm">Feature scheduled for the next implementation sprint.</p>
            </div>
          } />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;