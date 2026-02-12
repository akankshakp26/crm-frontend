import React, { useState } from 'react';

const LoginPage = ({ onLogin }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [hoveredIcon, setHoveredIcon] = useState(null);

  // --- THE NEW MIDNIGHT BLUE BRANDING ---
  // A deeper, more professional blue gradient
  const midnightGradient = 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)';
  const textDark = '#0f172a';

  const socialIconStyle = (id) => ({
    border: '1.5px solid #e2e8f0',
    borderRadius: '14px',
    width: '52px',
    height: '52px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontSize: '18px',
    fontWeight: '700',
    // MATCHING LOGIC: Icon hover matches the deep blue panel
    background: hoveredIcon === id ? midnightGradient : '#fff',
    color: hoveredIcon === id ? '#fff' : '#64748b',
    borderColor: hoveredIcon === id ? 'transparent' : '#e2e8f0',
    boxShadow: hoveredIcon === id ? '0 10px 20px -5px rgba(30, 58, 138, 0.4)' : 'none'
  });

  const primaryButtonStyle = {
    borderRadius: '16px',
    border: 'none',
    background: midnightGradient, // Tied to the panel color
    color: '#fff',
    padding: '16px 52px',
    cursor: 'pointer',
    marginTop: '25px',
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    boxShadow: '0 10px 25px -5px rgba(30, 58, 138, 0.4)'
  };

  return (
    <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f1f5f9' }}>
      <div style={{ backgroundColor: '#fff', borderRadius: '32px', overflow: 'hidden', width: '850px', minHeight: '520px', position: 'relative', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.2)' }}>
        
        {/* WHITE FORM SIDE */}
        <div style={{ position: 'absolute', top: 0, height: '100%', width: '50%', left: isSignUp ? '50%' : '0', transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)', zIndex: 2 }}>
          <form style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '0 60px', textAlign: 'center' }} 
                onSubmit={(e) => { e.preventDefault(); onLogin(); }}>
            <h1 style={{ margin: 0, fontSize: '32px', fontWeight: '900', color: textDark }}>{isSignUp ? 'Join Valise' : 'Sign In'}</h1>
            
            <div style={{ margin: '30px 0', display: 'flex', gap: '15px' }}>
              {['fb', 'google', 'linkedin'].map((id) => (
                <div key={id} style={socialIconStyle(id)} onMouseEnter={() => setHoveredIcon(id)} onMouseLeave={() => setHoveredIcon(null)}>
                  {id === 'fb' ? 'f' : id === 'google' ? 'G' : 'in'}
                </div>
              ))}
            </div>
            
            <span style={{ fontSize: '10px', color: '#94a3b8', marginBottom: '15px', fontWeight: '800', letterSpacing: '1.5px' }}>OR USE YOUR EMAIL</span>
            {isSignUp && <input style={inputStyle} type="text" placeholder="Full Name" />}
            <input style={inputStyle} type="email" placeholder="Email Address" />
            <input style={inputStyle} type="password" placeholder="Password" />
            <button style={primaryButtonStyle} type="submit">{isSignUp ? 'Sign Up' : 'Sign In'}</button>
          </form>
        </div>

        {/* MIDNIGHT BLUE PANEL */}
        <div style={{ 
          position: 'absolute', top: 0, height: '100%', width: '50%', 
          left: isSignUp ? '0' : '50%', transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)', 
          background: midnightGradient, // FULL PANEL MATCH
          color: '#fff', display: 'flex', flexDirection: 'column', 
          alignItems: 'center', justifyContent: 'center', padding: '0 50px', textAlign: 'center' 
        }}>
          <h1 style={{ margin: 0, fontSize: '30px', fontWeight: '900' }}>{isSignUp ? 'Welcome Back!' : 'Hello, Friend!'}</h1>
          <p style={{ margin: '20px 0 35px', color: 'rgba(255,255,255,0.7)', lineHeight: '1.6' }}>{isSignUp ? 'Keep connected with us please login with your info' : 'Enter your details and start your journey with us'}</p>
          <button onClick={() => setIsSignUp(!isSignUp)} style={{ ...primaryButtonStyle, background: 'transparent', border: '2px solid #fff', boxShadow: 'none' }}>
            {isSignUp ? 'Sign In' : 'Sign Up'}
          </button>
        </div>

      </div>
    </div>
  );
};

const inputStyle = { backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', padding: '15px 20px', margin: '10px 0', width: '100%', borderRadius: '14px', outline: 'none', fontSize: '14px' };

export default LoginPage;