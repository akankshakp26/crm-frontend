import React, { useState } from 'react';
import axiosInstance from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";

const LoginPage = ({ onLogin }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();

  // Form States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("sales"); // Default to 'sales' per backend enum
  const [error, setError] = useState("");

 const handleSubmit = async (e) => {
  if (e) e.preventDefault(); // Stop page reload
  setError("");

  try {
  if (isSignUp) {
    // We MUST send the role 'admin' or 'sales' to the backend
    await axiosInstance.post("/auth/register", {
      name,
      email,
      password,
      role: "admin" // Hardcode this to 'admin' for now so you can log in
    });

    alert("Registration successful!");
    setIsSignUp(false);
    return;
  }

  // --- LOGIN BLOCK ---
  const res = await axiosInstance.post("/auth/login", { email, password });
  localStorage.setItem("token", res.data.token);
  localStorage.setItem("user", JSON.stringify(res.data.user));

  onLogin(res.data.user);
  navigate("/");

} catch (err) {
  console.log("AUTH ERROR:", err.response?.data);
  setError(err.response?.data?.message || "Something went wrong");
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
    background: role === id ? midnightGradient : '#f1f5f9',
    color: role === id ? '#fff' : '#94a3b8',
    boxShadow: role === id ? '0 4px 12px rgba(30, 58, 138, 0.2)' : 'none'
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
        <div style={{ position: 'absolute', top: 0, height: '100%', width: '50%', left: isSignUp ? '50%' : '0', transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)', zIndex: 20 }}>
          <form style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '0 60px', textAlign: 'center' }} onSubmit={handleSubmit}>
            <h1 style={{ margin: 0, fontSize: '36px', fontWeight: '900', color: textDark, marginBottom: '8px' }}>
              {isSignUp ? 'Create Account' : 'Welcome Back'}
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '14px', fontWeight: '600', marginBottom: '25px' }}>
              {isSignUp ? 'Register your account details' : 'Sign in to your dashboard'}
            </p>
            
            {/* ROLE SELECTOR */}
            <div style={{ display: 'flex', width: '100%', gap: '12px', marginBottom: '20px' }}>
              <button type="button" onClick={() => setRole('sales')} style={roleButtonStyle('sales')}>Employee</button>
              <button type="button" onClick={() => setRole('admin')} style={roleButtonStyle('admin')}>Admin</button>
            </div>

            {error && <p style={{ color: '#ef4444', fontSize: '12px', fontWeight: '700', marginBottom: '10px' }}>{error}</p>}

            {isSignUp && (
              <input style={inputStyle} type="text" placeholder="Full Name" value={name} onChange={(e) => setName(e.target.value)} />
            )}
            <input style={inputStyle} type="email" placeholder="Email Address" value={email} onChange={(e) => setEmail(e.target.value)} />
            <input style={inputStyle} type="password" placeholder="Password (Min 6 chars)" value={password} onChange={(e) => setPassword(e.target.value)} />

           <button
  style={primaryButtonStyle}
  type="submit"
>
  {isSignUp ? 'Sign Up' : 'Sign In'}
</button>
          </form>
        </div>

        {/* SLIDING PANEL */}
        <div style={{ position: 'absolute', top: 0, height: '100%', width: '50%', left: isSignUp ? '0' : '50%', transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)', background: midnightGradient, color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 50px', textAlign: 'center' }}>
          <h1 style={{ margin: 0, fontSize: '30px', fontWeight: '900' }}>
            {isSignUp ? 'Already a Member?' : 'New Here?'}
          </h1>
          <p style={{ margin: '20px 0 35px', color: 'rgba(255,255,255,0.8)', lineHeight: '1.6', fontWeight: '500' }}>
            {isSignUp ? 'Log in to start managing your leads' : 'Enter your details and start your journey with us'}
          </p>
          <button onClick={() => setIsSignUp(!isSignUp)} style={{ ...primaryButtonStyle, background: 'transparent', border: '2px solid #fff', boxShadow: 'none', width: 'auto' }}>
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </div>
      </div>
    </div>
  );
};

const inputStyle = { backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', padding: '15px 20px', margin: '8px 0', width: '100%', borderRadius: '14px', outline: 'none', fontSize: '14px', fontWeight: '600' };

export default LoginPage;