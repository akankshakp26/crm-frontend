import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

const ProjectsPage = () => {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [editingClient, setEditingClient] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [clientForm, setClientForm] = useState({ ceoName: "", associatedFrom: "" });

  const [form, setForm] = useState({
    name: "",
    handledBy: "",
    totalPayment: "",
    phase1Percent: "",
    phase2Percent: "",
    phase3Percent: "",
    deadline: "",
  });

  const [showAddMenu, setShowAddMenu] = useState(false);
  const dropdownRef = useRef(null);
  const [showServiceForm, setShowServiceForm] = useState(false);

  const [serviceForm, setServiceForm] = useState({
    serviceName: "",
    createdDate: "",
    monthlyAmount: "",
    monthlyPayDate: "",
    handledBy: "",
  });

  const total = Number(form.totalPayment) || 0;
  const advanceAmount = (Number(form.phase1Percent) / 100) * total || 0;
  const middleAmount = (Number(form.phase2Percent) / 100) * total || 0;
  const deploymentAmount = (Number(form.phase3Percent) / 100) * total || 0;

  const fetchClient = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(`/clients/${clientId}`);
      setClient(res.data);
      setClientForm({
        ceoName: res.data.ceoName || "",
        associatedFrom: res.data.associatedFrom
          ? res.data.associatedFrom.substring(0, 10)
          : "",
      });
    } catch (err) {
      console.error("Error fetching client:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClient();
    fetchServices();
  }, [clientId]);

  const fetchServices = async () => {
    try {
      const res = await axiosInstance.get(`/services/${clientId}`);
      setServices(res.data);
    } catch (err) {
      console.error("Error fetching services:", err);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!form.name) { alert("Project name is required"); return; }

    try {
      if (editingProject) {
        // When editing, only update name, handledBy, deadline — NOT stage
        await axiosInstance.put(`/projects/${editingProject._id}`, {
          name: form.name,
          handledBy: form.handledBy,
          deadline: form.deadline,
        });
        setEditingProject(null);
      } else {
        // New project always starts at Intake
        await axiosInstance.post("/projects", {
          ...form,
          totalPayment: Number(form.totalPayment),
          phase1Percent: Number(form.phase1Percent),
          phase2Percent: Number(form.phase2Percent),
          phase3Percent: Number(form.phase3Percent),
          stage: "Intake", // ✅ Always starts at Intake
          clientId,
        });
      }

      setForm({
        name: "", handledBy: "", totalPayment: "",
        phase1Percent: "", phase2Percent: "", phase3Percent: "",
        deadline: "",
      });
      setShowForm(false);
      fetchClient();
    } catch (err) {
      console.error("Save failed:", err.response?.data || err);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowAddMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleDelete = async (projectId) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    try {
      await axiosInstance.delete(`/projects/${projectId}`);
      fetchClient();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (!client) return <div className="p-8">Client not found</div>;

  const totalProjects = client.projects?.length || 0;
  const totalRevenue = client.projects?.reduce((sum, p) => sum + (p.totalPayment || 0), 0) || 0;
  const receivedAmount = client.projects?.reduce((sum, p) => {
    const paid = p.installments?.filter((i) => i.paid).reduce((s, i) => s + i.amount, 0) || 0;
    return sum + paid;
  }, 0) || 0;
  const pendingAmount = totalRevenue - receivedAmount;

  const overdueProjects = client.projects?.filter(
    (p) => p.deadline && new Date(p.deadline) < new Date() && p.installments?.some((i) => !i.paid)
  );

  const handleDeleteClient = async () => {
    if (!window.confirm("Are you sure you want to delete this client?")) return;
    try {
      await axiosInstance.delete(`/clients/${clientId}`);
      navigate("/clients");
    } catch (err) {
      console.error("Failed to delete client:", err);
    }
  };

  const openEdit = (project) => {
    setEditingProject(project);
    setShowForm(true);
    setForm({
      name: project.name,
      handledBy: project.handledBy,
      totalPayment: project.totalPayment,
      phase1Percent: "",
      phase2Percent: "",
      phase3Percent: "",
      deadline: project.deadline ? project.deadline.substring(0, 10) : "",
    });
  };

  const handleServiceSubmit = async () => {
    if (!serviceForm.serviceName) { alert("Service name is required"); return; }
    if (!serviceForm.monthlyPayDate) { alert("Please select monthly payment date"); return; }

    try {
      const paymentDay = new Date(serviceForm.monthlyPayDate).getDate();
      const serviceData = {
        serviceName: serviceForm.serviceName,
        createdDate: serviceForm.createdDate,
        monthlyAmount: Number(serviceForm.monthlyAmount),
        monthlyPayDate: serviceForm.monthlyPayDate,
        paymentDay,
        handledBy: serviceForm.handledBy,
        clientId,
      };

      if (editingService) {
        await axiosInstance.put(`/services/${editingService._id}`, serviceData);
        setEditingService(null);
      } else {
        await axiosInstance.post("/services", serviceData);
      }

      setServiceForm({ serviceName: "", createdDate: "", monthlyAmount: "", monthlyPayDate: "", handledBy: "" });
      setShowServiceForm(false);
      fetchServices();
    } catch (err) {
      console.error("Service save failed:", err.response?.data || err);
    }
  };

  const handleDeleteService = async (serviceId) => {
    if (!window.confirm("Are you sure you want to delete this service?")) return;
    try {
      await axiosInstance.delete(`/services/${serviceId}`);
      fetchServices();
    } catch (err) {
      console.error("Delete service failed:", err);
    }
  };

  const handleEditService = (service) => {
    setEditingService(service);
    setServiceForm({
      serviceName: service.serviceName,
      createdDate: service.createdDate?.substring(0, 10),
      monthlyAmount: service.monthlyAmount,
      monthlyPayDate: service.monthlyPayDate?.substring(0, 10),
      handledBy: service.handledBy,
    });
    setShowServiceForm(true);
  };

  return (
    <div className="p-10 bg-slate-50 min-h-screen">
      {overdueProjects?.length > 0 && (
        <div className="bg-red-50 border border-red-200 p-4 rounded-xl mb-6">
          <h4 className="font-bold text-red-700 mb-2">⚠ Overdue Payments</h4>
          {overdueProjects.map((p) => (
            <p key={p._id} className="text-sm text-red-600">{p.name} payment overdue</p>
          ))}
        </div>
      )}

      <div className="mb-6">
        <button onClick={() => navigate("/clients")} className="text-sm font-bold text-blue-600 hover:underline">
          ← Back to Clients
        </button>
      </div>

      {/* CLIENT HEADER */}
      <div className="mb-12 flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-8">{client.name}</h1>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
            <div className="bg-white p-6 rounded-2xl shadow border">
              <p className="text-xs text-slate-400">Projects</p>
              <p className="text-2xl font-black text-slate-900">{totalProjects}</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow border">
              <p className="text-xs text-slate-400">Total Revenue</p>
              <p className="text-2xl font-black text-slate-900">₹{totalRevenue}</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow border">
              <p className="text-xs text-slate-400">Received</p>
              <p className="text-2xl font-black text-emerald-600">₹{receivedAmount}</p>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow border">
              <p className="text-xs text-slate-400">Pending</p>
              <p className="text-2xl font-black text-red-600">₹{pendingAmount}</p>
            </div>
          </div>

          <div className="mt-4 space-y-1 text-sm text-slate-500">
            <p>Email: {client.email}</p>
            <p>CEO: {client.ceoName || "—"}</p>
            <p>
              Associated From:{" "}
              {client.associatedFrom
                ? new Date(client.associatedFrom).toDateString()
                : new Date(client.createdAt).toDateString()}
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => setEditingClient(!editingClient)}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-bold transition"
          >
            {editingClient ? "Cancel" : "Edit Client"}
          </button>
          <button
            onClick={handleDeleteClient}
            className="px-5 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-bold transition"
          >
            Delete Client
          </button>
        </div>
      </div>

      {editingClient && (
        <div className="bg-white p-6 rounded-2xl shadow border border-slate-100 mb-10 space-y-4">
          <input name="ceoName" placeholder="CEO Name" value={clientForm.ceoName}
            onChange={(e) => setClientForm({ ...clientForm, ceoName: e.target.value })}
            className="w-full p-3 border border-slate-200 rounded-xl" />
          <input name="associatedFrom" type="date" value={clientForm.associatedFrom}
            onChange={(e) => setClientForm({ ...clientForm, associatedFrom: e.target.value })}
            className="w-full p-3 border border-slate-200 rounded-xl" />
          <button
            onClick={async () => {
              await axiosInstance.put(`/clients/${clientId}`, clientForm);
              setEditingClient(false);
              fetchClient();
            }}
            className="px-5 py-2 bg-blue-600 text-white rounded-xl font-bold"
          >
            Save Changes
          </button>
        </div>
      )}

      {/* ADD BUTTON */}
      <div ref={dropdownRef} className="relative mb-8">
        <button
          onClick={() => { setShowAddMenu(!showAddMenu); setShowForm(false); setShowServiceForm(false); }}
          className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-sm font-black shadow-lg transition"
        >
          + Add ▼
        </button>
        {showAddMenu && (
          <div className="absolute mt-2 bg-white border rounded-xl shadow w-40 z-10">
            <button onClick={() => { setShowForm(true); setShowServiceForm(false); setShowAddMenu(false); }}
              className="block w-full text-left px-4 py-2 hover:bg-slate-100">Project</button>
            <button onClick={() => { setShowServiceForm(true); setShowForm(false); setShowAddMenu(false); }}
              className="block w-full text-left px-4 py-2 hover:bg-slate-100">Service</button>
          </div>
        )}
      </div>

      {/* SERVICE FORM */}
      {showServiceForm && (
        <div className="bg-white p-8 rounded-3xl shadow-md border border-slate-100 mb-12 space-y-4">
          <h3 className="text-lg font-black text-slate-800 mb-4">
            {editingService ? "Edit Service" : "Create Service"}
          </h3>
          <div>
            <label className="text-sm font-semibold text-slate-600">Service Name</label>
            <input placeholder="Example: Website Hosting" value={serviceForm.serviceName}
              onChange={(e) => setServiceForm({ ...serviceForm, serviceName: e.target.value })}
              className="w-full p-3 border border-slate-200 rounded-xl mt-1" />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-600">Service Start Date</label>
            <input type="date" value={serviceForm.createdDate}
              onChange={(e) => setServiceForm({ ...serviceForm, createdDate: e.target.value })}
              className="w-full p-3 border border-slate-200 rounded-xl mt-1" />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-600">Monthly Payment Amount (₹)</label>
            <input type="number" placeholder="Example: 5000" value={serviceForm.monthlyAmount}
              onChange={(e) => setServiceForm({ ...serviceForm, monthlyAmount: e.target.value })}
              className="w-full p-3 border border-slate-200 rounded-xl mt-1" />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-600">Monthly Payment Date</label>
            <input type="date" value={serviceForm.monthlyPayDate}
              onChange={(e) => setServiceForm({ ...serviceForm, monthlyPayDate: e.target.value })}
              className="w-full p-3 border border-slate-200 rounded-xl mt-1" />
          </div>
          <div>
            <label className="text-sm font-semibold text-slate-600">Handled By</label>
            <input placeholder="Employee name" value={serviceForm.handledBy}
              onChange={(e) => setServiceForm({ ...serviceForm, handledBy: e.target.value })}
              className="w-full p-3 border border-slate-200 rounded-xl mt-1" />
          </div>
          <div className="flex gap-4">
            <button onClick={handleServiceSubmit}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition">
              {editingService ? "Update Service" : "Save Service"}
            </button>
            <button onClick={() => setShowServiceForm(false)}
              className="px-6 py-3 bg-slate-300 hover:bg-slate-400 rounded-xl font-bold">Cancel</button>
          </div>
        </div>
      )}

      {/* PROJECT FORM */}
      {showForm && (
        <div className="bg-white p-8 rounded-3xl shadow-md border border-slate-100 mb-12 space-y-4">
          <h3 className="text-lg font-black text-slate-800 mb-4">
            {editingProject ? "Edit Project" : "Create Project"}
          </h3>

          <input name="name" placeholder="Project Name" value={form.name} onChange={handleChange}
            className="w-full p-3 border border-slate-200 rounded-xl" />
          <input name="handledBy" placeholder="Handled By" value={form.handledBy} onChange={handleChange}
            className="w-full p-3 border border-slate-200 rounded-xl" />

          {!editingProject && (
            <>
              <div>
                <label className="text-sm font-semibold text-slate-600">Total Project Amount (₹)</label>
                <input name="totalPayment" type="number" placeholder="Enter total project amount"
                  value={form.totalPayment} onChange={handleChange}
                  className="w-full p-3 border border-slate-200 rounded-xl mt-1" />
              </div>

              <div className="mb-6">
                <label className="text-sm font-semibold text-slate-700">Payment Installments (%)</label>
                <p className="text-xs text-slate-400 mb-3">Total must equal 100%.</p>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <input name="phase1Percent" type="number" placeholder="Advance %" value={form.phase1Percent} onChange={handleChange}
                      className="w-full p-3 border border-slate-200 rounded-xl" />
                    <p className="text-xs text-slate-500 mt-1">Amount: ₹{advanceAmount.toFixed(0)}</p>
                  </div>
                  <div>
                    <input name="phase2Percent" type="number" placeholder="Middle %" value={form.phase2Percent} onChange={handleChange}
                      className="w-full p-3 border border-slate-200 rounded-xl" />
                    <p className="text-xs text-slate-500 mt-1">Amount: ₹{middleAmount.toFixed(0)}</p>
                  </div>
                  <div>
                    <input name="phase3Percent" type="number" placeholder="Deployment %" value={form.phase3Percent} onChange={handleChange}
                      className="w-full p-3 border border-slate-200 rounded-xl" />
                    <p className="text-xs text-slate-500 mt-1">Amount: ₹{deploymentAmount.toFixed(0)}</p>
                  </div>
                </div>
                <p className="text-sm text-slate-600 mt-3">
                  Total: {Number(form.phase1Percent || 0) + Number(form.phase2Percent || 0) + Number(form.phase3Percent || 0)}%
                </p>
              </div>
            </>
          )}

          <div>
            <label className="text-sm font-semibold text-slate-600">Project Deadline</label>
            <input name="deadline" type="date" value={form.deadline} onChange={handleChange}
              className="w-full p-3 border border-slate-200 rounded-xl mt-1" />
          </div>

          <div className="flex gap-4">
            <button onClick={handleSubmit}
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold transition">
              Save Project
            </button>
            <button onClick={() => { setShowForm(false); setEditingProject(null); }}
              className="px-6 py-3 bg-slate-300 hover:bg-slate-400 rounded-xl font-bold">Cancel</button>
          </div>
        </div>
      )}

      {/* SERVICES */}
      <h2 className="text-2xl font-black text-slate-900 mb-6">Services</h2>
      {services.length === 0 ? (
        <div className="bg-white p-6 rounded-xl border text-slate-400 mb-10">No services added yet.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          {services.map((service) => {
            const today = new Date().getDate();
            const payDay = new Date(service.monthlyPayDate).getDate();
            const isDue = today === payDay;
            const now = new Date();
            const nextPayment = new Date(now.getFullYear(), now.getMonth(), payDay);
            if (now.getDate() > payDay) nextPayment.setMonth(now.getMonth() + 1);

            return (
              <div key={service._id} className="bg-white p-6 rounded-2xl shadow border">
                <h3 className="text-lg font-bold">{service.serviceName}</h3>
                <p className="text-sm text-slate-500 mt-1">Handled by {service.handledBy}</p>
                {isDue && (
                  <div className="mt-2 bg-red-100 text-red-600 text-xs px-3 py-2 rounded-lg font-bold">
                    ⚠ Monthly payment due today
                  </div>
                )}
                <p className="text-sm mt-3">Monthly Amount: ₹{service.monthlyAmount}</p>
                <p className="text-xs text-slate-400">Next Payment: {nextPayment.toDateString()}</p>
                <div className="flex justify-end gap-4 mt-4 text-xs font-bold">
                  <button onClick={() => handleEditService(service)} className="text-yellow-600 hover:underline">Edit</button>
                  <button onClick={() => handleDeleteService(service._id)} className="text-red-600 hover:underline">Delete</button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* PROJECTS */}
      <h2 className="text-2xl font-black text-slate-900 mb-6">Projects</h2>
      <div className="mb-6">
        <input type="text" placeholder="Search projects..." value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-80 p-3 border border-slate-200 rounded-xl" />
      </div>

      {client.projects?.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-dashed border-slate-300 text-center text-slate-400">
          No projects added yet.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {client.projects
            ?.filter((project) => project.name?.toLowerCase().includes(searchTerm.toLowerCase()))
            .map((project) => {
              const paidTotal = project.installments?.filter((i) => i.paid).reduce((sum, i) => sum + i.amount, 0) || 0;
              const allPaid = paidTotal >= project.totalPayment;
              const progress = project.totalPayment > 0 ? (paidTotal / project.totalPayment) * 100 : 0;
              const isOverdue = project.deadline && new Date(project.deadline) < new Date() && !allPaid;
              let status = "Active";
              if (allPaid) status = "Completed";
              if (isOverdue) status = "Overdue";

              return (
                <div key={project._id}
                  className={`relative rounded-3xl p-1 transition-all ${isOverdue ? "bg-red-500/10" : allPaid ? "bg-emerald-500/10" : "bg-slate-900/5"}`}>
                  <div className="bg-white rounded-3xl p-6 shadow-md border border-slate-100">
                    <div className="flex justify-between items-start mb-5">
                      <div>
                        <h3 className="text-xl font-black text-slate-900">{project.name}</h3>
                        <p className="text-xs text-slate-400 mt-1">Handled by {project.handledBy}</p>
                        {/* Stage badge */}
                        <span className="inline-block mt-2 px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-full">
                          {project.stage || "Intake"}
                        </span>
                      </div>
                      <span className={`px-3 py-1 text-[10px] font-black rounded-full ${
                        status === "Completed" ? "bg-emerald-500 text-white" :
                        status === "Overdue" ? "bg-red-600 text-white" :
                        "bg-yellow-400 text-black"}`}>
                        {status}
                      </span>
                    </div>

                    {isOverdue && (
                      <div className="mb-3 bg-red-100 text-red-600 text-xs px-3 py-2 rounded-lg font-bold">⚠ Payment overdue</div>
                    )}

                    <div className="bg-slate-50 rounded-2xl p-4 space-y-2">
                      <p className="text-sm font-bold text-slate-800">Total: ₹{project.totalPayment}</p>
                      {project.installments?.map((inst, index) => (
                        <div key={index} className="flex justify-between items-center text-xs border-t pt-2">
                          <span>{inst.phase} ({inst.percentage}%)</span>
                          <span className="font-bold">₹{inst.amount}</span>
                          <button
                            onClick={async () => {
                              await axiosInstance.put(`/projects/${project._id}/installment/${index}`);
                              fetchClient();
                            }}
                            className={`px-2 py-1 rounded text-[10px] font-bold ${inst.paid ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-600"}`}
                          >
                            {inst.paid ? "Paid ✓" : "Mark Paid"}
                          </button>
                        </div>
                      ))}
                      <p className="text-xs text-slate-400 pt-2 border-t">
                        Deadline: {project.deadline ? new Date(project.deadline).toDateString() : "Not Set"}
                      </p>
                    </div>

                    <div className="mt-4">
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: `${progress}%` }} />
                      </div>
                      <p className="text-xs text-slate-400 mt-1">{progress.toFixed(0)}% paid</p>
                    </div>

                    <div className="flex justify-end gap-6 mt-5 text-xs font-bold">
                      <button onClick={() => navigate(`/project/${project._id}`)} className="text-blue-600 hover:underline">View</button>
                      <button onClick={() => openEdit(project)} className="text-yellow-600 hover:underline">Edit</button>
                      <button onClick={() => handleDelete(project._id)} className="text-red-600 hover:underline">Delete</button>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;
