import React, { useState } from 'react';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard({ onLogout }) {
  const [activeTab, setActiveTab] = useState('analyzer');
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);

  const chartData = [{ name: 'Mon', s: 40 }, { name: 'Tue', s: 30 }, { name: 'Wed', s: 65 }, { name: 'Thu', s: 45 }, { name: 'Fri', s: 90 }];

  const handleAnalyze = () => {
    const lowerText = text.toLowerCase();
    const positiveWords = ["happy", "good", "great", "wonderful", "excellent", "fine"];
    const isPositive = positiveWords.some(word => lowerText.includes(word));

    if (isPositive) {
      setResult({
        prediction: "Normal / Positive",
        color: "#10b981", 
        isRisk: false,
        emotion: "Joy/Contentment"
      });
    } else {
      setResult({
        prediction: "Anxiety Detected",
        color: "#818cf8", 
        isRisk: true,
        emotion: "Apprehension/Distress"
      });
    }
  };

  return (
    <div style={{ display: 'flex', width: '100vw', height: '100vh', background: '#05070a', color: 'white', overflow: 'hidden' }}>
      
      {/* SIDEBAR - DITTO */}
      <div style={{ width: '300px', background: '#0f172a', padding: '50px 30px', borderRight: '1px solid #1e293b', display: 'flex', flexDirection: 'column' }}>
        <h2 style={{ color: '#818cf8', fontWeight: '900', letterSpacing: '2px', marginBottom: '60px' }}>MINDSCAN AI</h2>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '15px', flex: 1 }}>
          <button onClick={() => setActiveTab('analyzer')} style={{ padding: '15px', borderRadius: '12px', border: 'none', background: activeTab === 'analyzer' ? '#4f46e5' : 'transparent', color: 'white', textAlign: 'left', cursor: 'pointer', fontWeight: 'bold' }}>Neural Analyzer</button>
          <button onClick={() => setActiveTab('stats')} style={{ padding: '15px', borderRadius: '12px', border: 'none', background: activeTab === 'stats' ? '#4f46e5' : 'transparent', color: 'white', textAlign: 'left', cursor: 'pointer', fontWeight: 'bold' }}>System Statistics</button>
        </nav>
        <button onClick={onLogout} style={{ background: 'transparent', color: '#ef4444', border: '1px solid #ef4444', padding: '12px', borderRadius: '10px', cursor: 'pointer', fontWeight: 'bold' }}>Terminate Session</button>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ flex: 1, padding: '40px 60px', overflowY: 'auto' }}>
        {activeTab === 'analyzer' ? (
          <div style={{ maxWidth: '1000px' }}>
            
            {/* QUICK STATS OVERVIEW CARDS */}
            <div style={{ display: 'flex', gap: '20px', marginBottom: '40px' }}>
              <div style={{ flex: 1, background: '#111827', padding: '20px', borderRadius: '20px', border: '1px solid #1e293b' }}>
                <p style={{ color: '#94a3b8', fontSize: '12px', textTransform: 'uppercase', marginBottom: '5px' }}>Total Posts Analyzed</p>
                <p style={{ fontSize: '24px', fontWeight: '900' }}>1,284</p>
              </div>
              <div style={{ flex: 1, background: '#111827', padding: '20px', borderRadius: '20px', border: '1px solid #1e293b' }}>
                <p style={{ color: '#94a3b8', fontSize: '12px', textTransform: 'uppercase', marginBottom: '5px' }}>System Risk Level</p>
                <p style={{ fontSize: '24px', fontWeight: '900', color: result?.isRisk ? "#ef4444" : "#10b981" }}>
                  {result ? (result.isRisk ? "HIGH" : "STABLE") : "STABLE"}
                </p>
              </div>
              <div style={{ flex: 1, background: '#111827', padding: '20px', borderRadius: '20px', border: '1px solid #1e293b' }}>
                <p style={{ color: '#94a3b8', fontSize: '12px', textTransform: 'uppercase', marginBottom: '5px' }}>Primary Emotion</p>
                <p style={{ fontSize: '24px', fontWeight: '900' }}>{result ? result.emotion : "Neutral"}</p>
              </div>
            </div>

            <h1 style={{ fontSize: '42px', fontWeight: '900', marginBottom: '10px' }}>Neural Signal Input</h1>
            <p style={{ color: '#94a3b8', marginBottom: '30px' }}>Clinical linguistic pattern processing.</p>
            
            <div style={{ background: '#111827', padding: '40px', borderRadius: '30px', border: '1px solid #1e293b' }}>
              <textarea 
                value={text} 
                onChange={(e) => setText(e.target.value)} 
                placeholder="Enter observations (e.g., 'I am sad')..." 
                style={{ width: '100%', height: '200px', background: '#05070a', border: '1px solid #1e293b', borderRadius: '20px', padding: '25px', color: 'white', fontSize: '18px', outline: 'none', resize: 'none' }} 
              />
              <button onClick={handleAnalyze} style={{ width: '100%', marginTop: '30px', padding: '20px', background: '#4f46e5', color: 'white', border: 'none', borderRadius: '15px', fontWeight: '900', cursor: 'pointer' }}>RUN AI DIAGNOSTICS</button>
            </div>

            {/* TELE-MANAS EMERGENCY ALERT */}
            {result && result.isRisk && (
              <div style={{ marginTop: '30px', background: 'rgba(239, 68, 68, 0.1)', padding: '25px', borderRadius: '20px', border: '1px solid #ef4444', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                 <div>
                    <h4 style={{ color: '#ef4444', fontSize: '12px', fontWeight: '900', textTransform: 'uppercase', marginBottom: '5px' }}>⚠️ TELE-MANAS EMERGENCY ALERT</h4>
                    <p style={{ color: '#fca5a5', fontSize: '14px' }}>High-risk signals detected. Immediate triage recommended.</p>
                 </div>
                 <a href="tel:14416" style={{ background: '#ef4444', color: 'white', padding: '12px 25px', borderRadius: '10px', textDecoration: 'none', fontWeight: '900', fontSize: '14px' }}>CALL TELE-MANAS</a>
              </div>
            )}

            {result && (
              <div style={{ marginTop: '30px', padding: '40px', background: '#111827', borderRadius: '30px', borderLeft: `12px solid ${result.color}` }}>
                <p style={{ color: result.color, fontWeight: '900', fontSize: '12px', letterSpacing: '2px' }}>NEURAL CLASSIFICATION</p>
                <h2 style={{ fontSize: '50px', fontWeight: '900', marginTop: '10px' }}>{result.prediction}</h2>
              </div>
            )}
          </div>
        ) : (
          <div style={{ width: '100%' }}>
            <h1 style={{ fontSize: '42px', fontWeight: '900', marginBottom: '40px' }}>System Trajectory</h1>
            <div style={{ background: '#111827', padding: '40px', borderRadius: '30px', border: '1px solid #1e293b', height: '450px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <Area type="monotone" dataKey="s" stroke="#818cf8" strokeWidth={4} fill="#818cf8" fillOpacity={0.1} />
                  <XAxis dataKey="name" stroke="#475569" />
                  <Tooltip contentStyle={{ background: '#0f172a', border: 'none', borderRadius: '10px' }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}