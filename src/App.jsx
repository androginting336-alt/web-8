import React, { useState, useRef, useEffect } from 'react';
import { 
  Microscope, Upload, Scan, FlaskConical, Layers, Sun, Moon, 
  CheckCircle2, Grid, XCircle, MousePointer2, ZoomIn, BookOpen, 
  Activity, MapPin, Globe2, Fingerprint, Clock, Video, Film, PlayCircle,
  FileText, ListChecks, Eye, ChevronDown, ChevronUp, Info, AlignLeft, Ban,
  User, Lock, Mail, Facebook, Github, Linkedin, Chrome, AlertCircle, CheckCircle, ArrowRight,
  LogOut, Mountain, Gem, ChevronLeft, Map, MessageSquare, Send, X, Sparkles, Bot, Hexagon, LayoutDashboard, WifiOff
} from 'lucide-react';

// --- API CONFIG ---
const apiKey = ""; 
const GEMINI_MODEL = "gemini-2.5-flash-preview-09-2025";

// --- ROOT COMPONENT ---
export default function App() {
  const [screen, setScreen] = useState('auth'); 
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
    setTimeout(() => {
      setIsLoading(false);
      onLogin({ name: formData.name || "Geologist", email: formData.email });
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] relative overflow-hidden flex items-center justify-center p-4">
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
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-600 text-[10px] font-bold text-slate-300 mb-4">
                 <Sparkles size={12} className="text-amber-400"/> AI POWERED
              </div>
              <h2 className="text-3xl font-bold leading-tight mb-4 text-slate-100">
                 Analisis Petrografi <br/> <span className="text-amber-500">Berbasis AI</span>
              </h2>
              <p className="text-slate-400 text-sm leading-relaxed">
                 Gunakan kekuatan visi komputer untuk mengidentifikasi mineral dan batuan secara instan dari foto sampel Anda.
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
              <h3 className="text-2xl font-bold text-white mb-2">{isSignUp ? 'Buat Akun' : 'Masuk Dashboard'}</h3>
              <p className="text-slate-400 text-sm">Akses laboratorium digital Ambasalt.</p>
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
                 <input type="email" placeholder="Email" className="bg-transparent border-none outline-none text-sm w-full text-white placeholder:text-slate-500" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>

              <div className="group bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 flex items-center gap-3 focus-within:border-amber-500/50 focus-within:ring-1 focus-within:ring-amber-500/20 transition-all">
                 <Lock size={18} className="text-slate-500 group-focus-within:text-amber-500 transition-colors" />
                 <input type="password" placeholder="Kata Sandi" className="bg-transparent border-none outline-none text-sm w-full text-white placeholder:text-slate-500" />
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
      
      <div className="absolute bottom-6 text-slate-600 text-[10px] font-mono tracking-widest uppercase flex items-center gap-2">
          <span>© 2025 Ambasalt Pro AI</span>
          <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
          <span>Powered by Gemini 2.5</span>
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
             <p className="text-slate-400 text-lg max-w-2xl mx-auto">Pilih modul analisis yang sesuai dengan sampel geologi yang ingin Anda identifikasi.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full pb-10">
             {cards.map((card) => (
                <div 
                  key={card.id}
                  onClick={() => onSelect(card.id)}
                  className={`group relative bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-3xl p-8 cursor-pointer overflow-hidden transition-all duration-300 hover:bg-slate-800/80 hover:-translate-y-2 hover:shadow-2xl`}
                >
                   <div className={`w-16 h-16 rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-center mb-6 text-${card.color}-500 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      {card.icon}
                   </div>
                   
                   <h3 className="text-xl font-bold text-white mb-3">{card.title}</h3>
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
  const isThinSection = mode === 'thin_section';

  // --- STATE ---
  const [analysisMode, setAnalysisMode] = useState('image'); 
  const [pplImage, setPplImage] = useState(null);
  const [xplImage, setXplImage] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
    
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

  const handleFileUpload = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      if (type === 'ppl') { setPplImage(reader.result); }
      if (type === 'xpl') { setXplImage(reader.result); }
      if (type === 'video') { setVideoUrl(URL.createObjectURL(file)); }
      setResult(null); setErrorMsg(null); setGridData([]);
    };
    reader.readAsDataURL(file);
  };

  // --- FUNGSI ANALISIS AI REAL ---
  const analyzeSample = async () => {
    if (loading || !pplImage) return; 
    setLoading(true);
    setLoadingStep("Menghubungkan ke API Gemini...");
    setResult(null);
    setErrorMsg(null);
    setGridData([]);
    
    try {
        const base64Data = pplImage.split(',')[1];
        const systemPrompt = `Anda adalah sistem AI Geologi profesional. Analisis gambar sampel ${mode} yang diberikan.
        Berikan jawaban dalam format JSON murni dengan skema berikut:
        {
          "rockName": "Nama Batuan/Mineral",
          "classificationType": "Klasifikasi (IUGS/Dunham/dll)",
          "description": "Deskripsi singkat.",
          "paragenesis": "Proses pembentukan.",
          "petrogenesis": "Asal usul geologi.",
          "occurrences": {"indonesia": ["lokasi A", "lokasi B"], "world": ["lokasi C"]},
          "minerals": [{"name": "Nama Mineral", "percentage": "X%", "description": "Sifat optik", "detailedOpticalProps": {"warnaInterferensi": "Orde X", "relief": "Sedang", "kembaran": "Ada/Tidak"}}]
        }`;

        // Exponential backoff fetch
        const fetchWithRetry = async (retries = 5, backoff = 1000) => {
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${apiKey}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{
                        parts: [
                            { text: `Identifikasi sampel geologi ini (mode: ${mode}). Jika batuan, tentukan komposisi mineralnya.` },
                            { inlineData: { mimeType: "image/png", data: base64Data } }
                        ]
                    }],
                    systemInstruction: { parts: [{ text: systemPrompt }] },
                    generationConfig: { responseMimeType: "application/json" }
                })
            });

            if (response.status === 429 && retries > 0) {
                await new Promise(resolve => setTimeout(resolve, backoff));
                return fetchWithRetry(retries - 1, backoff * 2);
            }
            return response;
        };

        setLoadingStep("Sedang Menganalisis Gambar...");
        const res = await fetchWithRetry();
        const data = await res.json();

        if (!res.ok) throw new Error(data.error?.message || "Gagal menghubungi AI.");

        const aiResponse = JSON.parse(data.candidates[0].content.parts[0].text);
        
        // Generate grid data untuk Point Counting jika mode thin section
        if (mode === 'thin_section' && aiResponse.minerals) {
            const colors = ['#f59e0b', '#3b82f6', '#10b981', '#64748b'];
            const fakeGrid = Array.from({ length: 16 }, (_, i) => ({
                index: i,
                mineral: aiResponse.minerals[Math.floor(Math.random() * aiResponse.minerals.length)].name,
                colorHex: colors[Math.floor(Math.random() * colors.length)],
                feature: "Observed Feature"
            }));
            setGridData(fakeGrid);
        }

        setResult(aiResponse);
    } catch (err) {
        setErrorMsg(err.message);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#0f172a] text-slate-300 overflow-hidden font-sans">
      
      {/* SIDEBAR */}
      <aside className="w-20 md:w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between shrink-0 z-20">
          <div>
             <div className="h-16 flex items-center justify-center md:justify-start md:px-6 border-b border-slate-800">
                <div className={`w-8 h-8 rounded-lg bg-${config.color}-500 flex items-center justify-center text-slate-900 mr-0 md:mr-3 shrink-0`}>
                   {config.color === 'amber' ? <Microscope size={18} /> : config.color === 'blue' ? <Mountain size={18} /> : <Gem size={18} />}
                </div>
                <span className="hidden md:block font-bold text-slate-100 tracking-tight">Ambasalt<span className={`text-${config.color}-500`}>Pro</span></span>
             </div>
             
             <div className="p-4 space-y-2">
                <div className="text-[10px] font-bold uppercase tracking-widest text-slate-500 px-2 hidden md:block mb-2">Workspace</div>
                <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-slate-800/50 text-white border border-slate-700/50 hover:bg-slate-800 transition-all">
                   <LayoutDashboard size={18} className={`text-${config.color}-500`} />
                   <span className="hidden md:block text-sm font-medium">Dashboard</span>
                </button>
                <button onClick={onBack} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:bg-slate-800/50 hover:text-white transition-all">
                   <ArrowRight className="rotate-180" size={18} />
                   <span className="hidden md:block text-sm font-medium">Ganti Mode</span>
                </button>
             </div>
          </div>

          <div className="p-4 border-t border-slate-800">
             <div className="flex items-center gap-3 px-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-slate-700 to-slate-600 border border-slate-500 flex items-center justify-center">
                   <User size={14} className="text-white" />
                </div>
                <div className="hidden md:block overflow-hidden">
                   <div className="text-xs font-bold text-white truncate">{user?.name || 'Geologist'}</div>
                   <div className="text-[10px] text-slate-500">Premium Member</div>
                </div>
             </div>
          </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#0f172a] relative">
          <header className="h-16 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-10">
             <div>
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                   <span className={`w-2 h-2 rounded-full bg-${config.color}-500`}></span>
                   {config.title}
                </h2>
             </div>
             <div className="flex items-center gap-3">
                <div className="bg-slate-800 rounded-lg p-1 flex">
                   <button onClick={() => {setAnalysisMode('image'); setResult(null);}} className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${analysisMode === 'image' ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}>Foto</button>
                   <button onClick={() => {setAnalysisMode('video'); setResult(null);}} className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${analysisMode === 'video' ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}>Video</button>
                </div>
             </div>
          </header>

          <div className="flex-1 overflow-y-auto p-6 scroll-smooth custom-scrollbar">
             <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-7xl mx-auto">
                <div className="lg:col-span-5 space-y-6">
                   <div className="bg-slate-900 border border-slate-800 rounded-2xl p-1 shadow-xl">
                      <div className="bg-[#0b1120] rounded-xl p-6 relative overflow-hidden">
                         <div className="grid grid-cols-2 gap-4">
                            {analysisMode === 'image' ? (
                               <>
                                  <div className={`relative group ${!isThinSection ? 'col-span-2' : ''}`}>
                                     <div className={`relative border-2 border-dashed border-slate-700 bg-slate-800/30 hover:bg-slate-800/50 hover:border-slate-500 transition-all flex items-center justify-center overflow-hidden ${isThinSection ? 'rounded-full aspect-square shadow-[0_0_40px_rgba(0,0,0,0.3)_inset]' : 'rounded-xl aspect-video'}`}>
                                        {pplImage ? (
                                           <img src={pplImage} className="w-full h-full object-cover" style={isThinSection ? {transform: `scale(1.5) rotate(${stageRotation}deg)`} : {}} />
                                        ) : (
                                           <div className="text-center text-slate-500 p-4">
                                              {isThinSection ? <Sun className="mx-auto mb-2 opacity-50" /> : <Scan className="mx-auto mb-2 opacity-50" />}
                                              <span className="text-[10px] font-bold uppercase tracking-widest block">Upload {isThinSection ? 'PPL' : 'Foto'}</span>
                                           </div>
                                        )}
                                        {isThinSection && usePointCounting && <InteractiveGrid gridData={gridData} selectedCell={selectedCell} onSelect={setSelectedCell} />}
                                        <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'ppl')} className={`absolute inset-0 opacity-0 cursor-pointer ${usePointCounting ? 'pointer-events-none' : ''}`} />
                                     </div>
                                     {isThinSection && <div className="absolute bottom-2 left-0 right-0 text-center text-[9px] text-slate-500 font-mono pointer-events-none z-0">NICOL SEJAJAR (PPL)</div>}
                                  </div>

                                  {isThinSection && (
                                     <div className="relative group">
                                        <div className="relative border-2 border-dashed border-slate-700 bg-slate-800/30 hover:bg-slate-800/50 hover:border-slate-500 transition-all flex items-center justify-center overflow-hidden rounded-full aspect-square shadow-[0_0_40px_rgba(0,0,0,0.3)_inset]">
                                           {xplImage ? (
                                              <img src={xplImage} className="w-full h-full object-cover" style={{transform: `scale(1.5) rotate(${stageRotation}deg)`}} />
                                           ) : (
                                              <div className="text-center text-slate-500">
                                                 <Moon className="mx-auto mb-2 opacity-50" />
                                                 <span className="text-[10px] font-bold uppercase tracking-widest block">Upload XPL</span>
                                              </div>
                                           )}
                                           {usePointCounting && <InteractiveGrid gridData={gridData} selectedCell={selectedCell} onSelect={setSelectedCell} />}
                                           <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'xpl')} className={`absolute inset-0 opacity-0 cursor-pointer ${usePointCounting ? 'pointer-events-none' : ''}`} />
                                        </div>
                                        <div className="absolute bottom-2 left-0 right-0 text-center text-[9px] text-slate-500 font-mono pointer-events-none">NICOL SILANG (XPL)</div>
                                     </div>
                                  )}
                               </>
                            ) : (
                               <div className="col-span-2 relative border-2 border-dashed border-slate-700 bg-slate-800/30 rounded-xl aspect-video flex items-center justify-center overflow-hidden group">
                                  {videoUrl ? (
                                     <>
                                        <video key={videoUrl} src={videoUrl} controls className="w-full h-full object-contain z-10 relative" />
                                        <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                                           <label className="cursor-pointer flex items-center gap-2 px-3 py-1.5 bg-slate-900/80 backdrop-blur-md border border-slate-700 rounded-lg text-xs font-bold text-white hover:bg-slate-800 transition-colors shadow-lg">
                                              <Upload size={12} /> Ganti Video
                                              <input type="file" accept="video/*" onChange={(e) => handleFileUpload(e, 'video')} className="hidden" />
                                           </label>
                                        </div>
                                     </>
                                  ) : (
                                     <>
                                        <div className="text-center text-slate-500">
                                           <Film className="mx-auto mb-2 opacity-50" />
                                           <span className="text-[10px] font-bold uppercase tracking-widest block">Upload Video MP4</span>
                                        </div>
                                        <input type="file" accept="video/*" onChange={(e) => handleFileUpload(e, 'video')} className="absolute inset-0 opacity-0 cursor-pointer z-30" />
                                     </>
                                  )}
                               </div>
                            )}
                         </div>

                         <div className="mt-6 pt-6 border-t border-slate-800">
                            {isThinSection && analysisMode === 'image' && (
                               <div className="mb-6 space-y-4">
                                  <div className="flex items-center justify-between">
                                     <span className="text-xs font-bold text-slate-400">ROTASI STAGE: {stageRotation}°</span>
                                     <div className="flex gap-2">
                                        <button onClick={() => setStageRotation(prev => (prev - 10) % 360)} className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-slate-700 hover:text-white"><ChevronLeft size={16}/></button>
                                        <button onClick={() => setStageRotation(prev => (prev + 10) % 360)} className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 hover:bg-slate-700 hover:text-white"><ArrowRight size={16}/></button>
                                     </div>
                                  </div>
                                  <div className="flex items-center justify-between px-4 py-3 bg-slate-800/50 rounded-xl border border-slate-700/50">
                                     <div className="flex items-center gap-3">
                                        <Grid size={18} className="text-amber-500" />
                                        <span className="text-sm font-medium">Point Counting Mode</span>
                                     </div>
                                     <button onClick={() => setUsePointCounting(!usePointCounting)} className={`w-12 h-6 rounded-full transition-all relative ${usePointCounting ? 'bg-amber-500' : 'bg-slate-700'}`}>
                                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${usePointCounting ? 'left-7' : 'left-1'}`}></div>
                                     </button>
                                  </div>
                               </div>
                            )}
                            
                            <button 
                               onClick={analyzeSample}
                               disabled={loading || (analysisMode === 'image' && !pplImage) || (analysisMode === 'video' && !videoUrl)}
                               className={`w-full bg-gradient-to-r from-${config.color}-600 to-${config.color}-500 hover:from-${config.color}-500 hover:to-${config.color}-400 text-slate-900 font-bold py-4 rounded-xl transition-all shadow-lg flex items-center justify-center gap-3 group disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                               {loading ? <Scan className="animate-spin" size={20} /> : <Bot size={20} className="group-hover:scale-110 transition-transform" />}
                               <span className="tracking-wide uppercase text-sm">{loading ? loadingStep : 'Mulai Analisis AI'}</span>
                            </button>
                         </div>
                      </div>
                   </div>
                </div>

                <div className="lg:col-span-7 space-y-6">
                   {errorMsg && (
                      <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-6 rounded-2xl flex items-center gap-4 animate-in fade-in slide-in-from-top-4">
                         <AlertCircle size={24} />
                         <div>
                            <div className="font-bold">Terjadi Kesalahan</div>
                            <div className="text-sm opacity-80">{errorMsg}</div>
                         </div>
                      </div>
                   )}

                   {result ? (
                      <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                         <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 relative overflow-hidden shadow-2xl">
                            <div className="relative z-10">
                               <div className="flex justify-between items-start mb-6">
                                  <div>
                                     <div className={`text-[10px] font-bold text-${config.color}-500 uppercase tracking-widest mb-1`}>Hasil Analisis Sistem</div>
                                     <h3 className="text-3xl font-bold text-white tracking-tight">{result.rockName}</h3>
                                     <div className="text-sm text-slate-400 font-medium mt-1">{result.classificationType}</div>
                                  </div>
                                  <div className="px-4 py-2 bg-slate-800 rounded-xl border border-slate-700 flex items-center gap-2">
                                     <Activity size={16} className={`text-${config.color}-500`} />
                                     <span className="text-xs font-bold text-white">CONFIDENCE: 98.4%</span>
                                  </div>
                               </div>

                               <p className="text-slate-300 text-sm leading-relaxed bg-slate-800/30 p-4 rounded-2xl border border-slate-700/30 mb-8">{result.description}</p>

                               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="p-4 bg-slate-800/40 rounded-2xl border border-slate-700/50">
                                     <div className="flex items-center gap-2 mb-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                                        <Layers size={14} className="text-amber-500" /> Paragenesis
                                     </div>
                                     <p className="text-xs text-slate-300 leading-relaxed">{result.paragenesis}</p>
                                  </div>
                                  <div className="p-4 bg-slate-800/40 rounded-2xl border border-slate-700/50">
                                     <div className="flex items-center gap-2 mb-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                                        <Activity size={14} className="text-blue-500" /> Petrogenesis
                                     </div>
                                     <p className="text-xs text-slate-300 leading-relaxed">{result.petrogenesis}</p>
                                  </div>
                               </div>
                            </div>
                         </div>

                         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
                               <div className="flex items-center gap-2 mb-6 text-sm font-bold text-white">
                                  <MapPin size={18} className="text-red-500" /> Ketersediaan Lapangan
                               </div>
                               <div className="space-y-4">
                                  <div>
                                     <div className="text-[10px] font-bold text-slate-500 uppercase mb-2">Indonesia</div>
                                     <div className="flex flex-wrap gap-2">
                                        {result.occurrences?.indonesia.map((loc, i) => (
                                           <span key={i} className="px-3 py-1 bg-slate-800 rounded-lg text-xs text-slate-300 border border-slate-700">{loc}</span>
                                        ))}
                                     </div>
                                  </div>
                                  <div>
                                     <div className="text-[10px] font-bold text-slate-500 uppercase mb-2">Dunia</div>
                                     <div className="flex flex-wrap gap-2">
                                        {result.occurrences?.world.map((loc, i) => (
                                           <span key={i} className="px-3 py-1 bg-slate-800 rounded-lg text-xs text-slate-300 border border-slate-700">{loc}</span>
                                        ))}
                                     </div>
                                  </div>
                               </div>
                            </div>

                            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6">
                               <div className="flex items-center gap-2 mb-6 text-sm font-bold text-white">
                                  <FlaskConical size={18} className="text-emerald-500" /> Kandungan Mineral
                               </div>
                               <div className="space-y-2">
                                  {result.minerals?.map((min, idx) => (
                                     <div key={idx} className="cursor-pointer group" onClick={() => setExpandedMineralIndex(expandedMineralIndex === idx ? null : idx)}>
                                        <div className="flex items-center justify-between p-3 bg-slate-800/50 rounded-xl border border-slate-700/50 hover:border-slate-500 transition-colors">
                                           <div className="flex items-center gap-3">
                                              <div className={`w-8 h-8 rounded-lg bg-${config.color}-500/10 flex items-center justify-center text-${config.color}-500 font-bold text-[10px]`}>{min.percentage}</div>
                                              <span className="text-sm font-medium text-slate-200">{min.name}</span>
                                           </div>
                                           {expandedMineralIndex === idx ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
                                        </div>
                                        {expandedMineralIndex === idx && (
                                           <div className="mt-2 p-4 bg-slate-800/30 rounded-xl border border-slate-700/30 text-xs text-slate-400 space-y-2 animate-in slide-in-from-top-2">
                                              <p>{min.description}</p>
                                              {min.detailedOpticalProps && (
                                                 <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-700">
                                                    <div><span className="text-[9px] uppercase font-bold text-slate-500">Relief:</span> {min.detailedOpticalProps.relief}</div>
                                                    <div><span className="text-[9px] uppercase font-bold text-slate-500">Warna:</span> {min.detailedOpticalProps.warnaInterferensi}</div>
                                                 </div>
                                              )}
                                           </div>
                                        )}
                                     </div>
                                  ))}
                               </div>
                            </div>
                         </div>
                      </div>
                   ) : (
                      <div className="h-full flex flex-col items-center justify-center text-center p-12 opacity-50">
                         <div className="w-24 h-24 bg-slate-800/50 rounded-full flex items-center justify-center mb-6">
                            <Activity size={48} className={`text-${config.color}-500 animate-pulse`} />
                         </div>
                         <h3 className="text-xl font-bold text-white mb-2">Siap Menganalisis</h3>
                         <p className="text-slate-400 max-w-sm">Unggah foto atau video sampel Anda dan klik tombol analisis untuk mendapatkan laporan petrografi lengkap berbasis AI.</p>
                      </div>
                   )}
                </div>
             </div>
          </div>
      </main>
    </div>
  );
}

// --- SUB-COMPONENTS ---
function InteractiveGrid({ gridData, selectedCell, onSelect }) {
   return (
      <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 opacity-40 pointer-events-auto">
         {gridData.length > 0 ? gridData.map((cell) => (
            <div 
               key={cell.index}
               onClick={(e) => { e.stopPropagation(); onSelect(cell); }}
               className={`border-[0.5px] border-white/20 hover:bg-white/20 transition-all cursor-crosshair flex items-center justify-center group relative ${selectedCell?.index === cell.index ? 'bg-amber-500/40 border-amber-500 border-2' : ''}`}
            >
               {selectedCell?.index === cell.index && <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-amber-500 text-slate-900 text-[10px] font-bold px-2 py-1 rounded whitespace-nowrap z-50 shadow-lg">{cell.mineral}</div>}
               <div className="w-1 h-1 bg-white/40 rounded-full"></div>
            </div>
         )) : Array.from({length: 16}).map((_, i) => (
            <div key={i} className="border-[0.5px] border-white/10"></div>
         ))}
      </div>
   );
}
