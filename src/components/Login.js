import React, { useState } from 'react';
import { Mail, Lock, User, Briefcase, Shield } from 'lucide-react';
import axios from 'axios'; 
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  // State to control the sliding animation
  const [isSignUpActive, setIsSignUpActive] = useState(false);

  // States for the forms
  const [loginRole, setLoginRole] = useState('employee'); // 'employee' or 'admin'
  const [signupRole, setSignupRole] = useState('employee');
  
  const [signInData, setSignInData] = useState({ email: '', password: '' });
  const [signUpData, setSignUpData] = useState({ name: '', email: '', password: '' });

  const navigate = useNavigate();

  // --- SIGN IN LOGIC ---
  const handleSignIn = async (e) => {
    e.preventDefault();
    
    try {
      const response = await axios.post('http://localhost:5000/api/auth/login', {
        email: signInData.email,
        password: signInData.password,
        role: loginRole // Sending the toggle choice (admin or employee)
      });

      // 1. Backend sends back a Token and User Data
      const { token, user } = response.data;

      // 2. Save them to the browser's memory so LeadsPage.jsx can see them
      localStorage.setItem('token', token);
      localStorage.setItem('userInfo', JSON.stringify(user));

      // 3. Success! Send the user to the Leads page
      console.log("✅ Login Successful!");
      navigate('/leads');

    } catch (error) {
      console.error("❌ Login Failed:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Invalid credentials. Please try again.");
    }
  };


  // --- SIGN UP LOGIC ---
  const handleSignUp = async (e) => {
    e.preventDefault();
    
    try {
      await axios.post('http://localhost:5000/api/auth/register', {
        name: signUpData.name,
        email: signUpData.email,
        password: signUpData.password,
        role: signupRole // Tell backend if this is an admin or employee account
      });

      // If successful, show an alert and slide the panel back to Sign In
      alert("Account created successfully! Please sign in.");
      setIsSignUpActive(false); 
      setSignUpData({ name: '', email: '', password: '' }); // Clear the form

    } catch (error) {
      console.error("❌ Sign Up Failed:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Could not create account.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
      {/* Main Container */}
      <div className="relative overflow-hidden bg-white w-full max-w-[900px] min-h-[600px] rounded-[2rem] shadow-2xl">
        
        {/* --- SIGN UP FORM CONTAINER --- */}
        <div className={`absolute top-0 left-0 w-1/2 h-full transition-all duration-700 ease-in-out flex items-center justify-center px-12 ${
            isSignUpActive ? 'translate-x-full opacity-100 z-50' : 'opacity-0 z-10 pointer-events-none'
          }`}>
          <form onSubmit={handleSignUp} className="w-full flex flex-col items-center text-center">
            <h1 className="text-4xl font-black text-slate-900 mb-6 tracking-tight">Create Account</h1>
            
            {/* Role Toggle Switch */}
            <div className="flex bg-slate-100 p-1 rounded-2xl mb-8 w-full shadow-inner">
              <button type="button" onClick={() => setSignupRole('employee')} className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${signupRole === 'employee' ? 'bg-white text-slate-900 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}>
                <Briefcase size={16} /> Employee
              </button>
              <button type="button" onClick={() => setSignupRole('admin')} className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${signupRole === 'admin' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}>
                <Shield size={16} /> Admin
              </button>
            </div>

            <div className="w-full space-y-4">
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input required type="text" placeholder="Full Name" className="w-full bg-slate-50 border border-slate-100 text-slate-900 text-sm rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 py-4 pl-12 pr-4 font-bold transition-all" value={signUpData.name} onChange={(e) => setSignUpData({...signUpData, name: e.target.value})} />
              </div>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input required type="email" placeholder="Email Address" className="w-full bg-slate-50 border border-slate-100 text-slate-900 text-sm rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 py-4 pl-12 pr-4 font-bold transition-all" value={signUpData.email} onChange={(e) => setSignUpData({...signUpData, email: e.target.value})} />
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input required type="password" placeholder="Password" className="w-full bg-slate-50 border border-slate-100 text-slate-900 text-sm rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 py-4 pl-12 pr-4 font-bold transition-all" value={signUpData.password} onChange={(e) => setSignUpData({...signUpData, password: e.target.value})} />
              </div>
            </div>
            <button type="submit" className="mt-8 bg-slate-900 text-white font-black uppercase tracking-widest text-sm py-4 px-12 rounded-2xl hover:bg-black transition-all w-full shadow-lg">Sign Up</button>
          </form>
        </div>

        {/* --- SIGN IN FORM CONTAINER --- */}
        <div className={`absolute top-0 left-0 w-1/2 h-full transition-all duration-700 ease-in-out flex items-center justify-center px-12 ${
            isSignUpActive ? '-translate-x-full opacity-0 z-10 pointer-events-none' : 'translate-x-0 opacity-100 z-50'
          }`}>
          <form onSubmit={handleSignIn} className="w-full flex flex-col items-center text-center">
            <h1 className="text-4xl font-black text-slate-900 mb-6 tracking-tight">Sign In</h1>
            
            {/* Role Toggle Switch */}
            <div className="flex bg-slate-100 p-1 rounded-2xl mb-8 w-full shadow-inner">
              <button type="button" onClick={() => setLoginRole('employee')} className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${loginRole === 'employee' ? 'bg-white text-slate-900 shadow-md' : 'text-slate-400 hover:text-slate-600'}`}>
                <Briefcase size={16} /> Employee
              </button>
              <button type="button" onClick={() => setLoginRole('admin')} className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 ${loginRole === 'admin' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-600'}`}>
                <Shield size={16} /> Admin
              </button>
            </div>

            <div className="w-full space-y-4">
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input required type="email" placeholder="Email Address" className="w-full bg-slate-50 border border-slate-100 text-slate-900 text-sm rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 py-4 pl-12 pr-4 font-bold transition-all" value={signInData.email} onChange={(e) => setSignInData({...signInData, email: e.target.value})} />
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input required type="password" placeholder="Password" className="w-full bg-slate-50 border border-slate-100 text-slate-900 text-sm rounded-2xl outline-none focus:ring-2 focus:ring-indigo-500 py-4 pl-12 pr-4 font-bold transition-all" value={signInData.password} onChange={(e) => setSignInData({...signInData, password: e.target.value})} />
              </div>
            </div>
            
            <a href="#" className="text-slate-400 font-bold text-sm mt-4 hover:text-indigo-600 transition-colors">Forgot your password?</a>
            <button type="submit" className="mt-8 bg-indigo-600 text-white font-black uppercase tracking-widest text-sm py-4 px-12 rounded-2xl hover:bg-indigo-700 transition-all w-full shadow-lg shadow-indigo-200">Sign In</button>
          </form>
        </div>

        {/* --- OVERLAY CONTAINER (The part that slides) --- */}
        <div className={`absolute top-0 left-1/2 w-1/2 h-full overflow-hidden transition-transform duration-700 ease-in-out z-[100] ${
            isSignUpActive ? '-translate-x-full' : 'translate-x-0'
          }`}>
          
          <div className={`bg-gradient-to-br from-indigo-600 via-blue-600 to-indigo-800 relative -left-full h-full w-[200%] transition-transform duration-700 ease-in-out text-white ${
              isSignUpActive ? 'translate-x-1/2' : 'translate-x-0'
            }`}>
            
            {/* Left Overlay (Shows when moving to Sign In) */}
            <div className={`absolute top-0 left-0 flex flex-col items-center justify-center w-1/2 h-full px-12 text-center transition-transform duration-700 ease-in-out ${
                isSignUpActive ? 'translate-x-0' : '-translate-x-[20%]'
              }`}>
              <h2 className="text-4xl font-black mb-6 tracking-tight text-white">Welcome Back!</h2>
              <p className="text-indigo-100 font-medium text-sm leading-relaxed mb-10 px-4">
                To keep connected with us please login with your personal info and role.
              </p>
              <button 
                onClick={() => setIsSignUpActive(false)} 
                className="bg-transparent border-2 border-white text-white font-black uppercase tracking-widest text-sm py-3 px-12 rounded-2xl hover:bg-white hover:text-indigo-600 transition-all shadow-lg"
              >
                Sign In
              </button>
            </div>

            {/* Right Overlay (Shows when moving to Sign Up) */}
            <div className={`absolute top-0 right-0 flex flex-col items-center justify-center w-1/2 h-full px-12 text-center transition-transform duration-700 ease-in-out ${
                isSignUpActive ? 'translate-x-[20%]' : 'translate-x-0'
              }`}>
              <h2 className="text-4xl font-black mb-6 tracking-tight text-white">Hello, Friend!</h2>
              <p className="text-indigo-100 font-medium text-sm leading-relaxed mb-10 px-4">
                Enter your personal details and select your role to start your journey with us.
              </p>
              <button 
                onClick={() => setIsSignUpActive(true)} 
                className="bg-transparent border-2 border-white text-white font-black uppercase tracking-widest text-sm py-3 px-12 rounded-2xl hover:bg-white hover:text-indigo-600 transition-all shadow-lg"
              >
                Sign Up
              </button>
            </div>
            
          </div>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;