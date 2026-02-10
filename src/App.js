import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import LeadsPage from './pages/LeadsPage';
import ClientsPage from './pages/ClientsPage';
import Pipeline from './pages/Pipeline';
import Journey from './pages/Journey';
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