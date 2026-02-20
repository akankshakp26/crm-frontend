import React, { useState, useEffect } from 'react';
import { User, Briefcase, Mail, Save, ArrowLeft, Shield } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Profile = ({ user, setUser }) => {
  const navigate = useNavigate();
const safeUser = user || { name: "", role: "", email: "" };

const [formData, setFormData] = useState({
  name: safeUser.name,
  role: safeUser.role,
  email: safeUser.email,
});

useEffect(() => {
  if (user) {
    setFormData({
      name: user.name,
      role: user.role,
      email: user.email,
    });
  }
}, [user]);
  const handleSave = (e) => {
    e.preventDefault();
    setUser({
      ...user,
      name: formData.name,
      role: formData.role,
      initial: formData.name.charAt(0).toUpperCase()
    });
    alert("Profile updated successfully!");
  };

  return (
    <div className="max-w-4xl mx-auto text-left animate-in fade-in duration-700">
      <button 
        onClick={() => navigate(-1)} 
        className="mb-8 flex items-center gap-2 text-slate-400 hover:text-slate-900 font-bold text-sm transition-all"
      >
        <ArrowLeft size={16} /> Back
      </button>

      <div className="mb-12">
        <h1 className="text-4xl font-black text-slate-900 tracking-tight">Account Settings</h1>
        <p className="text-blue-600 font-bold mt-2 uppercase tracking-widest text-[10px]">Manage your professional identity</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* SIDE CARD */}
        <div className="lg:col-span-1">
          <div className="bg-slate-900 p-10 rounded-[3rem] text-white text-center shadow-2xl">
            <div className="h-28 w-28 bg-blue-600 rounded-[2.5rem] mx-auto flex items-center justify-center text-4xl font-black mb-8 border-4 border-white/10 shadow-lg">
              {safeUser.name ? safeUser.name.charAt(0) : ""}
            </div>
            <h2 className="text-2xl font-black tracking-tight">{safeUser.name}</h2>
            <p className="text-[10px] font-black uppercase tracking-widest mt-3 opacity-60"></p>
            <div className="mt-10 pt-10 border-t border-white/5 space-y-4 text-left">
               <div className="flex items-center gap-3 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                 <Shield size={14} className="text-blue-500" /> Administrator
               </div>
               <div className="flex items-center gap-3 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                 <Mail size={14} className="text-blue-500" /> {formData.email}
               </div>
            </div>
          </div>
        </div>

        {/* EDIT FORM */}
        <div className="lg:col-span-2 space-y-8">
          <form onSubmit={handleSave} className="bg-white p-12 rounded-[3.5rem] border border-slate-100 shadow-sm space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-4 tracking-widest">Full Name</label>
                <div className="relative">
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input className="w-full p-5 pl-14 bg-slate-50 rounded-[1.5rem] border-none outline-none font-bold focus:ring-2 focus:ring-blue-500 transition-all" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-400 uppercase ml-4 tracking-widest">Job Role</label>
                <div className="relative">
                  <Briefcase className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                  <input className="w-full p-5 pl-14 bg-slate-50 rounded-[1.5rem] border-none outline-none font-bold focus:ring-2 focus:ring-blue-500 transition-all" value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} />
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-4 tracking-widest">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                <input className="w-full p-5 pl-14 bg-slate-50 rounded-[1.5rem] border-none outline-none font-bold focus:ring-2 focus:ring-blue-500 transition-all" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})} />
              </div>
            </div>

            <button type="submit" className="w-full py-6 bg-blue-600 text-white rounded-[2rem] font-black text-lg flex items-center justify-center gap-3 shadow-2xl transition-all hover:-translate-y-1 active:scale-95">
              <Save size={22} /> Save Profile Changes
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Profile;