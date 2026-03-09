import React, { useEffect, useMemo, useState } from "react";
import axiosInstance from "../api/axiosInstance";
import RecentActivity from "../components/RecentActivity";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [monthlyData, setMonthlyData] = useState([]);
  const [yearlyData, setYearlyData] = useState([]);
  const [leads, setLeads] = useState([]);
  const [clients, setClients] = useState([]);
  const [showRevenue, setShowRevenue] = useState(false);
  const [loading, setLoading] = useState(true);

  const currency = (n) => `₹${Number(n || 0).toLocaleString()}`;

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const currentYear = new Date().getFullYear();

        const [statsRes, monthlyRes, yearlyRes, leadsRes, clientsRes] =
          await Promise.all([
            axiosInstance.get("/dashboard/stats"),
            axiosInstance.get(`/dashboard/monthly?year=${currentYear}`),
            axiosInstance.get("/dashboard/yearly"),
            axiosInstance.get("/leads"),
            axiosInstance.get("/clients"),
          ]);

        setStats(statsRes.data || null);
        setMonthlyData(monthlyRes.data?.data || []);
        setYearlyData(yearlyRes.data || []);
        setLeads(leadsRes.data || []);
        setClients(clientsRes.data || []);
      } catch (error) {
        console.error("Dashboard fetch failed:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const currentMonthIndex = new Date().getMonth();
  const monthlyRevenue =
    stats?.monthlyRevenue || monthlyData[currentMonthIndex]?.totalRevenue || 0;

  const annualRevenue = stats?.annualRevenue || stats?.totalRevenue || 0;
  const activeClients = stats?.activeClients || stats?.totalClients || clients.length || 0;
  const marketStatus = stats?.marketStatus || "No Data";
  const totalRevenue = stats?.totalRevenue || 0;

  const flow = useMemo(() => {
    if (stats?.pipeline) {
      return stats.pipeline;
    }

    const countBy = (statusList) =>
      leads.filter((l) => statusList.includes(String(l?.status || ""))).length;

    return {
      leadsCreated: countBy(["New"]),
      projectsStarted: countBy(["Started", "Project Started"]),
      inProgress: countBy(["In Progress", "Progress"]),
      deploying: countBy(["Deploying", "Deployment"]),
      live: countBy(["Live"]),
    };
  }, [stats, leads]);

  if (loading) {
    return (
      <div className="p-8 bg-white min-h-screen text-left">
        <h1 className="text-4xl font-black text-slate-900 mb-10 tracking-tight">
          Performance Overview
        </h1>
        <div className="text-slate-400 font-bold">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-white min-h-screen text-left">
      <h1 className="text-4xl font-black text-slate-900 mb-10 tracking-tight">
        Performance Overview
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
        <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl hover:scale-[1.02] transition-all group">
          <p className="text-blue-400 font-bold uppercase text-[10px] tracking-widest">
            Active Clients
          </p>
          <h3 className="text-5xl font-black mt-2 group-hover:text-blue-500 transition-colors">
            {activeClients}
          </h3>
        </div>

        <button
          type="button"
          onClick={() => setShowRevenue(true)}
          className="text-left bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl hover:scale-[1.02] transition-all group"
        >
          <p className="text-blue-400 font-bold uppercase text-[10px] tracking-widest">
            Monthly Revenue
          </p>
          <h3 className="text-5xl font-black mt-2 group-hover:text-blue-500 transition-colors">
            {currency(monthlyRevenue)}
          </h3>
          <p className="mt-3 text-[10px] font-black uppercase tracking-[0.25em] text-slate-300/70">
            Click to view breakdown
          </p>
        </button>

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl">
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">
            Market Status
          </p>
          <h3 className="text-5xl font-black text-slate-900 mt-2 italic">
            {marketStatus}
          </h3>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-slate-50 p-10 rounded-[3rem] border border-slate-100">
          <h2 className="text-2xl font-black mb-6">Recent Activity</h2>
          <RecentActivity leads={leads} />
        </div>

        <div className="bg-slate-900 p-10 rounded-[3rem] text-white shadow-2xl">
          <h2 className="text-2xl font-black mb-10 text-blue-400">
            Delivery Overview
          </h2>

          <div className="space-y-7">
            {[
              { label: "Leads Created", value: flow.leadsCreated || 0 },
              { label: "Projects Started", value: flow.projectsStarted || 0 },
              { label: "In Progress", value: flow.inProgress || 0 },
              { label: "Deploying", value: flow.deploying || 0 },
              { label: "Live", value: flow.live || 0 },
            ].map((row) => {
              const pct = leads.length
                ? Math.min(100, (row.value / leads.length) * 100)
                : 0;

              return (
                <div key={row.label}>
                  <div className="flex justify-between mb-2 font-black uppercase text-[10px] tracking-widest">
                    <span>{row.label}</span>
                    <span className="text-blue-400">{row.value}</span>
                  </div>
                  <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-500 h-full transition-all duration-700 shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-10 pt-8 border-t border-white/10">
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-300/70">
              Total Revenue
            </p>
            <p className="text-3xl font-black mt-2">{currency(totalRevenue)}</p>
          </div>
        </div>
      </div>

      {showRevenue && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6"
          onClick={() => setShowRevenue(false)}
        >
          <div
            className="w-full max-w-lg bg-white rounded-[2rem] p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-black text-slate-900">
                  Revenue Breakdown
                </h3>
                <p className="text-xs font-bold text-slate-400 mt-1">
                  Backend connected revenue summary
                </p>
              </div>
              <button
                className="text-slate-400 hover:text-slate-900 font-black"
                onClick={() => setShowRevenue(false)}
              >
                ✕
              </button>
            </div>

            <div className="mt-8 space-y-4">
              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5">
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">
                  Annual Revenue
                </p>
                <p className="text-3xl font-black text-slate-900 mt-2">
                  {currency(annualRevenue)}
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5">
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">
                  Monthly Revenue
                </p>
                <p className="text-3xl font-black text-slate-900 mt-2">
                  {currency(monthlyRevenue)}
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5">
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">
                  Yearly Report Entries
                </p>
                <p className="text-3xl font-black text-slate-900 mt-2">
                  {yearlyData.length}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;