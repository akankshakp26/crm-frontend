import React, { useMemo, useState, useEffect } from "react";
import axios from "axios"; // Added Axios to talk to your backend
import {
  Plus,
  CalendarDays,
  Flag,
  CheckCircle2,
  Circle,
  Clock3,
  Search,
  X,
} from "lucide-react";

export default function TasksPage() {
  const [activeTab, setActiveTab] = useState("Today");
  const [query, setQuery] = useState("");
  const [tasks, setTasks] = useState([]); // Start with an empty array!

  // Add Task Modal
  const [open, setOpen] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    due: "",
    priority: "Medium",
  });

  // --- NEW: FETCH DATA FROM YOUR BACKEND ---
  const fetchTasks = async () => {
    try {
      // Call your GET /api/tasks endpoint
      const response = await axios.get("http://localhost:5000/api/tasks");
      
      // Map your MongoDB database fields to match this UI's exact needs
      const realTasks = response.data.map((t) => ({
        id: t._id, // MongoDB uses _id
        title: t.title,
        due: t.dueDate ? t.dueDate.substring(0, 10) : "", // Format ISO date
        priority: "Medium", // (Your DB model didn't have priority, so we default it)
        done: t.status === "Completed", // Convert string status to boolean
      }));
      
      setTasks(realTasks);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  // Run the fetch function exactly once when the page loads
  useEffect(() => {
    fetchTasks();
  }, []);
  // -----------------------------------------

  const todayISO = useMemo(() => {
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }, []);

  const isToday = (iso) => iso === todayISO;
  const isPast = (iso) => iso < todayISO;
  const isFuture = (iso) => iso > todayISO;

  const filteredTasks = useMemo(() => {
    const q = query.trim().toLowerCase();

    return tasks
      .filter((t) => {
        if (activeTab === "Completed") return t.done;
        if (activeTab === "Today") return !t.done && isToday(t.due);
        if (activeTab === "Upcoming") return !t.done && isFuture(t.due);
        return true;
      })
      .filter((t) => (q ? t.title.toLowerCase().includes(q) : true))
      .sort((a, b) => (a.due > b.due ? 1 : -1));
  }, [tasks, activeTab, query, todayISO]);

  const stats = useMemo(() => {
    const todayCount = tasks.filter((t) => !t.done && isToday(t.due)).length;
    const upcomingCount = tasks.filter((t) => !t.done && isFuture(t.due)).length;
    const completedCount = tasks.filter((t) => t.done).length;
    return { todayCount, upcomingCount, completedCount };
  }, [tasks, todayISO]);

  // --- NEW: UPDATE DATA IN YOUR BACKEND ---
  const toggleDone = async (id) => {
    // 1. Find the task and determine new status
    const targetTask = tasks.find((t) => t.id === id);
    const newStatus = targetTask.done ? "Pending" : "Completed";

    // 2. Instantly update UI so it feels fast
    setTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );

    // 3. Silently update the database in the background
    try {
      await axios.put(`http://localhost:5000/api/tasks/${id}`, {
        status: newStatus,
      });
    } catch (error) {
      console.error("Error updating task:", error);
      fetchTasks(); // Revert UI if backend fails
    }
  };
  // -----------------------------------------

  // --- NEW: SAVE NEW DATA TO YOUR BACKEND ---
  const addTask = async (e) => {
    e.preventDefault();
    if (!newTask.title.trim() || !newTask.due) {
      alert("Please enter Task Title + Due Date");
      return;
    }

    try {
      // 1. Send data to your POST endpoint
      await axios.post("http://localhost:5000/api/tasks", {
        title: newTask.title.trim(),
        dueDate: newTask.due,
        status: "Pending", // Match your database schema
      });

      // 2. Refresh the list from the database
      fetchTasks();

      // 3. Reset UI
      setNewTask({ title: "", due: "", priority: "Medium" });
      setOpen(false);
      setActiveTab(isToday(newTask.due) ? "Today" : "Upcoming");
    } catch (error) {
      console.error("Error saving task:", error);
      alert("Failed to save task to database!");
    }
  };
  // -----------------------------------------

  return (
    <div className="space-y-8">
      {/* HERO HEADER */}
      <div className="relative overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-sm">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,#e2e8f0_1px,transparent_1px)] [background-size:18px_18px] opacity-60" />
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-blue-600/15 blur-3xl" />
        <div className="absolute -left-24 -bottom-24 h-72 w-72 rounded-full bg-slate-900/10 blur-3xl" />

        <div className="relative p-8 lg:p-10">
          <div className="flex items-start justify-between gap-6">
            <div>
              <p className="inline-flex items-center gap-2 rounded-full bg-blue-600/10 px-4 py-2 text-xs font-bold text-blue-700">
                <Clock3 className="h-4 w-4" />
                Tasks & Follow-ups
              </p>

              <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-900">
                Tasks
              </h1>
              <p className="mt-2 max-w-2xl text-slate-500">
                Manage follow-ups, reminders & priorities with a clean workflow.
              </p>
            </div>

            <button
              onClick={() => setOpen(true)}
              className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition"
              type="button"
            >
              <Plus className="h-5 w-5" />
              Add Task
            </button>
          </div>

          {/* STATS */}
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatCard
              title="Due Today"
              value={stats.todayCount}
              icon={<CalendarDays className="h-5 w-5" />}
              tone="blue"
            />
            <StatCard
              title="Upcoming"
              value={stats.upcomingCount}
              icon={<Clock3 className="h-5 w-5" />}
              tone="slate"
            />
            <StatCard
              title="Completed"
              value={stats.completedCount}
              icon={<CheckCircle2 className="h-5 w-5" />}
              tone="green"
            />
          </div>

          {/* FILTER + SEARCH */}
          <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-wrap gap-3">
              <Pill
                label="Today"
                active={activeTab === "Today"}
                onClick={() => setActiveTab("Today")}
              />
              <Pill
                label="Upcoming"
                active={activeTab === "Upcoming"}
                onClick={() => setActiveTab("Upcoming")}
              />
              <Pill
                label="Completed"
                active={activeTab === "Completed"}
                onClick={() => setActiveTab("Completed")}
              />
            </div>

            <div className="relative w-full max-w-md">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search tasks…"
                className="w-full rounded-2xl border border-slate-200 bg-white px-12 py-3 text-sm text-slate-900 outline-none focus:ring-4 focus:ring-blue-600/10 focus:border-blue-300 transition"
              />
            </div>
          </div>
        </div>
      </div>

      {/* TASK LIST */}
      <div className="rounded-[2rem] border border-slate-100 bg-white shadow-sm">
        <div className="flex items-center justify-between px-8 py-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-900">Task List</h2>
          <p className="text-sm text-slate-500">
            Showing <span className="font-semibold">{filteredTasks.length}</span>
          </p>
        </div>

        <div className="p-6 lg:p-8">
          {filteredTasks.length === 0 ? (
            <EmptyState
              activeTab={activeTab}
              onAdd={() => setOpen(true)}
              onReset={() => setQuery("")}
            />
          ) : (
            <div className="grid gap-4">
              {filteredTasks.map((t) => {
                const status =
                  t.done ? "Done" : isPast(t.due) ? "Overdue" : isToday(t.due) ? "Today" : "Upcoming";

                return (
                  <div
                    key={t.id}
                    className={[
                      "group rounded-3xl border border-slate-100 bg-white p-5 shadow-sm transition",
                      "hover:shadow-md hover:border-slate-200",
                    ].join(" ")}
                  >
                    <div className="flex items-start gap-4">
                      <button
                        onClick={() => toggleDone(t.id)}
                        className="mt-1 shrink-0 rounded-xl border border-slate-200 p-2 hover:bg-slate-50 transition"
                        type="button"
                        aria-label="Toggle Done"
                      >
                        {t.done ? (
                          <CheckCircle2 className="h-6 w-6 text-blue-600" />
                        ) : (
                          <Circle className="h-6 w-6 text-slate-400" />
                        )}
                      </button>

                      <div className="flex-1">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                          <div>
                            <p
                              className={[
                                "text-lg font-extrabold text-slate-900",
                                t.done ? "line-through text-slate-400" : "",
                              ].join(" ")}
                            >
                              {t.title}
                            </p>

                            <div className="mt-2 flex flex-wrap items-center gap-2">
                              <Badge
                                icon={<CalendarDays className="h-4 w-4" />}
                                text={`Due: ${formatDate(t.due)}`}
                                tone="slate"
                              />
                              <Badge
                                icon={<Flag className="h-4 w-4" />}
                                text={`Priority: ${t.priority}`}
                                tone={t.priority === "High" ? "red" : t.priority === "Medium" ? "yellow" : "green"}
                              />
                              <Badge
                                text={status}
                                tone={status === "Overdue" ? "red" : status === "Today" ? "blue" : status === "Upcoming" ? "slate" : "green"}
                              />
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <button
                              className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
                              type="button"
                              onClick={() => alert("UI only")}
                            >
                              View
                            </button>
                            <button
                              className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800 transition"
                              type="button"
                              onClick={() => alert("UI only")}
                            >
                              Add Note
                            </button>
                          </div>
                        </div>

                        {/* subtle progress bar */}
                        {!t.done && (
                          <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                            <div
                              className={[
                                "h-full rounded-full",
                                isPast(t.due) ? "w-[85%] bg-red-500" : isToday(t.due) ? "w-[60%] bg-blue-600" : "w-[35%] bg-slate-500",
                              ].join(" ")}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ADD MODAL */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-slate-900/40"
            onClick={() => setOpen(false)}
          />
          <div className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-white shadow-2xl border border-slate-200">
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
              <h3 className="text-lg font-extrabold text-slate-900">Add Task</h3>
              <button
                onClick={() => setOpen(false)}
                className="rounded-xl border border-slate-200 p-2 hover:bg-slate-50 transition"
                type="button"
              >
                <X className="h-5 w-5 text-slate-600" />
              </button>
            </div>

            <form onSubmit={addTask} className="p-6 space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-500">Task Title</label>
                <input
                  value={newTask.title}
                  onChange={(e) => setNewTask((p) => ({ ...p, title: e.target.value }))}
                  placeholder="Eg: Follow up with client…"
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:ring-4 focus:ring-blue-600/10 focus:border-blue-300 transition"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-xs font-bold text-slate-500">Due Date</label>
                  <input
                    type="date"
                    value={newTask.due}
                    onChange={(e) => setNewTask((p) => ({ ...p, due: e.target.value }))}
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:ring-4 focus:ring-blue-600/10 focus:border-blue-300 transition"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-500">Priority</label>
                  <select
                    value={newTask.priority}
                    onChange={(e) => setNewTask((p) => ({ ...p, priority: e.target.value }))}
                    className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:ring-4 focus:ring-blue-600/10 focus:border-blue-300 transition"
                  >
                    <option>High</option>
                    <option>Medium</option>
                    <option>Low</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="rounded-2xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition"
                >
                  Add Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------ UI Helpers ------------------ */

function Pill({ label, active, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "rounded-full px-7 py-3 text-sm font-bold transition border",
        active
          ? "bg-blue-600 text-white border-blue-600 shadow-sm"
          : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50",
      ].join(" ")}
    >
      {label}
    </button>
  );
}

function StatCard({ title, value, icon, tone = "slate" }) {
  const map = {
    blue: "bg-blue-600/10 text-blue-700",
    slate: "bg-slate-900/5 text-slate-700",
    green: "bg-emerald-600/10 text-emerald-700",
  };
  return (
    <div className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
          {title}
        </p>
        <span className={`inline-flex items-center gap-2 rounded-2xl px-3 py-2 text-sm font-bold ${map[tone]}`}>
          {icon}
        </span>
      </div>
      <p className="mt-2 text-3xl font-black text-slate-900">{value}</p>
    </div>
  );
}

function Badge({ icon, text, tone = "slate" }) {
  const tones = {
    slate: "bg-slate-900/5 text-slate-700 border-slate-200",
    blue: "bg-blue-600/10 text-blue-700 border-blue-200",
    green: "bg-emerald-600/10 text-emerald-700 border-emerald-200",
    yellow: "bg-amber-500/10 text-amber-700 border-amber-200",
    red: "bg-red-500/10 text-red-700 border-red-200",
  };

  return (
    <span
      className={[
        "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold",
        tones[tone],
      ].join(" ")}
    >
      {icon ? icon : null}
      {text}
    </span>
  );
}

function EmptyState({ activeTab, onAdd, onReset }) {
  return (
    <div className="rounded-3xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center">
      <p className="text-xl font-extrabold text-slate-900">No tasks found</p>
      <p className="mt-2 text-slate-500">
        {activeTab === "Completed"
          ? "You haven’t completed any tasks yet."
          : "Try adding a task or clear your search."}
      </p>
      <div className="mt-6 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <button
          onClick={onAdd}
          className="rounded-2xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition"
          type="button"
        >
          Add Task
        </button>
        <button
          onClick={onReset}
          className="rounded-2xl border border-slate-200 px-6 py-3 text-sm font-semibold text-slate-700 hover:bg-white transition"
          type="button"
        >
          Clear Search
        </button>
      </div>
    </div>
  );
}

function formatDate(iso) {
  try {
    const d = new Date(iso);
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = d.toLocaleString("en", { month: "short" });
    const yyyy = d.getFullYear();
    return `${dd} ${mm} ${yyyy}`;
  } catch {
    return iso;
  }
}