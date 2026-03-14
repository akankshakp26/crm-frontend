import React, { useEffect, useMemo, useState } from "react";
import axiosInstance from "../api/axiosInstance";

const INDIA_HOLIDAYS = {
  "2025-01-26": "Republic Day",
  "2025-03-17": "Holi",
  "2025-04-14": "Dr. Ambedkar Jayanti",
  "2025-04-18": "Good Friday",
  "2025-05-12": "Buddha Purnima",
  "2025-08-15": "Independence Day",
  "2025-08-27": "Janmashtami",
  "2025-10-02": "Gandhi Jayanti",
  "2025-10-02": "Dussehra",
  "2025-10-20": "Diwali",
  "2025-11-05": "Guru Nanak Jayanti",
  "2025-12-25": "Christmas",
  "2026-01-26": "Republic Day",
  "2026-03-06": "Holi",
  "2026-04-03": "Good Friday",
  "2026-04-14": "Dr. Ambedkar Jayanti",
  "2026-05-01": "Labour Day",
  "2026-08-15": "Independence Day",
  "2026-10-02": "Gandhi Jayanti",
  "2026-10-19": "Dussehra",
  "2026-11-08": "Diwali",
  "2026-12-25": "Christmas",
};

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

const toISO = (date) => {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
};

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [monthlyData, setMonthlyData] = useState([]);
  const [yearlyData, setYearlyData] = useState([]);
  const [leads, setLeads] = useState([]);
  const [clients, setClients] = useState([]);
  const [projects, setProjects] = useState([]);
  const [services, setServices] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [showRevenue, setShowRevenue] = useState(false);
  const [loading, setLoading] = useState(true);

  // Calendar state
  const today = new Date();
  const [calYear, setCalYear] = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth());
  const [selectedDay, setSelectedDay] = useState(null);

  const currency = (n) => `₹${Number(n || 0).toLocaleString()}`;

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const currentYear = new Date().getFullYear();
        const [statsRes, monthlyRes, yearlyRes, leadsRes, clientsRes, projectsRes, tasksRes] =
          await Promise.all([
            axiosInstance.get("/dashboard/stats"),
            axiosInstance.get(`/dashboard/monthly?year=${currentYear}`),
            axiosInstance.get("/dashboard/yearly"),
            axiosInstance.get("/leads"),
            axiosInstance.get("/clients"),
            axiosInstance.get("/projects"),
            axiosInstance.get("/tasks"),
          ]);

        setStats(statsRes.data || null);
        setMonthlyData(monthlyRes.data?.data || []);
        setYearlyData(yearlyRes.data || []);
        setLeads(leadsRes.data || []);
        setClients(clientsRes.data || []);
        setProjects(projectsRes.data || []);
        setTasks(tasksRes.data || []);

        // Fetch all services for all clients
        const allServices = [];
        for (const client of clientsRes.data || []) {
          try {
            const sRes = await axiosInstance.get(`/services/${client._id}`);
            allServices.push(...(sRes.data || []));
          } catch {}
        }
        setServices(allServices);
      } catch (error) {
        console.error("Dashboard fetch failed:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // ── BUILD EVENT MAP ──
  const eventMap = useMemo(() => {
    const map = {};

    const addEvent = (isoDate, event) => {
      if (!isoDate) return;
      if (!map[isoDate]) map[isoDate] = [];
      map[isoDate].push(event);
    };

    // Project installment deadlines
    projects.forEach((project) => {
      if (project.deadline) {
        const iso = toISO(project.deadline);
        project.installments?.forEach((inst) => {
          if (!inst.paid) {
            addEvent(iso, {
              type: "project",
              label: `${project.name} — ${inst.phase} (₹${Number(inst.amount).toLocaleString()})`,
              color: "bg-blue-500",
              dot: "bg-blue-500",
            });
          }
        });
      }
    });

    // Service monthly payments — generate for current & next month
    services.forEach((service) => {
      if (service.monthlyPayDate) {
        const payDay = new Date(service.monthlyPayDate).getDate();
        // Generate for 3 months
        for (let m = 0; m < 3; m++) {
          const d = new Date(today.getFullYear(), today.getMonth() + m, payDay);
          const iso = toISO(d);
          addEvent(iso, {
            type: "service",
            label: `${service.serviceName} — ₹${Number(service.monthlyAmount).toLocaleString()}`,
            color: "bg-emerald-500",
            dot: "bg-emerald-500",
          });
        }
      }
    });

    // Tasks due
    tasks.forEach((task) => {
      if (task.dueDate && task.status !== "Completed") {
        const iso = toISO(task.dueDate);
        addEvent(iso, {
          type: "task",
          label: task.title,
          color: "bg-red-500",
          dot: "bg-red-500",
        });
      }
    });

    // India holidays
    Object.entries(INDIA_HOLIDAYS).forEach(([iso, name]) => {
      addEvent(iso, {
        type: "holiday",
        label: name,
        color: "bg-amber-400",
        dot: "bg-amber-400",
      });
    });

    return map;
  }, [projects, services, tasks]);

  // ── CALENDAR GRID ──
  const calendarDays = useMemo(() => {
    const firstDay = new Date(calYear, calMonth, 1).getDay();
    const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
    const days = [];

    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) days.push(d);

    return days;
  }, [calYear, calMonth]);

  const prevMonth = () => {
    if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1); }
    else setCalMonth(m => m - 1);
    setSelectedDay(null);
  };

  const nextMonth = () => {
    if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1); }
    else setCalMonth(m => m + 1);
    setSelectedDay(null);
  };

  const selectedISO = selectedDay
    ? `${calYear}-${String(calMonth+1).padStart(2,"0")}-${String(selectedDay).padStart(2,"0")}`
    : null;

  const selectedEvents = selectedISO ? (eventMap[selectedISO] || []) : [];

  const currentMonthIndex = new Date().getMonth();
  const monthlyRevenue = stats?.monthlyRevenue || monthlyData[currentMonthIndex]?.totalRevenue || 0;
  const annualRevenue = stats?.annualRevenue || stats?.totalRevenue || 0;
  const activeClients = stats?.activeClients || stats?.totalClients || clients.length || 0;
  const marketStatus = stats?.marketStatus || "No Data";
  const totalRevenue = stats?.totalRevenue || 0;

  const flow = useMemo(() => {
    if (stats?.pipeline) return stats.pipeline;
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
        <h1 className="text-4xl font-black text-slate-900 mb-10 tracking-tight">Performance Overview</h1>
        <div className="text-slate-400 font-bold">Loading dashboard...</div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-white min-h-screen text-left">
      <h1 className="text-4xl font-black text-slate-900 mb-10 tracking-tight">Performance Overview</h1>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
        <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl hover:scale-[1.02] transition-all group">
          <p className="text-blue-400 font-bold uppercase text-[10px] tracking-widest">Active Clients</p>
          <h3 className="text-5xl font-black mt-2 group-hover:text-blue-500 transition-colors">{activeClients}</h3>
        </div>

        <button type="button" onClick={() => setShowRevenue(true)}
          className="text-left bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-2xl hover:scale-[1.02] transition-all group">
          <p className="text-blue-400 font-bold uppercase text-[10px] tracking-widest">Monthly Revenue</p>
          <h3 className="text-5xl font-black mt-2 group-hover:text-blue-500 transition-colors">{currency(monthlyRevenue)}</h3>
          <p className="mt-3 text-[10px] font-black uppercase tracking-[0.25em] text-slate-300/70">Click to view breakdown</p>
        </button>

        <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl">
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest">Market Status</p>
          <h3 className="text-5xl font-black text-slate-900 mt-2 italic">{marketStatus}</h3>
        </div>
      </div>

      {/* Calendar + Delivery Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* ── CALENDAR ── */}
        <div className="bg-white rounded-[3rem] border border-slate-100 shadow-xl p-8">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-black text-slate-900">Calendar</h2>
            <div className="flex items-center gap-3">
              <button onClick={prevMonth}
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 font-black transition">‹</button>
              <span className="font-black text-slate-900 text-sm min-w-[130px] text-center">
                {MONTHS[calMonth]} {calYear}
              </span>
              <button onClick={nextMonth}
                className="w-9 h-9 flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 font-black transition">›</button>
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap gap-3 mb-5">
            {[
              { dot: "bg-blue-500", label: "Project Payment" },
              { dot: "bg-emerald-500", label: "Service Payment" },
              { dot: "bg-red-500", label: "Task Due" },
              { dot: "bg-amber-400", label: "Holiday" },
            ].map((l) => (
              <div key={l.label} className="flex items-center gap-1.5">
                <div className={`w-2.5 h-2.5 rounded-full ${l.dot}`} />
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{l.label}</span>
              </div>
            ))}
          </div>

          {/* Day Headers */}
          <div className="grid grid-cols-7 mb-2">
            {DAYS.map((d) => (
              <div key={d} className="text-center text-[10px] font-black uppercase tracking-widest text-slate-300 py-1">{d}</div>
            ))}
          </div>

          {/* Days Grid */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, i) => {
              if (!day) return <div key={`empty-${i}`} />;

              const iso = `${calYear}-${String(calMonth+1).padStart(2,"0")}-${String(day).padStart(2,"0")}`;
              const events = eventMap[iso] || [];
              const isToday = iso === toISO(today);
              const isSelected = day === selectedDay;

              // Get unique event types for dots
              const types = [...new Set(events.map(e => e.type))];

              return (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day === selectedDay ? null : day)}
                  className={`relative flex flex-col items-center justify-start pt-1.5 pb-2 rounded-2xl min-h-[52px] transition-all text-sm font-bold ${
                    isSelected
                      ? "bg-slate-900 text-white shadow-lg"
                      : isToday
                      ? "bg-blue-600 text-white shadow-md"
                      : events.length > 0
                      ? "bg-slate-50 hover:bg-slate-100 text-slate-900"
                      : "hover:bg-slate-50 text-slate-700"
                  }`}
                >
                  <span>{day}</span>
                  {types.length > 0 && (
                    <div className="flex gap-0.5 mt-1 flex-wrap justify-center">
                      {types.map((type) => {
                        const dotColor = type === "project" ? "bg-blue-500" :
                          type === "service" ? "bg-emerald-500" :
                          type === "task" ? "bg-red-500" : "bg-amber-400";
                        return (
                          <div key={type}
                            className={`w-1.5 h-1.5 rounded-full ${isSelected || isToday ? "bg-white/80" : dotColor}`}
                          />
                        );
                      })}
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Selected Day Events */}
          {selectedDay && (
            <div className="mt-6 border-t border-slate-100 pt-5">
              <p className="font-black text-slate-900 text-sm mb-3">
                {selectedDay} {MONTHS[calMonth]} {calYear}
              </p>
              {selectedEvents.length === 0 ? (
                <p className="text-slate-400 font-bold text-xs">No events on this day</p>
              ) : (
                <div className="space-y-2">
                  {selectedEvents.map((ev, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl">
                      <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${ev.dot}`} />
                      <p className="text-sm font-bold text-slate-700">{ev.label}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── DELIVERY OVERVIEW ── */}
        <div className="bg-slate-900 p-10 rounded-[3rem] text-white shadow-2xl">
          <h2 className="text-2xl font-black mb-10 text-blue-400">Delivery Overview</h2>

          <div className="space-y-7">
            {[
              { label: "Leads Created", value: flow.leadsCreated || 0 },
              { label: "Projects Started", value: flow.projectsStarted || 0 },
              { label: "In Progress", value: flow.inProgress || 0 },
              { label: "Deploying", value: flow.deploying || 0 },
              { label: "Live", value: flow.live || 0 },
            ].map((row) => {
              const pct = leads.length ? Math.min(100, (row.value / leads.length) * 100) : 0;
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
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-300/70">Total Revenue</p>
            <p className="text-3xl font-black mt-2">{currency(totalRevenue)}</p>
          </div>
        </div>
      </div>

      {/* Revenue Modal */}
      {showRevenue && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6"
          onClick={() => setShowRevenue(false)}>
          <div className="w-full max-w-lg bg-white rounded-[2rem] p-8 shadow-2xl"
            onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-black text-slate-900">Revenue Breakdown</h3>
                <p className="text-xs font-bold text-slate-400 mt-1">Backend connected revenue summary</p>
              </div>
              <button className="text-slate-400 hover:text-slate-900 font-black" onClick={() => setShowRevenue(false)}>✕</button>
            </div>

            <div className="mt-8 space-y-4">
              {[
                { label: "Annual Revenue", value: annualRevenue },
                { label: "Monthly Revenue", value: monthlyRevenue },
                { label: "Yearly Report Entries", value: yearlyData.length, raw: true },
              ].map(({ label, value, raw }) => (
                <div key={label} className="bg-slate-50 border border-slate-100 rounded-2xl p-5">
                  <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">{label}</p>
                  <p className="text-3xl font-black text-slate-900 mt-2">{raw ? value : currency(value)}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}