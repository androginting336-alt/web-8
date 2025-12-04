// --- 3. MAIN APP (DIPERBAIKI: Logika API & Model Stabil) ---
function AmbasaltMainApp({ mode, onBack, user }) {
  // === CONFIGURATION ===
  const apiKey = "AIzaSyAyebr2_x6uNGAyUa7xwfzLyfghbgN9rOM"; 
  // SAYA UBAH KE MODEL STABIL (1.5 Flash) agar kuota lebih banyak & jarang error 429
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

  // --- API LOGIC (DIPERBAIKI: Exponential Backoff untuk Error 429) ---
  const callGeminiWithRetry = async (payload, maxRetries = 3) => {
    let attempt = 0;
    while (attempt <= maxRetries) {
      try {
        // Menggunakan MODEL_NAME yang sudah diganti ke versi stabil
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });

        // Tangani Error HTTP spesifik
        if (!response.ok) {
          // Jika Error 429 (Too Many Requests) atau 503 (Server Overload)
          if (response.status === 429 || response.status === 503) {
            throw new Error("RATE_LIMIT");
          }
          throw new Error(`HTTP Error: ${response.status}`);
        }
        
        return await response.json();

      } catch (error) {
        attempt++;
        console.warn(`Percobaan ke-${attempt} gagal: ${error.message}`);

        if (attempt > maxRetries) throw error;

        // Logika Backoff: Tunggu 2 detik, lalu 4 detik, lalu 8 detik (Mencegah spam ke server)
        const delay = error.message === "RATE_LIMIT" ? Math.pow(2, attempt) * 1000 : 2000;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  };

  const handleFileUpload = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result.split(',')[1];
      if (type === 'ppl') { setPplImage(reader.result); setPplBase64(base64String); }
      if (type === 'xpl') { setXplImage(reader.result); setXplBase64(base64String); }
      if (type === 'video') { setVideoUrl(URL.createObjectURL(file)); setVideoBase64(base64String); }
      // Reset state
      setResult(null); setErrorMsg(null); setGridData([]);
    };
    reader.readAsDataURL(file);
  };

  const analyzeSample = async () => {
    if (loading) return; // Mencegah klik ganda

    setLoading(true);
    setLoadingStep("Inisialisasi Model AI...");
    setResult(null);
    setErrorMsg(null);
    setGridData([]);
    
    if (isThinSection && analysisMode === 'image') setUsePointCounting(true);

    try {
      // Prompt JSON yang sama
      const jsonFormat = `
        OUTPUT JSON (Strict, no markdown formatting):
        {
          "rockName": "Nama Batuan (Sesuai Klasifikasi Internasional)",
          "classificationType": "Sistem Klasifikasi (IUGS/Folk/Dunham/Wentworth)",
          "description": "Deskripsi petrografi/litologi detail.",
          "paragenesis": "Urutan pembentukan/kristalisasi.",
          "petrogenesis": "Interpretasi genesa.",
          "occurrences": { "indonesia": ["Lokasi1", "Lokasi2"], "world": ["Lokasi1"] },
          "pointCountingStats": "Ringkasan komposisi modal (%)",
          "gridAnalysis": [ 
              // WAJIB ADA 16 ITEM (Index 0-15) untuk simulasi grid 4x4
              {"index": 0, "mineral": "Nama Mineral", "colorHex": "#KodeWarna", "feature": "Fitur Optik Khas"},
              {"index": 1, "mineral": "...", "colorHex": "...", "feature": "..."},
              ... (lanjutkan sampai index 15)
          ], 
          "minerals": [
             { 
               "name": "Nama Mineral", 
               "percentage": "Angka Pasti (Contoh: 45%)", 
               "description": "Deskripsi kehadiran.",
               "detailedOpticalProps": {
                  "warnaInterferensi": "...", "polaKembaran": "...", "ekstingsi": "...",
                  "birefringence": "...", "relief": "...", "cleavageFracture": "...",
                  "zoning": "...", "habitusShape": "...", "teksturStruktur": "...", "interferenceFigure": "..."
               }
             }
          ]
        }
      `;

      let prompt = `PERAN: Ahli Petrografi & Geologi Senior. 
      
      TUGAS: Analisis sampel geologi ini dengan standar profesional.
      
      INSTRUKSI KHUSUS:
      1. KLASIFIKASI: 
         - Untuk Batuan Beku/Metamorf: Gunakan klasifikasi IUGS (Streckeisen).
         - Untuk Batuan Karbonat: Gunakan klasifikasi Folk atau Dunham.
         - Untuk Batuan Sedimen Klastik: Gunakan skala Udden-Wentworth atau klasifikasi Pettijohn.
      2. KUANTITATIF: Berikan estimasi persentase mineral dalam ANGKA PASTI (Contoh: "35%", bukan "30-40%"). Total komposisi harus mendekati 100%.
      3. POINT COUNTING (Grid Analysis):
         - Lakukan simulasi perhitungan titik (point counting) pada grid 4x4 (16 titik) di atas citra.
         - Anda WAJIB mengisi array 'gridAnalysis' dengan tepat 16 objek (index 0 sampai 15).
         - Identifikasi mineral dominan yang berada tepat di posisi grid tersebut.
      4. LOKASI: Sebutkan formasi atau daerah spesifik di Indonesia dimana batuan ini umum ditemukan.

      MODE ANALISIS: ${config.title}.
      ${jsonFormat}`;
      
      const parts = [{ text: prompt }];
      if (analysisMode === 'image') {
         if (!pplBase64) throw new Error("Upload gambar utama.");
         parts.push({ inline_data: { mime_type: "image/jpeg", data: pplBase64 } });
         if (xplBase64) parts.push({ inline_data: { mime_type: "image/jpeg", data: xplBase64 } });
      } else {
         if (!videoBase64) throw new Error("Upload video.");
         parts.push({ inline_data: { mime_type: "video/mp4", data: videoBase64 } });
      }

      setLoadingStep("Klasifikasi Standar Internasional...");
      
      const data = await callGeminiWithRetry({ 
        contents: [{ parts }], 
        generationConfig: { responseMimeType: "application/json" } 
      });
      
      if (!data.candidates) throw new Error("Gagal mendapatkan respons AI. Cek koneksi atau coba gambar lain.");
      
      const text = data.candidates[0].content.parts[0].text;
      const parsed = JSON.parse(text);
      setResult(parsed);
      if (isThinSection && parsed.gridAnalysis) setGridData(parsed.gridAnalysis);

    } catch (err) {
      console.error(err);
      if (err.message.includes("429") || err.message === "RATE_LIMIT") {
        setErrorMsg("Terlalu banyak permintaan (429). Sistem sedang sibuk, mohon tunggu 30 detik sebelum mencoba lagi.");
      } else {
        setErrorMsg(err.message || "Terjadi kesalahan saat analisis.");
      }
    } finally {
      setLoading(false);
    }
  };

  // --- UI RENDER (SAMA SEPERTI SEBELUMNYA, HANYA RENDER) ---
  return (
    <div className="flex h-screen bg-[#0f172a] text-slate-300 overflow-hidden font-sans">
      
      {/* SIDEBAR (Mini on Mobile) */}
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
                  <div className="text-[10px] text-slate-500">Pro License</div>
               </div>
            </div>
         </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col min-w-0 bg-[#0f172a] relative">
         
         {/* Top Header */}
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

         {/* Content Scrollable */}
         <div className="flex-1 overflow-y-auto p-6 scroll-smooth custom-scrollbar">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-7xl mx-auto">
               
               {/* LEFT COLUMN: INPUT & VISUALIZATION */}
               <div className="lg:col-span-5 space-y-6">
                  {/* Card Container */}
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-1 shadow-xl">
                     <div className="bg-[#0b1120] rounded-xl p-6 relative overflow-hidden">
                        
                        {/* INPUT VISUALIZER */}
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

                        {/* CONTROLS AREA */}
                        <div className="mt-6 pt-6 border-t border-slate-800">
                           {isThinSection && analysisMode === 'image' && (
                              <div className="mb-6 space-y-4">
                                 <div className="flex items-center justify-between">
                                    <span className="text-xs font-bold text-slate-400">STAGE ROTATION</span>
                                    <span className="text-xs font-mono text-amber-500">{stageRotation}°</span>
                                 </div>
                                 <input type="range" min="0" max="360" value={stageRotation} onChange={(e) => setStageRotation(e.target.value)} className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500" />
                                 
                                 <button onClick={() => setUsePointCounting(!usePointCounting)} className={`w-full py-2 rounded-lg border text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${usePointCounting ? 'bg-amber-500/10 border-amber-500 text-amber-500' : 'bg-slate-800 border-slate-700 text-slate-400'}`}>
                                    <Grid size={14} /> Toggle Point Counting Grid
                                 </button>
                              </div>
                           )}

                           <button 
                              onClick={analyzeSample}
                              disabled={loading || (!pplImage && !videoUrl)}
                              className={`w-full py-4 rounded-xl font-bold uppercase tracking-widest text-sm shadow-lg flex items-center justify-center gap-2 transition-all transform active:scale-[0.98] ${loading ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : `bg-gradient-to-r from-${config.color}-600 to-${config.color}-500 hover:from-${config.color}-500 hover:to-${config.color}-400 text-slate-900`}`}
                           >
                              {loading ? <><Scan className="animate-spin" /> {loadingStep}</> : <><Sparkles size={18} /> Mulai Analisis AI</>}
                           </button>
                           {errorMsg && <div className="mt-3 p-3 bg-red-900/20 border border-red-900/50 rounded-lg text-xs text-red-400 flex items-center gap-2"><AlertCircle size={14} /> {errorMsg}</div>}
                        </div>

                     </div>
                  </div>
               </div>

               {/* RIGHT COLUMN: REPORT */}
               <div className="lg:col-span-7 space-y-6">
                  {loading && (
                     <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-slate-900/30 rounded-2xl border border-slate-800 border-dashed">
                        <div className="relative">
                           <div className={`w-16 h-16 border-4 border-slate-800 border-t-${config.color}-500 rounded-full animate-spin`}></div>
                           <div className={`absolute inset-0 flex items-center justify-center text-${config.color}-500`}><Bot size={20} /></div>
                        </div>
                        <p className="mt-4 text-sm font-mono text-slate-500 animate-pulse">AI sedang menganalisis sampel...</p>
                     </div>
                  )}

                  {!loading && !result && (
                     <div className="h-full min-h-[400px] flex flex-col items-center justify-center bg-slate-900/30 rounded-2xl border border-slate-800 border-dashed text-slate-600">
                        <FlaskConical size={48} strokeWidth={1} className="mb-4 opacity-50" />
                        <p className="text-lg font-medium">Menunggu Data Sampel</p>
                        <p className="text-sm">Unggah gambar atau video untuk memulai analisis.</p>
                     </div>
                  )}

                  {result && !loading && (
                     <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        
                        {/* HEADER CARD */}
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 relative overflow-hidden">
                           <div className={`absolute top-0 left-0 w-1 h-full bg-${config.color}-500`}></div>
                           <div className="relative z-10">
                              <span className={`inline-block px-3 py-1 rounded-full bg-${config.color}-900/30 border border-${config.color}-500/30 text-${config.color}-400 text-[10px] font-bold uppercase tracking-wider mb-4`}>
                                 {result.classificationType}
                              </span>
                              <h1 className="text-4xl font-bold text-white mb-6 leading-tight">{result.rockName}</h1>
                              
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                 <div>
                                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2"><AlignLeft size={14}/> Deskripsi</h4>
                                    <p className="text-sm text-slate-300 leading-relaxed">{result.description}</p>
                                 </div>
                                 <div className="space-y-6">
                                    <div>
                                       <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2"><Clock size={14}/> Petrogenesa</h4>
                                       <p className="text-sm text-slate-300 leading-relaxed">{result.petrogenesis}</p>
                                    </div>
                                    {result.paragenesis && (
                                       <div>
                                          <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2"><ListChecks size={14}/> Paragenesa</h4>
                                          <p className="text-sm text-slate-300 leading-relaxed">{result.paragenesis}</p>
                                       </div>
                                    )}
                                 </div>
                              </div>
                           </div>
                        </div>

                        {/* GEO LOCATION CARD */}
                        {result.occurrences && (
                           <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 relative overflow-hidden group">
                              <div className="absolute -right-10 -bottom-10 text-slate-800 opacity-50 rotate-12 group-hover:rotate-0 transition-transform duration-700">
                                 <Globe2 size={180} strokeWidth={0.5} />
                              </div>
                              <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8">
                                 <div>
                                    <h4 className="text-xs font-bold text-emerald-500 uppercase tracking-widest mb-3 flex items-center gap-2"><Map size={14}/> Lokasi (Indonesia)</h4>
                                    <ul className="space-y-2">
                                       {result.occurrences.indonesia?.map((loc, i) => (
                                          <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                                             <span className="mt-1.5 w-1 h-1 rounded-full bg-emerald-500"></span> {loc}
                                          </li>
                                       )) || <li className="text-slate-500 italic">Data tidak tersedia</li>}
                                    </ul>
                                 </div>
                                 <div>
                                    <h4 className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-3 flex items-center gap-2"><Globe2 size={14}/> Distribusi Global</h4>
                                    <div className="flex flex-wrap gap-2">
                                       {result.occurrences.world?.map((loc, i) => (
                                          <span key={i} className="px-2.5 py-1 rounded-md bg-slate-800 border border-slate-700 text-xs text-slate-400">{loc}</span>
                                       )) || <span className="text-slate-500 italic">Data tidak tersedia</span>}
                                    </div>
                                 </div>
                              </div>
                           </div>
                        )}

                        {/* MINERAL COMPOSITION */}
                        <div className="space-y-4">
                           <h3 className="text-lg font-bold text-white flex items-center gap-2"><Layers size={20} className={`text-${config.color}-500`} /> Komposisi Mineralogi</h3>
                           <div className="grid grid-cols-1 gap-4">
                              {result.minerals?.map((m, i) => (
                                 <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-slate-600 transition-colors">
                                    <div 
                                       className="p-4 flex items-center justify-between cursor-pointer bg-slate-800/30" 
                                       onClick={() => setExpandedMineralIndex(expandedMineralIndex === i ? null : i)}
                                    >
                                       <div className="flex items-center gap-4">
                                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 ${expandedMineralIndex === i ? `bg-${config.color}-500 text-slate-900` : 'bg-slate-800'}`}>
                                             {expandedMineralIndex === i ? <Eye size={16} /> : <ChevronDown size={16} />}
                                          </div>
                                          <div>
                                             <h4 className="font-bold text-slate-200">{m.name}</h4>
                                             <p className="text-xs text-slate-500 line-clamp-1">{m.description}</p>
                                          </div>
                                       </div>
                                       <div className={`px-3 py-1 rounded text-xs font-mono font-bold bg-slate-950 text-${config.color}-500 border border-slate-800`}>
                                          {m.percentage}
                                       </div>
                                    </div>
                                    
                                    {expandedMineralIndex === i && m.detailedOpticalProps && (
                                       <div className="p-4 border-t border-slate-800 bg-slate-900/50">
                                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                             {Object.entries(m.detailedOpticalProps).map(([key, val]) => (
                                                <div key={key} className="p-2 rounded bg-slate-950 border border-slate-800/50">
                                                   <div className="text-[9px] uppercase tracking-wider text-slate-500 mb-1 font-bold">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                                                   <div className="text-xs text-slate-300 font-medium truncate" title={val}>{val}</div>
                                                </div>
                                             ))}
                                          </div>
                                       </div>
                                    )}
                                 </div>
                              ))}
                           </div>
                        </div>

                     </div>
                  )}
               </div>
            </div>
         </div>
      </main>

      <MinoAssistant result={result} apiKey={apiKey} />
      
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #334155; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #475569; }
      `}</style>
    </div>
  );
}

// --- MINO ASSISTANT (JUGA PERLU DIPERBAIKI MODELNYA) ---
function MinoAssistant({ result, apiKey }) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([{ role: 'model', text: 'Halo! Saya MINO, asisten geologi Anda. Ada yang bisa saya bantu?' }]);
  const [isTyping, setIsTyping] = useState(false);
  const endRef = useRef(null);

  // Model yang sama (Stabil)
  const MODEL_NAME = "gemini-1.5-flash"; 

  useEffect(() => endRef.current?.scrollIntoView({ behavior: "smooth" }), [messages, isOpen]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    try {
      let prompt = `PERAN: MINO (AI Geologist). Jawab singkat & ilmiah.`;
      if (result) prompt += ` KONTEKS: Batuan ${result.rockName}, ${result.classificationType}. Mineral: ${result.minerals.map(m=>m.name).join(', ')}.`;
      prompt += ` USER: ${userMsg.text}`;
      
      // Update URL ke Model Stabil
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL_NAME}:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      });

      if (response.status === 429) throw new Error("Terlalu banyak request. Tunggu sebentar.");

      const data = await response.json();
      const answer = data.candidates?.[0]?.content?.parts?.[0]?.text || "Maaf, saya tidak mengerti.";
      
      setMessages(prev => [...prev, { role: 'model', text: answer }]);
    } catch (e) { 
        console.error(e);
        setMessages(prev => [...prev, { role: 'model', text: "Maaf, terjadi kesalahan koneksi atau limit API tercapai." }]); 
    }
    finally { setIsTyping(false); }
  };

  return (
    <>
      <button onClick={() => setIsOpen(!isOpen)} className={`fixed bottom-6 right-6 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 z-50 hover:scale-110 ${isOpen ? 'bg-slate-700 rotate-90 text-slate-300' : 'bg-gradient-to-tr from-amber-600 to-amber-500 text-slate-900'}`}>{isOpen ? <X /> : <Bot size={28} />}</button>
      <div className={`fixed bottom-24 right-6 w-80 md:w-96 bg-[#1e293b] border border-slate-700 rounded-2xl shadow-2xl flex flex-col transition-all duration-300 origin-bottom-right z-50 ${isOpen ? 'scale-100 opacity-100' : 'scale-0 opacity-0 pointer-events-none'}`} style={{ height: '500px' }}>
        <div className="p-4 border-b border-slate-700 bg-slate-800 rounded-t-2xl flex items-center gap-3"><div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center text-slate-900"><Sparkles size={16} /></div><div><h3 className="text-sm font-bold text-white">MINO Assistant</h3><p className="text-[10px] text-emerald-400">● Online</p></div></div>
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#0f172a] custom-scrollbar">{messages.map((m, i) => (<div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}><div className={`max-w-[85%] p-3 rounded-2xl text-xs leading-relaxed ${m.role === 'user' ? 'bg-amber-600 text-white rounded-tr-none' : 'bg-slate-800 text-slate-200 rounded-tl-none'}`}>{m.text}</div></div>))}{isTyping && <div className="text-xs text-slate-500 ml-4">MINO sedang mengetik...</div>}<div ref={endRef} /></div>
        <div className="p-3 border-t border-slate-700 bg-slate-800 rounded-b-2xl"><form onSubmit={(e) => {e.preventDefault(); handleSend();}} className="flex gap-2"><input value={input} onChange={e=>setInput(e.target.value)} placeholder="Tanya MINO..." className="flex-1 bg-slate-900 border border-slate-600 rounded-xl px-4 py-2 text-xs text-white focus:border-amber-500 outline-none" /><button disabled={!input.trim() || isTyping} className="bg-amber-500 text-slate-900 p-2 rounded-xl hover:bg-amber-400 disabled:opacity-50"><Send size={16} /></button></form></div>
      </div>
    </>
  );
}
