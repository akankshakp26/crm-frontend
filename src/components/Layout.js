import React from 'react';
import { Link } from 'react-router-dom';

const Layout = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar - Monika can style this later */}
      <aside className="w-64 bg-slate-900 text-white flex flex-col">
        <div className="p-6 text-2xl font-bold border-b border-slate-800">CRM Pro</div>
        <nav className="flex-1 p-4 space-y-2">
          <div className="p-3 bg-blue-600 rounded-lg cursor-pointer">Dashboard</div>
          <div className="p-3 hover:bg-slate-800 rounded-lg cursor-pointer">Clients</div>
          <div className="p-3 hover:bg-slate-800 rounded-lg cursor-pointer">Analytics</div>
          <Link to="/" className="block p-3 hover:bg-blue-600 rounded-lg">Dashboard</Link>
  <Link to="/clients" className="block p-3 hover:bg-blue-600 rounded-lg">Clients</Link>
        </nav>
      </aside>

      {/* Main Content Area - Where Akanksha's work goes */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-white border-b flex items-center px-8 justify-between">
          <span className="font-medium text-gray-500">Welcome back, Team!</span>
          <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">A</div>
        </header>
        <section className="flex-1 overflow-y-auto p-8">
          {children}
        </section>
      </main>
    </div>
  );
};

export default Layout;