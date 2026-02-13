import React, { useState } from 'react';
import { Building2, ExternalLink, ShieldCheck} from 'lucide-react';

const ClientsPage = () => {
  // Mock data based on the Client Management requirements [cite: 32, 34]
  const [clients] = useState([
    { 
      id: 1, 
      name: "TechNova Solutions", 
      org: "Enterprise", 
      engagement: "High", 
      status: "Active",
      revenue: "$12,000" 
    },
    { 
      id: 2, 
      name: "Green Valley Agro", 
      org: "SME", 
      engagement: "Medium", 
      status: "Active",
      revenue: "$4,500" 
    },
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Client Management</h1>
          <p className="text-sm text-gray-500">Managing long-term relationships and organization data[cite: 108].</p>
        </div>
      </div>

      {/* Client Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {clients.map((client) => (
          <div key={client.id} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all group">
            <div className="flex justify-between items-start">
              <div className="flex gap-4">
                <div className="bg-blue-50 p-3 rounded-xl text-blue-600">
                  <Building2 size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 text-lg">{client.name}</h3>
                  <p className="text-sm text-gray-500 flex items-center gap-1">
                    <ShieldCheck size={14} className="text-green-500" /> {client.org} Account
                  </p>
                </div>
              </div>
              <button className="text-gray-400 hover:text-blue-600 transition-colors">
                <ExternalLink size={20} />
              </button>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-2">
              <div className="bg-gray-50 p-2 rounded-lg text-center">
                <p className="text-[10px] uppercase text-gray-400 font-bold">Engagement</p>
                <p className="text-sm font-semibold text-slate-700">{client.engagement}</p>
              </div>
              <div className="bg-gray-50 p-2 rounded-lg text-center">
                <p className="text-[10px] uppercase text-gray-400 font-bold">Status</p>
                <p className="text-sm font-semibold text-green-600">{client.status}</p>
              </div>
              <div className="bg-gray-50 p-2 rounded-lg text-center">
                <p className="text-[10px] uppercase text-gray-400 font-bold">Revenue</p>
                <p className="text-sm font-semibold text-blue-600">{client.revenue}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClientsPage;