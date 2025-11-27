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
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#0f172a] relative overflow-hidden flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute -bottom-[20%] -right-[10%] w-[50%] h-[50%] bg-amber-600/10 rounded-full blur-[120px] animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute inset-0 opacity-20" style={{backgroundImage: `radial-gradient(#475569 1px, transparent 1px)`, backgroundSize: '30px 30px'}}></div>
      </div>

      <div className="relative z-10 bg-slate-900/60 backdrop-blur-2xl border border-slate-700/50 rounded-3xl shadow-2xl w-full max-w-[900px] min-h-[600px] flex overflow-hidden">
        <div className="hidden md:flex w-1/2 bg-gradient-to-br from-slate-800 to-slate-900 p-12 flex-col justify-between relative border-r border-slate-700/50">
           <div className="absolute inset-0 opacity-10" style={{backgroundImage: `repeating-linear-gradient(45deg, #000 25%, transparent 25%, transparent 75%, #000 75%, #000), repeating-linear-gradient(45deg, #000 25%, #1e293b 25%, #1e293b 75%, #000 75%, #000)`, backgroundPosition: '0 0, 10px 10px', backgroundSize: '20px 20px'}}></div>
           <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                 <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center text-slate-900 shadow-lg shadow-amber-500/20"><Microscope size={24} strokeWidth={2.5} /></div>
                 <h1 className="text-2xl font-bold tracking-tight text-white">Ambasalt<span className="text-amber-500">Pro</span></h1>
              </div>
              <h2 className="text-3xl font-bold leading-tight mb-4 text-slate-100">Masa Depan <br/> <span className="text-amber-500">Analisis Petrografi</span></h2>
              <p className="text-slate-400 text-sm leading-relaxed">Platform berbasis AI untuk identifikasi batuan, mineral, dan sayatan tipis dengan akurasi tinggi.</p>
           </div>
        </div>

        <div className="w-full md:w-1/2 p-12 flex flex-col justify-center bg-slate-900/40 relative">
           <div className="mb-8 text-center">
              <h3 className="text-2xl font-bold text-white mb-2">{isSignUp ? 'Buat Akun Baru' : 'Selamat Datang'}</h3>
              <p className="text-slate-400 text-sm">Masuk untuk mengakses dashboard profesional.</p>
           </div>
           <form onSubmit={handleAuth} className="space-y-4">
              {isSignUp && (
                <div className="group bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 flex items-center gap-3 focus-within:border-amber-500/50 transition-all">
                   <User size={18} className="text-slate-500 group-focus-within:text-amber-500" />
                   <input type="text" placeholder="Nama Lengkap" className="bg-transparent border-none outline-none text-sm w-full text-white" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                </div>
              )}
              <div className="group bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 flex items-center gap-3 focus-within:border-amber-500/50 transition-all">
                 <Mail size={18} className="text-slate-500 group-focus-within:text-amber-500" />
                 <input type="email" placeholder="Email" className="bg-transparent border-none outline-none text-sm w-full text-white" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
              </div>
              <div className="group bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 flex items-center gap-3 focus-within:border-amber-500/50 transition-all">
                 <Lock size={18} className="text-slate-500 group-focus-within:text-amber-500" />
                 <input type="password" placeholder="Sandi" className="bg-transparent border-none outline-none text-sm w-full text-white" />
              </div>
              <button disabled={isLoading} className="w-full mt-6 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-slate-900 font-bold py-3.5 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2">
                {isLoading ? <Scan className="animate-spin" size={18} /> : (isSignUp ? 'Daftar' : 'Masuk Dashboard')}
                {!isLoading && <ArrowRight size={18} />}
              </button>
           </form>
           <div className="mt-8 text-center"><p className="text-slate-500 text-sm">{isSignUp ? 'Sudah punya akun?' : 'Belum punya akun?'} <button onClick={() => setIsSignUp(!isSignUp)} className="ml-2 text-amber-500 font-medium hover:underline">{isSignUp ? 'Login' : 'Daftar'}</button></p></div>
        </div>
      </div>
    </div>
  );
}

// --- 2. SELECTION SCREEN ---
function SelectionScreen({ onSelect, onLogout, user }) {
  const cards = [
    { id: 'rock', title: 'Hand Specimen', desc: 'Identifikasi batuan beku, sedimen, & metamorf.', icon: <Mountain size={32} />, color: 'blue' },
    { id: 'thin_section', title: 'Thin Section', desc: 'Analisis mikroskopis polarisasi (PPL/XPL).', icon: <Microscope size={32} />, color: 'amber' },
    { id: 'mineral', title: 'Identifikasi Mineral', desc: 'Determinasi spesies mineral & kristal.', icon: <Gem size={32} />, color: 'emerald' },
  ];

  return (
    <div className="min-h-screen bg-[#0f172a] flex flex-col p-8 font-sans overflow-auto">
       <nav className="flex justify-between items-center mb-16 max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-3"><div className="w-8 h-8 bg-amber-500 rounded-md flex items-center justify-center text-slate-900"><Hexagon size={18} fill="currentColor" /></div><span className="font-bold text-lg text-slate-100">Ambasalt<span className="text-amber-500">Pro</span></span></div>
          <button onClick={onLogout} className="flex items-center gap-2 px-4 py-2 rounded-full border border-slate-700 bg-slate-800/50 hover:bg-slate-700 text-slate-400 text-xs font-bold uppercase"><LogOut size={14} /> Keluar</button>
       </nav>
       <div className="flex-1 flex flex-col items-center justify-center max-w-6xl mx-auto w-full">
          <div className="text-center mb-16 space-y-4"><h1 className="text-4xl md:text-5xl font-bold text-white">Pilih Metode Analisis</h1><p className="text-slate-400 text-lg">Pilih modul yang sesuai dengan sampel geologi Anda.</p></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full pb-10">
             {cards.map((card) => (
                <div key={card.id} onClick={() => onSelect(card.id)} className={`group relative bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 rounded-3xl p-8 cursor-pointer overflow-hidden hover:bg-slate-800/80 hover:-translate-y-2 transition-all hover:border-${card.color}-500/30 shadow-lg`}>
                   <div className={`absolute top-0 right-0 w-32 h-32 opacity-10 rounded-bl-[100px] -mr-6 -mt-6 bg-${card.color}-500 transition-transform group-hover:scale-110`}></div>
                   <div className={`w-16 h-16 rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-center mb-6 text-${card.color}-500 group-hover:scale-110 transition-transform shadow-lg`}>{card.icon}</div>
                   <h3 className={`text-xl font-bold text-white mb-3 group-hover:text-${card.color}-400`}>{card.title}</h3>
                   <p className="text-slate-400 text-sm leading-relaxed mb-8">{card.desc}</p>
                   <div className="flex items-center gap-2 text-xs font-bold uppercase text-slate-500 group-hover:text-white">Mulai Analisis <ArrowRight size={14} /></div>
                </div>
             ))}
          </div>
       </div>
    </div>
  );
}

// --- 3. MAIN APP (MANUAL FETCH ENV VAR) ---
function AmbasaltMainApp({ mode, onBack, user }) {
  // === CONFIGURATION ===
  // PENTING: Saat di Vercel, GANTI baris di bawah ini menjadi:
  // const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  const apiKey = "AIzaSyDCmG85Gsj89AZN_tZdCXylp4ya914m7yg"; 
  // =====================

  const isThinSection = mode === 'thin_section';
  const [analysisMode, setAnalysisMode] = useState('image'); 
  const [pplImage, setPplImage] = useState(null);
  const [pplBase64, setPplBase64] = useState(null); // Raw base64 string
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

  const config = {
    thin_section: { title: "Thin Section Analysis", color: "amber" },
    rock: { title: "Hand Specimen Identification", color: "blue" },
    mineral: { title: "Mineral Specimen Analysis", color: "emerald" },
  }[mode];

  // --- MANUAL FETCH ANALYSIS ---
  const analyzeSample = async () => {
    setLoading(true);
    setLoadingStep("Menghubungkan ke Brain AI...");
    setErrorMsg(null);
    setResult(null);
    setGridData([]);

    // Cek API Key
    if (!apiKey) {
        setErrorMsg("API Key hilang! Set Environment Variable: VITE_GEMINI_API_KEY di Vercel.");
        setLoading(false);
        return;
    }

    try {
      const jsonFormat = `
      OUTPUT JSON STRICTLY (No Markdown):
      {
        "rockName": "Scientific Name",
        "classificationType": "IUGS/Folk/Dunham",
        "description": "Detailed petrographic description.",
        "paragenesis": "Formation sequence.",
        "petrogenesis": "Origin interpretation.",
        "occurrences": { "indonesia": ["Loc1", "Loc2"], "world": ["Loc1"] },
        "pointCountingStats": "Modal composition summary",
        "gridAnalysis": [ 
            {"index": 0, "mineral": "Name", "colorHex": "#Hex", "feature": "Feature"},
            ... (16 items total for 4x4 grid)
        ], 
        "minerals": [
           { 
             "name": "Mineral Name", 
             "percentage": "XX%", 
             "description": "Short desc",
             "detailedOpticalProps": { "warna": "...", "relief": "...", "birefringence": "..." }
           }
        ]
      }`;

      // Construct Payload Manual
      const parts = [
          { text: `ROLE: Senior Petrographer. TASK: Analyze this geology sample (${config.title}). ${jsonFormat}` }
      ];

      if (analysisMode === 'image') {
        if (!pplBase64) throw new Error("Mohon upload gambar.");
        parts.push({ inline_data: { mime_type: "image/jpeg", data: pplBase64 } });
        if (xplBase64) parts.push({ inline_data: { mime_type: "image/jpeg", data: xplBase64 } });
      } else {
         if (!videoBase64) throw new Error("Mohon upload video.");
         parts.push({ inline_data: { mime_type: "video/mp4", data: videoBase64 } });
      }

      setLoadingStep("Menganalisis Petrografi...");
      
      // FETCH Manual ke Endpoint Google
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: parts }] })
      });

      const data = await response.json();

      if (data.error) throw new Error(data.error.message || "Gagal terhubung ke AI.");
      if (!data.candidates || !data.candidates[0].content) throw new Error("AI tidak memberikan respon.");

      const text = data.candidates[0].content.parts[0].text;
      
      // Bersihkan markdown jika ada
      const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanedText);
      
      setResult(parsed);
      if (isThinSection && parsed.gridAnalysis) setGridData(parsed.gridAnalysis);

    } catch (err) {
      console.error("AI Error:", err);
      setErrorMsg(err.message || "Gagal menganalisis. Coba gambar lain.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result.split(',')[1]; // Remove data:image/jpeg;base64, prefix
      if (type === 'ppl') { setPplImage(reader.result); setPplBase64(base64String); }
      if (type === 'xpl') { setXplImage(reader.result); setXplBase64(base64String); }
      if (type === 'video') { setVideoUrl(URL.createObjectURL(file)); setVideoBase64(base64String); }
      setResult(null); setErrorMsg(null);
    };
    reader.readAsDataURL(file);
  };

  // --- UI ---
  return (
    <div className="flex h-screen bg-[#0f172a] text-slate-300 overflow-hidden font-sans">
      <aside className="w-20 md:w-64 bg-slate-900 border-r border-slate-800 flex flex-col justify-between shrink-0 z-20">
         <div>
            <div className="h-16 flex items-center justify-center md:justify-start md:px-6 border-b border-slate-800">
               <div className={`w-8 h-8 rounded-lg bg-${config.color}-500 flex items-center justify-center text-slate-900 mr-0 md:mr-3 shrink-0`}>{config.color === 'amber' ? <Microscope size={18} /> : config.color === 'blue' ? <Mountain size={18} /> : <Gem size={18} />}</div>
               <span className="hidden md:block font-bold text-slate-100">Ambasalt<span className={`text-${config.color}-500`}>Pro</span></span>
            </div>
            <div className="p-4 space-y-2">
               <div className="text-[10px] font-bold uppercase text-slate-500 px-2 hidden md:block mb-2">Workspace</div>
               <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-slate-800/50 text-white border border-slate-700/50"><LayoutDashboard size={18} /><span className="hidden md:block text-sm">Dashboard</span></button>
               <button onClick={onBack} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-400 hover:bg-slate-800/50 hover:text-white"><ArrowRight className="rotate-180" size={18} /><span className="hidden md:block text-sm">Ganti Mode</span></button>
            </div>
         </div>
      </aside>

      <main className="flex-1 flex flex-col min-w-0 bg-[#0f172a] relative">
         <header className="h-16 border-b border-slate-800 bg-slate-900/50 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-10">
            <h2 className="text-sm font-bold text-white flex items-center gap-2"><span className={`w-2 h-2 rounded-full bg-${config.color}-500`}></span>{config.title}</h2>
            <div className="bg-slate-800 rounded-lg p-1 flex">
               <button onClick={() => setAnalysisMode('image')} className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${analysisMode === 'image' ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}>Foto</button>
               <button onClick={() => setAnalysisMode('video')} className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${analysisMode === 'video' ? 'bg-slate-700 text-white shadow' : 'text-slate-400 hover:text-slate-200'}`}>Video</button>
            </div>
         </header>

         <div className="flex-1 overflow-y-auto p-6 scroll-smooth custom-scrollbar">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-7xl mx-auto">
               {/* INPUT */}
               <div className="lg:col-span-5 space-y-6">
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-1 shadow-xl">
                     <div className="bg-[#0b1120] rounded-xl p-6 relative overflow-hidden">
                        <div className="grid grid-cols-2 gap-4">
                           {analysisMode === 'image' ? (
                             <>
                               <div className={`relative group ${!isThinSection ? 'col-span-2' : ''}`}>
                                  <div className={`relative border-2 border-dashed border-slate-700 bg-slate-800/30 hover:bg-slate-800/50 transition-all flex items-center justify-center overflow-hidden ${isThinSection ? 'rounded-full aspect-square shadow-inner' : 'rounded-xl aspect-video'}`}>
                                     {pplImage ? <img src={pplImage} className="w-full h-full object-cover" style={isThinSection ? {transform: `scale(1.5) rotate(${stageRotation}deg)`} : {}} /> : <div className="text-center text-slate-500 p-4"><Sun className="mx-auto mb-2 opacity-50" /><span className="text-[10px] font-bold uppercase">Upload {isThinSection ? 'PPL' : 'Foto'}</span></div>}
                                     {isThinSection && usePointCounting && <InteractiveGrid gridData={gridData} selectedCell={selectedCell} onSelect={setSelectedCell} />}
                                     <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'ppl')} className="absolute inset-0 opacity-0 cursor-pointer" />
                                  </div>
                                  {isThinSection && <div className="text-center text-[9px] text-slate-500 mt-2">PPL (Plane Polarized)</div>}
                               </div>
                               {isThinSection && (
                                  <div className="relative group">
                                     <div className="relative border-2 border-dashed border-slate-700 bg-slate-800/30 hover:bg-slate-800/50 transition-all flex items-center justify-center overflow-hidden rounded-full aspect-square shadow-inner">
                                        {xplImage ? <img src={xplImage} className="w-full h-full object-cover" style={{transform: `scale(1.5) rotate(${stageRotation}deg)`}} /> : <div className="text-center text-slate-500"><Moon className="mx-auto mb-2 opacity-50" /><span className="text-[10px] font-bold uppercase">Upload XPL</span></div>}
                                        <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'xpl')} className="absolute inset-0 opacity-0 cursor-pointer" />
                                     </div>
                                     <div className="text-center text-[9px] text-slate-500 mt-2">XPL (Cross Polarized)</div>
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
                           {isThinSection && (
                              <div className="mb-6 space-y-4">
                                 <div className="flex justify-between text-xs font-bold text-slate-400"><span>ROTATION</span><span className="text-amber-500">{stageRotation}°</span></div>
                                 <input type="range" min="0" max="360" value={stageRotation} onChange={(e) => setStageRotation(e.target.value)} className="w-full h-1 bg-slate-700 rounded-lg accent-amber-500" />
                                 <button onClick={() => setUsePointCounting(!usePointCounting)} className={`w-full py-2 rounded-lg border text-xs font-bold uppercase flex justify-center gap-2 ${usePointCounting ? 'text-amber-500 border-amber-500 bg-amber-500/10' : 'text-slate-400 border-slate-700'}`}><Grid size={14} /> Grid Mode</button>
                              </div>
                           )}
                           <button onClick={analyzeSample} disabled={loading || (!pplImage && !videoUrl)} className={`w-full py-4 rounded-xl font-bold uppercase tracking-widest text-sm shadow-lg flex items-center justify-center gap-2 transition-all ${loading ? 'bg-slate-800 text-slate-500' : `bg-gradient-to-r from-${config.color}-600 to-${config.color}-500 hover:from-${config.color}-500 text-slate-900`}`}>
                              {loading ? <><Scan className="animate-spin" /> {loadingStep}</> : <><Sparkles size={18} /> Analisis AI</>}
                           </button>
                           {errorMsg && <div className="mt-3 p-3 bg-red-900/20 border border-red-900/50 rounded-lg text-xs text-red-400 flex items-center gap-2"><AlertCircle size={14} /> {errorMsg}</div>}
                        </div>
                     </div>
                  </div>
               </div>

               {/* REPORT */}
               <div className="lg:col-span-7 space-y-6">
                  {!loading && !result && <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-slate-900/30 rounded-2xl border border-slate-800 border-dashed text-slate-600"><FlaskConical size={48} strokeWidth={1} className="mb-4 opacity-50" /><p>Menunggu Data Sampel</p></div>}
                  {loading && <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-slate-900/30 rounded-2xl border border-slate-800 border-dashed"><div className="w-12 h-12 border-4 border-t-amber-500 border-slate-800 rounded-full animate-spin mb-4"></div><p className="text-sm text-slate-500 animate-pulse">{loadingStep}</p></div>}
                  
                  {result && !loading && (
                     <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 relative overflow-hidden">
                           <div className={`absolute top-0 left-0 w-1 h-full bg-${config.color}-500`}></div>
                           <span className="px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-xs font-bold uppercase mb-4 inline-block">{result.classificationType}</span>
                           <h1 className="text-3xl font-bold text-white mb-6">{result.rockName}</h1>
                           <div className="grid md:grid-cols-2 gap-8">
                              <div><h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Deskripsi</h4><p className="text-sm text-slate-300 leading-relaxed">{result.description}</p></div>
                              <div className="space-y-4">
                                 <div><h4 className="text-xs font-bold text-slate-500 uppercase mb-2">Petrogenesa</h4><p className="text-sm text-slate-300">{result.petrogenesis}</p></div>
                              </div>
                           </div>
                        </div>

                        {/* Minerals */}
                        <div className="space-y-3">
                           <h3 className="text-lg font-bold text-white flex items-center gap-2"><Layers size={18} /> Komposisi Mineral</h3>
                           {result.minerals?.map((m, i) => (
                              <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                                 <div className="p-4 flex items-center justify-between cursor-pointer hover:bg-slate-800/50 transition-colors" onClick={() => setExpandedMineralIndex(expandedMineralIndex === i ? null : i)}>
                                    <div className="flex items-center gap-4">
                                       <div className={`w-8 h-8 rounded flex items-center justify-center ${expandedMineralIndex === i ? 'bg-amber-500 text-slate-900' : 'bg-slate-800 text-slate-400'}`}>{expandedMineralIndex === i ? <Eye size={16} /> : <ChevronDown size={16} />}</div>
                                       <div><h4 className="font-bold text-slate-200">{m.name}</h4><p className="text-xs text-slate-500">{m.description}</p></div>
                                    </div>
                                    <div className="text-xs font-mono font-bold bg-black/30 px-3 py-1 rounded text-amber-500">{m.percentage}</div>
                                 </div>
                                 {expandedMineralIndex === i && m.detailedOpticalProps && (
                                    <div className="p-4 border-t border-slate-800 bg-slate-950/30 grid grid-cols-2 gap-3">
                                       {Object.entries(m.detailedOpticalProps).map(([k, v]) => <div key={k} className="bg-slate-900 p-2 rounded border border-slate-800"><div className="text-[9px] uppercase text-slate-500 font-bold">{k}</div><div className="text-xs text-slate-300">{v}</div></div>)}
                                    </div>
                                 )}
                              </div>
                           ))}
                        </div>
                     </div>
                  )}
               </div>
            </div>
         </div>
      </main>
      
      {/* MINO CHATBOT (MANUAL FETCH) */}
      <MinoAssistant result={result} apiKey={apiKey} />
      <style>{`.custom-scrollbar::-webkit-scrollbar { width: 6px; } .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }`}</style>
    </div>
  );
}

// --- HELPERS ---
const InteractiveGrid = ({ gridData, selectedCell, onSelect }) => (
    <div className="absolute inset-0 grid grid-cols-4 grid-rows-4 z-20 pointer-events-none rounded-full overflow-hidden">
      {[...Array(16)].map((_, i) => {
        const cellData = gridData?.find(d => d.index == i);
        return (
          <div key={i} onClick={(e) => { e.stopPropagation(); onSelect(i); }} className={`relative border border-white/5 flex items-center justify-center cursor-pointer pointer-events-auto group ${selectedCell === i ? 'bg-amber-500/20 border-amber-500/50' : 'hover:bg-white/5'}`}>
            {cellData && <div className="w-1.5 h-1.5 rounded-full shadow-sm bg-white/80 absolute top-1 right-1" style={{backgroundColor: cellData.colorHex}}></div>}
            {cellData && selectedCell === i && <div className="absolute bottom-1 bg-black/80 px-2 rounded text-[8px] text-amber-500 font-bold">{cellData.mineral}</div>}
          </div>
        );
      })}
    </div>
);

function MinoAssistant({ result, apiKey }) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([{ role: 'model', text: 'Halo! Saya MINO. Ada yang bisa dibantu tentang batuan ini?' }]);
  const [isTyping, setIsTyping] = useState(false);
  const endRef = useRef(null);

  useEffect(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim() || !apiKey) return;
    const userMsg = { role: 'user', text: input };
    const newMsgs = [...messages, userMsg];
    setMessages(newMsgs);
    setInput('');
    setIsTyping(true);

    try {
      const prompt = result ? `CONTEXT: User is asking about analyzed rock: ${result.rockName}. Previous chat: ${JSON.stringify(messages)}. USER QUESTION: ${input}. ANSWER SHORTLY.` : `You are Mino, a geology assistant. USER: ${input}`;
      
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });

      const data = await response.json();
      const answer = data.candidates?.[0]?.content?.parts?.[0]?.text || "Maaf, saya tidak mengerti.";
      
      setMessages([...newMsgs, { role: 'model', text: answer }]);
    } catch (e) {
      setMessages([...newMsgs, { role: 'model', text: "Maaf, koneksi terputus." }]);
    } finally { setIsTyping(false); }
  };

  return (
    <>
      <button onClick={() => setIsOpen(!isOpen)} className={`fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all z-50 ${isOpen ? 'bg-slate-700 text-white' : 'bg-gradient-to-tr from-amber-600 to-amber-500 text-slate-900'}`}>{isOpen ? <X /> : <Bot size={28} />}</button>
      {isOpen && <div className="fixed bottom-24 right-6 w-80 h-96 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden">
         <div className="p-3 bg-slate-800 border-b border-slate-700 font-bold text-white text-sm flex items-center gap-2"><Sparkles size={14} className="text-amber-500"/> MINO Assistant</div>
         <div className="flex-1 overflow-y-auto p-3 space-y-3">{messages.map((m, i) => <div key={i} className={`p-2 rounded-xl text-xs max-w-[85%] ${m.role === 'user' ? 'bg-amber-600 text-white self-end ml-auto' : 'bg-slate-800 text-slate-300'}`}>{m.text}</div>)}{isTyping && <div className="text-xs text-slate-500 p-2">Mino mengetik...</div>}<div ref={endRef}></div></div>
         <form onSubmit={(e) => {e.preventDefault(); handleSend()}} className="p-2 border-t border-slate-800 flex gap-2"><input value={input} onChange={e=>setInput(e.target.value)} className="flex-1 bg-slate-800 rounded-lg px-3 text-xs text-white outline-none" placeholder="Tanya sesuatu..." /><button className="p-2 bg-amber-500 rounded-lg text-slate-900"><Send size={14} /></button></form>
      </div>}
    </>
  );
}
