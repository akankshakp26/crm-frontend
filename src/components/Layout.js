import React from 'react';
import { LayoutDashboard, Users, GitMerge, Settings, Bell, Search, Map } from 'lucide-react';
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
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col shadow-xl">
        <div className="p-8 pb-10 flex items-center gap-3">
          <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-xl">V</div>
          <span className="text-xl font-bold tracking-tight">Valise CRM</span>
        </div>
        
        <nav className="flex-1 px-4 space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                location.pathname === item.path 
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' 
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.name}</span>
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center px-8 justify-between sticky top-0 z-10">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input type="text" placeholder="Quick search..." className="w-full bg-slate-100 rounded-xl py-2 pl-10 focus:ring-2 focus:ring-blue-500 outline-none text-sm" />
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-800">Akanksha</p>
              <p className="text-[10px] font-bold text-blue-600 uppercase tracking-tighter">Frontend Developer</p>
            </div>
            <div className="h-10 w-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold">A</div>
          </div>
        </header>

        <section className="flex-1 overflow-y-auto p-8 lg:p-12">
          {children}
        </section>
      </main>
    </div>
  );
};

export default Layout;