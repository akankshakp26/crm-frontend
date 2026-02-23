import React, { useState, useEffect } from 'react';
import axiosInstance from "../api/axiosInstance"; // 🔥 Using Harshitha's secure axios
import InteractionLogs from '../components/InteractionLogs';
import RecentActivity from '../components/RecentActivity';

const Dashboard = () => {
  // 1. Create state to hold the data from the backend (Your code)
  const [stats, setStats] = useState({
    totalLeads: 0,
    totalClients: 0,
    totalRevenue: 0,
    avgRevenue: 0,
    conversionRate: "0%"
  });
  const [loading, setLoading] = useState(true);

  // 2. Fetch the data when the page loads
  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        // 🔥 Using the secure instance to fetch your stats
        const response = await axiosInstance.get('/dashboard/stats');
        setStats(response.data);
      } catch (error) {
        console.error("Error fetching live stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  if (loading) return <p className="p-8 font-bold text-slate-500">Loading live stats...</p>;

  return (
    <div className="p-8 animate-in fade-in duration-700">
      <h1 className="text-4xl font-black text-slate-900 mb-10 tracking-tight text-left">Performance Overview</h1>
      
      {/* 3. Display the live stats in 4 grid boxes */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        
        {/* Box 1: Total Revenue */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl">
          <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">Total Revenue</p>
          <h3 className="text-4xl font-black text-slate-900 mt-2">${stats.totalRevenue.toLocaleString()}</h3>
        </div>
        
        {/* Box 2: Total Leads */}
        <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-xl">
          <p className="text-slate-400 font-bold uppercase text-xs tracking-widest text-left">Total Leads</p>
          <h3 className="text-4xl font-black mt-2 text-left">{stats.totalLeads}</h3>
        </div>

        {/* Box 3: Total Clients */}
        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl">
          <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">Active Clients</p>
          <h3 className="text-4xl font-black text-slate-900 mt-2">{stats.totalClients}</h3>
        </div>

        {/* Box 4: Conversion Rate */}
        <div className="bg-blue-600 p-8 rounded-[2.5rem] text-white shadow-xl">
          <p className="text-blue-200 font-bold uppercase text-xs tracking-widest">Conversion Rate</p>
          <h3 className="text-4xl font-black mt-2">{stats.conversionRate}</h3>
        </div>

      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm min-h-[400px]">
          <h2 className="text-2xl font-bold mb-6 text-slate-900">Interaction Logs</h2>
          <InteractionLogs />
        </div>
        <div className="lg:col-span-1">
          <RecentActivity />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;