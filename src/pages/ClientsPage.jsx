import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Building2 } from 'lucide-react';
import axiosInstance from "../api/axiosInstance";

const ClientsPage = () => {
  const [clients, setClients] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const res = await axiosInstance.get("/clients");
      setClients(res.data);
    } catch (err) {
      console.error("Failed to fetch clients", err);
    }
  };

  return (
    <div className="p-8 text-left bg-white min-h-screen">
      <div className="mb-12 flex justify-between items-end border-b border-slate-100 pb-8">
        <div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tight">Active Clients</h1>
          <p className="text-blue-600 font-bold text-xs uppercase mt-3 tracking-[0.3em] flex items-center gap-2">
            <TrendingUp size={14} /> Enterprise Accounts
          </p>
        </div>

        <div className="bg-slate-900 text-white px-4 py-1.5 rounded-2xl flex items-center gap-2">
          <span className="text-blue-500 font-black text-xl">{clients.length}</span>
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 border-l border-slate-700 pl-2">Total</span>
        </div>
      </div>

      {clients.length === 0 ? (
        <div className="p-24 text-center bg-slate-50 rounded-[4rem] border-4 border-dashed border-slate-200">
          <Building2 className="text-slate-200 mx-auto mb-4" size={40} />
          <p className="text-slate-400 font-black uppercase tracking-widest text-xs">
            No clients yet.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {clients.map((client) => (
            <div
              key={client._id}
              onClick={() => navigate(`/projects/${client._id}`)}
              className="cursor-pointer group relative bg-slate-900 p-1 rounded-[2.8rem] hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500"
            >
              <div className="bg-slate-900 rounded-[2.6rem] p-8 border border-slate-800">
                <h3 className="text-3xl font-black text-white group-hover:text-blue-400 transition-colors">
                  {client.name}
                </h3>

                <div className="mt-6">
                  <p className="text-slate-400 text-xs uppercase">Revenue</p>
                  <p className="text-white text-2xl font-black">
                    ₹{(client.revenue || 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClientsPage;