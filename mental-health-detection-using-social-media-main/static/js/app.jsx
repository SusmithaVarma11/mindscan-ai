const { useState } = React;

function LoginView({ onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(window.__LOGIN_ERROR__ || '');
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await res.json();

            if (!res.ok || !data.success) {
                setError(data.error || 'Login failed.');
                return;
            }

            onLogin();
            window.history.pushState({}, '', '/dashboard');
        } catch (e) {
            setError('Unable to login right now. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex h-screen w-full">
            <div className="hidden lg:flex lg:w-1/2 gradient-side items-center justify-center p-12 relative">
                <div className="absolute top-0 left-0 w-full h-full bg-black/10"></div>
                <div className="relative z-10 text-white max-w-md">
                    <h1 className="text-6xl font-black mb-6">Your Mind,<br /><span className="text-white/70">Analyzed.</span></h1>
                    <p className="text-lg text-white/80 leading-relaxed font-light">Join thousands using MindScan AI to better understand emotional health through language patterns.</p>
                </div>
            </div>

            <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-[#0f172a]">
                <div className="w-full max-w-md">
                    <div className="mb-10 text-center lg:text-left">
                        <h2 className="text-4xl font-bold text-white mb-2">Welcome Back</h2>
                        <p className="text-slate-400">Enter your credentials to access the AI engine.</p>
                    </div>

                    {error && (
                        <div className="bg-rose-500/10 border border-rose-500/50 text-rose-400 p-4 rounded-xl mb-6 text-sm">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-slate-300 text-sm font-semibold mb-2">Username</label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                placeholder="admin"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-slate-300 text-sm font-semibold mb-2">Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 text-white font-bold py-4 rounded-xl shadow-lg transition-all transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70"
                        >
                            {loading ? 'Signing In...' : 'Sign In'}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-slate-500 text-sm">
                        Demo Mode: User is <span className="text-indigo-400">admin</span> / <span className="text-indigo-400">password123</span>
                    </p>
                </div>
            </div>
        </div>
    );
}

function DashboardView({ onLogout }) {
    const [text, setText] = useState('');
    const [prediction, setPrediction] = useState('--');
    const [confidence, setConfidence] = useState('0%');
    const [color, setColor] = useState('transparent');
    const [showResult, setShowResult] = useState(false);
    const [loading, setLoading] = useState(false);

    const risks = ['Depression', 'Anxiety', 'Sad'];
    const showTele = risks.includes(prediction);

    async function analyzeText() {
        if (!text.trim()) {
            alert('Please enter text.');
            return;
        }

        setLoading(true);

        try {
            const res = await fetch('/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ text })
            });

            if (!res.ok) {
                throw new Error('Failed to analyze text');
            }

            const data = await res.json();
            setPrediction(data.prediction || '--');
            setConfidence(data.confidence || '0%');
            setColor(data.color || '#ffffff');
            setShowResult(true);
        } catch (e) {
            alert('Unable to analyze right now. Please try again.');
        } finally {
            setLoading(false);
        }
    }

    function resetForm() {
        setText('');
        setPrediction('--');
        setConfidence('0%');
        setColor('transparent');
        setShowResult(false);
    }

    function downloadPDF() {
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        doc.setFontSize(20);
        doc.text('MindScan Report', 20, 20);
        doc.setFontSize(10);
        doc.text(`Date: ${new Date().toLocaleString()}`, 20, 30);
        doc.text('--------------------------------------------------', 20, 35);
        doc.text('Input Text:', 20, 45);
        doc.text(doc.splitTextToSize(text || 'No input provided', 170), 20, 55);
        doc.text(`Result: ${prediction}`, 20, 100);
        doc.text(`Confidence: ${confidence}`, 20, 110);
        doc.save('MindScan_Report.pdf');
    }

    return (
        <div className="min-h-screen flex items-center justify-center p-6 text-white">
            <div className="glass w-full max-w-2xl rounded-[2.5rem] p-10 shadow-2xl">
                <div className="flex justify-between items-center mb-10">
                    <span className="bg-white/10 px-4 py-1 rounded-full text-[10px] font-bold tracking-widest">SYSTEM SECURE</span>
                    <button
                        onClick={onLogout}
                        className="opacity-50 text-[10px] hover:opacity-100 transition-all font-bold tracking-widest uppercase cursor-pointer"
                    >
                        Sign Out
                    </button>
                </div>

                <div className="text-center mb-10">
                    <h1 className="text-5xl font-extrabold tracking-tighter mb-2">Mind<span className="text-pink-500">Scan</span></h1>
                    <p className="text-purple-300 opacity-80">Advanced Emotional Pattern Detection</p>
                </div>

                <div className="space-y-6">
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className="w-full h-48 bg-black/20 border border-white/10 rounded-2xl p-6 focus:outline-none focus:ring-2 focus:ring-pink-500 transition-all text-white"
                        placeholder="Paste text here for emotional analysis..."
                    ></textarea>

                    <div className="flex gap-4">
                        <button
                            onClick={analyzeText}
                            disabled={loading}
                            className="flex-1 bg-gradient-to-r from-pink-500 to-purple-600 py-4 rounded-xl font-bold shadow-lg hover:scale-[1.02] transition-transform disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Analyzing...' : 'Analyze Signals'}
                        </button>
                        <button onClick={resetForm} className="px-8 bg-white/5 rounded-xl hover:bg-white/10 transition-all">Reset</button>
                    </div>
                </div>

                {showResult && (
                    <div className="mt-8 p-6 bg-white/5 rounded-2xl border-l-4" style={{ borderColor: color }}>
                        <div className="flex justify-between items-start mb-6">
                            <div>
                                <p className="text-[10px] opacity-50 uppercase">Detected Pattern</p>
                                <h2 className="text-3xl font-bold">{prediction}</h2>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] opacity-50 uppercase">Confidence</p>
                                <h2 className="text-2xl font-mono">{confidence}</h2>
                            </div>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-3">
                            {showTele && (
                                <a href="tel:14416" className="flex-1 bg-red-500/20 text-red-300 border border-red-500/50 py-3 rounded-lg text-center font-bold">Call Tele-MANAS</a>
                            )}
                            <button onClick={downloadPDF} className="flex-1 bg-white/10 hover:bg-white/20 py-3 rounded-lg font-bold">Download Report</button>
                        </div>
                    </div>
                )}

                <div className="mt-12 pt-6 border-t border-white/5 text-center">
                    <p className="text-[9px] text-pink-400 font-bold uppercase tracking-[0.2em] mb-2">Safety Notice</p>
                    <p className="text-[10px] text-white/40 leading-relaxed px-10">This AI model is for screening purposes. It is not a clinical diagnosis. In case of emergency, contact local medical services immediately.</p>
                </div>
            </div>
        </div>
    );
}

function App() {
    const [view, setView] = useState(window.__INITIAL_VIEW__ === 'dashboard' ? 'dashboard' : 'login');

    function handleLogout() {
        setView('login');
        window.history.pushState({}, '', '/');
    }

    return view === 'login'
        ? <LoginView onLogin={() => setView('dashboard')} />
        : <DashboardView onLogout={handleLogout} />;
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
