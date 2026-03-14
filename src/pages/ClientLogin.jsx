import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";

const ClientLogin = ({ onClientLogin }) => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await axiosInstance.post("/auth/client-login", form);
      localStorage.setItem("clientToken", res.data.token);
      localStorage.setItem("clientUser", JSON.stringify(res.data.client));
      onClientLogin(res.data.client);
      navigate("/client/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md">

        {/* Logo / Title */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black text-white tracking-tight">Client Portal</h1>
          <p className="text-blue-500 font-bold text-xs uppercase mt-3 tracking-[0.4em]">
            Secure Access
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-[3rem] shadow-2xl overflow-hidden">
          <div className="p-8 bg-slate-50 border-b border-slate-100">
            <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase">Sign In</h2>
            <p className="text-slate-400 font-bold text-sm mt-1">
              Use the credentials provided by your admin
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-10 space-y-6">
            {/* Username */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Username
              </label>
              <input
                required
                type="text"
                placeholder="your_username"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                className="w-full px-6 py-4 bg-slate-50 rounded-2xl font-bold border-none outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                Password
              </label>
              <input
                required
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full px-6 py-4 bg-slate-50 rounded-2xl font-bold border-none outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Error */}
            {error && (
              <div className="px-5 py-3 bg-red-50 rounded-2xl">
                <p className="text-red-500 font-bold text-sm">{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>

            {/* Back to admin */}
            <p className="text-center text-slate-400 text-sm font-bold">
              Admin?{" "}
              <span
                onClick={() => navigate("/login")}
                className="text-blue-500 cursor-pointer hover:underline"
              >
                Login here
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ClientLogin;
