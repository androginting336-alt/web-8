import React, { useState, useRef, useEffect } from 'react';
import { 
  Microscope, Upload, Scan, FlaskConical, Layers, Sun, Moon, 
  CheckCircle2, Grid, XCircle, MousePointer2, ZoomIn, BookOpen, 
  Activity, MapPin, Globe2, Fingerprint, Clock, Video, Film, PlayCircle,
  FileText, ListChecks, Eye, ChevronDown, ChevronUp, Info, AlignLeft, Ban,
  User, Lock, Mail, Facebook, Github, Linkedin, Chrome, AlertCircle, CheckCircle, ArrowRight,
  LogOut, Mountain, Gem, ChevronLeft, Map, MessageSquare, Send, X, Sparkles, Bot, Hexagon, LayoutDashboard
} from 'lucide-react';

// --- ROOT COMPONENT ---
export default function App() {
  const [screen, setScreen] = useState('auth'); // auth, selection, app
  const [appMode, setAppMode] = useState('thin_section'); 
  const [user, setUser] = useState(null);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setScreen('selection');
  };
    
  const handleSelectMode = (mode) => {
    setAppMode(mode);
    setScreen('app');
  };

  const handleLogout = () => {
    setScreen('auth');
    setAppMode('thin_section');
    setUser(null);
  };

  const handleBackToMenu = () => setScreen('selection');

  return (
    <div className="font-sans text-slate-200 antialiased selection:bg-amber-500/30 selection:text-amber-200 h-screen w-full overflow-hidden">
      {screen === 'auth' && <AuthScreen onLogin={handleLoginSuccess} />}
      {screen === 'selection' && <SelectionScreen onSelect={handleSelectMode} onLogout={handleLogout} user={user} />}
      {screen === 'app' && <AmbasaltMainApp mode={appMode} onBack={handleBackToMenu} user={user} />}
    </div>
  );
}

// --- 1. AUTH SCREEN ---
function AuthScreen({ onLogin }) {
  const [isSignUp, setIsSignUp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ email: 'geo@ambasalt.com', password: '', name: '' });

  const handleAuth = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API delay
    setTimeout(() => {
      setIsLoading(false);
      onLogin({ name: formData.name || "Geologist", email: formData.email });
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] relative overflow-hidden flex items-center justify-center p-4">
      {/* Dynamic CSS Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] bg-amber-600/10 rounded-full blur-[120px] animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: `radial-gradient(#475569 1px, transparent 1px)`,
            backgroundSize: '30px 30px'
        }}></div>
      </div>

      <div className="relative z-10 bg-slate-900/60 backdrop-blur-2xl border border-slate-700/50 rounded-3xl shadow-2xl w-full max-w-[900px] min-h-[600px] flex overflow-hidden">
        <div className="hidden md:flex w-1/2 bg-gradient-to-br from-slate-800 to-slate-900 p-12 flex-col justify-between relative border-r border-slate-700/50">
           {/* Subtle Pattern Overlay */}
           <div className="absolute inset-0 opacity-10" style={{
               backgroundImage: `repeating-linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000), repeating-linear-gradient(45deg, #000 25%, #1e293b 25%, #1e293b 75%, #000 75%, #000)`,
               backgroundPosition: '0 0, 10px 10px',
               backgroundSize: '20px 20px'
           }}></div>
           
           <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                 <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center text-slate-900 shadow-lg shadow-amber-500/20">
                    <Microscope size={24} strokeWidth={2.5} />
                 </div>
                 <h1 className="text-2xl font-bold tracking-tight text-white">Ambasalt<span className="text-amber-500">Pro</span></h1>
              </div>
              <h2 className="text-3xl font-bold leading-tight mb-4 text-slate-100">
                 Masa Depan <br/> <span className="text-amber-500">Analisis Petrografi</span>
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed">
                 Platform berbasis AI untuk identifikasi batuan, mineral, dan sayatan tipis dengan akurasi tinggi. Menggunakan standar klasifikasi internasional (IUGS, Folk, Dunham).
              </p>
           </div>
           <div className="flex gap-2 relative z-10">
              <div className="h-1 flex-1 bg-amber-500 rounded-full opacity-100"></div>
              <div className="h-1 flex-1 bg-slate-700 rounded-full"></div>
              <div className="h-1 flex-1 bg-slate-700 rounded-full"></div>
           </div>
        </div>

        <div className="w-full md:w-1/2 p-12 flex flex-col justify-center bg-slate-900/40 relative">
           <div className="mb-8 text-center">
              <h3 className="text-2xl font-bold text-white mb-2">{isSignUp ? 'Buat Akun Baru' : 'Selamat Datang'}</h3>
              <p className="text-slate-400 text-sm">{isSignUp ? 'Mulai perjalanan riset Anda hari ini.' : 'Masuk untuk mengakses dashboard.'}</p>
           </div>

           <form onSubmit={handleAuth} className="space-y-4">
              {isSignUp && (
                <div className="group bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 flex items-center gap-3 focus-within:border-amber-500/50 focus-within:ring-1 focus-within:ring-amber-500/20 transition-all">
                   <User size={18} className="text-slate-500 group-focus-within:text-amber-500 transition-colors" />
                   <input type="text" placeholder="Nama Lengkap" className="bg-transparent border-none outline-none text-sm w-full text-white placeholder:text-slate-500" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
              )}
              
              <div className="group bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 flex items-center gap-3 focus-within:border-amber-500/50 focus-within:ring-1 focus-within:ring-amber-500/20 transition-all">
                 <Mail size={18} className="text-slate-500 group-focus-within:text-amber-500 transition-colors" />
                 <input type="email" placeholder="Email Profesional" className="bg-transparent border-none outline-none text-sm w-full text-white placeholder:text-slate-500" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>

              <div className="group bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 flex items-center gap-3 focus-within:border-amber-500/50 focus-within:ring-1 focus-within:ring-amber-500/20 transition-all">
                 <Lock size={18} className="text-slate-500 group-focus-within:text-amber-500 transition-colors" />
                 <input type="password" placeholder="Kata Sandi" className="bg-transparent border-none outline-none text-sm w-full text-white placeholder:text-slate-500" />
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 mt-2">
                 <label className="flex items-center gap-2 cursor-pointer hover:text-slate-300">
                    <input type="checkbox" className="rounded border-slate-700 bg-slate-800 text-amber-500 focus:ring-0" /> Ingat saya
                 </label>
                 <a href="#" className="hover:text-amber-500 transition-colors">Lupa sandi?</a>
              </div>

              <button 
                disabled={isLoading}
                className="w-full mt-6 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-900 font-bold py-3.5 rounded-xl transition-all transform active:scale-[0.98] shadow-lg shadow-amber-900/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {isLoading ? <Scan className="animate-spin" size={18} /> : (isSignUp ? 'Daftar Sekarang' : 'Masuk Dashboard')}
                {!isLoading && <ArrowRight size={18} />}
              </button>
           </form>

           <div className="mt-8 text-center">
              <p className="text-slate-500 text-sm">
                 {isSignUp ? 'Sudah punya akun?' : 'Belum memiliki akun?'} 
                 <button onClick={() => setIsSignUp(!isSignUp)} className="ml-2 text-amber-500 font-medium hover:underline focus:outline-none">
                    {isSignUp ? 'Login di sini' : 'Daftar gratis'}
                 </button>
              </p>
           </div>
        </div>
      </div>
      
      {/* COPYRIGHT FOOTER */}
      <div className="absolute bottom-6 text-slate-600 text-[10px] font-mono tracking-widest uppercase flex items-center gap-2">
         <span>© 2025 Ambasalt</span>
         <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
         <span>Secure Enclave</span>
      </div>
    </div>
  );
}

// --- 2. SELECTION SCREEN ---
function SelectionScreen({ onSelect, onLogout, user }) {
  const cards = [
    { id: 'rock', title: 'Hand Specimen', desc: 'Identifikasi batuan beku, sedimen, & metamorf skala makroskopis.', icon: <Mountain size={32} />, color: 'blue' },
    { id: 'thin_section', title: 'Thin Section', desc: 'Analisis mikroskopis polarisasi (PPL/XPL) dengan point counting.', icon: <Microscope size={32} />, color: 'amber' },
    { id: 'mineral', title: 'Identifikasi Mineral', desc: 'Determinasi spesies mineral berdasarkan sifat fisik kristal.', icon: <Gem size={32} />, color: 'emerald' },
  ];

  return (
    <div className="min-h-screen bg-[#0f172a] flex flex-col p-8 font-sans overflow-auto">
       <nav className="flex justify-between items-center mb-16 max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-amber-500 rounded-md flex items-center justify-center text-slate-900">
                <Hexagon size={18} fill="currentColor" />
             </div>
             <span className="font-bold text-lg tracking-tight text-slate-100">Ambasalt<span className="text-amber-500">Pro</span></span>
          </div>
          <div className="flex items-center gap-4">
             <span className="text-sm text-slate-400 hidden md:inline">Halo, {user?.name || 'Geologist'}</span>
             <button onClick={onLogout} className="flex items-center gap-2 px-4 py-2 rounded-full border border-slate-700 bg-slate-800/50 hover:bg-slate-700 text-slate-400 hover:text-white transition-all text-xs font-bold uppercase tracking-wider">
                <LogOut size={14} /> Keluar
             </button>
          </div>
       </nav>

       <div className="flex-1 flex flex-col items-center justify-center max-w-6xl mx-auto w-full">
          <div className="text-center mb-16 space-y-4">
             <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">Pilih Metode Analisis</h1>
             <p className="text-slate-400 text-lg max-w-2xl mx-auto">Pilih modul analisis yang sesuai dengan sampel geologi Anda untuk memulai identifikasi berbasis AI.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full pb-10">
             {cards.map((card) => (
                <div 
                  key={card.id}
                  onClick={() => onSelect(card.id)}
                  className={`group relative bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-3xl p-8 cursor-pointer overflow-hidden transition-all duration-300 hover:bg-slate-800/80 hover:-translate-y-2 hover:shadow-2xl hover:border-${card.color}-500/30`}
                >
                   {/* Correct dynamic class handling for hover shadows */}
                   <div className={`absolute top-0 right-0 w-32 h-32 opacity-10 rounded-bl-[100px] -mr-6 -mt-6 transition-transform group-hover:scale-110 bg-${card.color}-500`}></div>
                   
                   <div className={`w-16 h-16 rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-center mb-6 text-${card.color}-500 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      {card.icon}
                   </div>
                   
                   <h3 className={`text-xl font-bold text-white mb-3 group-hover:text-${card.color}-400 transition-colors`}>{card.title}</h3>
                   <p className="text-slate-400 text-sm leading-relaxed mb-8">{card.desc}</p>
                   
                   <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 group-hover:text-white transition-colors">
                      Mulai Analisis <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                   </div>
                </div>
             ))}
          </div>
       </div>
    </div>
  );
}

// --- 3. MAIN APP ---
function AmbasaltMainApp({ mode, onBack, user }) {
  // === CONFIGURATION ===
  // KEY BARU:
  const apiKey = "AIzaSyBPUEsGT5mF9RfSDCPSCWHQaSsQlLZZn8c"; 
  
  // SAYA KEMBALIKAN KE MODEL STABIL RESMI (VERSI 1.5) agar tidak 404
  const MODEL_NAME = "gemini-1.5-flash"; 
  // =====================

  const isThinSection = mode === 'thin_section';

  // --- STATE ---
  const [analysisMode, setAnalysisMode] = useState('image'); 
  const [pplImage, setPplImage] = useState(null);
  const [pplBase64, setPplBase64] = useState(null);
  const [xplImage, setXplImage] = useState(null);
  const [xplBase64, setXplBase64] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [videoBase64, setVideoBase64] = useState(null);
   
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState("");
  const [result, setResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
   
  const [usePointCounting, setUsePointCounting] = useState(false);
  const [stageRotation, setStageRotation] = useState(0);
  const [gridData, setGridData] = useState([]); 
  const [selectedCell, setSelectedCell] = useState(null); 
  const [expandedMineralIndex, setExpandedMineralIndex] = useState(null);

  // Config
  const config = {
    thin_section: { title: "Thin Section Analysis", color: "amber" },
    rock: { title: "Hand Specimen Identification", color: "blue" },
    mineral: { title: "Mineral Specimen Analysis", color: "emerald" },
  }[mode];

  // --- API LOGIC (ANTI-429 RETRY SYSTEM) ---
  const callGeminiWithRetry = async (payload, maxRetries = 3) => {
    let attempt = 0;
    while (attempt <= maxRetries) {
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        // Tangani Error HTTP spesifik
        if (!response.ok) {
          if (response.status === 429 || response.status === 503) {
            throw new Error("RATE_LIMIT");
          }
          if (response.status === 404) {
             throw new Error("MODEL_NOT_FOUND");
          }
          throw new Error(`HTTP Error: ${response.status}`);
        }
        
        return await response.json();

      } catch (error) {
        attempt++;
        console.warn(`Percobaan ke-${attempt} gagal: ${error.message}`);

        if (error.message === "MODEL_NOT_FOUND") {
            throw new Error("Model AI tidak ditemukan (404). Mohon hubungi developer untuk update versi model.");
        }

        if (attempt > maxRetries) throw error;

        // JEDA WAKTU (Backoff) untuk mengatasi 429
        const delay = error.message === "RATE_LIMIT" ? Math.pow(2, attempt) * 1500 : 2000;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  };

  const handleFileUpload = (e,
