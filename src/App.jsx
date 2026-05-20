import React, { useState, useRef, useEffect } from 'react';
import { 
  Microscope, Upload, Scan, FlaskConical, Layers, Sun, Moon, 
  CheckCircle2, Grid, XCircle, MousePointer2, ZoomIn, BookOpen, 
  Activity, MapPin, Globe2, Fingerprint, Clock, Video, Film, PlayCircle,
  FileText, ListChecks, Eye, ChevronDown, ChevronUp, Info, AlignLeft, Ban,
  User, Lock, Mail, Facebook, Github, Linkedin, Chrome, AlertCircle, CheckCircle, ArrowRight,
  LogOut, Mountain, Gem, ChevronLeft, Map, MessageSquare, Send, X, Sparkles, Bot, Hexagon, LayoutDashboard, WifiOff,
  Search, Compass, Flame, Heart, Target, Zap, ShieldCheck, Radio, TrendingUp, Loader, Plus, Minus
} from 'lucide-react';

const OFFLINE_DATABASE = {
  thin_section: [
    {
      rockName: "Andesit Piroksen",
      classificationType: "Batuan Beku Intermediet (IUGS)",
      description: "Sayatan tipis menunjukkan tekstur porfiritik dengan fenokris plagioklas dan piroksen (augit) yang tertanam dalam massa dasar gelas vulkanik dan mikrolit plagioklas. Terdapat struktur aliran (trachytic texture) pada massa dasar.",
      paragenesis: "Kristalisasi awal plagioklas dan piroksen pada kondisi tekanan tinggi, diikuti pendinginan cepat magma di permukaan membentuk massa dasar gelas.",
      petrogenesis: "Berasal dari magma intermediet calc-alkaline di lingkungan busur kepulauan (island arc).",
      occurrences: { indonesia: ["Gunung Merapi, DIY", "Bandung Selatan"], world: ["Andes, Amerika Selatan"] },
      minerals: [
        { name: "Plagioklas (Andesin)", percentage: "45%", description: "Fenokris euhedral, kembaran albit-carlsbad, zoning osilatorik.", detailedOpticalProps: { warnaInterferensi: "Abu-abu orde 1", relief: "Sedang", kembaran: "Albit", habitus: "Tabular" } },
        { name: "Piroksen (Augit)", percentage: "20%", description: "Fenokris subhedral, warna hijau pucat di PPL, belahan 2 arah 90 derajat.", detailedOpticalProps: { warnaInterferensi: "Orde 2 Bawah", relief: "Tinggi", sudutPemadaman: "Miring (40-45°)" } },
        { name: "Massa Dasar (Gelas)", percentage: "30%", description: "Isotropik (gelap total di XPL).", detailedOpticalProps: { relief: "Rendah", sifat: "Isotropik" } },
        { name: "Opak (Magnetit)", percentage: "5%", description: "Hitam di PPL dan XPL.", detailedOpticalProps: { sifat: "Opak" } }
      ]
    }
  ],
  rock: [
    {
      rockName: "Granit Biotit",
      classificationType: "Batuan Beku Asam (Plutonik)",
      description: "Batuan berbutir kasar (faneritik), holokristalin, berwarna terang berbintik hitam.",
      paragenesis: "Pembekuan magma lambat jauh di bawah permukaan bumi (intrusif).",
      petrogenesis: "Magma felsik hasil pelelehan kerak benua atau diferensiasi magma.",
      occurrences: { indonesia: ["Kepulauan Riau (Karimun)", "Sulawesi Barat"], world: ["Yosemite, USA"] },
      minerals: [
        { name: "K-Feldspar (Orthoclast)", percentage: "40%", description: "Warna merah muda salmon, belahan jelas." },
        { name: "Kuarsa", percentage: "30%", description: "Tidak berwarna/abu-abu, kilap kaca, pecahan konkoidal." },
        { name: "Plagioklas", percentage: "15%", description: "Putih susu, striasi pada permukaan belahan." },
        { name: "Biotit", percentage: "15%", description: "Hitam, bentuk lembaran (mika), kilap mutiara." }
      ]
    }
  ],
  mineral: [
    {
      rockName: "Amethyst (Kecubung)",
      classificationType: "Mineral Silikat (Tektosilikat)",
      description: "Varietas kuarsa berwarna ungu. Kristal berbentuk prisma heksagonal dengan terminasi piramidal.",
      paragenesis: "Terbentuk di rongga geode pada batuan vulkanik, warna ungu akibat iradiasi besi (Fe3+).",
      petrogenesis: "Hidrotermal suhu rendah.",
      occurrences: { indonesia: ["Kalimantan Barat", "Lampung"], world: ["Brazil", "Uruguay"] },
      minerals: [
        { name: "Kuarsa (SiO2)", percentage: "99%", description: "Kekerasan Mohs 7, pecahan konkoidal." },
        { name: "Inklusi (Goethite)", percentage: "<1%", description: "Jarum-jarum kecoklatan di dalam kristal." }
      ]
    }
  ]
};

const getMineralColor = (mineralName) => {
  const name = mineralName.toLowerCase();
  if (name.includes('plagioklas') || name.includes('andesin') || name.includes('feldspar')) {
    return 'rgba(215, 220, 230, 0.45)';
  }
  if (name.includes('piroksen') || name.includes('augit')) {
    return 'rgba(105, 140, 95, 0.5)';
  }
  if (name.includes('kuarsa') || name.includes('quartz')) {
    return 'rgba(240, 245, 255, 0.2)';
  }
  if (name.includes('biotit') || name.includes('mika')) {
    return 'rgba(160, 110, 60, 0.55)';
  }
  if (name.includes('kalsit') || name.includes('limestone') || name.includes('ooid')) {
    return 'rgba(235, 225, 205, 0.5)';
  }
  if (name.includes('gelas') || name.includes('massa dasar')) {
    return 'rgba(40, 40, 40, 0.6)';
  }
  if (name.includes('opak') || name.includes('magnetit')) {
    return 'rgba(15, 15, 15, 0.85)';
  }
  return 'rgba(201, 166, 107, 0.45)';
};

// ============================================
// ROOT COMPONENT ENHANCED
// ============================================
export default function App() {
  const [screen, setScreen] = useState('auth'); 
  const [appMode, setAppMode] = useState('thin_section'); 
  const [user, setUser] = useState(null);
  const [isBlackMode, setIsBlackMode] = useState(false);
  const toggleTheme = () => setIsBlackMode(!isBlackMode);

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setScreen('dashboard'); 
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

  const handleGoToSelection = () => setScreen('selection');
  const handleBackToDashboard = () => setScreen('dashboard');

  const mainBg = isBlackMode ? 'bg-[#000000]' : 'bg-[#1A1815]';
  const textMain = isBlackMode ? 'text-zinc-200' : 'text-[#F5F1E8]';

  return (
    <div className={`font-sans ${textMain} antialiased selection:bg-[#C9A66B]/30 selection:text-[#C9A66B] h-screen w-full overflow-hidden ${mainBg} transition-colors duration-500`}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Orbitron:wght@400;600;800;900&display=swap');
        
        * {
          transition: color 0.3s, background-color 0.3s, border-color 0.3s;
        }
        
        ::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        ::-webkit-scrollbar-track {
          background: rgba(255,255,255,0.05);
        }
        ::-webkit-scrollbar-thumb {
          background: rgba(201,166,107,0.3);
          border-radius: 3px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(201,166,107,0.6);
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(201,166,107,0.2);
          border-radius: 3px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(201,166,107,0.4);
        }
        
        .glow-cyan {
          box-shadow: 0 0 20px rgba(0, 240, 255, 0.3), inset 0 0 20px rgba(0, 240, 255, 0.1);
        }
        
        .glow-gold {
          box-shadow: 0 0 20px rgba(201, 166, 107, 0.3), inset 0 0 20px rgba(201, 166, 107, 0.1);
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(5deg); }
        }
        
        @keyframes glow-pulse {
          0%, 100% { box-shadow: 0 0 20px rgba(201, 166, 107, 0.3); }
          50% { box-shadow: 0 0 30px rgba(201, 166, 107, 0.6); }
        }
        
        @keyframes scan-line {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-glow { animation: glow-pulse 2s ease-in-out infinite; }
        .scan-animation { animation: scan-line 3s linear infinite; }
      `}</style>
      {screen === 'auth' && <AuthScreen onLogin={handleLoginSuccess} isBlackMode={isBlackMode} />}
      {screen === 'dashboard' && <DashboardScreen onNavigateToSelection={handleGoToSelection} onLogout={handleLogout} user={user} isBlackMode={isBlackMode} toggleTheme={toggleTheme} />}
      {screen === 'selection' && <SelectionScreen onSelect={handleSelectMode} onBack={handleBackToDashboard} onLogout={handleLogout} user={user} isBlackMode={isBlackMode} toggleTheme={toggleTheme} />}
      {screen === 'app' && <AmbasaltMainApp mode={appMode} onBackToSelection={handleGoToSelection} onBackToDashboard={handleBackToDashboard} user={user} isBlackMode={isBlackMode} />}
    </div>
  );
}

// ============================================
// AUTH SCREEN - dengan 3D background
// ============================================
function AuthScreen({ onLogin, isBlackMode }) {
  const [view, setView] = useState('login');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [isRegLoading, setIsRegLoading] = useState(false);
  const [loadedCards, setLoadedCards] = useState({ login: false, register: false });
  const canvasRef = useRef(null);

  useEffect(() => {
    const link = document.createElement('link');
    link.href = "https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    setTimeout(() => {
      setLoadedCards({ login: true, register: false });
    }, 100);

    let animationFrameId;
    let scene, camera, renderer, globe, particlesMesh, terrainGroup;
    let crystals = [];
    const particlesCount = 800;
    
    let mouseX = 0; let mouseY = 0;
    let targetX = 0; let targetY = 0;
    let windowHalfX = window.innerWidth / 2;
    let windowHalfY = window.innerHeight / 2;
    let clock;

    const initThreeJS = () => {
      if (!window.THREE || !canvasRef.current) return;
      const THREE = window.THREE;
      clock = new THREE.Clock();

      scene = new THREE.Scene();
      scene.fog = new THREE.FogExp2(isBlackMode ? 0x000000 : 0x1A1815, 0.02);

      camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      camera.position.z = 30;
      camera.position.y = 5;

      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      
      canvasRef.current.innerHTML = '';
      canvasRef.current.appendChild(renderer.domElement);

      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
      scene.add(ambientLight);

      const pointLight = new THREE.PointLight(0xC9A66B, 2, 100);
      pointLight.position.set(10, 20, 20);
      scene.add(pointLight);
      
      const pointLight2 = new THREE.PointLight(0x5C6B4F, 1, 100);
      pointLight2.position.set(-10, -20, -10);
      scene.add(pointLight2);

      const sphereGeometry = new THREE.SphereGeometry(14, 32, 32);
      const sphereMaterial = new THREE.MeshBasicMaterial({
          color: 0xC9A66B, wireframe: true, transparent: true, opacity: 0.15
      });
      globe = new THREE.Mesh(sphereGeometry, sphereMaterial);
      globe.position.set(0, 0, -10);
      scene.add(globe);

      const crystalGeo = new THREE.OctahedronGeometry(1.5, 0);
      const crystalGeoSmall = new THREE.OctahedronGeometry(0.8, 0);
      const crystalMat = new THREE.MeshStandardMaterial({
          color: 0xD4AF37, metalness: 0.7, roughness: 0.2, wireframe: true, transparent: true, opacity: 0.6
      });

      const crystalPositions = [
          {x: -18, y: 10, z: -5, s: 1}, {x: 20, y: -8, z: -10, s: 1.5},
          {x: -15, y: -12, z: 5, s: 0.8}, {x: 15, y: 12, z: 2, s: 1}
      ];

      crystalPositions.forEach(pos => {
          const geo = pos.s > 1 ? crystalGeo : crystalGeoSmall;
          const mesh = new THREE.Mesh(geo, crystalMat);
          mesh.position.set(pos.x, pos.y, pos.z);
          mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
          mesh.userData = {
              rx: (Math.random() - 0.5) * 0.02, ry: (Math.random() - 0.5) * 0.02, floatOffset: Math.random() * Math.PI * 2
          };
          crystals.push(mesh);
          scene.add(mesh);
      });

      const particlesGeometry = new THREE.BufferGeometry();
      const posArray = new Float32Array(particlesCount * 3);
      for(let i = 0; i < particlesCount * 3; i++) {
          posArray[i] = (Math.random() - 0.5) * 100;
      }
      particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
      const particlesMaterial = new THREE.PointsMaterial({
          size: 0.15, color: 0xF5F1E8, transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending
      });
      particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
      scene.add(particlesMesh);

      terrainGroup = new THREE.Group();
      const lineGeo = new THREE.PlaneGeometry(80, 40, 20, 10);
      const lineMat = new THREE.MeshBasicMaterial({
          color: 0x5C6B4F, wireframe: true, transparent: true, opacity: 0.1
      });
      const terrainLines = new THREE.Mesh(lineGeo, lineMat);
      terrainLines.rotation.x = -Math.PI / 2;
      terrainLines.position.y = -15;
      terrainGroup.add(terrainLines);
      scene.add(terrainGroup);

      animate();
    };

    const animate = () => {
      if (!scene) return;
      animationFrameId = requestAnimationFrame(animate);
      const time = clock.getElapsedTime();

      if (globe) {
          globe.rotation.y += 0.001;
          globe.rotation.x += 0.0005;
      }

      if (particlesMesh) {
          particlesMesh.rotation.y = time * 0.05;
      }

      crystals.forEach((crystal) => {
          crystal.rotation.x += crystal.userData.rx;
          crystal.rotation.y += crystal.userData.ry;
          crystal.position.y += Math.sin(time * 1.5 + crystal.userData.floatOffset) * 0.01;
      });

      targetX = mouseX * 0.005;
      targetY = mouseY * 0.005;

      camera.position.x += (targetX - camera.position.x) * 0.02;
      camera.position.y += (-targetY - camera.position.y + 5) * 0.02;
      camera.lookAt(scene.position);

      renderer.render(scene, camera);
    };

    const onDocumentMouseMove = (event) => {
      mouseX = (event.clientX - windowHalfX);
      mouseY = (event.clientY - windowHalfY);
    };

    const onWindowResize = () => {
      if(!camera || !renderer) return;
      windowHalfX = window.innerWidth / 2;
      windowHalfY = window.innerHeight / 2;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    if (window.THREE) {
      initThreeJS();
    } else {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
      script.onload = initThreeJS;
      document.head.appendChild(script);
    }

    window.addEventListener('mousemove', onDocumentMouseMove);
    window.addEventListener('resize', onWindowResize);

    return () => {
      window.removeEventListener('mousemove', onDocumentMouseMove);
      window.removeEventListener('resize', onWindowResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isBlackMode]);

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoginLoading(true);
    const emailValue = e.target.querySelector('#email').value;

    setTimeout(() => {
      setIsLoginLoading(false);
      onLogin({ name: "Eksplorator", email: emailValue }); 
    }, 2000);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsRegLoading(true);

    const form = e.target;
    try {
        const formData = new FormData(form);
        const response = await fetch('https://script.google.com/macros/s/AKfycbwOzXMCnlqn7HpP3zVz4T5mC5TAU8GBYdSrugccf3C4PW2nOxLGN3zffwZ149VdGq5q/exec', { method: 'POST', body: formData });
        if(response.ok) {
            alert('Pendaftaran Berhasil! Silakan masuk.');
            form.reset();
            setView('login');
        }
    } catch (error) {
        console.error('Error!', error.message);
    } finally {
        setIsRegLoading(false);
    }
  };

  const toggleView = (newView, e) => {
    if (e) e.preventDefault();
    setLoadedCards({ login: false, register: false });
    setTimeout(() => {
      setView(newView);
      setTimeout(() => {
        setLoadedCards(prev => ({ ...prev, [newView]: true }));
      }, 30);
    }, 300);
  };

  return (
    <div style={{ margin: 0, padding: 0, width: '100%', height: '100%', overflow: 'hidden', fontFamily: "'Poppins', sans-serif", backgroundColor: isBlackMode ? '#000000' : '#1A1815', transition: 'background-color 0.5s' }}>
      <style>{`
        #canvas-container { position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 0; }
        #ui-container { position: relative; z-index: 10; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; padding: 1rem; }
        .glass-card {
            background: rgba(255, 255, 255, 0.05); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
            border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 24px;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5), inset 0 0 20px rgba(201, 166, 107, 0.05);
            opacity: 0; transform: translateY(30px) scale(0.95); transition: opacity 0.6s ease-out, transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .glass-card.loaded { opacity: 1; transform: translateY(0) scale(1); }
        .logo-glow { filter: drop-shadow(0 0 12px rgba(201, 166, 107, 0.6)); animation: pulseGlow 3s infinite alternate; }
        @keyframes pulseGlow { 0% { filter: drop-shadow(0 0 10px rgba(201, 166, 107, 0.4)); transform: scale(1); } 100% { filter: drop-shadow(0 0 20px rgba(201, 166, 107, 0.8)); transform: scale(1.05); } }
        .custom-input { background: rgba(0, 0, 0, 0.5); border: 1px solid rgba(255, 255, 255, 0.1); color: #F5F1E8; transition: all 0.3s ease; }
        .custom-input:focus { outline: none; border-color: #C9A66B; box-shadow: 0 0 15px rgba(201, 166, 107, 0.3); background: rgba(0, 0, 0, 0.7); }
        .custom-input::placeholder { color: rgba(245, 241, 232, 0.4); }
        .btn-gradient { background: linear-gradient(135deg, #C9A66B 0%, #8A6E40 100%); color: #1A1815; transition: all 0.3s ease; position: relative; overflow: hidden; }
        .btn-gradient:hover { transform: translateY(-2px); box-shadow: 0 10px 20px rgba(201, 166, 107, 0.3); }
        .btn-gradient:active { transform: translateY(1px); }
        .btn-glass { background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1); color: #F5F1E8; transition: all 0.3s ease; }
        .btn-glass:hover { background: rgba(255, 255, 255, 0.1); border-color: rgba(255, 255, 255, 0.2); transform: translateY(-2px); }
        .loader { border: 2px solid rgba(26, 24, 21, 0.2); border-left-color: #1A1815; border-radius: 50%; width: 20px; height: 20px; animation: spin 1s linear infinite; display: none; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        .btn-loading .loader { display: inline-block; }
        .btn-loading .btn-text { display: none; }
      `}</style>

      <div id="canvas-container" ref={canvasRef}></div>

      <div id="ui-container" className="text-[#F5F1E8]">
          
          <div id="login-card" className={`glass-card w-full max-w-[420px] p-8 md:p-10 mx-auto ${view !== 'login' ? 'hidden' : ''} ${loadedCards.login ? 'loaded' : ''}`}>
              <div className="text-center mb-8">
                  <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-white/5 border border-white/10 mb-4 logo-glow">
                      <Mountain size={36} className="text-[#C9A66B] fill-[#C9A66B]" />
                  </div>
                  <h1 className="text-2xl md:text-3xl font-bold tracking-wide text-white mb-2">Ambasalt</h1>
                  <p className="text-xs md:text-sm text-[#F5F1E8]/70 font-light">Rock Mineral & Thin Section Analysis</p>
                  <p className="text-[10px] text-[#C9A66B]/80 font-mono tracking-wider mt-1 uppercase">+ GEO-LENS v2.5 Engine</p>
              </div>

              <form id="loginForm" onSubmit={handleLogin} className="space-y-5">
                  <div>
                      <label htmlFor="email" className="block text-xs font-medium text-[#F5F1E8]/80 mb-1.5 ml-1">Email Address</label>
                      <div className="relative">
                          <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#F5F1E8]/50" />
                          <input type="email" id="email" required placeholder="name@email.com" 
                              className="custom-input w-full rounded-xl py-3 pl-11 pr-4 text-sm" />
                      </div>
                  </div>

                  <div>
                      <label htmlFor="password" className="block text-xs font-medium text-[#F5F1E8]/80 mb-1.5 ml-1">Password</label>
                      <div className="relative">
                          <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#F5F1E8]/50" />
                          <input type={showLoginPassword ? "text" : "password"} id="password" required placeholder="••••••••" 
                              className="custom-input w-full rounded-xl py-3 pl-11 pr-11 text-sm" />
                          <button type="button" onClick={() => setShowLoginPassword(!showLoginPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#F5F1E8]/50 hover:text-[#C9A66B] transition-colors">
                              <Eye size={18} />
                          </button>
                      </div>
                  </div>

                  <button type="submit" className={`btn-gradient w-full rounded-xl py-3.5 mt-4 font-semibold text-sm flex items-center justify-center gap-2 relative ${isLoginLoading ? 'btn-loading' : ''}`}>
                      <span className="btn-text">Sign In & Explore</span>
                      <ArrowRight size={16} strokeWidth={3} className="btn-text" />
                      <div className="loader"></div>
                  </button>
              </form>

              <div className="flex items-center my-6">
                  <div className="flex-grow border-t border-white/10"></div>
                  <span className="mx-4 text-xs text-[#F5F1E8]/50 font-light">or</span>
                  <div className="flex-grow border-t border-white/10"></div>
              </div>

              <button className="btn-glass w-full rounded-xl py-3 font-medium text-sm flex items-center justify-center gap-3 relative overflow-hidden">
                  <Chrome size={20} className="fill-current" />
                  Continue with Google
              </button>

              <div className="mt-8 text-center text-xs">
                  <p className="text-[#F5F1E8]/60">
                      Don't have an account? 
                      <a href="#" onClick={(e) => toggleView('register', e)} className="ml-1 text-[#C9A66B] font-semibold hover:text-[#D4AF37] transition-colors">Register now</a>
                  </p>
              </div>
          </div>

          <div id="register-card" className={`glass-card w-full max-w-[420px] p-8 md:p-10 mx-auto ${view !== 'register' ? 'hidden' : ''} ${loadedCards.register ? 'loaded' : ''}`}>
              <div className="text-center mb-6">
                  <h2 className="text-2xl md:text-3xl font-bold tracking-wide text-white mb-2">Create Account</h2>
                  <p className="text-xs md:text-sm text-[#F5F1E8]/70 font-light">Join Ambasalt + GEO-LENS</p>
              </div>

              <form id="registerForm" onSubmit={handleRegister} className="space-y-4">
                  <div>
                      <label htmlFor="reg-name" className="block text-xs font-medium text-[#F5F1E8]/80 mb-1.5 ml-1">Full Name</label>
                      <div className="relative">
                          <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#F5F1E8]/50" />
                          <input type="text" id="reg-name" name="nama" required placeholder="John Doe" 
                              className="custom-input w-full rounded-xl py-2.5 pl-11 pr-4 text-sm" />
                      </div>
                  </div>

                  <div>
                      <label htmlFor="reg-email" className="block text-xs font-medium text-[#F5F1E8]/80 mb-1.5 ml-1">Email Address</label>
                      <div className="relative">
                          <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#F5F1E8]/50" />
                          <input type="email" id="reg-email" name="email" required placeholder="name@email.com" 
                              className="custom-input w-full rounded-xl py-2.5 pl-11 pr-4 text-sm" />
                      </div>
                  </div>

                  <div>
                      <label htmlFor="reg-password" className="block text-xs font-medium text-[#F5F1E8]/80 mb-1.5 ml-1">Password</label>
                      <div className="relative">
                          <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#F5F1E8]/50" />
                          <input type={showRegPassword ? "text" : "password"} id="reg-password" name="password" required placeholder="••••••••" 
                              className="custom-input w-full rounded-xl py-2.5 pl-11 pr-11 text-sm" />
                          <button type="button" onClick={() => setShowRegPassword(!showRegPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#F5F1E8]/50 hover:text-[#C9A66B] transition-colors">
                              <Eye size={18} />
                          </button>
                      </div>
                  </div>

                  <button type="submit" className={`btn-gradient w-full rounded-xl py-3.5 mt-2 font-semibold text-sm flex items-center justify-center gap-2 relative ${isRegLoading ? 'btn-loading' : ''}`}>
                      <span className="btn-text">Create Account</span>
                      <User size={16} strokeWidth={3} className="btn-text" />
                      <div className="loader"></div>
                  </button>
              </form>

              <div className="mt-6 text-center text-xs">
                  <p className="text-[#F5F1E8]/60">
                      Already have an account? 
                      <a href="#" onClick={(e) => toggleView('login', e)} className="ml-1 text-[#C9A66B] font-semibold hover:text-[#D4AF37] transition-colors">Sign In</a>
                  </p>
              </div>
          </div>
      </div>
    </div>
  );
}

// ============================================
// DASHBOARD SCREEN
// ============================================
function DashboardScreen({ onNavigateToSelection, onLogout, user, isBlackMode, toggleTheme }) {
  const [selectedTopic, setSelectedTopic] = useState(null);
  
  const navBg = isBlackMode ? 'bg-[#000000]/80' : 'bg-[#2E2A24]/60';
  const cardBg = isBlackMode ? 'bg-zinc-900/60' : 'bg-[#2E2A24]/40';
  const innerCardBg = isBlackMode ? 'bg-black' : 'bg-[#1A1815]';

  const geologyTopics = [
    {
      title: "Klasifikasi Batuan",
      image: "https://images.unsplash.com/photo-1525857597365-5f6af3ec56a7?auto=format&fit=crop&q=80&w=600&h=400",
      desc: "Batuan adalah buku harian bumi yang mencatat setiap peristiwa geologis miliaran tahun lalu.",
      color: "hover:border-orange-500/50 hover:shadow-[0_0_20px_rgba(249,115,22,0.2)]",
      btnColor: "text-orange-500",
      modalData: [
        { label: "Batuan Beku", text: "Terbentuk dari pendinginan magma/lava. Contoh: Basalt di dasar samudra, Granit penyusun benua." },
        { label: "Batuan Sedimen", text: "Endapan material yang terkompaksi (litifikasi) seiring waktu. Tempat bernaungnya fosil makhluk purba." },
        { label: "Batuan Metamorf", text: "Batuan yang bertransformasi wujud akibat suhu dan tekanan sangat ekstrem di kedalaman bumi." }
      ]
    },
    {
      title: "Mineral & Kristal",
      image: "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?auto=format&fit=crop&q=80&w=600&h=400",
      desc: "Setiap batu tersusun dari mineral. Ini adalah zat padat anorganik dengan struktur kristal sempurna.",
      color: "hover:border-emerald-500/50 hover:shadow-[0_0_20px_rgba(16,185,129,0.2)]",
      btnColor: "text-emerald-500",
      modalData: [
        { label: "Struktur Kristal", text: "Menentukan bentuk fisik. Intan (sangat keras) dan grafit penyusun (sangat lunak) terbuat dari unsur yang sama: Karbon." },
        { label: "Sifat Optik/Fisik", text: "Dikenali dari warna, kilap (logam/non-logam), cerat, belahan, dan tingkat kekerasan (Skala Mohs)." },
        { label: "Silikat", text: "Kelompok mineral paling umum di Bumi (mencapai 90% dari kerak bumi). Termasuk Kuarsa dan Feldspar." }
      ]
    },
    {
      title: "Analisis Sayatan Tipis",
      image: "https://images.unsplash.com/photo-1582719471384-894fbb16e074?auto=format&fit=crop&q=80&w=600&h=400",
      desc: "Melihat 'DNA' batuan di bawah mikroskop cahaya terpolarisasi melalui sayatan setebal 0.03mm.",
      color: "hover:border-[#C9A66B]/50 hover:shadow-[0_0_20px_rgba(201,166,107,0.2)]",
      btnColor: "text-[#C9A66B]",
      modalData: [
        { label: "PPL (Nicol Sejajar)", text: "Melihat warna asli mineral, bentuk relief (timbulnya mineral terhadap sekitarnya), dan pleokroisme." },
        { label: "XPL (Nicol Silang)", text: "Mendeteksi 'Warna Interferensi', hasil dari pembelasan cahaya (birefringence) oleh struktur kristal mineral." },
        { label: "Kembaran (Twinning)", text: "Pola garis berselang-seling yang muncul saat rotasi mikroskop, seperti kembaran Albit pada mineral plagioklas." }
      ]
    }
  ];

  const funFacts = [
    "Gempa bumi terdalam yang pernah tercatat terjadi di kedalaman lebih dari 750 kilometer!",
    "Palung Mariana (10.9 km) jauh lebih dalam daripada ketinggian puncak Gunung Everest (8.8 km).",
    "Batu Apung (Pumice) adalah satu-satunya batuan yang bisa mengapung di air!",
    "Intan terdalam tidak terbentuk dari batu bara, melainkan dari material karbon purba.",
    "Bumi memiliki lempeng tektonik yang bergerak sekitar 2-10 cm per tahun (secepat pertumbuhan kuku)!",
    "Sekitar 335 juta tahun lalu, seluruh benua menyatu membentuk supercontinent Pangea.",
    "Warna merah pada tanah di Mars disebabkan oleh oksidasi besi, seperti berkarat di bumi.",
    "Sebagian besar emas yang kita tambang berasal dari hantaman meteorit miliaran tahun silam.",
    "Magma bisa mencapai suhu 700°-1300°C, cukup untuk melelehkan besi!",
    "Mineral Kuarsa bersifat piezoelektrik - menghasilkan listrik bila ditekan!"
  ];

  return (
    <div className="h-full w-full flex flex-col font-sans overflow-y-auto overflow-x-hidden relative custom-scrollbar">
       <div className="absolute top-[10%] left-[-10%] w-[500px] h-[500px] bg-[#C9A66B]/10 rounded-full blur-[120px] pointer-events-none"></div>
       <div className="absolute bottom-[10%] right-[-10%] w-[400px] h-[400px] bg-[#5C6B4F]/10 rounded-full blur-[100px] pointer-events-none"></div>

       <nav className={`h-20 border-b border-white/5 ${navBg} backdrop-blur-md flex items-center justify-between px-6 md:px-8 sticky top-0 z-50 shrink-0 transition-colors duration-500`}>
          <div className="flex items-center gap-4">
             <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Logo_ITERA.png/600px-Logo_ITERA.png" alt="ITERA" className="h-10 w-auto object-contain drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]" />
             <div className="h-10 w-10 bg-gradient-to-br from-[#00f0ff] to-[#0066ff] rounded-full flex items-center justify-center border-[2px] border-[#030712] shadow-[0_0_15px_rgba(0,240,255,0.4)] shrink-0">
                <Microscope size={18} className="text-[#030712]" />
             </div>
             <div className="ml-2 hidden sm:block">
                <h1 className="font-bold text-xl tracking-tight flex items-center gap-2">
                   Ambasalt × GEO-LENS
                </h1>
                <p className="text-[10px] text-[#C9A66B] font-mono tracking-widest uppercase mt-0.5">AI Geology Engine v2.5</p>
             </div>
          </div>
          <div className="flex items-center gap-4 md:gap-6">
             <button onClick={toggleTheme} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all" title="Ganti Tema">
                {isBlackMode ? <Sun size={18} className="text-amber-200" /> : <Moon size={18} className="text-slate-300" />}
             </button>
             <div className="flex items-center gap-3 border-l border-white/10 pl-4 md:pl-6">
                <div className="text-right hidden sm:block">
                   <p className="text-sm font-bold">{user?.name || 'Geologist'}</p>
                   <p className="text-[10px] opacity-50">Premium Subscriber</p>
                </div>
                <button onClick={onLogout} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center opacity-70 hover:text-red-400 hover:bg-red-400/10 transition-all" title="Logout">
                   <LogOut size={18} />
                </button>
             </div>
          </div>
       </nav>

       <div className="flex-1 w-full max-w-7xl mx-auto px-6 py-12 relative z-10 flex flex-col shrink-0">
          <div className="text-center max-w-4xl mx-auto mb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
             <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#C9A66B]/30 bg-[#C9A66B]/10 text-[#C9A66B] text-xs font-bold uppercase tracking-wider mb-6">
                <Sparkles size={14} /> Powered by AI Engine
             </div>
             <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Membaca Sejarah Bumi <br/> Melalui <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00f0ff] to-[#0066ff]">Analisis Geologi</span>
             </h2>
             <p className="text-lg opacity-70 mb-10 leading-relaxed max-w-2xl mx-auto">
                Teknologi AI terdepan bertemu tradisi geologi modern untuk menganalisis struktur kristal, komposisi mineral, dan sejarah batuan dengan akurasi tinggi.
             </p>
             <button onClick={onNavigateToSelection} className="inline-flex items-center gap-3 bg-gradient-to-r from-[#00f0ff] to-[#0066ff] text-[#030712] px-8 py-4 rounded-2xl font-bold text-lg hover:shadow-[0_10px_30px_rgba(0,240,255,0.3)] hover:-translate-y-1 transition-all">
                <Scan size={22} /> Akses GEO-LENS Analyzer <ArrowRight size={20} />
             </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
             <div className={`${cardBg} border border-[#C9A66B]/20 p-8 md:p-10 rounded-3xl backdrop-blur-sm hover:border-[#C9A66B]/50 transition-colors shadow-xl`}>
                <div className="w-14 h-14 bg-[#C9A66B]/10 rounded-2xl flex items-center justify-center mb-6">
                   <Globe2 className="text-[#C9A66B]" size={28} />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold mb-4">Apa itu Geologi?</h3>
                <p className="opacity-70 leading-relaxed text-sm md:text-base">
                   Geologi adalah ilmu yang mempelajari planet bumi secara menyeluruh, mencakup bahan penyusunnya (batuan, air, mineral), struktur, sifat fisik, sejarah masa lalu, dan proses pembentukannya yang tiada henti.
                </p>
             </div>
             <div className={`${cardBg} border border-[#5C6B4F]/20 p-8 md:p-10 rounded-3xl backdrop-blur-sm hover:border-[#5C6B4F]/50 transition-colors shadow-xl`}>
                <div className="w-14 h-14 bg-[#5C6B4F]/10 rounded-2xl flex items-center justify-center mb-6">
                   <Layers className="text-[#5C6B4F]" size={28} />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold mb-4">Apa itu Batuan?</h3>
                <p className="opacity-70 leading-relaxed text-sm md:text-base">
                   Batuan adalah massa padat yang terbentuk secara alami, tersusun atas kristal dari satu atau lebih jenis mineral. Mereka mencatat peristiwa geologis masa lalu selama miliaran tahun.
                </p>
             </div>
          </div>

          <div className="mb-24">
             <div className="text-center mb-12">
                <h3 className="text-3xl md:text-4xl font-bold mb-4">Materi Studi Utama</h3>
                <p className="opacity-50">Klik pada kartu untuk melihat fakta-fakta menarik!</p>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {geologyTopics.map((topic, idx) => (
                   <div 
                      key={idx} 
                      onClick={() => setSelectedTopic(topic)}
                      className={`${cardBg} border border-white/5 rounded-3xl p-3 backdrop-blur-sm transition-all duration-300 ${topic.color} group cursor-pointer flex flex-col`}
                   >
                      <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden mb-6 relative">
                         <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors z-10"></div>
                         <img src={topic.image} alt={topic.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      </div>
                      <div className="px-3 pb-4 flex-1 flex flex-col">
                         <h3 className="text-2xl font-bold mb-3">{topic.title}</h3>
                         <p className="opacity-60 text-sm leading-relaxed mb-6 flex-1">
                            {topic.desc}
                         </p>
                         <button className={`w-full py-3 rounded-xl bg-white/5 font-semibold text-sm transition-colors border border-white/10 group-hover:bg-white/10 ${topic.btnColor}`}>
                            Lihat Detail
                         </button>
                      </div>
                   </div>
                ))}
             </div>
          </div>

          <div className={`${isBlackMode ? 'bg-zinc-900' : 'bg-gradient-to-br from-[#2E2A24] to-[#1A1815]'} border border-[#00f0ff]/30 rounded-3xl p-8 md:p-12 flex flex-col gap-10 items-start mb-24 shadow-2xl relative overflow-hidden`}>
             <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#00f0ff]/5 rounded-full blur-[80px] pointer-events-none"></div>
             <div className="flex items-center gap-6 relative z-10 w-full border-b border-white/10 pb-6">
                <div className="shrink-0 w-16 h-16 bg-[#00f0ff]/10 rounded-2xl flex items-center justify-center border border-[#00f0ff]/30">
                   <Target size={32} className="text-[#00f0ff]" />
                </div>
                <div>
                   <h4 className="text-3xl font-bold mb-1">Trivia Geologi</h4>
                   <p className="text-[#00f0ff] text-sm">Tahukah kamu tentang fakta-fakta mencengangkan ini?</p>
                </div>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10 w-full">
                {funFacts.map((fact, idx) => (
                   <div key={idx} className="flex gap-4 items-start bg-black/20 p-5 rounded-2xl border border-white/5 hover:border-[#00f0ff]/30 transition-colors hover:-translate-y-1">
                      <div className="mt-1 w-6 h-6 rounded-full bg-[#00f0ff]/20 flex items-center justify-center shrink-0">
                         <div className="w-2 h-2 rounded-full bg-[#00f0ff] shadow-[0_0_8px_#00f0ff]"></div>
                      </div>
                      <p className="text-sm opacity-90 leading-relaxed font-medium">{fact}</p>
                   </div>
                ))}
             </div>
          </div>
       </div>

       <footer className={`w-full ${isBlackMode ? 'bg-[#000000]' : 'bg-[#0a0908]'} border-t border-white/10 py-10 mt-auto relative z-20 shrink-0`}>
          <div className="max-w-7xl mx-auto px-6 md:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
             <div className="text-center md:text-left flex items-center gap-4">
                <div className={`w-12 h-12 ${innerCardBg} rounded-full flex items-center justify-center border border-white/10 bg-gradient-to-br from-[#00f0ff] to-[#0066ff]`}>
                   <Microscope className="text-[#030712]" size={20} />
                </div>
                <div>
                    <h4 className="font-bold text-lg tracking-wide">Ambasalt Engine</h4>
                    <p className="opacity-50 text-xs mt-1 uppercase tracking-wider">+ GEO-LENS v2.5</p>
                </div>
             </div>
             <div className="text-center md:text-right">
                <p className="opacity-70 text-sm mb-1">
                   Teknologi AI untuk analisis geologi oleh <span className="font-bold text-[#00f0ff]">Kelompok 23 ITERA</span>
                </p>
                <p className="text-xs opacity-50">
                   Digitalisasi petrologi dan mineralogi untuk masa depan
                </p>
             </div>
          </div>
       </footer>

       {selectedTopic && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
             <div className={`${innerCardBg} border border-[#00f0ff]/30 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-300`}>
                <button 
                  onClick={() => setSelectedTopic(null)}
                  className="absolute top-4 right-4 z-20 w-10 h-10 bg-black/50 hover:bg-[#00f0ff] rounded-full flex items-center justify-center backdrop-blur-md transition-colors"
                >
                   <X size={20} className="text-white" />
                </button>
                <div className="h-48 md:h-64 w-full relative">
                   <div className={`absolute inset-0 bg-gradient-to-t ${isBlackMode ? 'from-black' : 'from-[#1A1815]'} to-transparent z-10`}></div>
                   <img src={selectedTopic.image} alt={selectedTopic.title} className="w-full h-full object-cover" />
                   <h2 className="absolute bottom-6 left-6 md:left-10 z-20 text-3xl md:text-4xl font-bold text-white">
                      {selectedTopic.title}
                   </h2>
                </div>
                <div className="p-6 md:p-10 max-h-[50vh] overflow-y-auto custom-scrollbar">
                   <div className="space-y-6">
                      {selectedTopic.modalData.map((data, idx) => (
                         <div key={idx} className={`${cardBg} border border-white/5 p-5 rounded-2xl`}>
                            <h4 className="text-lg font-bold text-[#00f0ff] mb-2">{data.label}</h4>
                            <p className="opacity-80 text-sm md:text-base leading-relaxed">{data.text}</p>
                         </div>
                      ))}
                   </div>
                </div>
             </div>
          </div>
       )}
    </div>
  );
}

// ============================================
// SELECTION SCREEN
// ============================================
function SelectionScreen({ onSelect, onBack, onLogout, user, isBlackMode, toggleTheme }) {
  const navBg = isBlackMode ? 'bg-[#000000]/80' : 'bg-[#1A1815]/80';
  const cardBg = isBlackMode ? 'bg-zinc-900/60' : 'bg-[#2E2A24]/40';
  const innerCardBg = isBlackMode ? 'bg-black' : 'bg-[#1A1815]';

  const cards = [
    { id: 'rock', title: 'Hand Specimen', desc: 'Identifikasi batuan skala makroskopis (beku, sedimen, metamorf).', icon: <Mountain size={32} />, color: '#3b82f6' },
    { id: 'thin_section', title: 'Thin Section Analysis', desc: 'Analisis mikroskopis polarisasi (PPL/XPL) dengan AI point counting.', icon: <Microscope size={32} />, color: '#00f0ff' },
    { id: 'mineral', title: 'Determinasi Mineral', desc: 'Identifikasi spesies mineral berdasarkan sifat fisik kristal dan optik.', icon: <Gem size={32} />, color: '#10b981' },
  ];

  return (
    <div className="h-full w-full flex flex-col font-sans overflow-y-auto overflow-x-hidden relative custom-scrollbar">
       <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#00f0ff]/5 rounded-full blur-[120px] pointer-events-none"></div>

       <nav className={`flex justify-between items-center px-6 md:px-8 h-20 w-full relative z-10 border-b border-white/5 shrink-0 ${navBg} backdrop-blur-md`}>
          <button onClick={onBack} className={`flex items-center gap-2 opacity-70 hover:opacity-100 transition-colors ${cardBg} px-4 py-2 rounded-full border border-white/5`}>
             <ChevronLeft size={18} /> <span className="text-sm font-semibold hidden sm:block">Kembali ke Info</span>
          </button>

          <div className="flex items-center gap-3">
             <span className="font-bold text-xl tracking-tight">Ambasalt</span>
             <span className={`text-[10px] ${innerCardBg} px-2 py-0.5 rounded text-[#00f0ff] border border-[#00f0ff]/30`}>GEO-LENS</span>
          </div>

          <div className="flex items-center gap-4">
             <button onClick={toggleTheme} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all hidden sm:flex" title="Ganti Tema">
                {isBlackMode ? <Sun size={18} className="text-amber-200" /> : <Moon size={18} className="text-slate-300" />}
             </button>
             <span className="text-sm opacity-70 hidden md:inline">{user?.name || 'Geologist'}</span>
             <button onClick={onLogout} className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 opacity-70 hover:opacity-100 transition-all text-xs font-bold uppercase tracking-wider">
                <LogOut size={14} /> <span className="hidden sm:block">Keluar</span>
             </button>
          </div>
       </nav>

       <div className="flex-1 flex flex-col items-center justify-start md:justify-center py-10 md:py-0 max-w-6xl mx-auto w-full relative z-10 shrink-0 px-6">
          <div className="text-center mb-12 space-y-4">
             <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Pilih Metode Analisis</h1>
             <p className="opacity-60 text-lg max-w-2xl mx-auto">Gunakan teknologi GEO-LENS terdepan untuk analisis sampel geologi Anda</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full pb-10">
             {cards.map((card) => (
                <div 
                  key={card.id}
                  onClick={() => onSelect(card.id)}
                  className={`group relative ${cardBg} backdrop-blur-sm border border-white/10 rounded-3xl p-8 cursor-pointer overflow-hidden transition-all duration-300 hover:bg-black/40 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]`}
                >
                   <div className="absolute top-0 right-0 w-32 h-32 opacity-5 rounded-bl-[100px] -mr-6 -mt-6 transition-transform group-hover:scale-110" style={{backgroundColor: card.color}}></div>
                   <div className={`w-16 h-16 rounded-2xl ${innerCardBg} border border-white/10 flex items-center justify-center mb-6 transition-transform duration-300 shadow-lg`} style={{color: card.color}}>
                      {card.icon}
                   </div>
                   <h3 className="text-xl font-bold mb-3 transition-colors">{card.title}</h3>
                   <p className="opacity-60 text-sm leading-relaxed mb-8">{card.desc}</p>
                   <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest opacity-50 group-hover:opacity-100 transition-colors" style={{color: card.color}}>
                      Buka Modul <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                   </div>
                </div>
             ))}
          </div>
       </div>
    </div>
  );
}

// ============================================
// INTERACTIVE GRID COMPONENT
// ============================================
function InteractiveGrid({ gridData, selectedCell, onSelect }) {
  if (!gridData || gridData.length === 0) return null;
  return (
    <div className="absolute inset-0 grid grid-cols-8 grid-rows-8 pointer-events-auto z-20">
      {gridData.map((cell) => (
         <div
           key={cell.index}
           onClick={() => onSelect(cell.index)}
           className={`border-[0.5px] border-white/15 hover:bg-white/20 cursor-pointer transition-all ${selectedCell === cell.index ? 'ring-2 ring-[#00f0ff] z-30' : ''}`}
           style={{ backgroundColor: selectedCell === cell.index ? cell.colorHex : 'transparent' }}
         />
      ))}
    </div>
  );
}

// ============================================
// MAIN APP COMPONENT (Analisis Utama)
// ============================================
function AmbasaltMainApp({ mode, onBackToSelection, onBackToDashboard, user, isBlackMode }) {
  const isThinSection = mode === 'thin_section';

  // ---- STATE ----
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
  const [zoomLevel, setZoomLevel] = useState(1);
  const [lightIntensity, setLightIntensity] = useState(85);

  // ---- CONFIG ----
  const sidebarBg = isBlackMode ? 'bg-zinc-950' : 'bg-[#2E2A24]/60';
  const innerCardBg = isBlackMode ? 'bg-zinc-900/80' : 'bg-[#2E2A24]/40';
  const pureBg = isBlackMode ? 'bg-black' : 'bg-[#1A1815]/80';

  const config = {
    thin_section: { title: "Thin Section Analysis", colorCode: "#00f0ff" },
    rock: { title: "Hand Specimen Analysis", colorCode: "#3b82f6" },
    mineral: { title: "Mineral Identification", colorCode: "#10b981" },
  }[mode];

  // ---- FILE UPLOAD ----
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

  // ---- FETCH WITH RETRY ----
  const fetchWithRetry = async (url, options, retries = 5, delay = 1000) => {
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        if ((response.status === 429 || response.status === 503 || response.status === 500) && retries > 0) {
          await new Promise(resolve => setTimeout(resolve, delay));
          return fetchWithRetry(url, options, retries - 1, delay * 2);
        }
        const errorDetail = await response.json().catch(() => ({}));
        const detailMsg = errorDetail?.error?.message || `HTTP error! status: ${response.status}`;
        throw new Error(detailMsg);
      }
      return response;
    } catch (error) {
      if (retries > 0) {
        await new Promise(resolve => setTimeout(resolve, delay));
        return fetchWithRetry(url, options, retries - 1, delay * 2);
      }
      throw error;
    }
  };

  // ---- ANALISIS UTAMA ----
  const analyzeSample = async () => {
    if (loading) return; 
    setLoading(true);
    setLoadingStep("Menganalisis Sampel...");
    setResult(null);
    setErrorMsg(null);
    setGridData([]);
    setSelectedCell(null); 
    
    setTimeout(() => setLoadingStep("Mencocokkan Pola Kristal..."), 1000);
    setTimeout(() => setLoadingStep("Menghitung Persentase Mineral..."), 2000);
    setTimeout(() => setLoadingStep("Menyusun Laporan Detail..."), 3000);

    setTimeout(async () => {
        try {
            if (!pplImage) {
                throw new Error("Silakan unggah gambar sampel untuk analisis GEO-LENS AI.");
            }

            const modelName = "gemini-2.5-flash";
            const url = `/api/gemini`;
            const mimeType = pplImage.split(';')[0].split(':')[1];
            const base64Data = pplImage.split(',')[1];

            const promptText = `Anda adalah ahli geologi profesional bersertifikat dalam petrologi dan mineralogi. Analisis gambar sampel geologi ini dengan detail tinggi untuk: ${config.title}.\r\nIdentifikasi mineral/batuan dominan dengan akurasi 80-95% berdasarkan ciri visual, tekstur, warna, dan struktur kristal.\r\nJAWAB HANYA DALAM FORMAT JSON VALID:\r\n{\r\n  \"rockName\": \"Nama Batuan/Mineral Utama\",\r\n  \"classificationType\": \"Tipe Klasifikasi IUGS/Folk\",\r\n  \"description\": \"Deskripsi tekstur, struktur, dan proses pembentukannya\",\r\n  \"minerals\": [\r\n    { \"name\": \"Mineral 1\", \"percentage\": \"Est %\", \"description\": \"Sifat optik/fisik\" }\r\n  ]\r\n}`;

            const response = await fetchWithRetry(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{\r\n                        role: "user",
                        parts: [
                            { text: promptText },
                            { inlineData: { mimeType: mimeType, data: base64Data } }
                        ]
                    }],
                    generationConfig: {
                        responseMimeType: "application/json"
                    }
                })
            });

            const data = await response.json();
            const textContent = data.candidates?.[0]?.content?.parts?.[0]?.text;
            
            if (textContent) {
                const apiResult = JSON.parse(textContent);

                // ---- ALGORITMA GRID 8x8 BERBASIS PERSENTASE ----
                if (mode === 'thin_section') {
                    const totalCells = 64;
                    const tempGrid = [];
                    
                    const parsedMinerals = apiResult.minerals.map((m, idx) => {
                        const numericPct = parseFloat(m.percentage.replace(/[^0-9.]/g, '')) || 0;
                        return { ...m, numericPct, index: idx };
                    });

                    const totalPct = parsedMinerals.reduce((sum, m) => sum + m.numericPct, 0) || 100;

                    let allocatedMinerals = [];
                    let totalAssigned = 0;

                    parsedMinerals.forEach(m => {
                        const count = Math.floor((m.numericPct / totalPct) * totalCells);
                        m.allocatedCount = count;
                        totalAssigned += count;
                        for (let i = 0; i < count; i++) {
                            allocatedMinerals.push(m);
                        }
                    });

                    let leftovers = totalCells - totalAssigned;
                    if (leftovers > 0 && parsedMinerals.length > 0) {
                        parsedMinerals.sort((a, b) => {
                            const remainA = ((a.numericPct / totalPct) * totalCells) - a.allocatedCount;
                            const remainB = ((b.numericPct / totalPct) * totalCells) - b.allocatedCount;
                            return remainB - remainA;
                        });
                        
                        let i = 0;
                        while (leftovers > 0) {
                            allocatedMinerals.push(parsedMinerals[i % parsedMinerals.length]);
                            leftovers--;
                            i++;
                        }
                    }

                    // Fisher-Yates Shuffle untuk distribusi natural
                    for (let i = allocatedMinerals.length - 1; i > 0; i--) {
                        const j = Math.floor(Math.random() * (i + 1));
                        [allocatedMinerals[i], allocatedMinerals[j]] = [allocatedMinerals[j], allocatedMinerals[i]];
                    }

                    for (let i = 0; i < totalCells; i++) {
                        const min = allocatedMinerals[i];
                        tempGrid.push({
                            index: i,
                            mineral: min.name,
                            colorHex: getMineralColor(min.name),
                            feature: min.description || "Komponen Batuan"
                        });
                    }
                    setGridData(tempGrid);
                }

                setResult(apiResult);
            } else {
                throw new Error("Format respons AI tidak valid.");
            }
        } catch (error) {
            console.error("AI Error:", error);
            setErrorMsg(error.message || "Kesalahan sistem saat menghubungi Gemini API.");
        } finally {
            setLoading(false);
        }
    }, 4000);
  };

  return (
    <div className="flex h-screen overflow-hidden font-sans">
      
      {/* ===== SIDEBAR KIRI ===== */}
      <aside className={`w-20 md:w-64 ${sidebarBg} border-r border-white/5 flex flex-col justify-between shrink-0 z-20 transition-colors`}>
         <div className="overflow-y-auto flex-1 custom-scrollbar">
            <div className="h-16 flex items-center justify-center md:justify-start md:px-6 border-b border-white/5 shrink-0">
               <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[#030712] mr-0 md:mr-3 shrink-0 glow-cyan" style={{backgroundColor: config.colorCode}}>
                  {mode === 'thin_section' ? <Microscope size={18} /> : mode === 'rock' ? <Mountain size={18} /> : <Gem size={18} />}
               </div>
               <span className="hidden md:block font-bold tracking-tight">GEO-LENS</span>
            </div>
            
            <div className="p-4 space-y-2">
               <div className="text-[10px] font-bold uppercase tracking-widest opacity-40 px-2 hidden md:block mb-2">Navigation</div>
               <button onClick={onBackToDashboard} className="w-full flex items-center justify-center md:justify-start gap-3 md:px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                  <BookOpen size={18} style={{color: config.colorCode}} />
                  <span className="hidden md:block text-sm font-medium">Info Geologi</span>
               </button>
               <button onClick={onBackToSelection} className="w-full flex items-center justify-center md:justify-start gap-3 md:px-3 py-2.5 rounded-xl opacity-60 hover:bg-white/5 hover:opacity-100 transition-all">
                  <ArrowRight className="rotate-180" size={18} />
                  <span className="hidden md:block text-sm font-medium">Ganti Mode</span>
               </button>
            </div>
         </div>

         <div className="p-4 border-t border-white/5 shrink-0">
            <div className="flex items-center justify-center md:justify-start gap-3 md:px-2">
               <div className="w-8 h-8 rounded-full bg-black border border-[#00f0ff]/30 flex items-center justify-center shrink-0">
                  <User size={14} className="text-[#00f0ff]" />
               </div>
               <div className="hidden md:block overflow-hidden">
                  <div className="text-xs font-bold truncate">{user?.name || 'Geologist'}</div>
                  <div className="text-[10px] opacity-40">Active</div>
               </div>
            </div>
         </div>
      </aside>

      {/* ===== MAIN CONTENT ===== */}
      <main className="flex-1 flex flex-col min-w-0 relative">
         <header className="h-16 border-b border-white/5 bg-black/20 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-10">
            <div>
               <h2 className="text-sm font-bold flex items-center gap-2">
                  <Radio size={12} style={{color: config.colorCode, fill: config.colorCode}} />
                  {config.title} × AI-Powered
               </h2>
            </div>
            <div className="flex items-center gap-3">
               <div className="bg-black/40 rounded-lg p-1 flex border border-white/5">
                  <button onClick={() => {setAnalysisMode('image'); setResult(null);}} className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${analysisMode === 'image' ? 'bg-[#00f0ff] text-black shadow' : 'opacity-50 hover:opacity-100'}`}>Foto</button>
                  <button onClick={() => {setAnalysisMode('video'); setResult(null);}} className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${analysisMode === 'video' ? 'bg-[#00f0ff] text-black shadow' : 'opacity-50 hover:opacity-100'}`}>Video</button>
               </div>
            </div>
         </header>

         <div className="flex-1 overflow-y-auto p-6 scroll-smooth custom-scrollbar">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-7xl mx-auto">
               
               {/* ===== KOLOM KIRI: UPLOAD & KONTROL ===== */}
               <div className="lg:col-span-6 space-y-6">
                  <div className={`${innerCardBg} border border-white/10 rounded-2xl p-1 shadow-xl transition-colors`}>
                     <div className={`${pureBg} rounded-xl p-6 relative overflow-hidden transition-colors`}>
                        
                        {/* AREA UPLOAD */}
                        <div className="grid grid-cols-2 gap-4">
                           {analysisMode === 'image' ? (
                              <>
                                 {/* PPL IMAGE */}
                                 <div className={`relative group ${!isThinSection ? 'col-span-2' : ''}`}>
                                    <div className={`relative border-2 border-dashed border-[#F5F1E8]/20 bg-black/30 hover:bg-black/50 hover:border-[#00f0ff] transition-all flex items-center justify-center overflow-hidden ${isThinSection ? 'rounded-full aspect-square shadow-[0_0_40px_rgba(0,240,255,0.2)_inset]' : 'rounded-xl aspect-video'}`}>
                                       {pplImage ? (
                                          <img src={pplImage} className="absolute inset-0 w-full h-full object-cover transition-transform" style={isThinSection ? {transform: `scale(${zoomLevel}) rotate(${stageRotation}deg)`} : {}} />
                                       ) : (
                                          <div className="text-center opacity-50 p-4">
                                             {isThinSection ? <Sun className="mx-auto mb-2 opacity-50 text-[#00f0ff]" /> : <Scan className="mx-auto mb-2 opacity-50" />}
                                             <span className="text-[10px] font-bold uppercase tracking-widest block">Upload {isThinSection ? 'PPL' : 'Foto'}</span>
                                          </div>
                                       )}
                                       {isThinSection && usePointCounting && <InteractiveGrid gridData={gridData} selectedCell={selectedCell} onSelect={setSelectedCell} />}
                                       <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'ppl')} className={`absolute inset-0 opacity-0 cursor-pointer ${usePointCounting ? 'pointer-events-none' : ''}`} />
                                    </div>
                                    {isThinSection && <div className="absolute bottom-[-20px] left-0 right-0 text-center text-[9px] opacity-40 font-mono pointer-events-none z-0">PPL: NICOL SEJAJAR</div>}
                                 </div>

                                 {/* XPL IMAGE */}
                                 {isThinSection && (
                                    <div className="relative group">
                                       <div className="relative border-2 border-dashed border-[#F5F1E8]/20 bg-black/30 hover:bg-black/50 hover:border-[#00f0ff] transition-all flex items-center justify-center overflow-hidden rounded-full aspect-square shadow-[0_0_40px_rgba(0,240,255,0.2)_inset]">
                                          {xplImage ? (
                                             <img src={xplImage} className="w-full h-full object-cover transition-transform" style={{transform: `scale(${zoomLevel}) rotate(${stageRotation}deg)`}} />
                                          ) : (
                                             <div className="text-center opacity-50">
                                                <Moon className="mx-auto mb-2 opacity-50 text-[#5C6B4F]" />
                                                <span className="text-[10px] font-bold uppercase tracking-widest block">Upload XPL</span>
                                             </div>
                                          )}
                                          {usePointCounting && <InteractiveGrid gridData={gridData} selectedCell={selectedCell} onSelect={setSelectedCell} />}
                                          <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'xpl')} className={`absolute inset-0 opacity-0 cursor-pointer ${usePointCounting ? 'pointer-events-none' : ''}`} />
                                       </div>
                                       <div className="absolute bottom-[-20px] left-0 right-0 text-center text-[9px] opacity-40 font-mono pointer-events-none">XPL: NICOL SILANG</div>
                                    </div>
                                 )}
                              </>
                           ) : (
                              <div className="col-span-2 relative border-2 border-dashed border-[#F5F1E8]/20 bg-black/30 rounded-xl aspect-video flex items-center justify-center overflow-hidden group hover:border-[#00f0ff] transition-all">
                                 {videoUrl ? (
                                    <>
                                       <video key={videoUrl} src={videoUrl} controls className="w-full h-full object-contain z-10 relative" />
                                       <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                                          <label className="cursor-pointer flex items-center gap-2 px-3 py-1.5 bg-black/80 backdrop-blur-md border border-white/10 rounded-lg text-xs font-bold hover:bg-white/10 transition-colors shadow-lg">
                                             <Upload size={12} /> Ganti Video
                                             <input type="file" accept="video/*" onChange={(e) => handleFileUpload(e, 'video')} className="hidden" />
                                          </label>
                                       </div>
                                    </>
                                 ) : (
                                    <>
                                       <div className="text-center opacity-50">
                                          <Film className="mx-auto mb-2 opacity-50 text-[#00f0ff]" />
                                          <span className="text-[10px] font-bold uppercase tracking-widest block">Upload Video MP4</span>
                                       </div>
                                       <input type="file" accept="video/*" onChange={(e) => handleFileUpload(e, 'video')} className="absolute inset-0 opacity-0 cursor-pointer z-30" />
                                    </>
                                 )}
                              </div>
                           )}
                        </div>

                        {/* KONTROL MICROSCOPE */}
                        <div className="mt-8 pt-6 border-t border-white/10">
                           {isThinSection && analysisMode === 'image' && (
                              <div className="mb-6 space-y-4">
                                 
                                 {/* POINT COUNTING INFO */}
                                 {usePointCounting && selectedCell !== null && gridData.length > 0 && (
                                     <div className="p-4 rounded-xl border border-[#00f0ff]/50 bg-[#00f0ff]/10 flex items-center justify-between mb-4 animate-in slide-in-from-top-2">
                                         <div className="flex items-center gap-3">
                                             <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(0,240,255,0.3)]" style={{backgroundColor: gridData.find(c => c.index === selectedCell)?.colorHex}}>
                                                 <MousePointer2 size={14} className="text-white drop-shadow-md" />
                                             </div>
                                             <div>
                                                 <div className="text-[10px] uppercase tracking-widest opacity-60 font-bold mb-0.5">Titik #{selectedCell + 1} / 64</div>
                                                 <div className="text-[#00f0ff] font-bold text-sm">{gridData.find(c => c.index === selectedCell)?.mineral || 'Unknown'}</div>
                                                 <div className="text-[10px] opacity-40 mt-0.5">Sifat: {gridData.find(c => c.index === selectedCell)?.feature}</div>
                                             </div>
                                         </div>
                                         <button onClick={() => setSelectedCell(null)} className="opacity-50 hover:opacity-100 hover:text-red-400 transition-colors bg-black/20 p-1.5 rounded-full">
                                             <X size={16} />
                                         </button>
                                     </div>
                                 )}

                                 {/* KONTROL ZOOM */}
                                 <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                       <span className="text-sm opacity-80 font-medium">Digital Lens Zoom</span>
                                       <span className="text-xs text-[#00f0ff] font-mono font-bold bg-[#00f0ff]/10 px-2 py-1 rounded">{zoomLevel.toFixed(1)}x</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                       <button onClick={() => setZoomLevel(Math.max(1, zoomLevel - 0.5))} className="p-1.5 rounded-lg border border-white/10 hover:bg-white/5 transition-colors"><Minus size={14} /></button>
                                       <input type="range" min="1" max="8" step="0.5" value={zoomLevel} onChange={(e) => setZoomLevel(parseFloat(e.target.value))} 
                                          className="flex-1 h-2 bg-black rounded-lg appearance-none cursor-pointer accent-[#00f0ff]" />
                                       <button onClick={() => setZoomLevel(Math.min(8, zoomLevel + 0.5))} className="p-1.5 rounded-lg border border-white/10 hover:bg-white/5 transition-colors"><Plus size={14} /></button>
                                    </div>
                                 </div>

                                 {/* KONTROL ROTASI */}
                                 <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                       <span className="text-sm opacity-80 font-medium">Rotasi Stage (Objek)</span>
                                       <span className="text-xs text-[#00f0ff] font-mono font-bold bg-[#00f0ff]/10 px-2 py-1 rounded">{stageRotation}°</span>
                                    </div>
                                    <input type="range" min="0" max="360" value={stageRotation} onChange={(e) => setStageRotation(e.target.value)} 
                                       className="w-full h-2 bg-black rounded-lg appearance-none cursor-pointer accent-[#00f0ff]" />
                                 </div>

                                 {/* KONTROL CAHAYA */}
                                 <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                       <span className="text-sm opacity-80 font-medium">Aperture Light Intensity</span>
                                       <span className="text-xs text-[#00f0ff] font-mono font-bold bg-[#00f0ff]/10 px-2 py-1 rounded">{lightIntensity}%</span>
                                    </div>
                                    <input type="range" min="10" max="100" value={lightIntensity} onChange={(e) => setLightIntensity(e.target.value)} 
                                       className="w-full h-2 bg-black rounded-lg appearance-none cursor-pointer accent-[#00f0ff]" />
                                 </div>

                                 {/* POINT COUNTING TOGGLE */}
                                 <label className="flex items-center gap-3 cursor-pointer mt-4 p-3 bg-white/5 rounded-lg border border-white/5 hover:bg-white/10 transition-colors">
                                    <input type="checkbox" checked={usePointCounting} onChange={(e) => setUsePointCounting(e.target.checked)} className="w-4 h-4 rounded text-[#00f0ff] accent-[#00f0ff] bg-black border-white/20" />
                                    <span className="text-sm opacity-80 font-medium">Aktifkan Point Counting (8×8 Grid)</span>
                                 </label>
                              </div>
                           )}
                           
                           {/* TOMBOL ANALISIS */}
                           <button onClick={analyzeSample} disabled={loading || (analysisMode==='image' && !pplImage)} 
                              className="w-full text-[#030712] font-bold py-3.5 rounded-xl hover:shadow-[0_0_30px_rgba(0,240,255,0.3)] hover:-translate-y-0.5 active:translate-y-0 transition-all flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-[#00f0ff] to-[#0066ff]">
                              {loading ? <Scan className="animate-spin" size={20} /> : <Sparkles size={20} />}
                              {loading ? loadingStep : "Mulai Analisis GEO-LENS"}
                           </button>
                        </div>

                     </div>
                  </div>
               </div>

               {/* ===== KOLOM KANAN: HASIL ===== */}
               <div className="lg:col-span-6 space-y-6">
                  {errorMsg && (
                     <div className="bg-red-500/10 border border-red-500/50 text-red-200 p-4 rounded-xl flex items-start gap-3">
                        <AlertCircle className="shrink-0 mt-0.5 text-red-400" size={18} />
                        <div className="text-sm">
                           <p className="font-bold mb-1">Kesalahan Analisis:</p>
                           <p className="opacity-80">{errorMsg}</p>
                        </div>
                     </div>
                  )}

                  {result ? (
                     <div className={`${innerCardBg} border border-white/10 rounded-2xl p-6 shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-500 transition-colors`}>
                        <div className="flex items-start justify-between mb-6">
                           <div>
                              <div className="text-[10px] font-bold tracking-widest text-[#00f0ff] uppercase mb-1 flex items-center gap-1">
                                 <CheckCircle size={12} /> Hasil Analisis GEO-LENS
                              </div>
                              <h3 className="text-2xl font-bold">{result.rockName}</h3>
                              <p className="text-sm opacity-60 mt-1">{result.classificationType}</p>
                           </div>
                           <div className="w-10 h-10 rounded-full bg-[#00f0ff]/20 border border-[#00f0ff]/50 flex items-center justify-center text-[#00f0ff]">
                              <Bot size={20} />
                           </div>
                        </div>

                        <div className="space-y-6">
                           <div>
                              <h4 className="text-xs font-bold opacity-50 uppercase tracking-wider mb-2 flex items-center gap-2"><FileText size={14}/> Deskripsi Geologi</h4>
                              <p className="text-sm opacity-80 leading-relaxed bg-black/40 p-4 rounded-xl border border-white/5">{result.description}</p>
                           </div>
                           
                           <div>
                              <h4 className="text-xs font-bold opacity-50 uppercase tracking-wider mb-2 flex items-center gap-2"><Gem size={14}/> Komposisi Mineral</h4>
                              <div className="grid gap-3">
                                 {result.minerals.map((min, idx) => (
                                    <div key={idx} className="bg-black/40 border border-white/5 p-3 rounded-xl flex justify-between items-center group hover:border-[#00f0ff]/50 transition-colors">
                                       <div>
                                          <div className="font-semibold text-sm">{min.name}</div>
                                          <div className="text-xs opacity-50 mt-0.5">{min.description}</div>
                                       </div>
                                       <div className="text-[#00f0ff] font-bold text-lg">{min.percentage}</div>
                                    </div>
                                 ))}
                              </div>
                           </div>
                        </div>
                     </div>
                  ) : (
                     <div className="h-full min-h-[400px] border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center text-center p-8 bg-white/5">
                        <Hexagon size={48} className="text-white/10 mb-4" strokeWidth={1} />
                        <h3 className="text-lg font-bold opacity-50 mb-2">Belum Ada Hasil</h3>
                        <p className="text-sm opacity-30 max-w-sm">Upload media dan klik tombol analisis untuk melihat hasil klasifikasi dari GEO-LENS AI Engine.</p>
                     </div>
                  )}
               </div>

            </div>
         </div>
      </main>
    </div>
  );
}
