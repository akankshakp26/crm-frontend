import React, { useState } from 'react';
import axiosInstance from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";

const LoginPage = ({ onLogin, onClientLogin }) => {
  const navigate = useNavigate();

  const [loginType, setLoginType] = useState("sales");
  const [error, setError] = useState("");

  // Admin fields
  const [email, setEmail] = useState("");
  const [adminPassword, setAdminPassword] = useState("");

  // Client fields
  const [username, setUsername] = useState("");
  const [clientPassword, setClientPassword] = useState("");

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setError("");

    try {
      if (loginType === "sales") {
        // ── CLIENT LOGIN ──
        const res = await axiosInstance.post("/auth/client-login", {
          username,
          password: clientPassword,
        });

        localStorage.setItem("clientToken", res.data.token);
        localStorage.setItem("clientUser", JSON.stringify(res.data.client));
        onClientLogin(res.data.client);
        navigate("/client/dashboard");

      } else {
        // ── ADMIN LOGIN ──
        const res = await axiosInstance.post("/auth/login", {
          email,
          password: adminPassword,
        });

        const loggedUser = res.data.user;

        if (loggedUser.role !== "admin") {
          setError("Access denied: Admin account required");
          return;
        }

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("user", JSON.stringify(loggedUser));
        onLogin(loggedUser);
        navigate("/");
      }

    } catch (err) {
      console.log("AUTH ERROR:", err.response?.data);
      setError(err.response?.data?.message || "Invalid credentials");
    }
  };

  // --- STYLING ---
  const midnightGradient = 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)';
  const textDark = '#0f172a';

  const roleButtonStyle = (id) => ({
    flex: 1,
    padding: '12px',
    borderRadius: '14px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '800',
    fontSize: '13px',
    transition: 'all 0.3s ease',
    background: loginType === id ? midnightGradient : '#f1f5f9',
    color: loginType === id ? '#fff' : '#94a3b8',
    boxShadow: loginType === id ? '0 4px 12px rgba(30, 58, 138, 0.2)' : 'none'
  });

  const primaryButtonStyle = {
    borderRadius: '16px',
    border: 'none',
    background: midnightGradient,
    color: '#fff',
    padding: '16px 52px',
    cursor: 'pointer',
    marginTop: '25px',
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    width: '100%',
    boxShadow: '0 10px 25px -5px rgba(30, 58, 138, 0.4)'
  };

  return (
    <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f1f5f9' }}>
      <div style={{ backgroundColor: '#fff', borderRadius: '32px', overflow: 'hidden', width: '850px', minHeight: '520px', position: 'relative', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.2)' }}>

        {/* FORM SIDE */}
        <div style={{ position: 'absolute', top: 0, height: '100%', width: '50%', left: '0', zIndex: 20 }}>
          <form style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '0 60px', textAlign: 'center' }} onSubmit={handleSubmit}>
            <h1 style={{ margin: 0, fontSize: '36px', fontWeight: '900', color: textDark, marginBottom: '8px' }}>
              Welcome Back
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '14px', fontWeight: '600', marginBottom: '25px' }}>
              Sign in to your dashboard
            </p>

            {/* ROLE SELECTOR */}
            <div style={{ display: 'flex', width: '100%', gap: '12px', marginBottom: '20px' }}>
              <button type="button" onClick={() => { setLoginType("sales"); setError(""); }} style={roleButtonStyle("sales")}>
                Client
              </button>
              <button type="button" onClick={() => { setLoginType("admin"); setError(""); }} style={roleButtonStyle("admin")}>
                Admin
              </button>
            </div>

            {error && <p style={{ color: '#ef4444', fontSize: '12px', fontWeight: '700', marginBottom: '10px' }}>{error}</p>}

            {/* CLIENT FIELDS */}
            {loginType === "sales" && (
              <>
                <input
                  style={inputStyle}
                  type="text"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
                <input
                  style={inputStyle}
                  type="password"
                  placeholder="Password"
                  value={clientPassword}
                  onChange={(e) => setClientPassword(e.target.value)}
                  required
                />
              </>
            )}

            {/* ADMIN FIELDS */}
            {loginType === "admin" && (
              <>
                <input
                  style={inputStyle}
                  type="email"
                  placeholder="Email Address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <input
                  style={inputStyle}
                  type="password"
                  placeholder="Password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  required
                />
              </>
            )}

            <button style={primaryButtonStyle} type="submit">
              Sign In
            </button>
          </form>
        </div>

        {/* STATIC PANEL */}
        <div style={{ position: 'absolute', top: 0, height: '100%', width: '50%', left: '50%', background: midnightGradient, color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 50px', textAlign: 'center' }}>
          <h1 style={{ margin: 0, fontSize: '30px', fontWeight: '900' }}>CRM Portal</h1>
          <p style={{ margin: '20px 0 35px', color: 'rgba(255,255,255,0.8)', lineHeight: '1.6', fontWeight: '500' }}>
            {loginType === "sales"
              ? "Enter your username and password provided by your admin."
              : "Enter your credentials to access your leads and manage your workflow efficiently."}
          </p>
        </div>
      </div>
    </div>
  );
};

const inputStyle = {
  backgroundColor: '#f8fafc',
  border: '1px solid #e2e8f0',
  padding: '15px 20px',
  margin: '8px 0',
  width: '100%',
  borderRadius: '14px',
  outline: 'none',
  fontSize: '14px',
  fontWeight: '600'
};

export default LoginPage;
