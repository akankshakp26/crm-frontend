import React, { useEffect, useState, useMemo } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

const STAGES = [
  { id: "Intake",    title: "Intake",    dot: "bg-blue-500",    color: "text-blue-500",    border: "border-blue-200",    bg: "bg-blue-50/50" },
  { id: "Planning",  title: "Planning",  dot: "bg-purple-500",  color: "text-purple-500",  border: "border-purple-200",  bg: "bg-purple-50/50" },
  { id: "Execution", title: "Execution", dot: "bg-orange-500",  color: "text-orange-500",  border: "border-orange-200",  bg: "bg-orange-50/50" },
  { id: "Delivery",  title: "Delivery",  dot: "bg-emerald-500", color: "text-emerald-500", border: "border-emerald-200", bg: "bg-emerald-50/50" },
  { id: "Completed", title: "Completed", dot: "bg-slate-400",   color: "text-slate-400",   border: "border-slate-200",   bg: "bg-slate-50/50" },
];

const Pipeline = ({ setSelectedProject }) => {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [projects, setProjects] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState("all");
  const [loading, setLoading] = useState(true);
  const [dragOverStage, setDragOverStage] = useState(null);
  const [draggingId, setDraggingId] = useState(null);

  useEffect(() => {
    fetchClients();
    fetchProjects();
  }, []);

  const fetchClients = async () => {
    try {
      const res = await axiosInstance.get("/clients");
      setClients(res.data || []);
    } catch (err) {
      console.error("Failed to fetch clients:", err);
    }
  };

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/projects");
      setProjects(res.data || []);
    } catch (err) {
      console.error("Failed to fetch projects:", err);
      toast.error("Failed to load pipeline");
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = useMemo(() => {
    if (selectedClientId === "all") return projects;
    return projects.filter((p) => (p.client?._id || p.client) === selectedClientId);
  }, [projects, selectedClientId]);

  const getProjectsForStage = (stageId) =>
    filteredProjects.filter((p) => (p.stage || "Intake") === stageId);

  const totalProjects = filteredProjects.length;
  const completedCount = filteredProjects.filter((p) => p.stage === "Completed").length;
  const completionRate = totalProjects ? Math.round((completedCount / totalProjects) * 100) : 0;

  const onDragStart = (e, projectId) => {
    e.dataTransfer.setData("projectId", projectId);
    setDraggingId(projectId);
  };
  const onDragEnd = () => { setDraggingId(null); setDragOverStage(null); };
  const onDragOver = (e, stageId) => { e.preventDefault(); setDragOverStage(stageId); };
  const onDragLeave = () => setDragOverStage(null);

  const onDrop = async (e, stageId) => {
    e.preventDefault();
    setDragOverStage(null);
    setDraggingId(null);

    const projectId = e.dataTransfer.getData("projectId");
    const project = projects.find((p) => p._id === projectId);
    if (!project || project.stage === stageId) return;

    setProjects((prev) => prev.map((p) => (p._id === projectId ? { ...p, stage: stageId } : p)));

    try {
      await axiosInstance.put(`/projects/${projectId}`, { stage: stageId });
      toast.success(`Moved to ${stageId}`);
    } catch (err) {
      console.error("Stage update failed:", err);
      toast.error("Failed to update stage");
      fetchProjects();
    }
  };

  const handleCardClick = (project) => {
    if (draggingId) return;
    setSelectedProject(project);
    navigate("/journey");
  };

  const selectedClient = clients.find((c) => c._id === selectedClientId);

  if (loading) {
    return (
      <div className="p-8 bg-white min-h-screen">
        <h1 className="text-5xl font-black text-slate-900 tracking-tight">Pipeline</h1>
        <p className="text-slate-400 font-bold mt-4">Loading pipeline...</p>
      </div>
    );
  }

  return (
    <div className="p-8 bg-white min-h-screen text-left">
      <div className="mb-8">
        <h1 className="text-5xl font-black text-slate-900 tracking-tight">Pipeline</h1>
        <p className="text-slate-400 font-bold text-xs uppercase mt-2 tracking-[0.4em]">Project Stage Tracker</p>
      </div>

      {/* ── TOP STAT BOXES — dark ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Company Selector */}
        <div className="bg-slate-900 rounded-[2rem] p-6 shadow-xl">
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 mb-3">Select Company</p>
          <select
            value={selectedClientId}
            onChange={(e) => setSelectedClientId(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-2xl px-5 py-3 outline-none font-semibold text-white text-sm"
          >
            <option value="all">All Companies</option>
            {clients.map((client) => (
              <option key={client._id} value={client._id}>{client.name}</option>
            ))}
          </select>
        </div>

        {/* Total Projects */}
        <div className="bg-slate-900 rounded-[2rem] p-6 shadow-xl">
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">Total Projects</p>
          <p className="text-4xl font-black text-white mt-2">{totalProjects}</p>
          {selectedClient && <p className="text-xs text-blue-400 font-bold mt-1">{selectedClient.name}</p>}
        </div>

        {/* Completion Rate */}
        <div className="bg-slate-900 rounded-[2rem] p-6 shadow-xl">
          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">Completion Rate</p>
          <p className="text-4xl font-black text-white mt-2">{completionRate}%</p>
          <div className="w-full bg-slate-700 rounded-full h-2 mt-3 overflow-hidden">
            <div
              className="h-2 rounded-full bg-gradient-to-r from-blue-500 to-emerald-500 transition-all duration-500"
              style={{ width: `${completionRate}%` }}
            />
          </div>
        </div>
      </div>

      {/* Filter badge */}
      {selectedClientId !== "all" && selectedClient && (
        <div className="mb-6">
          <span className="inline-flex items-center gap-2 bg-slate-100 border border-slate-200 rounded-full px-4 py-2 text-sm font-bold text-slate-700">
            Viewing: {selectedClient.name}
            <button onClick={() => setSelectedClientId("all")} className="text-slate-400 hover:text-slate-900 font-black ml-1">×</button>
          </span>
        </div>
      )}

      <p className="text-xs text-slate-400 font-bold mb-6">
        💡 Drag cards to move between stages · Click a card to view project journey
      </p>

      {/* Empty state */}
      {totalProjects === 0 && (
        <div className="text-center py-24 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
          <p className="text-slate-400 font-black uppercase tracking-widest text-sm">
            {selectedClientId === "all"
              ? "No projects found. Add projects from the Clients page."
              : "No projects for this company yet."}
          </p>
        </div>
      )}

      {/* Kanban Board */}
      {totalProjects > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 pb-10">
          {STAGES.map((stage) => {
            const stageProjects = getProjectsForStage(stage.id);
            const isDragOver = dragOverStage === stage.id;

            return (
              <div
                key={stage.id}
                onDragOver={(e) => onDragOver(e, stage.id)}
                onDragLeave={onDragLeave}
                onDrop={(e) => onDrop(e, stage.id)}
                className="flex flex-col"
              >
                <div className="flex items-center gap-2 mb-4 px-2">
                  <div className={`w-3 h-3 rounded-full ${stage.dot}`} />
                  <h3 className={`font-black text-sm uppercase tracking-[0.2em] ${stage.color}`}>{stage.title}</h3>
                  <span className="ml-auto bg-slate-100 text-slate-500 px-2 py-1 rounded-full font-black text-[10px]">
                    {stageProjects.length}
                  </span>
                </div>

                <div className={`flex flex-col gap-4 rounded-[2.5rem] p-4 flex-grow min-h-[480px] border-2 transition-all duration-200 ${
                  isDragOver ? `${stage.border} ${stage.bg} scale-[1.01] shadow-lg` : "border-slate-100 bg-slate-50"
                }`}>
                  {stageProjects.map((project) => {
                    const paidTotal = project.installments?.filter((i) => i.paid).reduce((s, i) => s + i.amount, 0) || 0;
                    const progress = project.totalPayment > 0 ? (paidTotal / project.totalPayment) * 100 : 0;
                    const isOverdue = project.deadline && new Date(project.deadline) < new Date() && paidTotal < project.totalPayment;
                    const isDragging = draggingId === project._id;

                    return (
                      <div
                        key={project._id}
                        draggable
                        onDragStart={(e) => onDragStart(e, project._id)}
                        onDragEnd={onDragEnd}
                        onClick={() => handleCardClick(project)}
                        className={`bg-white p-5 rounded-[2rem] border cursor-grab active:cursor-grabbing hover:border-blue-200 hover:shadow-md hover:-translate-y-1 transition-all select-none ${
                          isDragging ? "opacity-40 scale-95" : "opacity-100 border-slate-100"
                        }`}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="font-black text-slate-900 text-base leading-tight pr-2 hover:text-blue-600 transition-colors">
                            {project.name}
                          </h4>
                          <div className={`w-2.5 h-2.5 rounded-full shrink-0 mt-1 ${stage.dot}`} />
                        </div>

                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Company</p>
                        <p className="text-sm font-bold text-slate-600 mb-3">{project.client?.name || "—"}</p>

                        {isOverdue && (
                          <div className="mb-3 bg-red-50 text-red-500 text-[10px] px-3 py-1.5 rounded-xl font-black">
                            ⚠ Payment overdue
                          </div>
                        )}

                        <p className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Total Payment</p>
                        <p className="text-xl font-black text-slate-900 mb-3">
                          ₹{Number(project.totalPayment || 0).toLocaleString()}
                        </p>

                        <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div className="h-1.5 rounded-full bg-emerald-500 transition-all duration-500" style={{ width: `${progress}%` }} />
                        </div>
                        <p className="text-[10px] text-slate-400 font-bold mt-1">{progress.toFixed(0)}% paid</p>

                        {project.deadline && (
                          <p className="text-[10px] text-slate-400 font-bold mt-2">
                            Due: {new Date(project.deadline).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}
                          </p>
                        )}
                      </div>
                    );
                  })}

                  {stageProjects.length === 0 && (
                    <div className={`flex-1 flex items-center justify-center border-2 border-dashed rounded-[2rem] py-10 text-center font-bold text-xs transition-all ${
                      isDragOver ? `${stage.border} ${stage.color}` : "border-slate-200 text-slate-300"
                    }`}>
                      {isDragOver ? "Drop here" : `No ${stage.title.toLowerCase()} projects`}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Pipeline;
