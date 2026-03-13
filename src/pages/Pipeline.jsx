import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import axiosInstance from "../api/axiosInstance";

const Pipeline = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCompany, setSelectedCompany] = useState("all");

  const fetchLeads = async () => {
    try {
      const res = await axiosInstance.get("/leads");
      setLeads(res.data || []);
    } catch (error) {
      console.error("Failed to fetch leads:", error);
      toast.error("Failed to load pipeline");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const companyOptions = useMemo(() => {
    const companies = leads
      .map((lead) => lead.company || "")
      .filter(Boolean);
    return [...new Set(companies)];
  }, [leads]);

  const filteredLeads = useMemo(() => {
    if (selectedCompany === "all") return leads;
    return leads.filter((lead) => (lead.company || "") === selectedCompany);
  }, [leads, selectedCompany]);

  const columns = [
    {
      id: "Intake",
      title: "Intake",
      dot: "bg-blue-500",
      statuses: ["New", "Contacted"],
      updateStatus: "Contacted",
      emptyText: "No intake projects",
    },
    {
      id: "Planning",
      title: "Planning",
      dot: "bg-purple-500",
      statuses: ["Negotiation", "Started", "Project Started"],
      updateStatus: "Started",
      emptyText: "No planning projects",
    },
    {
      id: "Execution",
      title: "Execution",
      dot: "bg-orange-500",
      statuses: ["In Progress", "Progress", "Confirmed"],
      updateStatus: "In Progress",
      emptyText: "No execution projects",
    },
    {
      id: "Delivery",
      title: "Delivery",
      dot: "bg-emerald-500",
      statuses: ["Deploying", "Deployment", "Live"],
      updateStatus: "Live",
      emptyText: "No delivery projects",
    },
  ];

  const getColumnLeads = (column) =>
    filteredLeads.filter((lead) =>
      column.statuses.includes(String(lead?.status || ""))
    );

  const totalProjects = filteredLeads.length;

  const deliveryCount = useMemo(() => {
    return filteredLeads.filter((lead) =>
      ["Deploying", "Deployment", "Live"].includes(String(lead?.status || ""))
    ).length;
  }, [filteredLeads]);

  const completionRate = totalProjects
    ? Math.round((deliveryCount / totalProjects) * 100)
    : 0;

  const onDrop = async (e, column) => {
    e.preventDefault();

    const leadId = e.dataTransfer.getData("leadId");
    const lead = leads.find((l) => (l._id || l.id) === leadId);

    if (!lead) return;

    const currentStatus = String(lead.status || "");
    if (column.statuses.includes(currentStatus)) return;

    try {
      await axiosInstance.put(`/leads/${leadId}`, {
        status: column.updateStatus,
      });

      await fetchLeads();
      toast.success(
        `${lead.projectName || lead.name || "Project"} moved to ${column.title}`
      );
    } catch (err) {
      console.error("Pipeline update failed:", err);
      toast.error("Failed to update pipeline");
    }
  };

  if (loading) {
    return (
      <div className="p-8 h-full bg-white text-left">
        <h1 className="text-5xl font-black text-slate-900 tracking-tight">
          Pipeline
        </h1>
        <p className="text-slate-400 font-bold mt-4">Loading pipeline...</p>
      </div>
    );
  }

  return (
    <div className="p-8 h-full bg-white text-left">
      <div className="mb-8">
        <h1 className="text-5xl font-black text-slate-900 tracking-tight">
          Pipeline
        </h1>
        <p className="text-slate-400 font-bold text-xs uppercase mt-2 tracking-[0.4em]">
          Company Project Flow
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm">
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 mb-2">
            Select Company
          </p>
          <select
            value={selectedCompany}
            onChange={(e) => setSelectedCompany(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-[2rem] px-5 py-3 outline-none font-semibold text-slate-700"
          >
            <option value="all">All Companies</option>
            {companyOptions.map((company) => (
              <option key={company} value={company}>
                {company}
              </option>
            ))}
          </select>
        </div>

        <div className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm">
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">
            Total Services / Projects
          </p>
          <p className="text-3xl font-black text-slate-900 mt-2">
            {totalProjects}
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-[2rem] p-6 shadow-sm">
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">
            Completion Rate
          </p>
          <p className="text-3xl font-black text-slate-900 mt-2">
            {completionRate}%
          </p>
        </div>
      </div>

      {selectedCompany !== "all" && (
        <div className="mb-8">
          <span className="inline-flex items-center gap-2 bg-slate-100 border border-slate-200 rounded-full px-4 py-2 text-sm font-bold text-slate-700">
            Viewing: {selectedCompany}
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 pb-10">
        {columns.map((column) => {
          const columnLeads = getColumnLeads(column);

          return (
            <div
              key={column.id}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => onDrop(e, column)}
              className="flex flex-col"
            >
              <div className="flex items-center gap-3 mb-4 px-2">
                <div className={`w-3 h-3 rounded-full ${column.dot}`} />
                <h3 className="font-black text-sm uppercase tracking-[0.2em] text-slate-500">
                  {column.title}
                </h3>
                <span className="ml-auto bg-slate-100 text-slate-500 px-2 py-1 rounded-full font-black text-[10px]">
                  {columnLeads.length}
                </span>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-[2.5rem] p-5 flex-grow min-h-[420px] shadow-sm">
                <div className="space-y-4">
                  {columnLeads.map((lead) => (
                    <div
                      key={lead._id || lead.id}
                      draggable
                      onDragStart={(e) =>
                        e.dataTransfer.setData("leadId", lead._id || lead.id)
                      }
                      className="bg-white p-5 rounded-[2rem] border border-slate-200 cursor-grab active:cursor-grabbing hover:border-blue-300 hover:shadow-md hover:-translate-y-1 transition-all group"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <h4 className="font-black text-slate-900 text-lg leading-tight">
                          {lead.projectName || lead.name || "Unnamed Project"}
                        </h4>
                        <div
                          className={`w-2.5 h-2.5 rounded-full ${column.dot} mt-2`}
                        />
                      </div>

                      <div className="space-y-3">
                        <div>
                          <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">
                            Company
                          </p>
                          <p className="text-sm font-bold text-slate-600">
                            {lead.company || "-"}
                          </p>
                        </div>

                        <div>
                          <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">
                            Current Stage
                          </p>
                          <p className="text-sm font-bold text-slate-600">
                            {lead.status || "-"}
                          </p>
                        </div>

                        <div>
                          <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mb-1">
                            Value
                          </p>
                          <p className="text-xl font-black text-slate-900 tracking-tighter">
                            ₹{Number(lead.value || 0).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}

                  {columnLeads.length === 0 && (
                    <div className="flex items-center justify-center bg-white border border-dashed border-slate-200 rounded-[2rem] py-14 text-center text-slate-300 font-bold text-xs">
                      {column.emptyText}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Pipeline;