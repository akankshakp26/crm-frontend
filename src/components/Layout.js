import React from 'react';
import { 
  LayoutDashboard, 
  Users, 
  GitMerge, 
  Settings, 
  Map, 
  Search,
  LogOut,
  Bell
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const Layout = ({ children }) => {
  const location = useLocation();
  
  const menuItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Leads', path: '/leads', icon: GitMerge },
    { name: 'Pipeline', path: '/pipeline', icon: Settings },
    { name: 'Clients', path: '/clients', icon: Users },
    { name: 'Journey', path: '/journey', icon: Map },
  ];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans text-slate-900">
      
      {/* 1. HOTSTAR-STYLE GLASS SIDEBAR */}
      <aside className="group w-20 hover:w-64 bg-slate-900/90 backdrop-blur-xl text-white flex flex-col transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] z-30 border-r border-white/10 shadow-2xl relative no-scrollbar">
        
        {/* Subtle top glow */}
        <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-blue-500/20 to-transparent pointer-events-none" />

        {/* Branding Area - Only one instance, cleaned up padding */}
        <div className="p-6 mb-10 flex-shrink-0 relative">
          <div className="flex items-center gap-4">
            <div className="h-9 w-9 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-xl flex-shrink-0 flex items-center justify-center font-bold shadow-lg shadow-blue-600/40 ring-1 ring-white/30">V</div>
            <span className="text-xl font-bold opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 font-sans">Valise CRM</span>
          </div>
        </div>
        
        {/* Nav Links - Added pt-2 so the Dashboard border doesn't touch the logo */}
        <nav className="flex-1 px-3 pt-2 space-y-3 relative overflow-y-auto no-scrollbar">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center gap-4 p-3 rounded-2xl transition-all duration-300 group/item relative border ${
                  isActive 
                  ? 'bg-white/15 backdrop-blur-md text-white border-white/20 shadow-xl' 
                  : 'text-slate-400 border-transparent hover:bg-white/5 hover:text-white hover:border-white/10'
                }`}
              >
                <item.icon size={22} className={`flex-shrink-0 transition-transform duration-300 ${isActive ? 'scale-110 text-blue-400' : 'group-hover/item:scale-110'}`} />
                <span className="font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
                  {item.name}
                </span>

                {/* Improved Active Indicator - Moves it slightly left so it doesn't cut the border */}
                {isActive && (
                    <div className="absolute -left-1 w-1.5 h-6 bg-blue-500 rounded-r-full shadow-[0_0_10px_rgba(59,130,246,0.5)] group-hover:opacity-0 transition-opacity" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Account / Logout Section */}
        <div className="p-4 border-t border-white/5 relative bg-black/10">
          <button className="flex items-center gap-4 p-3 w-full rounded-xl text-slate-400 hover:bg-red-500/20 hover:text-red-400 transition-all duration-300 group/logout">
            <LogOut size={22} className="flex-shrink-0" />
            <span className="font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
              Logout
            </span>
          </button>
        </div>
      </aside>

      {/* 2. MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        
        {/* Glass Header */}
        <header className="h-20 bg-white/70 backdrop-blur-lg border-b border-slate-200/60 flex items-center px-8 justify-between sticky top-0 z-20">
          <div className="relative w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-500 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search leads, clients..." 
              className="w-full bg-slate-100/80 rounded-2xl py-2.5 pl-11 pr-4 focus:ring-4 focus:ring-blue-500/10 focus:bg-white border-transparent focus:border-blue-500/30 outline-none transition-all text-sm font-medium" 
            />
          </div>
          
          <div className="flex items-center gap-6">
            <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all relative">
                <Bell size={20} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-10 w-[1px] bg-slate-200"></div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-800 leading-none">Akanksha</p>
                <p className="text-[10px] font-black text-blue-600 uppercase tracking-widest mt-1.5 opacity-80">Frontend Developer</p>
              </div>
              <div className="h-11 w-11 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white font-bold shadow-lg shadow-blue-600/30 ring-2 ring-white ring-offset-2 ring-offset-slate-50 cursor-pointer hover:scale-105 transition-transform">
                A
              </div>
            </div>
          </div>
        </header>

        {/* 3. SCROLLABLE PAGE CONTENT */}
        <section className="flex-1 overflow-y-auto bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:24px_24px]">
          <div className="max-w-[1400px] mx-auto p-8 lg:p-12 animate-in fade-in duration-1000">
            {children}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Layout;