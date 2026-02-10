import React from 'react';
import { LayoutDashboard, Users, Briefcase, Heart, Settings, LogOut } from 'lucide-react';

const Sidebar = () => {
  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, active: true },
    { name: 'Lead List', icon: Users, active: false }, // Akanksha's Page
    { name: 'Sales Pipeline', icon: Briefcase, active: false },
    { name: 'Client Insights', icon: Heart, active: false }, // Your Feature
    { name: 'Settings', icon: Settings, active: false },
  ];

  return (
    <div className="h-screen w-64 bg-slate-900 text-slate-300 flex flex-col fixed left-0 top-0">
      <div className="p-6">
        <h1 className="text-white text-2xl font-bold flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg"></div> CRM.io
        </h1>
      </div>

      <nav className="flex-1 px-4 space-y-2 mt-4">
        {menuItems.map((item) => (
          <a
            key={item.name}
            href="#"
            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              item.active 
                ? 'bg-blue-600 text-white' 
                : 'hover:bg-slate-800 hover:text-white'
            }`}
          >
            <item.icon size={20} />
            <span className="font-medium">{item.name}</span>
          </a>
        ))}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <button className="flex items-center gap-3 px-4 py-3 w-full hover:bg-slate-800 rounded-lg transition-colors">
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;