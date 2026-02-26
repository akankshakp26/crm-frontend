import React from "react";
import RecentActivity from "../components/RecentActivity";

const Dashboard = ({ leads = [] }) => {
  const confirmedLeads = leads.filter(
    (l) => l.status === "Confirmed" || l.status === "Qualified"
  );

  const totalRevenue = confirmedLeads.reduce(
    (acc, curr) => acc + (curr.value || 0),
    0
  );

  const activeLeadsCount = leads.filter((l) => l.status !== "Lost").length;

  // ✅ Removed dummy "Optimal" -> calculate a real status
  const marketStatus =
    leads.length === 0
      ? "No Data"
      : totalRevenue > 0
      ? "Active"
      : activeLeadsCount > 0
      ? "In Progress"
      : "No Active Leads";

  // ✅ Pipeline Health now 5 items (edit names if your project uses different statuses)
  const pipelineStages = ["New", "Contacted", "Negotiation", "Qualified", "Confirmed"];

  return (
    <div className="p-8 bg-white min-h-screen text-left">
      <h1 className="text-4xl font-black text-slate-900 mb-10 tracking-tight">
        Performance Overview
      </h1>

      {/* Three Boxes Side-by-Side */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
        <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl hover:scale-[1.02] transition-all group">
          <p className="text-blue-400 font-bold uppercase text-[10px] tracking-widest">
            Active Leads
          </p>
          <h3 className="text-5xl font-black mt-2 group-hover:text-blue-500 transition-colors">
            {activeLeadsCount}
          </h3>
        </div>

        {/* ✅ Total Revenue now uses same theme + hover like Active Leads */}
        <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl hover:scale-[1.02] transition-all group">
          <p className="text-blue-400 font-bold uppercase text-[10px] tracking-widest">
            Total Revenue
          </p>
          <h3 className="text-5xl font-black mt-2 group-hover:text-blue-500 transition-colors">
            ₹{totalRevenue.toLocaleString()}
          </h3>
        </div>

        {/* ✅ Market Status is not dummy now */}
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
        {/* Recent Activity Box */}
        <div className="bg-slate-50 p-10 rounded-[3rem] border border-slate-100">
          <h2 className="text-2xl font-black mb-6">Recent Activity</h2>

          {/* ✅ Pass leads (so you can show real activities inside RecentActivity) */}
          <RecentActivity leads={leads} />
        </div>

        {/* Pipeline Health Box */}
        <div className="bg-slate-900 p-10 rounded-[3rem] text-white shadow-2xl">
          <h2 className="text-2xl font-black mb-10 text-blue-400">
            Pipeline Health
          </h2>

          <div className="space-y-8">
            {pipelineStages.map((status) => {
              const count = leads.filter((l) => l.status === status).length;
              const percentage = leads.length > 0 ? (count / leads.length) * 100 : 0;

              return (
                <div key={status}>
                  <div className="flex justify-between mb-2 font-black uppercase text-[10px] tracking-widest">
                    <span>{status === "New" ? "Leads Created" : status}</span>
                    <span className="text-blue-400">{count} Companies</span>
                  </div>

                  <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
                    <div
                      className="bg-blue-500 h-full transition-all duration-1000 shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                      style={{ width: `${percentage}%` }}
                    />
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

export default Dashboard;