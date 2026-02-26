import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { LayoutDashboard, GitMerge, Settings, Users, Map } from "lucide-react";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const sidebarBg = "#1e2532"; 
  const activeBlue = "#3b82f6";

  const menuItems = [
    { icon: <LayoutDashboard size={22} />, path: "/" },
    { icon: <GitMerge size={22} />, path: "/pipeline" },
    { icon: <Users size={22} />, path: "/leads" },
    { icon: <Map size={22} />, path: "/journey" },
    { icon: <Settings size={22} />, path: "/profile" },
  ];

  return (
    <div style={{ backgroundColor: sidebarBg }} className="w-20 h-screen flex flex-col items-center py-6 fixed left-0 top-0 z-50">
      <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-12 shadow-lg shadow-blue-500/40">
        <span className="text-white font-black text-xl">V</span>
      </div>

      <div className="flex flex-col gap-8 w-full items-center">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <div key={item.path} className="relative w-full flex justify-center items-center group">
              {isActive && (
                <div style={{ backgroundColor: activeBlue, boxShadow: `0 0 10px ${activeBlue}` }} className="absolute left-0 w-1 h-8 rounded-r-full" />
              )}
              <button onClick={() => navigate(item.path)} className={`p-3 rounded-2xl transition-all duration-200 ${isActive ? "bg-slate-700/40 text-blue-400 border border-white/5" : "text-slate-500 hover:text-slate-300"}`}>
                {item.icon}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Sidebar;