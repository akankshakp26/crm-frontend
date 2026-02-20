import React, { useState } from 'react';
import { CheckSquare } from "lucide-react";

import { 
  LayoutDashboard, Users, GitMerge, Settings, Map, Search, LogOut, Bell, ChevronDown, User, ShieldCheck, CheckCheck, Trash2
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Layout = ({ children, onLogout, user, searchTerm, setSearchTerm }) => {
  const safeUser = user || { name: "", role: "", initial: "safeUser.name?.charAt(0)" };
  const location = useLocation();
  const navigate = useNavigate();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // INTERACTIVE NOTIFICATION STATE
  const [notifications, setNotifications] = useState([
    { id: 1, title: "Security Update", desc: "MFA is now active.", icon: ShieldCheck, color: "text-blue-600", bg: "bg-blue-50" },
    { id: 2, title: "System Alert", desc: "Server sync completed.", icon: ShieldCheck, color: "text-emerald-600", bg: "bg-emerald-50" }
  ]);
  
  const markAsRead = (id) => {
    setNotifications(notifications.filter(note => note.id !== id));
  };

  const clearAll = () => setNotifications([]);

  const menuItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Leads', path: '/leads', icon: GitMerge },
    { name: 'Pipeline', path: '/pipeline', icon: Settings },
    { name: 'Clients', path: '/clients', icon: Users },
    { name: 'Journey', path: '/journey', icon: Map },
    { name: "Tasks", path: "/tasks", icon: CheckSquare },


  ];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans text-slate-900 text-left">
      <aside className="group w-20 hover:w-64 bg-slate-900/95 backdrop-blur-xl text-white flex flex-col transition-all duration-300 ease-in-out z-30 border-r border-white/10 shadow-2xl relative no-scrollbar">
        <div className="p-5 mb-10 flex-shrink-0">
          <div className="flex items-center gap-4 overflow-hidden">
            <div className="h-10 w-10 min-w-[40px] rounded-xl bg-blue-600 flex items-center justify-center font-bold shadow-lg ring-1 ring-white/30 text-white flex-shrink-0">V</div>
            <span className="text-xl font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">Valise CRM</span>
          </div>
        </div>
        <nav className="flex-1 px-3 space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.name} to={item.path} className={`flex items-center gap-4 p-3 rounded-2xl transition-all duration-200 group/item border ${isActive ? 'bg-white/15 backdrop-blur-md text-white border-white/10' : 'text-slate-400 border-transparent hover:bg-white/5 hover:text-white'}`}>
                <item.icon size={22} className="flex-shrink-0" style={{ color: isActive ? '#3b82f6' : 'inherit' }} />
                <span className="font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">{item.name}</span>
              </Link>
            );
          })}
        </nav>
        <div className="p-4 border-t border-white/5 bg-black/20">
          <button onClick={onLogout} className="flex items-center gap-4 p-3 w-full rounded-xl text-slate-400 hover:bg-red-500/20 hover:text-red-400 transition-all duration-200">
            <LogOut size={22} className="flex-shrink-0" />
            <span className="font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200">Logout</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-20 bg-white/70 backdrop-blur-lg border-b border-slate-200/60 flex items-center px-8 justify-between sticky top-0 z-20">
          <div className="relative w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input type="text" placeholder="Search leads..." className="w-full bg-slate-100/80 rounded-2xl py-2.5 pl-11 pr-4 focus:ring-2 focus:ring-blue-500 outline-none font-medium transition-all" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          
          <div className="flex items-center gap-6">
            <div className="relative py-4" onMouseEnter={() => setShowNotifications(true)} onMouseLeave={() => setShowNotifications(false)}>
                <button className={`p-2 rounded-xl transition-all relative ${showNotifications ? 'bg-blue-50 text-blue-600' : 'text-slate-400 hover:bg-slate-100'}`}>
                    <Bell size={20} />
                    {notifications.length > 0 && <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>}
                </button>
                {showNotifications && (
                    <div className="absolute right-0 top-[85%] mt-1 w-80 bg-white rounded-[2rem] border border-slate-100 shadow-2xl p-6 z-50 animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-black text-slate-900 tracking-tight">System Alerts</h3>
                            {notifications.length > 0 && (
                              <button onClick={clearAll} className="text-[10px] font-black text-slate-400 hover:text-red-500 uppercase flex items-center gap-1 transition-colors">
                                <Trash2 size={12} /> Clear All
                              </button>
                            )}
                        </div>
                        <div className="space-y-3">
                            {notifications.length > 0 ? notifications.map(note => (
                                <div key={note.id} className="flex items-center justify-between p-3 hover:bg-slate-50 rounded-2xl transition-all group">
                                    <div className="flex gap-4">
                                      <div className={`h-10 w-10 ${note.bg} ${note.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                                          <note.icon size={20} />
                                      </div>
                                      <div>
                                          <p className="text-xs font-bold text-slate-800">{note.title}</p>
                                          <p className="text-[10px] text-slate-400 mt-1">{note.desc}</p>
                                      </div>
                                    </div>
                                    <button onClick={() => markAsRead(note.id)} className="text-slate-200 hover:text-blue-500 opacity-0 group-hover:opacity-100 transition-all">
                                      <CheckCheck size={18} />
                                    </button>
                                </div>
                            )) : (
                              <div className="py-8 text-center">
                                <p className="text-xs font-bold text-slate-300 italic">No new notifications</p>
                              </div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            <div className="relative py-4" onMouseEnter={() => setShowProfileMenu(true)} onMouseLeave={() => setShowProfileMenu(false)}>
              <div className="flex items-center gap-3 cursor-pointer p-2 rounded-2xl hover:bg-slate-100/50 transition-all">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold text-slate-800 leading-none">
  {safeUser.name}
</p>

<p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-1.5 opacity-80">
  {safeUser.role}
</p>
                </div>
               
                <ChevronDown size={14} className={`text-slate-400 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} />
              </div>
              {showProfileMenu && (
                <div className="absolute right-0 top-[85%] w-48 bg-white rounded-3xl border border-slate-200 shadow-2xl p-2 z-50">
                  <button onClick={() => { navigate('/profile'); setShowProfileMenu(false); }} className="w-full flex items-center gap-3 p-3 text-slate-600 hover:bg-slate-50 rounded-2xl font-bold text-xs text-left"><User size={16} /> My Profile</button>
                  <div className="h-[1px] bg-slate-100 my-1 mx-2"></div>
                  <button onClick={onLogout} className="w-full flex items-center gap-3 p-3 text-red-500 hover:bg-red-50 rounded-2xl font-bold text-xs text-left"><LogOut size={16} /> Logout</button>
                </div>
              )}


            </div>
          </div>
        </header>
        <section className="flex-1 overflow-y-auto bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px]">
          <div className="max-w-[1400px] mx-auto p-8 lg:p-12 animate-in fade-in duration-700">{children}</div>
        </section>
        {/* ✅ Global Footer */}
<footer className="text-center py-6 text-sm text-slate-400 border-t border-slate-200 bg-white">
  © {new Date().getFullYear()} Valise CRM. All rights reserved.
</footer>

      </main>
    </div>
  );
};

export default Layout;