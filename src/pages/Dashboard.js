// src/pages/Dashboard.js
import React from 'react';
import StatsGrid from '../components/StatsGrid'; // Adjusted path to your components folder

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Note: Sidebar is usually handled by Layout.js, 
          but if you use it here, ensure the path is correct */}
      
      <main className="flex-1 p-8">
        <header className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900">Admin Dashboard</h2>
          <p className="text-gray-500">Welcome back, Monika. Here's what's happening today.</p>
        </header>

        <StatsGrid />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-100 shadow-sm h-64">
             <h3 className="font-semibold mb-4 text-slate-900">Recent Activity</h3>
             <p className="text-gray-400 text-sm">Activity logs will appear here...</p>
          </div>
          
          <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm h-64">
             <h3 className="font-semibold mb-4 text-slate-900">Relationship Health</h3>
             <p className="text-gray-400 text-sm">AI-driven trust index coming soon...</p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;