import React, { useState } from 'react';
import { 
  LayoutDashboard, Users, GitMerge, Settings, Map, Search, LogOut, Bell, ChevronDown, User, ShieldCheck, Clock
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Layout = ({ children, onLogout, user }) => {
  const location = useLocation();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  
  const menuItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Leads', path: '/leads', icon: GitMerge },
    { name: 'Pipeline', path: '/pipeline', icon: Settings },
    { name: 'Clients', path: '/clients', icon: Users },
    { name: 'Journey', path: '/journey', icon: Map },
  ];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans text-slate-900">
      
      {/* SIDEBAR WITH TOOLTIPS */}
      <aside className="group w-20 hover:w-64 bg-slate-900/90 backdrop-blur-xl text-white flex flex-col transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] z-30 border-r border-white/10 shadow-2xl relative no-scrollbar">
        <div className="p-6 mb-10 flex-shrink-0 relative">
          <div className="flex items-center gap-4 text-left">
            <div className="h-9 w-9 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-xl flex-shrink-0 flex items-center justify-center font-bold shadow-lg shadow-blue-600/40 ring-1 ring-white/30 text-white">V</div>
            <span className="text-xl font-bold opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">Valise CRM</span>
          </div>
        </div>
        
        <nav className="flex-1 px-3 pt-2 space-y-3 relative">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.name} to={item.path} className={`flex items-center gap-4 p-3 rounded-2xl transition-all duration-300 group/item relative border ${isActive ? 'bg-white/15 backdrop-blur-md text-white border-white/20' : 'text-slate-400 border-transparent hover:bg-white/5 hover:text-white'}`}>
                <item.icon size={22} className={`flex-shrink-0 transition-transform duration-300 ${isActive ? 'scale-110 text-blue-400' : 'group-hover/item:scale-110'}`} />
                <span className="font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">{item.name}</span>
                
                {/* TOOLTIP */}
                <div className="absolute left-20 px-3 py-1 bg-slate-800 text-white text-[10px] font-bold rounded-lg opacity-0 pointer-events-none group-hover:hidden group-hover/item:opacity-100 transition-opacity whitespace-nowrap z-50 shadow-xl border border-white/10">{item.name}</div>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/5 relative bg-black/10">
          <button onClick={onLogout} className="flex items-center gap-4 p-3 w-full rounded-xl text-slate-400 hover:bg-red-500/20 hover:text-red-400 transition-all duration-300 group/logout">
            <LogOut size={22} className="flex-shrink-0" />
            <span className="font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">Logout</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden relative">
        <header className="h-20 bg-white/70 backdrop-blur-lg border-b border-slate-200/60 flex items-center px-8 justify-between sticky top-0 z-20">
          <div className="relative w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
            <input type="text" placeholder="Search leads, clients..." className="w-full bg-slate-100/80 rounded-2xl py-2.5 pl-11 pr-4 focus:ring-4 focus:ring-blue-500/10 focus:bg-white border-transparent focus:border-blue-500/30 outline-none transition-all text-sm font-medium text-left" />
          </div>
          
          <div className="flex items-center gap-6">
            
            {/* NOTIFICATION HOVER BRIDGE */}
            <div className="relative py-4" onMouseEnter={() => setShowNotifications(true)} onMouseLeave={() => setShowNotifications(false)}>
                <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all relative">
                    <Bell size={20} />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
                </button>
                {showNotifications && (
                    <div className="absolute right-0 top-[85%] mt-1 w-80 bg-white rounded-[2rem] border border-slate-100 shadow-2xl p-6 z-50 animate-in fade-in zoom-in-95 duration-200">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="font-black text-slate-900 tracking-tight">System Alerts</h3>
                            <span className="text-[10px] font-black text-blue-600 uppercase bg-blue-50 px-2 py-1 rounded-lg">2 New</span>
                        </div>
                        <div className="space-y-4">
                            <div className="flex gap-4 p-3 hover:bg-slate-50 rounded-2xl transition-colors text-left"><div className="h-10 w-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center flex-shrink-0"><ShieldCheck size={20} /></div><div><p className="text-xs font-bold text-slate-800">Security Update</p><p className="text-[10px] text-slate-400 mt-1">MFA is now active.</p></div></div>
                        </div>
                    </div>
                )}
            </div>

            <div className="h-10 w-[1px] bg-slate-200"></div>
            
            {/* PROFILE HOVER BRIDGE */}
            <div className="relative py-4" onMouseEnter={() => setShowProfileMenu(true)} onMouseLeave={() => setShowProfileMenu(false)}>
              <div className="flex items-center gap-3 cursor-pointer p-2 rounded-2xl transition-all">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-bold text-slate-800 leading-none">{user.name}</p>
                  <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-1.5 opacity-80">{user.role}</p>
                </div>
                <div className="h-11 w-11 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold shadow-lg shadow-blue-600/30 ring-2 ring-white ring-offset-2 ring-offset-slate-50">{user.initial}</div>
                <ChevronDown size={14} className={`text-slate-400 transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} />
              </div>
              {showProfileMenu && (
                <div className="absolute right-0 top-[85%] w-48 bg-white rounded-3xl border border-slate-200 shadow-2xl p-2 animate-in fade-in zoom-in-95 duration-200 z-50">
                  <button className="w-full flex items-center gap-3 p-3 text-slate-600 hover:bg-blue-50 hover:text-blue-600 rounded-2xl font-bold transition-all text-xs text-left"><User size={16} /> My Profile</button>
                  <div className="h-[1px] bg-slate-100 my-1 mx-2"></div>
                  <button onClick={onLogout} className="w-full flex items-center gap-3 p-3 text-red-500 hover:bg-red-50 rounded-2xl font-bold transition-all text-xs text-left"><LogOut size={16} /> Logout</button>
                </div>
              )}
            </div>
          </div>
        </header>
        <section className="flex-1 overflow-y-auto bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px]">
          <div className="max-w-[1400px] mx-auto p-8 lg:p-12 animate-in fade-in duration-1000">{children}</div>
        </section>
      </main>
    </div>
  );
};

export default Layout;