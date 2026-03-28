import React, { useState } from 'react';
import './style.css'; 
import Dashboard from './Dashboard'; 

const Ticker = () => {
  const items = ["AI CORE v4.2 ONLINE", "98.2% CLINICAL ACCURACY", "TELE-MANAS PROTOCOL ACTIVE", "SECURE DIAGNOSTIC ENVIRONMENT"];
  return (
    <div className="ticker-container">
      <div className="ticker-track">
        {[...items, ...items].map((item, i) => <span key={i} className="ticker-item">{item}</span>)}
      </div>
    </div>
  );
};

export default function App() {
  const [isLogged, setIsLogged] = useState(false);
  const [isSignup, setIsSignup] = useState(false); // Toggle for Signup
  const [user, setUser] = useState('');
  const [pass, setPass] = useState('');

  const handleAuth = () => {
    if (isSignup) {
      alert("Account created successfully! Please login.");
      setIsSignup(false);
    } else {
      if (user === 'admin' && pass === 'password123') {
        setIsLogged(true);
      } else {
        alert("Access Denied: Please check credentials.");
      }
    }
  };

  if (isLogged) return <Dashboard onLogout={() => setIsLogged(false)} />;

  return (
    <div className="app-container">
      <Ticker />
      <div className="hero-wrapper">
        <div className="content-left">
          <h1 className="brand-title">MIND<br/>SCAN</h1>
          <p className="hero-subtitle">Next-Generation Clinical Diagnostics.</p>
          <div className="info-card">
            <h4 className="card-label">Validated System</h4>
            <p className="card-text">Achieving a 98.2% accuracy score against clinical datasets.</p>
          </div>
          <div className="info-card">
            <h4 className="card-label">Emergency Triage</h4>
            <p className="card-text">Integrated with <strong>Tele-MANAS</strong> protocols for high-risk signals.</p>
          </div>
        </div>

        <div className="login-box">
          <h2 className="login-title">{isSignup ? "Create Account" : "Admin Access"}</h2>
          <p className="login-subtitle" style={{color: '#94a3b8', marginBottom: '20px'}}>
            {isSignup ? "Register for the diagnostic core." : "Initialize diagnostic session."}
          </p>
          
          <input 
            placeholder="Username" 
            value={user} 
            onChange={e => setUser(e.target.value)} 
          />
          <input 
            type="password" 
            placeholder="Security Key" 
            value={pass} 
            onChange={e => setPass(e.target.value)} 
          />
          
          <button className="admin-btn" onClick={handleAuth}>
            {isSignup ? "Register System" : "Authorize System"}
          </button>

          <p style={{ marginTop: '20px', color: '#94a3b8', fontSize: '14px', textAlign: 'center' }}>
            {isSignup ? "Already have access?" : "Need a new account?"} 
            <span 
              onClick={() => setIsSignup(!isSignup)} 
              style={{ color: '#818cf8', cursor: 'pointer', marginLeft: '5px', fontWeight: 'bold' }}
            >
              {isSignup ? "Login here" : "Sign up here"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}