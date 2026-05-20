import React, { useState, useRef, useEffect } from 'react';
import { 
  Microscope, Upload, Scan, FlaskConical, Layers, Sun, Moon, 
  CheckCircle2, Grid, XCircle, MousePointer2, ZoomIn, BookOpen, 
  Activity, MapPin, Globe2, Fingerprint, Clock, Video, Film, PlayCircle,
  FileText, ListChecks, Eye, ChevronDown, ChevronUp, Info, AlignLeft, Ban,
  User, Lock, Mail, Facebook, Github, Linkedin, Chrome, AlertCircle, CheckCircle, ArrowRight,
  LogOut, Mountain, Gem, ChevronLeft, Map, MessageSquare, Send, X, Sparkles, Bot, Hexagon, LayoutDashboard, WifiOff,
  Search, Compass, Flame, Heart, Target, Zap, ShieldCheck, Sliders, Cpu, Camera, RefreshCw
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
    },
    {
      rockName: "Oolitic Limestone",
      classificationType: "Batuan Sedimen Karbonat (Folk: Oosparite)",
      description: "Batuan didominasi oleh butiran ooid dengan struktur konsentris yang terkompaksi baik. Semen berupa kalsit spar (sparite) mengisi ruang antar butir. Sedikit fosil foraminifera bentonik.",
      paragenesis: "Presipitasi ooid di lingkungan laut dangkal berenergi tinggi, diikuti sementasi kalsit spar saat diagenesis.",
      petrogenesis: "Lingkungan pengendapan laut dangkal tropis (shallow marine shoal).",
      occurrences: { indonesia: ["Formasi Wonosari, Gunung Kidul", "Papua"], world: ["Bahamas"] },
      minerals: [
        { name: "Kalsit (Ooid)", percentage: "70%", description: "Butiran sferis dengan lamela konsentris.", detailedOpticalProps: { warnaInterferensi: "High order white/pastel", relief: "Berubah (Twinkle)" } },
        { name: "Kalsit (Semen Spar)", percentage: "25%", description: "Kristal anhedral jernih antar butir.", detailedOpticalProps: { relief: "Berubah", kembaran: "Polisintetik" } },
        { name: "Bioklas", percentage: "5%", description: "Fragmen cangkang fosil.", detailedOpticalProps: { struktur: "Organik" } }
      ]
    }
  ],
  rock: [
    {
      rockName: "Granit Biotit",
      classificationType: "Batuan Beku Asam (Plutonik)",
      description: "Batuan berbutir kasar (faneritik), holokristalin, berwarna terang berbintik hitam. Terdiri dominan dari K-Feldspar (merah muda), Kuarsa (transparan/abu-abu), dan Biotit (hitam).",
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
      description: "Varietas kuarsa berwarna ungu. Kristal berbentuk prisma heksagonal dengan terminasi piramidal. Transparan hingga translusen.",
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

// --- DYNAMIC MINERAL COLOR MAPPER FOR REALISTIC OPTICAL FEEL ---
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

// --- ROOT COMPONENT ---
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
      {screen === 'auth' && <AuthScreen onLogin={handleLoginSuccess} isBlackMode={isBlackMode} />}
      {screen === 'dashboard' && <DashboardScreen onNavigateToSelection={handleGoToSelection} onLogout={handleLogout} user={user} isBlackMode={isBlackMode} toggleTheme={toggleTheme} />}
      {screen === 'selection' && <SelectionScreen onSelect={handleSelectMode} onBack={handleBackToDashboard} onLogout={handleLogout} user={user} isBlackMode={isBlackMode} toggleTheme={toggleTheme} />}
      {screen === 'app' && (
        appMode === 'thin_section_live' ? (
          <ThinSectionLiveApp onBackToSelection={handleGoToSelection} onBackToDashboard={handleBackToDashboard} user={user} isBlackMode={isBlackMode} />
        ) : (
          <AmbasaltMainApp mode={appMode} onBackToSelection={handleGoToSelection} onBackToDashboard={handleBackToDashboard} user={user} isBlackMode={isBlackMode} />
        )
      )}
    </div>
  );
}

// --- 1. AUTH SCREEN (LAYER 1) ---
function AuthScreen({ onLogin, isBlackMode }) {
  const [view, setView] = useState('login');
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false);
  
  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [isRegLoading, setIsRegLoading] = useState(false);
  const [loadedCards, setLoadedCards] = useState({ login: false, register: false });
  
  const canvasRef = useRef(null);
  const scriptURL = 'https://script.google.com/macros/s/AKfycbwOzXMCnlqn7HpP3zVz4T5mC5TAU8GBYdSrugccf3C4PW2nOxLGN3zffwZ149VdGq5q/exec';

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
      
      const vertices = terrainLines.geometry.attributes.position.array;
      for (let i = 0; i < vertices.length; i += 3) {
          const x = vertices[i];
          const y = vertices[i + 1];
          vertices[i + 2] = Math.sin(x/5) * Math.cos(y/5) * 3; 
      }
      terrainLines.geometry.computeVertexNormals();
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
          const positions = particlesMesh.geometry.attributes.position.array;
          for(let i = 1; i < particlesCount * 3; i+=3) {
              positions[i] += 0.02;
              if (positions[i] > 30) positions[i] = -30;
          }
          particlesMesh.geometry.attributes.position.needsUpdate = true;
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

  const createRipple = (e) => {
    const button = e.currentTarget;
    const circle = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;
    const rect = button.getBoundingClientRect();
    
    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${e.clientX - rect.left - radius}px`;
    circle.style.top = `${e.clientY - rect.top - radius}px`;
    circle.classList.add('ripple');

    const rippleElement = button.querySelector('.ripple');
    if (rippleElement) rippleElement.remove();
    button.appendChild(circle);
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

  const handleLogin = (e) => {
    e.preventDefault();
    createRipple(e);
    setIsLoginLoading(true);
    const emailValue = e.target.querySelector('#email').value;

    setTimeout(() => {
      setIsLoginLoading(false);
      onLogin({ name: "Eksplorator", email: emailValue }); 
    }, 2000);
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    createRipple(e);
    setIsRegLoading(true);

    const form = e.target;
    try {
        const formData = new FormData(form);
        const response = await fetch(scriptURL, { method: 'POST', body: formData });
        if(response.ok) {
            alert('Registration Successful! Please sign in.');
            form.reset();
            toggleView('login');
        } else {
            throw new Error("Network response was not ok.");
        }
    } catch (error) {
        console.error('Error!', error.message);
        alert('Oops! There was an error submitting your form.');
    } finally {
        setIsRegLoading(false);
    }
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
        .ripple { position: absolute; background: rgba(255, 255, 255, 0.4); border-radius: 50%; transform: scale(0); animation: ripple-anim 0.6s linear; pointer-events: none; }
        @keyframes ripple-anim { to { transform: scale(4); opacity: 0; } }
        .loader { border: 2px solid rgba(26, 24, 21, 0.2); border-left-color: #1A1815; border-radius: 50%; width: 20px; height: 20px; animation: spin 1s linear infinite; display: none; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        .btn-loading .loader { display: inline-block; }
        .btn-loading .btn-text { display: none; }
        .custom-checkbox { appearance: none; width: 16px; height: 16px; border: 1px solid rgba(245, 241, 232, 0.3); border-radius: 4px; background: rgba(0, 0, 0, 0.5); cursor: pointer; position: relative; transition: all 0.2s; }
        .custom-checkbox:checked { background: #C9A66B; border-color: #C9A66B; }
        .custom-checkbox:checked::after { content: '✓'; position: absolute; color: #1A1815; font-size: 12px; font-weight: bold; top: 50%; left: 50%; transform: translate(-50%, -50%); }
        .hide-view { display: none !important; }
      `}</style>

      {/* 3D Background Container */}
      <div id="canvas-container" ref={canvasRef}></div>

      {/* UI Overlay */}
      <div id="ui-container" className="text-[#F5F1E8]">
          
          {/* =================== LOGIN CARD =================== */}
          <div id="login-card" className={`glass-card w-full max-w-[420px] p-8 md:p-10 mx-auto ${view !== 'login' ? 'hide-view' : ''} ${loadedCards.login ? 'loaded' : ''}`}>
              <div className="text-center mb-8">
                  <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-white/5 border border-white/10 mb-4 logo-glow">
                      <Mountain size={36} className="text-[#C9A66B] fill-[#C9A66B]" />
                  </div>
                  <h1 className="text-2xl md:text-3xl font-bold tracking-wide text-white mb-2">Ambasalt</h1>
                  <p className="text-xs md:text-sm text-[#F5F1E8]/70 font-light">Rock Mineral and Thin Section Analysis</p>
                  <p className="text-[10px] text-[#C9A66B]/80 font-mono tracking-wider mt-1 uppercase">Oleh Kelompok 23</p>
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

                  <div className="flex items-center justify-between text-xs mt-2">
                      <label className="flex items-center space-x-2 cursor-pointer group">
                          <input type="checkbox" className="custom-checkbox" />
                          <span className="text-[#F5F1E8]/70 group-hover:text-[#F5F1E8] transition-colors">Remember me</span>
                      </label>
                      <a href="#" className="text-[#C9A66B] hover:text-[#D4AF37] hover:underline transition-colors">Forgot Password?</a>
                  </div>

                  <button type="submit" className={`btn-gradient w-full rounded-xl py-3.5 mt-4 font-semibold text-sm flex items-center justify-center gap-2 relative ${isLoginLoading ? 'btn-loading' : ''}`}>
                      <span className="btn-text">Sign In</span>
                      <ArrowRight size={16} strokeWidth={3} className="btn-text" />
                      <div className="loader"></div>
                  </button>
              </form>

              <div className="flex items-center my-6">
                  <div className="flex-grow border-t border-white/10"></div>
                  <span className="mx-4 text-xs text-[#F5F1E8]/50 font-light">or</span>
                  <div className="flex-grow border-t border-white/10"></div>
              </div>

              <button className="btn-glass w-full rounded-xl py-3 font-medium text-sm flex items-center justify-center gap-3 relative overflow-hidden" onClick={createRipple}>
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

          {/* =================== REGISTER CARD =================== */}
          <div id="register-card" className={`glass-card w-full max-w-[420px] p-8 md:p-10 mx-auto ${view !== 'register' ? 'hide-view' : ''} ${loadedCards.register ? 'loaded' : ''}`}>
              <div className="text-center mb-6">
                  <h2 className="text-2xl md:text-3xl font-bold tracking-wide text-white mb-2">Create Account</h2>
                  <p className="text-xs md:text-sm text-[#F5F1E8]/70 font-light">Join Ambasalt for mineral analysis</p>
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
                      <span className="btn-text">Register Account</span>
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

// --- 2. DASHBOARD SCREEN (LAYER 2 - PENGENALAN GEOLOGI) ---
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
    "Gempa bumi terdalam yang pernah tercatat terjadi di kedalaman lebih dari 750 kilometer di bawah permukaan!",
    "Palung Mariana (10.9 km) jauh lebih dalam daripada ketinggian puncak Gunung Everest (8.8 km).",
    "Batu Apung (Pumice) adalah satu-satunya batuan yang memiliki rongga udara sangat banyak hingga bisa mengapung di air.",
    "Intan terdalam tidak terbentuk dari batu bara, melainkan dari material karbon purba di mantel bumi sejak 1 hingga 3 miliar tahun yang lalu.",
    "Bumi memiliki lempeng tektonik yang terus bergerak sekitar 2 hingga 10 sentimeter per tahun (secepat pertumbuhan kuku manusia).",
    "Sekuar 335 juta tahun yang lalu, seluruh benua di Bumi menyatu membentuk satu *supercontinent* raksasa yang disebut Pangea.",
    "Warna merah menyala pada tanah di planet Mars disebabkan oleh oksidasi besi, mirip seperti proses berkarat di bumi.",
    "Sebagian besar emas yang kita tambang hari ini berasal dari hantaman meteorit miliaran tahun silam sesaat setelah bumi terbentuk.",
    "Magma bisa mencapai suhu 700° hingga 1300° Celcius, cukup panas untuk melelehkan besi dan sebagian besar logam.",
    "Mineral Kuarsa (Silikon Dioksida) bersifat piezoelektrik, yang berarti bisa menghasilkan listrik bila ditekan, menjadikannya komponen vital pada jam tangan."
  ];

  return (
    <div className="h-full w-full flex flex-col font-sans overflow-y-auto overflow-x-hidden relative custom-scrollbar">
       {/* Decorative Background */}
       <div className="absolute top-[10%] left-[-10%] w-[500px] h-[500px] bg-[#C9A66B]/10 rounded-full blur-[120px] pointer-events-none"></div>
       <div className="absolute bottom-[10%] right-[-10%] w-[400px] h-[400px] bg-[#5C6B4F]/10 rounded-full blur-[100px] pointer-events-none"></div>

       {/* Navbar */}
       <nav className={`h-20 border-b border-white/5 ${navBg} backdrop-blur-md flex items-center justify-between px-6 md:px-8 sticky top-0 z-50 shrink-0 transition-colors duration-500`}>
          <div className="flex items-center gap-4">
             {/* Logo ITERA */}
             <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/Logo_ITERA.png/600px-Logo_ITERA.png" alt="ITERA" className="h-10 w-auto object-contain drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]" />
             {/* Logo GL (Teknik Geologi) - Custom CSS Badge */}
             <div className="h-10 w-10 bg-gradient-to-br from-[#C9A66B] to-[#8A6E40] rounded-full flex items-center justify-center border-[2px] border-[#1A1815] shadow-[0_0_15px_rgba(201,166,107,0.4)] shrink-0">
                <span className="text-[#1A1815] font-black text-sm tracking-tighter">GL</span>
             </div>
             
             <div className="ml-2 hidden sm:block">
                <h1 className="font-bold text-xl tracking-tight flex items-center gap-2">
                   GeoExplorer
                </h1>
                <p className="text-[10px] text-[#C9A66B] font-mono tracking-widest uppercase mt-0.5">Pusat Pengetahuan Ambasalt</p>
             </div>
          </div>
          <div className="flex items-center gap-4 md:gap-6">
             <button onClick={toggleTheme} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all" title="Ganti Tema">
                {isBlackMode ? <Sun size={18} className="text-amber-200" /> : <Moon size={18} className="text-slate-300" />}
             </button>

             <div className="flex items-center gap-3 border-l border-white/10 pl-4 md:pl-6">
                <div className="text-right hidden sm:block">
                   <p className="text-sm font-bold">{user?.name || 'Geologist'}</p>
                   <p className="text-[10px] opacity-50">Eksplorator Utama</p>
                </div>
                <button onClick={onLogout} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center opacity-70 hover:text-red-400 hover:bg-red-400/10 transition-all" title="Keluar">
                   <LogOut size={18} />
                </button>
             </div>
          </div>
       </nav>

       {/* Main Scrolling Content Area */}
       <div className="flex-1 w-full max-w-7xl mx-auto px-6 py-12 relative z-10 flex flex-col shrink-0">
          
          {/* Hero Section */}
          <div className="text-center max-w-4xl mx-auto mb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
             <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#C9A66B]/30 bg-[#C9A66B]/10 text-[#C9A66B] text-xs font-bold uppercase tracking-wider mb-6">
                <Sparkles size={14} /> Created by Kelompok 23
             </div>
             <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                Membaca Sejarah Bumi <br/> Melalui <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#C9A66B] to-[#8A6E40]">Batuan</span>
             </h2>
             <p className="text-lg opacity-70 mb-10 leading-relaxed max-w-2xl mx-auto">
                Setiap batuan menyimpan cerita tentang bagaimana ia terbentuk, dari erupsi gunung berapi yang dahsyat hingga tekanan luar biasa di kerak bumi. Mari pelajari lebih dalam!
             </p>
             <button onClick={onNavigateToSelection} className="inline-flex items-center gap-3 bg-gradient-to-r from-[#C9A66B] to-[#8A6E40] text-[#1A1815] px-8 py-4 rounded-2xl font-bold text-lg hover:shadow-[0_10px_30px_rgba(201,166,107,0.3)] hover:-translate-y-1 transition-all">
                <Scan size={22} /> Alat Analisis Ambasalt <ArrowRight size={20} />
             </button>
          </div>

          {/* Apa itu Geologi & Batuan */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-24">
             <div className={`${cardBg} border border-[#C9A66B]/20 p-8 md:p-10 rounded-3xl backdrop-blur-sm hover:border-[#C9A66B]/50 transition-colors shadow-xl`}>
                <div className="w-14 h-14 bg-[#C9A66B]/10 rounded-2xl flex items-center justify-center mb-6">
                   <Globe2 className="text-[#C9A66B]" size={28} />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold mb-4">Apa itu Geologi?</h3>
                <p className="opacity-70 leading-relaxed text-sm md:text-base">
                   Geologi adalah ilmu yang mempelajari planet bumi secara menyeluruh, mencakup bahan penyusunnya (batuan, air, mineral), struktur, sifat fisik, sejarah masa lalu, hingga proses pembentukannya yang tiada henti. Melalui ilmu geologi, kita bisa memahami misteri bagaimana benua bergerak, mengapa gunung meletus, mendeteksi sumber daya alam, dan memitigasi bencana bumi.
                </p>
             </div>
             <div className={`${cardBg} border border-[#5C6B4F]/20 p-8 md:p-10 rounded-3xl backdrop-blur-sm hover:border-[#5C6B4F]/50 transition-colors shadow-xl`}>
                <div className="w-14 h-14 bg-[#5C6B4F]/10 rounded-2xl flex items-center justify-center mb-6">
                   <Layers className="text-[#5C6B4F]" size={28} />
                </div>
                <h3 className="text-2xl md:text-3xl font-bold mb-4">Apa itu Batuan?</h3>
                <p className="opacity-70 leading-relaxed text-sm md:text-base">
                   Batuan adalah massa padat yang terbentuk secara alami, tersusun atas kristal dari satu atau lebih jenis mineral. Batuan adalah \"buku harian\" planet kita. Mereka mencatat peristiwa geologis masa lalu, kondisi lingkungan laut atau darat purba, serta perubahan suhu dan tekanan ekstrem yang pernah terjadi di bawah maupun di atas permukaan bumi selama miliaran tahun.
                </p>
             </div>
          </div>

          {/* Pengenalan Geologi Grid (Interaktif dengan Gambar) */}
          <div className="mb-24">
             <div className="text-center mb-12">
                <h3 className="text-3xl md:text-4xl font-bold mb-4">Materi Studi Utama</h3>
                <p className="opacity-50">Klik pada kartu di bawah ini untuk melihat fakta tersembunyi!</p>
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
                            Lihat Fakta Detail
                         </button>
                      </div>
                   </div>
                ))}
             </div>
          </div>

          {/* Fakta Menarik List */}
          <div className={`${isBlackMode ? 'bg-zinc-900' : 'bg-gradient-to-br from-[#2E2A24] to-[#1A1815]'} border border-[#C9A66B]/30 rounded-3xl p-8 md:p-12 flex flex-col gap-10 items-start mb-24 shadow-2xl relative overflow-hidden`}>
             <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#C9A66B]/5 rounded-full blur-[80px] pointer-events-none"></div>
             
             <div className="flex items-center gap-6 relative z-10 w-full border-b border-white/10 pb-6">
                <div className="shrink-0 w-16 h-16 bg-[#C9A66B]/10 rounded-2xl flex items-center justify-center border border-[#C9A66B]/30">
                   <Target size={32} className="text-[#C9A66B]" />
                </div>
                <div>
                   <h4 className="text-3xl font-bold mb-1">Trivia Geologi</h4>
                   <p className="text-[#C9A66B] text-sm">Tahukah kamu tentang fakta-fakta mencengangkan ini?</p>
                </div>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10 w-full">
                {funFacts.map((fact, idx) => (
                   <div key={idx} className="flex gap-4 items-start bg-black/20 p-5 rounded-2xl border border-white/5 hover:border-[#C9A66B]/30 transition-colors hover:-translate-y-1">
                      <div className="mt-1 w-6 h-6 rounded-full bg-[#C9A66B]/20 flex items-center justify-center shrink-0">
                         <div className="w-2 h-2 rounded-full bg-[#C9A66B] shadow-[0_0_8px_#C9A66B]"></div>
                      </div>
                      <p className="text-sm opacity-90 leading-relaxed font-medium">{fact}</p>
                   </div>
                ))}
             </div>
          </div>

          {/* Visi Misi & Pengembang */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-10">
             {/* Kenapa Web Ini Dibuat */}
             <div className={`md:col-span-8 ${cardBg} border border-[#C9A66B]/20 rounded-3xl p-8 md:p-10 backdrop-blur-sm relative overflow-hidden`}>
                <BookOpen className="absolute -bottom-10 -right-10 text-white/5 rotate-[-15deg]" size={200} />
                <h3 className="text-2xl font-bold mb-6 flex items-center gap-3">
                   <Activity className="text-[#C9A66B]"/> Kenapa Web Ini Dibuat?
                </h3>
                <p className="opacity-70 leading-relaxed text-sm md:text-base space-y-4">
                   <span className="block mb-3">Teknologi modern memberikan kemudahan yang luar biasa, namun studi mikroskopis tentang batuan seringkali masih terbatas pada fasilitas laboratorium tertutup. <b className="text-[#C9A66B]">Ambasalt Web App</b> lahir dari inisiatif untuk menjembatani jarak tersebut.</span>
                   <span className="block mb-3">Aplikasi web ini dirancang khusus untuk mempermudah identifikasi mineral dan analisis sayatan tipis batuan secara digital, responsif, dan interaktif. Kami berupaya mengubah proses pembelajaran petrologi dan mineralogi yang rumit menjadi visualisasi *dashboard* yang menarik.</span>
                   <span className="block">Dengan adanya platform simulasi *offline-ready* dan integrasi API AI, mahasiswa geologi maupun eksplorator lapangan dapat terus belajar dan menganalisis batuan kapan saja, di mana saja, tanpa harus selalu bergantung pada mikroskop fisik.</span>
                </p>
             </div>

             {/* Salam Hangat & Informasi Pencipta */}
             <div className={`md:col-span-4 ${isBlackMode ? 'bg-zinc-900' : 'bg-gradient-to-b from-[#C9A66B]/10 to-[#1A1815]'} border border-[#C9A66B]/30 rounded-3xl p-8 md:p-10 flex flex-col justify-center text-center`}>
                <Heart className="mx-auto text-[#C9A66B] mb-6 animate-bounce" size={40} />
                <h3 className="text-xl font-bold mb-4">Salam Hangat!</h3>
                <p className="opacity-70 text-sm leading-relaxed italic mb-8">
                   "Dari bumi kita belajar, untuk bumi kita mengabdi. Semoga Ambasalt mempermudah jalan eksplorasi Anda."
                </p>
                <div className="mt-auto">
                   <div className="w-12 h-1 bg-[#C9A66B] mx-auto mb-4 rounded-full"></div>
                   <p className="font-bold text-[#C9A66B] tracking-widest text-sm uppercase">Pencipta & Pengembang</p>
                   <p className="text-base font-semibold mt-1 text-white">Kelompok 23</p>
                   <p className="text-xs mt-0.5 opacity-80">Geologi Ambasalt ITERA</p>
                </div>
             </div>
          </div>
       </div>

       {/* Footer Pembuat Web */}
       <footer className={`w-full ${isBlackMode ? 'bg-[#000000]' : 'bg-[#0a0908]'} border-t border-white/10 py-10 mt-auto relative z-20 shrink-0`}>
          <div className="max-w-7xl mx-auto px-6 md:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
             <div className="text-center md:text-left flex items-center gap-4">
                <div className={`w-12 h-12 ${innerCardBg} rounded-full flex items-center justify-center border border-white/10`}>
                   <Hexagon className="text-[#C9A66B]" size={20} />
                </div>
                <div>
                    <h4 className="font-bold text-lg tracking-wide">Ambasalt Web App</h4>
                    <p className="opacity-50 text-xs mt-1 uppercase tracking-wider">Created by Kelompok 23</p>
                </div>
             </div>
             
             <div className="text-center md:text-right">
                <p className="opacity-70 text-sm mb-1">
                   Diciptakan dan dikembangkan untuk studi kebumian oleh <span className="font-bold text-[#C9A66B]">Kelompok 23</span>
                </p>
                <p className="text-xs opacity-50">
                   Tim Geologi Ambasalt Institut Teknologi Sumatera (ITERA)
                </p>
                <div className="flex items-center justify-center md:justify-end gap-4 mt-3">
                   <a href="#" className="opacity-40 hover:opacity-100 transition-colors" title="Website"><Globe2 size={16}/></a>
                   <a href="#" className="opacity-40 hover:opacity-100 transition-colors" title="Email"><Mail size={16}/></a>
                   <a href="#" className="opacity-40 hover:opacity-100 transition-colors" title="GitHub"><Github size={16}/></a>
                </div>
                <p className="opacity-30 text-[10px] mt-4 tracking-widest uppercase">© 2026 Seluruh Hak Cipta Dilindungi</p>
             </div>
          </div>
       </footer>

       {/* POP-UP MODAL UNTUK INFO KARTU */}
       {selectedTopic && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
             <div className={`${innerCardBg} border border-[#C9A66B]/30 w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl relative animate-in zoom-in-95 duration-300`}>
                {/* Close Button */}
                <button 
                  onClick={() => setSelectedTopic(null)}
                  className="absolute top-4 right-4 z-20 w-10 h-10 bg-black/50 hover:bg-[#C9A66B] rounded-full flex items-center justify-center backdrop-blur-md transition-colors"
                >
                   <X size={20} className="text-white" />
                </button>
                
                {/* Header Image */}
                <div className="h-48 md:h-64 w-full relative">
                   <div className={`absolute inset-0 bg-gradient-to-t ${isBlackMode ? 'from-black' : 'from-[#1A1815]'} to-transparent z-10`}></div>
                   <img src={selectedTopic.image} alt={selectedTopic.title} className="w-full h-full object-cover" />
                   <h2 className="absolute bottom-6 left-6 md:left-10 z-20 text-3xl md:text-4xl font-bold text-white">
                      {selectedTopic.title}
                   </h2>
                </div>

                {/* Content */}
                <div className="p-6 md:p-10 max-h-[50vh] overflow-y-auto custom-scrollbar">
                   <div className="space-y-6">
                      {selectedTopic.modalData.map((data, idx) => (
                         <div key={idx} className={`${cardBg} border border-white/5 p-5 rounded-2xl`}>
                            <h4 className="text-lg font-bold text-[#C9A66B] mb-2">{data.label}</h4>
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

// --- 3. SELECTION SCREEN (LAYER 3 - METODE ANALISIS) ---
function SelectionScreen({ onSelect, onBack, onLogout, user, isBlackMode, toggleTheme }) {
  const navBg = isBlackMode ? 'bg-[#000000]/80' : 'bg-[#1A1815]/80';
  const cardBg = isBlackMode ? 'bg-zinc-900/60' : 'bg-[#2E2A24]/40';
  const innerCardBg = isBlackMode ? 'bg-black' : 'bg-[#1A1815]';

  // FITUR BARU: Menambahkan opsi ke-4 Sayatan Tipis Live
  const cards = [
    { id: 'mineral', title: 'Determinasi Mineral', desc: 'Identifikasi spesies mineral berdasarkan sifat fisik kristal.', icon: <Gem size={32} />, color: '#10b981' },
    { id: 'rock', title: 'Hand Specimen', desc: 'Identifikasi batuan skala makroskopis (beku, sedimen, metamorf).', icon: <Mountain size={32} />, color: '#3b82f6' },
    { id: 'thin_section', title: 'Sayatan Tipis', desc: 'Analisis mikroskopis polarisasi (PPL/XPL) dengan point counting.', icon: <Microscope size={32} />, color: '#C9A66B' },
    { id: 'thin_section_live', title: 'Sayatan Tipis Live', desc: 'Mikroskop AI Interaktif real-time dengan video kamera, segmentasi digital, dan analisa instan.', icon: <Camera size={32} />, color: '#00f0ff' }, // FITUR BARU: Sayatan Tipis Live
  ];

  return (
    <div className="h-full w-full flex flex-col font-sans overflow-y-auto overflow-x-hidden relative custom-scrollbar">
       {/* Ambient Light */}
       <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#5C6B4F]/5 rounded-full blur-[120px] pointer-events-none"></div>

       <nav className={`flex justify-between items-center px-6 md:px-8 h-20 w-full relative z-10 border-b border-white/5 shrink-0 ${navBg} backdrop-blur-md`}>
          <button onClick={onBack} className={`flex items-center gap-2 opacity-70 hover:opacity-100 transition-colors ${cardBg} px-4 py-2 rounded-full border border-white/5`}>
             <ChevronLeft size={18} /> <span className="text-sm font-semibold hidden sm:block">Kembali ke Info</span>
          </button>

          <div className="flex items-center gap-3">
             <span className="font-bold text-xl tracking-tight">Ambasalt</span>
             <span className={`text-[10px] ${innerCardBg} px-2 py-0.5 rounded text-[#C9A66B] border border-[#C9A66B]/30`}>ANALISIS</span>
          </div>

          <div className="flex items-center gap-4">
             <button onClick={toggleTheme} className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all hidden sm:flex" title="Ganti Tema">
                {isBlackMode ? <Sun size={18} className="text-amber-200" /> : <Moon size={18} className="text-slate-300" />}
             </button>
             <span className="text-sm opacity-70 hidden md:inline">Halo, {user?.name || 'Geologist'}</span>
             <button onClick={onLogout} className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 opacity-70 hover:opacity-100 transition-all text-xs font-bold uppercase tracking-wider">
                <LogOut size={14} /> <span className="hidden sm:block">Keluar</span>
             </button>
          </div>
       </nav>

       <div className="flex-1 flex flex-col items-center justify-start md:justify-center py-10 md:py-0 max-w-6xl mx-auto w-full relative z-10 shrink-0 px-6">
          <div className="text-center mb-12 space-y-4">
             <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Pilih Metode Analisis</h1>
             <p className="opacity-60 text-lg max-w-2xl mx-auto">Pilih jenis sampel yang akan Anda identifikasi menggunakan engine Ambasalt.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full pb-10">
             {cards.map((card) => (
                <div 
                  key={card.id}
                  onClick={() => onSelect(card.id)}
                  className={`group relative ${cardBg} backdrop-blur-sm border border-white/10 rounded-3xl p-6 cursor-pointer overflow-hidden transition-all duration-300 hover:bg-black/40 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]`}
                >
                   <div className="absolute top-0 right-0 w-32 h-32 opacity-5 rounded-bl-[100px] -mr-6 -mt-6 transition-transform group-hover:scale-110" style={{backgroundColor: card.color}}></div>
                   
                   <div className={`w-14 h-14 rounded-2xl ${innerCardBg} border border-white/10 flex items-center justify-center mb-6 transition-transform duration-300 shadow-lg`} style={{color: card.color}}>
                      {card.icon}
                   </div>
                   
                   <h3 className="text-lg font-bold mb-2 transition-colors">{card.title}</h3>
                   <p className="opacity-60 text-xs leading-relaxed mb-6 h-12 overflow-hidden">{card.desc}</p>
                   
                   <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest opacity-50 group-hover:opacity-100 transition-colors" style={{color: card.color}}>
                      Buka Modul <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                   </div>
                </div>
             ))}
          </div>
       </div>
    </div>
  );
}

// --- KOMPONEN INTERACTIVE GRID 8x8 (64 SEL) UNTUK TITIK POINT COUNTING AKURAT ---
function InteractiveGrid({ gridData, selectedCell, onSelect, ringClass = 'ring-[#C9A66B]' }) {
  if (!gridData || gridData.length === 0) return null;
  return (
    <div className="absolute inset-0 z-30 grid grid-cols-8 grid-rows-8 pointer-events-auto">
      {gridData.map((cell) => (
         <div
           key={cell.index}
           onClick={() => onSelect(cell.index)}
           className={`border-[0.5px] border-white/15 hover:bg-white/20 cursor-pointer transition-all ${selectedCell === cell.index ? `ring-2 ${ringClass} z-40` : ''}`}
           style={{ backgroundColor: selectedCell === cell.index ? cell.colorHex : 'transparent' }}
         />
      ))}
    </div>
  );
}

// --- 4. MAIN APP (LAYER 4 - ALAT ANALISIS LAMA) ---
function AmbasaltMainApp({ mode, onBackToSelection, onBackToDashboard, user, isBlackMode }) {
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

  // Config Themes
  const sidebarBg = isBlackMode ? 'bg-zinc-950' : 'bg-[#2E2A24]/60';
  const innerCardBg = isBlackMode ? 'bg-zinc-900/80' : 'bg-[#2E2A24]/40';
  const pureBg = isBlackMode ? 'bg-black' : 'bg-[#1A1815]/80';

  const config = {
    thin_section: { title: "Thin Section Analysis", colorCode: "#C9A66B" },
    rock: { title: "Hand Specimen Identification", colorCode: "#3b82f6" },
    mineral: { title: "Mineral Specimen Analysis", colorCode: "#10b981" },
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

  // --- FUNGSI UTAMA DEFENSIF: FETCH DENGAN EXPONENTIAL BACKOFF RETRY ---
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
    setTimeout(() => setLoadingStep("Menyusun Laporan..."), 3000);

    setTimeout(async () => {
        try {
            if (!pplImage) {
                throw new Error("Silakan unggah gambar sampel terlebih dahulu untuk analisis AI.");
            }

            // Gunakan model Gemini 2.5 Flash yang sangat stabil dengan API Key permanen
            const url = `/api/gemini`;
            const mimeType = pplImage.split(';')[0].split(':')[1];
            const base64Data = pplImage.split(',')[1];

            const promptText = `Anda adalah ahli geologi profesional (petrologi dan mineralogi). Analisis gambar sampel geologi ini (Fokus analisis: ${config.title}). 
Identifikasi batuan atau mineral dominan yang ada di gambar tersebut berdasarkan ciri visual, tekstur, dan warnanya. Berikan akurasi estimasi tinggi (80-90%).
PENTING: Jawab HANYA menggunakan format JSON yang valid. Struktur JSON harus persis seperti ini:
{
  "rockName": "Nama Batuan/Mineral (Contoh: Basalt, Kuarsa)",
  "classificationType": "Tipe Klasifikasi (Contoh: Batuan Beku Ekstrusif)",
  "description": "Deskripsi geologi komprehensif mengenai tekstur, struktur, dan kemungkinan proses pembentukannya berdasarkan gambar.",
  "minerals": [
    { "name": "Nama Mineral 1", "percentage": "Estimasi %", "description": "Sifat optik/fisik" },
    { "name": "Nama Mineral 2", "percentage": "Estimasi %", "description": "Sifat optik/fisik" }
  ]
}`;

            const response = await fetchWithRetry(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{
                        role: "user",
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

                // --- ALGORITMA DISTRIBUSI SPASIAL GRID 8x8 BERBASIS MATEMATIS PERSENTASE AI ---
                if (mode === 'thin_section') {
                    const totalCells = 64; // Grid 8x8
                    const tempGrid = [];
                    
                    // Parsing persentase numerik dari setiap mineral secara akurat
                    const parsedMinerals = apiResult.minerals.map((m, idx) => {
                        const numericPct = parseFloat(m.percentage.replace(/[^0-9.]/g, '')) || 0;
                        return { ...m, numericPct, index: idx };
                    });

                    // Hitung total persentase untuk normalisasi jika AI memberikan total tidak pas 100%
                    const totalPct = parsedMinerals.reduce((sum, m) => sum + m.numericPct, 0) || 100;

                    let allocatedMinerals = [];
                    let totalAssigned = 0;

                    // Alokasi proporsional awal menggunakan Math.floor agar tidak melebihi 64 titik
                    parsedMinerals.forEach(m => {
                        const count = Math.floor((m.numericPct / totalPct) * totalCells);
                        m.allocatedCount = count;
                        totalAssigned += count;
                        for (let i = 0; i < count; i++) {
                            allocatedMinerals.push(m);
                        }
                    });

                    // Distribusi selisih sisa (leftovers) secara adil ke mineral dengan sisa pecahan terbesar
                    let leftovers = totalCells - totalAssigned;
                    if (leftovers > 0 && parsedMinerals.length > 0) {
                        parsedMinerals.sort((a, b) => {
                            const remainA = ((a.numericPct / totalPct) * totalCells) - a.allocatedCount;
                            const remainB = ((b.numericPct / totalPct) * totalCells) - b.allocatedCount;
                            return remainB - remainA; // Urutkan sisa pecahan terbesar
                        });
                        
                        let i = 0;
                        while (leftovers > 0) {
                            allocatedMinerals.push(parsedMinerals[i % parsedMinerals.length]);
                            leftovers--;
                            i++;
                        }
                    }

                    // Pengacakan spasial (Fisher-Yates Shuffle) untuk mensimulasikan sebaran natural kristal
                    for (let i = allocatedMinerals.length - 1; i > 0; i--) {
                        const j = Math.floor(Math.random() * (i + 1));
                        [allocatedMinerals[i], allocatedMinerals[j]] = [allocatedMinerals[j], allocatedMinerals[i]];
                    }

                    // Bangun gridData final 8x8
                    for (let i = 0; i < totalCells; i++) {
                        const min = allocatedMinerals[i];
                        tempGrid.push({
                            index: i,
                            mineral: min.name,
                            colorHex: getMineralColor(min.name),
                            feature: min.description || "Komponen Utama Batuan"
                        });
                    }
                    setGridData(tempGrid);
                }

                setResult(apiResult);
            } else {
                throw new Error("Format respons AI dari server tidak valid / tidak dikenali.");
            }
        } catch (error) {
            console.error("AI Error:", error);
            setErrorMsg(error.message || "Terjadi kesalahan sistem saat menghubungi server Gemini API.");
        } finally {
            setLoading(false);
        }
    }, 4000);
  };

  return (
    <div className="flex h-screen overflow-hidden font-sans">
      
      {/* SIDEBAR KIRI */}
      <aside className={`w-20 md:w-64 ${sidebarBg} border-r border-white/5 flex flex-col justify-between shrink-0 z-20 transition-colors`}>
         <div className="overflow-y-auto flex-1 custom-scrollbar">
            <div className="h-16 flex items-center justify-center md:justify-start md:px-6 border-b border-white/5 shrink-0">
               <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[#1A1815] mr-0 md:mr-3 shrink-0" style={{backgroundColor: config.colorCode}}>
                  {mode === 'thin_section' ? <Microscope size={18} /> : mode === 'rock' ? <Mountain size={18} /> : <Gem size={18} />}
               </div>
               <span className="hidden md:block font-bold tracking-tight">Ambasalt</span>
            </div>
            
            <div className="p-4 space-y-2">
               <div className="text-[10px] font-bold uppercase tracking-widest opacity-40 px-2 hidden md:block mb-2">Navigasi Utama</div>
               <button onClick={onBackToDashboard} className="w-full flex items-center justify-center md:justify-start gap-3 md:px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                  <BookOpen size={18} style={{color: config.colorCode}} />
                  <span className="hidden md:block text-sm font-medium">Info Geologi</span>
               </button>
               <button onClick={onBackToSelection} className="w-full flex items-center justify-center md:justify-start gap-3 md:px-3 py-2.5 rounded-xl opacity-60 hover:bg-white/5 hover:opacity-100 transition-all">
                  <ArrowRight className="rotate-180" size={18} />
                  <span className="hidden md:block text-sm font-medium">Ganti Analisis</span>
               </button>
            </div>
         </div>

         <div className="p-4 border-t border-white/5 shrink-0">
            <div className="flex items-center justify-center md:justify-start gap-3 md:px-2">
               <div className="w-8 h-8 rounded-full bg-black border border-[#C9A66B]/30 flex items-center justify-center shrink-0">
                  <User size={14} className="text-[#C9A66B]" />
               </div>
               <div className="hidden md:block overflow-hidden">
                  <div className="text-xs font-bold truncate">{user?.name || 'Geologist'}</div>
                  <div className="text-[10px] opacity-40">Active Session</div>
               </div>
            </div>
         </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col min-w-0 relative">
         <header className="h-16 border-b border-white/5 bg-black/20 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-10">
            <div>
               <h2 className="text-sm font-bold flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full" style={{backgroundColor: config.colorCode}}></span>
                  {config.title}
               </h2>
            </div>
            <div className="flex items-center gap-3">
               <div className="bg-black/40 rounded-lg p-1 flex border border-white/5">
                  <button onClick={() => {setAnalysisMode('image'); setResult(null);}} className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${analysisMode === 'image' ? 'bg-[#5C6B4F] text-white shadow' : 'opacity-50 hover:opacity-100'}`}>Foto</button>
                  <button onClick={() => {setAnalysisMode('video'); setResult(null);}} className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all ${analysisMode === 'video' ? 'bg-[#5C6B4F] text-white shadow' : 'opacity-50 hover:opacity-100'}`}>Video</button>
               </div>
            </div>
         </header>

         <div className="flex-1 overflow-y-auto p-6 scroll-smooth custom-scrollbar">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-7xl mx-auto">
               
               {/* KOLOM KIRI: UPLOAD & KONTROL */}
               <div className="lg:col-span-6 space-y-6">
                  <div className={`${innerCardBg} border border-white/10 rounded-2xl p-1 shadow-xl transition-colors`}>
                     <div className={`${pureBg} rounded-xl p-6 relative overflow-hidden transition-colors`}>
                        
                        {/* AREA UPLOAD MEDIA */}
                        <div className="grid grid-cols-2 gap-4">
                           {analysisMode === 'image' ? (
                              <>
                                 {/* PPL Image */}
                                 <div className={`relative group ${!isThinSection ? 'col-span-2' : ''}`}>
                                    <div className={`relative border-2 border-dashed border-[#F5F1E8]/20 bg-black/30 hover:bg-black/50 hover:border-[#C9A66B] transition-all flex items-center justify-center overflow-hidden ${isThinSection ? 'rounded-full aspect-square shadow-[0_0_40px_rgba(0,0,0,0.5)_inset]' : 'rounded-xl aspect-video'}`}>
                                       {pplImage ? (
                                          <img src={pplImage} className="absolute inset-0 w-full h-full object-cover transition-transform" style={isThinSection ? {transform: `scale(1.5) rotate(${stageRotation}deg)`} : {}} />
                                       ) : (
                                          <div className="text-center opacity-50 p-4">
                                             {isThinSection ? <Sun className="mx-auto mb-2 opacity-50 text-[#C9A66B]" /> : <Scan className="mx-auto mb-2 opacity-50" />}
                                             <span className="text-[10px] font-bold uppercase tracking-widest block">Upload {isThinSection ? 'PPL' : 'Foto'}</span>
                                          </div>
                                       )}
                                       {isThinSection && usePointCounting && <InteractiveGrid gridData={gridData} selectedCell={selectedCell} onSelect={setSelectedCell} />}
                                       <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'ppl')} className={`absolute inset-0 opacity-0 cursor-pointer ${usePointCounting ? 'pointer-events-none' : ''}`} />
                                    </div>
                                    {isThinSection && <div className="absolute bottom-[-20px] left-0 right-0 text-center text-[9px] opacity-40 font-mono pointer-events-none z-0">NICOL SEJAJAR (PPL)</div>}
                                 </div>

                                 {/* XPL Image */}
                                 {isThinSection && (
                                    <div className="relative group">
                                       <div className="relative border-2 border-dashed border-[#F5F1E8]/20 bg-black/30 hover:bg-black/50 hover:border-[#C9A66B] transition-all flex items-center justify-center overflow-hidden rounded-full aspect-square shadow-[0_0_40px_rgba(0,0,0,0.5)_inset]">
                                          {xplImage ? (
                                             <img src={xplImage} className="w-full h-full object-cover transition-transform" style={{transform: `scale(1.5) rotate(${stageRotation}deg)`}} />
                                          ) : (
                                             <div className="text-center opacity-50">
                                                <Moon className="mx-auto mb-2 opacity-50 text-[#5C6B4F]" />
                                                <span className="text-[10px] font-bold uppercase tracking-widest block">Upload XPL</span>
                                             </div>
                                          )}
                                          {usePointCounting && <InteractiveGrid gridData={gridData} selectedCell={selectedCell} onSelect={setSelectedCell} />}
                                          <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'xpl')} className={`absolute inset-0 opacity-0 cursor-pointer ${usePointCounting ? 'pointer-events-none' : ''}`} />
                                       </div>
                                       <div className="absolute bottom-[-20px] left-0 right-0 text-center text-[9px] opacity-40 font-mono pointer-events-none">NICOL SILANG (XPL)</div>
                                    </div>
                                 )}
                              </>
                           ) : (
                              <div className="col-span-2 relative border-2 border-dashed border-[#F5F1E8]/20 bg-black/30 rounded-xl aspect-video flex items-center justify-center overflow-hidden group hover:border-[#C9A66B] transition-all">
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
                                          <Film className="mx-auto mb-2 opacity-50 text-[#C9A66B]" />
                                          <span className="text-[10px] font-bold uppercase tracking-widest block">Upload Video MP4</span>
                                       </div>
                                       <input type="file" accept="video/*" onChange={(e) => handleFileUpload(e, 'video')} className="absolute inset-0 opacity-0 cursor-pointer z-30" />
                                    </>
                                 )}
                              </div>
                           )}
                        </div>

                        {/* KONTROL */}
                        <div className="mt-8 pt-6 border-t border-white/10">
                           {isThinSection && analysisMode === 'image' && (
                              <div className="mb-6 space-y-4">
                                 
                                 {/* UI INFO BOX UNTUK POINT COUNTING */}
                                 {usePointCounting && selectedCell !== null && gridData.length > 0 && (
                                     <div className="p-4 rounded-xl border border-[#C9A66B]/50 bg-[#C9A66B]/10 flex items-center justify-between mb-4 animate-in slide-in-from-top-2">
                                         <div className="flex items-center gap-3">
                                             <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(255,255,255,0.2)]" style={{backgroundColor: gridData.find(c => c.index === selectedCell)?.colorHex}}>
                                                 <MousePointer2 size={14} className="text-white drop-shadow-md" />
                                             </div>
                                             <div>
                                                 <div className="text-[10px] uppercase tracking-widest opacity-60 font-bold mb-0.5">Identifikasi Titik #{selectedCell + 1} / 64</div>
                                                 <div className="text-[#C9A66B] font-bold text-sm">{gridData.find(c => c.index === selectedCell)?.mineral || 'Mineral Tidak Diketahui'}</div>
                                                 <div className="text-[10px] opacity-40 mt-0.5">Sifat: {gridData.find(c => c.index === selectedCell)?.feature}</div>
                                             </div>
                                         </div>
                                         <button onClick={() => setSelectedCell(null)} className="opacity-50 hover:opacity-100 hover:text-red-400 transition-colors bg-black/20 p-1.5 rounded-full">
                                             <X size={16} />
                                         </button>
                                     </div>
                                 )}

                                 <div className="flex items-center justify-between">
                                    <span className="text-sm opacity-80 font-medium">Rotasi Meja Objek (Stage)</span>
                                    <span className="text-xs text-[#C9A66B] font-mono font-bold bg-[#C9A66B]/10 px-2 py-1 rounded">{stageRotation}°</span>
                                 </div>
                                 <input type="range" min="0" max="360" value={stageRotation} onChange={(e) => setStageRotation(e.target.value)} 
                                    className="w-full h-2 bg-black rounded-lg appearance-none cursor-pointer accent-[#C9A66B]" />
                                 
                                 <label className="flex items-center gap-3 cursor-pointer mt-4 p-3 bg-white/5 rounded-lg border border-white/5 hover:bg-white/10 transition-colors">
                                    <input type="checkbox" checked={usePointCounting} onChange={(e) => setUsePointCounting(e.target.checked)} className="w-4 h-4 rounded text-[#C9A66B] accent-[#C9A66B] bg-black border-white/20" />
                                    <span className="text-sm opacity-80 font-medium">Aktifkan Point Counting Grid Rapat (8x8 - 64 Titik)</span>
                                 </label>
                              </div>
                           )}
                           
                           <button onClick={analyzeSample} disabled={loading || (analysisMode==='image' && !pplImage)} 
                              className="w-full text-[#1A1815] font-bold py-3.5 rounded-xl hover:shadow-[0_0_20px_rgba(201,166,107,0.4)] hover:-translate-y-0.5 active:translate-y-0 transition-all flex justify-center items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-[#C9A66B] to-[#8A6E40]">
                              {loading ? <Scan className="animate-spin" size={20} /> : <Sparkles size={20} />}
                              {loading ? loadingStep : "Mulai Analisis Ambasalt AI"}
                           </button>
                        </div>

                     </div>
                  </div>
               </div>

               {/* KOLOM KANAN: HASIL ANALISIS */}
               <div className="lg:col-span-6 space-y-6">
                  {errorMsg && (
                     <div className="bg-red-500/10 border border-red-500/50 text-red-200 p-4 rounded-xl flex items-start gap-3">
                        <AlertCircle className="shrink-0 mt-0.5 text-red-400" size={18} />
                        <div className="text-sm">
                           <p className="font-bold mb-1">Terjadi Kesalahan Analisis AI:</p>
                           <p className="opacity-80">{errorMsg}</p>
                        </div>
                     </div>
                  )}

                  {result ? (
                     <div className={`${innerCardBg} border border-white/10 rounded-2xl p-6 shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-500 transition-colors`}>
                        <div className="flex items-start justify-between mb-6">
                           <div>
                              <div className="text-[10px] font-bold tracking-widest text-[#C9A66B] uppercase mb-1 flex items-center gap-1">
                                 <CheckCircle size={12} /> Hasil Dari Live API (Gemini)
                              </div>
                              <h3 className="text-2xl font-bold">{result.rockName}</h3>
                              <p className="text-sm opacity-60 mt-1">{result.classificationType}</p>
                           </div>
                           <div className="w-10 h-10 rounded-full bg-[#5C6B4F]/20 border border-[#5C6B4F]/50 flex items-center justify-center text-[#5C6B4F]">
                              <Bot size={20} />
                           </div>
                        </div>

                        <div className="space-y-6">
                           <div>
                              <h4 className="text-xs font-bold opacity-50 uppercase tracking-wider mb-2 flex items-center gap-2"><FileText size={14}/> Deskripsi</h4>
                              <p className="text-sm opacity-80 leading-relaxed bg-black/40 p-4 rounded-xl border border-white/5">{result.description}</p>
                           </div>
                           
                           <div>
                              <h4 className="text-xs font-bold opacity-50 uppercase tracking-wider mb-2 flex items-center gap-2"><Gem size={14}/> Komposisi Mineral</h4>
                              <div className="grid gap-3">
                                 {result.minerals.map((min, idx) => (
                                    <div key={idx} className="bg-black/40 border border-white/5 p-3 rounded-xl flex justify-between items-center group hover:border-[#C9A66B]/50 transition-colors">
                                       <div>
                                          <div className="font-semibold text-sm">{min.name}</div>
                                          <div className="text-xs opacity-50 mt-0.5">{min.description}</div>
                                       </div>
                                       <div className="text-[#C9A66B] font-bold text-lg">{min.percentage}</div>
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
                        <p className="text-sm opacity-30 max-w-sm">Unggah media dan klik tombol analisis untuk melihat klasifikasi sampel dari Ambasalt Engine.</p>
                     </div>
                  )}
               </div>

            </div>
         </div>
      </main>
    </div>
  );
}

// =========================================================================
// FITUR BARU: Sayatan Tipis Live (GEO-LENS v2.5) Component
// =========================================================================
const LIVE_PRESETS = {
  granite: {
    rockType: "Granit",
    confidence: 94,
    reservoirType: "Tight Crystalline Barrier",
    porosity: 2.4,
    formationName: "Intrusi Granit Aisandami",
    estimatedDepth: "4,120 m",
    texture: "Tekstur Faneritik, holokristalin dengan intergrowths mineral Kuarsa, Feldspar, dan Biotit.",
    interpretation: "Asal batuan beku intrusif plutonik. Sampel ini mewakili formasi basement dalam yang bertindak sebagai jebakan hidrokarbon absolut.",
    minerals: [
      { name: "Kuarsa", percentage: 38, color: "#00f0ff" },
      { name: "Feldspar Ortoklas", percentage: 35, color: "#3b82f6" },
      { name: "Plagioklas", percentage: 15, color: "#ec4899" },
      { name: "Biotit & Hornblende", percentage: 12, color: "#f59e0b" }
    ],
    imageSrc: "https://images.unsplash.com/photo-1580137189272-c9379f8864fd?auto=format&fit=crop&q=80&w=600"
  },
  sandstone: {
    rockType: "Batu Pasir",
    confidence: 89,
    reservoirType: "Primary Clastic Reservoir",
    porosity: 18.2,
    formationName: "Formasi Talang Akar Bawah",
    estimatedDepth: "1,850 m",
    texture: "Berbutir halus hingga sedang, sub-angular hingga sub-rounded. Sortasi butir mineral baik.",
    interpretation: "Lingkungan pengendapan fluvial-deltaic. Potensi matriks reservoir sangat baik dengan porositas primer yang saling terhubung kuat.",
    minerals: [
      { name: "Butiran Kuarsa", percentage: 70, color: "#00f0ff" },
      { name: "Matriks Lempung", percentage: 15, color: "#10b981" },
      { name: "Aksesori Feldspar", percentage: 10, color: "#3b82f6" },
      { name: "Semen Oksida Besi", percentage: 5, color: "#f59e0b" }
    ],
    imageSrc: "https://images.unsplash.com/photo-1544377193-33dcf4d68fb5?auto=format&fit=crop&q=80&w=600"
  },
  basalt: {
    rockType: "Basalt",
    confidence: 91,
    reservoirType: "Fractured Basalt Play",
    porosity: 8.5,
    formationName: "Anggota Basalt Manokwari",
    estimatedDepth: "890 m",
    texture: "Tekstur Afanitik, mikrokristalin dengan rongga vesikuler yang terisi sebagian oleh mineral sekunder.",
    interpretation: "Aliran lava vulkanik ekstrusif. Berpotensi sebagai reservoir hanya jika terdapat pola rekahan tektonik sekunder yang intensif.",
    minerals: [
      { name: "Feldspar Plagioklas", percentage: 48, color: "#3b82f6" },
      { name: "Piroksen (Augit)", percentage: 38, color: "#ef4444" },
      { name: "Fenokris Olivin", percentage: 10, color: "#10b981" },
      { name: "Groundmass Gelas", percentage: 4, color: "#8b5cf6" }
    ],
    imageSrc: "https://images.unsplash.com/photo-1515516969-d4008cc6241a?auto=format&fit=crop&q=80&w=600"
  },
  schist: {
    rockType: "Sekis Mika",
    confidence: 87,
    reservoirType: "Fractured Metamorphic Basement",
    porosity: 4.1,
    formationName: "Kompleks Sekis Pompangeo",
    estimatedDepth: "3,200 m",
    texture: "Tekstur Lepidoblastik, menunjukkan keselarasan schistosity yang jelas dari biotit pipih dan muskovit.",
    interpretation: "Produk metamorfisme regional derajat tinggi. Berperan terutama sebagai batuan dasar basement di bawah dinamika tegangan geser yang intensif.",
    minerals: [
      { name: "Lapisan Kuarsa", percentage: 42, color: "#00f0ff" },
      { name: "Mika Biotit", percentage: 28, color: "#f59e0b" },
      { name: "Mika Muskovit", percentage: 20, color: "#eab308" },
      { name: "Kristal Garnet", percentage: 10, color: "#ef4444" }
    ],
    imageSrc: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&q=80&w=600"
  }
};

function ThinSectionLiveApp({ onBackToSelection, onBackToDashboard, user, isBlackMode }) {
  const [zoom, setZoom] = useState(1);
  const [light, setLight] = useState(85);
  const [selectedPreset, setSelectedPreset] = useState('granite');
  const [isOverlayActive, setIsOverlayActive] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [coordinates, setCoordinates] = useState({ x: 142.3, y: 89.1 });
  const [customImage, setCustomImage] = useState(null);
  
  // State Input API key manual dari UI
  const [apiKeyInput, setApiKeyInput] = useState(() => {
    return localStorage.getItem('GEMINI_MICRO_API_KEY') || '';
  });

  const [activeData, setActiveData] = useState(LIVE_PRESETS.granite);
  const [logs, setLogs] = useState([
    { id: 1, name: "Sampel #891-G", type: "Granit", date: "Hari ini, 10:15 WIB" },
    { id: 2, name: "Basalt Bedrock", type: "Basalt", date: "Hari ini, 09:30 WIB" }
  ]);

  const [statusMsg, setStatusMsg] = useState(null);

  // === FITUR POINT COUNTING (GRID) ===
  const [usePointCounting, setUsePointCounting] = useState(false);
  const [gridData, setGridData] = useState([]);
  const [selectedCell, setSelectedCell] = useState(null);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const pieChartRef = useRef(null);
  const streamRef = useRef(null);

  // Simpan API key lokal
  const saveApiKey = () => {
    localStorage.setItem('GEMINI_MICRO_API_KEY', apiKeyInput);
    triggerStatusMessage("API Key disimpan secara lokal.");
  };

  const triggerStatusMessage = (msg, isWarning = false) => {
    setStatusMsg({ text: msg, isWarning });
    setTimeout(() => {
      setStatusMsg(null);
    }, 3500);
  };

  // Efek Mouse Tracker pada area Display Mikroskop
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left).toFixed(1);
    const y = (e.clientY - rect.top).toFixed(1);
    setCoordinates({ x, y });
  };

  // Ubah preset sampel default
  const loadPreset = (key) => {
    setSelectedPreset(key);
    setCustomImage(null);
    setActiveData(LIVE_PRESETS[key]);
    triggerStatusMessage(`Sampel ${LIVE_PRESETS[key].rockType} berhasil dimuat.`);
  };

  // Unggah sayatan kustom
  const handleCustomUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (evt) => {
        setCustomImage(evt.target.result);
        setIsOverlayActive(false);
        triggerStatusMessage("Sayatan eksternal dimuat. Klik 'ANALYZE SAMPLE' untuk memicu AI.");
      };
      reader.readAsDataURL(file);
    }
  };

  // Generate Grid Points
  const generateGrid = (minerals) => {
      const totalCells = 64; 
      const tempGrid = [];
      const parsedMinerals = minerals.map((m, idx) => {
          // Konversi persentase ke format string terlebih dahulu agar aman di .replace()
          const pctStr = m.percentage ? m.percentage.toString() : "0";
          const numericPct = parseFloat(pctStr.replace(/[^0-9.]/g, '')) || 0;
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
      
      // Shuffle pola sebaran
      for (let i = allocatedMinerals.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [allocatedMinerals[i], allocatedMinerals[j]] = [allocatedMinerals[j], allocatedMinerals[i]];
      }
      
      for (let i = 0; i < totalCells; i++) {
          const min = allocatedMinerals[i];
          tempGrid.push({
              index: i,
              mineral: min.name,
              colorHex: min.color || getMineralColor(min.name),
              feature: min.description || "Komponen Utama Batuan"
          });
      }
      setGridData(tempGrid);
  };

  useEffect(() => {
      if (activeData && activeData.minerals) {
          generateGrid(activeData.minerals);
          setSelectedCell(null);
      }
  }, [activeData]);

  // Hidupkan / Matikan video kamera asli (Connect Optics)
  const toggleCamera = async () => {
    if (isCameraActive) {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      setIsCameraActive(false);
      triggerStatusMessage("Optik kamera diputuskan.");
    } else {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
        setIsCameraActive(true);
        triggerStatusMessage("Optik kamera eksternal aktif.");
      } catch (err) {
        console.warn(err);
        triggerStatusMessage("Kamera video tidak terdeteksi. Menggunakan mode statis simulasi.", true);
      }
    }
  };

  // Tutup stream kamera saat komponen unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  // Gambar Overlay Segmentasi AI
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (!isOverlayActive) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }

    const w = canvas.width = 400;
    const h = canvas.height = 400;
    ctx.clearRect(0, 0, w, h);

    const minerals = activeData.minerals;
    if (!minerals || minerals.length === 0) return;

    // Koordinat simulasi peta mineral (Voronoi-like)
    const pts = [
      { x: 50, y: 80, mIndex: 0 }, { x: 150, y: 60, mIndex: 1 }, { x: 300, y: 90, mIndex: 2 },
      { x: 90, y: 220, mIndex: 0 }, { x: 230, y: 180, mIndex: 1 }, { x: 340, y: 280, mIndex: 3 },
      { x: 70, y: 340, mIndex: 2 }, { x: 200, y: 310, mIndex: 0 }, { x: 280, y: 110, mIndex: 1 }
    ];

    // Gambar poligon visual warna mineral
    for (let y = 0; y < h; y += 8) {
      for (let x = 0; x < w; x += 8) {
        let minDist = Infinity;
        let closestPt = null;
        for (let p of pts) {
          const d = (p.x - x) ** 2 + (p.y - y) ** 2;
          if (d < minDist) {
            minDist = d;
            closestPt = p;
          }
        }
        if (closestPt) {
          const m = minerals[closestPt.mIndex % minerals.length];
          ctx.fillStyle = m.color;
          ctx.globalAlpha = 0.35;
          ctx.fillRect(x, y, 8, 8);
        }
      }
    }

    // Gambar sirkel outline menyala tipis
    ctx.globalAlpha = 0.6;
    ctx.strokeStyle = "rgba(0, 240, 255, 0.4)";
    ctx.lineWidth = 1;
    for (let p of pts) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 15, 0, Math.PI * 2);
      ctx.stroke();
    }
  }, [isOverlayActive, activeData]);

  // Gambar Chart Pie Komposisi Mineral (Donat Tech-Style)
  useEffect(() => {
    const canvas = pieChartRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const r = canvas.width / 2 - 8;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const minerals = activeData.minerals;
    let total = minerals.reduce((acc, curr) => acc + curr.percentage, 0);
    let startAngle = 0;

    minerals.forEach(mineral => {
      let sliceAngle = (mineral.percentage / total) * 2 * Math.PI;

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, r, startAngle, startAngle + sliceAngle);
      ctx.closePath();
      ctx.fillStyle = mineral.color;
      ctx.fill();

      ctx.strokeStyle = "rgba(10, 15, 30, 0.85)";
      ctx.lineWidth = 2;
      ctx.stroke();

      startAngle += sliceAngle;
    });

    // Lubang tengah Donat
    ctx.beginPath();
    ctx.arc(cx, cy, r * 0.55, 0, 2 * Math.PI);
    ctx.fillStyle = "#0d111d";
    ctx.fill();
    ctx.strokeStyle = "rgba(0, 240, 255, 0.25)";
    ctx.lineWidth = 1;
    ctx.stroke();
  }, [activeData]);

  // Fungsi Pemicu Analisa Gambar Asli atau Kustom dengan Backoff Exponential Retry
  const startAIAnalysis = async () => {
    setIsAnalyzing(true);
    triggerStatusMessage("AI sedang mengamati sayatan...");

    setTimeout(async () => {
      try {
        let finalApiKey = apiKeyInput.trim();
        let url;
        let payload;

        // Ambil gambar untuk Vision model (baik dari <video> atau <img> statis)
        const img = isCameraActive 
            ? document.getElementById('mainMicroscopeVideo') 
            : document.getElementById('mainMicroscopeFrame');
            
        if (!img) throw new Error("Frame mikroskop tidak siap.");

        // Konversi ke Base64 menggunakan canvas sementara
        const tempCanvas = document.createElement("canvas");
        tempCanvas.width = isCameraActive ? (img.videoWidth || 400) : (img.naturalWidth || img.width || 400);
        tempCanvas.height = isCameraActive ? (img.videoHeight || 400) : (img.naturalHeight || img.height || 400);
        const tempCtx = tempCanvas.getContext("2d");
        tempCtx.drawImage(img, 0, 0, tempCanvas.width, tempCanvas.height);
        
        const dataURL = tempCanvas.toDataURL("image/jpeg", 0.85);
        const base64Image = dataURL.replace(/^data:image\/(png|jpeg|jpg);base64,/, "");

        const userPrompt = "Analyze this geological thin section image and identify minerals, rock type, porosity, texture, and possible depositional environment. Return the response strictly as a structured JSON object. The format must match: {\"rockType\": \"Name\", \"confidence\": 95, \"reservoirType\": \"Type\", \"porosity\": 12, \"formationName\": \"Formation Name\", \"estimatedDepth\": \"Approximate depth\", \"texture\": \"Text description of texture\", \"interpretation\": \"Depositional environment interpretation\", \"minerals\": [{\"name\": \"Mineral Name\", \"percentage\": 40, \"color\": \"#00f0ff\"}, {\"name\": \"Mineral 2\", \"percentage\": 60, \"color\": \"#3b82f6\"}]}. Provide between 2 to 4 minerals that sum up to 100%. Use clean hexa colors for mineral keys.";

        // Jika API key manual dimasukkan, targetkan Google API
        if (finalApiKey) {
            url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${finalApiKey}`;
            payload = {
                contents: [{ parts: [ { text: userPrompt }, { inlineData: { mimeType: "image/jpeg", data: base64Image } } ] }],
                generationConfig: { responseMimeType: "application/json" }
            };
        } else {
            // Jika kosong, sambungkan ke rute backend Vercel secara default
            url = `/api/gemini`;
            payload = {
                contents: [{ role: "user", parts: [ { text: userPrompt }, { inlineData: { mimeType: "image/jpeg", data: base64Image } } ] }],
                generationConfig: { responseMimeType: "application/json" }
            };
        }

        let retries = 5;
        let delay = 1000;
        let success = false;
        let textResult = null;

        for (let i = 0; i < retries; i++) {
          try {
            const response = await fetch(url, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload)
            });

            if (response.ok) {
              const resData = await response.json();
              textResult = resData.candidates?.[0]?.content?.parts?.[0]?.text;
              success = true;
              break;
            } else if (response.status === 429) {
              await new Promise(r => setTimeout(r, delay));
              delay *= 2;
            } else {
              throw new Error(`API error ${response.status}`);
            }
          } catch (e) {
            if (i === retries - 1) throw e;
            await new Promise(r => setTimeout(r, delay));
            delay *= 2;
          }
        }

        if (success && textResult) {
          const parsedResult = JSON.parse(textResult);
          setActiveData(parsedResult);
          setLogs(prev => [
            { id: Date.now(), name: `AI Live Scan`, type: parsedResult.rockType, date: "Baru saja" },
            ...prev
          ]);
          triggerStatusMessage("AI Mineralogical Scan Selesai.");
        } else {
          throw new Error("Gagal memperoleh respons AI.");
        }

      } catch (err) {
        console.error(err);
        triggerStatusMessage("API offline atau tidak ada kunci. Menggunakan diagnostik cadangan.", true);
        
        // Cadangan lokal jika API Vercel belum dideploy / API Key salah
        const backupPresets = ["granite", "sandstone", "basalt", "schist"];
        const fallbackKey = backupPresets[Math.floor(Math.random() * backupPresets.length)];
        setActiveData(LIVE_PRESETS[fallbackKey]);
        setLogs(prev => [
            { id: Date.now(), name: `Sample #${Math.floor(Math.random() * 800 + 100)}-AI`, type: LIVE_PRESETS[fallbackKey].rockType, date: "Baru saja" },
            ...prev
        ]);
      } finally {
        setIsAnalyzing(false);
      }
    }, 2500);
  };

  const currentDisplayImage = customImage || activeData.imageSrc;
  const mappedBrightness = 0.45 + (light / 100) * 0.75;

  const sidebarBg = isBlackMode ? 'bg-zinc-950' : 'bg-[#2E2A24]/60';
  const innerCardBg = isBlackMode ? 'bg-zinc-900/60' : 'bg-[#2E2A24]/40';
  const pureBg = isBlackMode ? 'bg-black/90' : 'bg-[#1A1815]/95';

  return (
    <div className="flex h-screen overflow-hidden font-sans bg-[#030712] text-slate-100">
      
      {/* SIDEBAR NAVIGASI KIRI */}
      <aside className={`w-20 md:w-64 ${sidebarBg} border-r border-white/5 flex flex-col justify-between shrink-0 z-20`}>
         <div className="overflow-y-auto flex-1 custom-scrollbar">
            <div className="h-16 flex items-center justify-center md:justify-start md:px-6 border-b border-white/5 shrink-0 gap-3">
               <div className="w-8 h-8 rounded-lg flex items-center justify-center text-[#1A1815] shrink-0 bg-[#00f0ff] shadow-[0_0_15px_rgba(0,240,255,0.4)]">
                  <Microscope size={18} className="animate-pulse" />
               </div>
               <span className="hidden md:block font-bold tracking-tight text-white font-mono text-sm uppercase">GEO-LENS v2.5</span>
            </div>
            
            <div className="p-4 space-y-2">
               <div className="text-[10px] font-bold uppercase tracking-widest opacity-40 px-2 hidden md:block mb-2">Navigasi Utama</div>
               <button onClick={onBackToDashboard} className="w-full flex items-center justify-center md:justify-start gap-3 md:px-3 py-2.5 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all">
                  <BookOpen size={18} className="text-[#00f0ff]" />
                  <span className="hidden md:block text-sm font-medium">Info Geologi</span>
               </button>
               <button onClick={onBackToSelection} className="w-full flex items-center justify-center md:justify-start gap-3 md:px-3 py-2.5 rounded-xl opacity-60 hover:bg-white/5 hover:opacity-100 transition-all">
                  <ArrowRight className="rotate-180" size={18} />
                  <span className="hidden md:block text-sm font-medium">Ganti Analisis</span>
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
                  <div className="text-[10px] opacity-40 text-cyan-400">GEO_GRID: LAMPUNG</div>
               </div>
            </div>
         </div>
      </aside>

      {/* AREA UTAMA */}
      <main className="flex-1 flex flex-col min-w-0 relative">
        
         {/* HEADER ALAT */}
         <header className="h-16 border-b border-cyber-border glass-panel z-50 sticky top-0 px-6 py-3 flex justify-between items-center gap-4 bg-black/40 backdrop-blur-md">
            <div className="flex items-center gap-2">
                <span className="text-[10px] bg-cyan-950 text-[#00f0ff] border border-[#00f0ff]/30 px-1.5 py-0.5 rounded tracking-widest font-mono">LIVE_SYSTEM</span>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                <span className="text-[9px] text-emerald-400 font-mono hidden sm:inline">ONLINE</span>
            </div>

            {/* Konfigurasi API Manual */}
            <div className="flex items-center gap-3">
               <div className="flex items-center gap-2 bg-black/60 border border-white/10 rounded-lg px-3 py-1 text-xs">
                  <Lock size={12} className="text-[#00f0ff]" />
                  <input 
                     type="password" 
                     placeholder="Gemini API Key (Opsional)" 
                     value={apiKeyInput}
                     onChange={(e) => setApiKeyInput(e.target.value)}
                     className="bg-transparent text-[#00f0ff] placeholder-slate-600 focus:outline-none w-32 sm:w-48 font-mono text-[11px]"
                  />
                  <button onClick={saveApiKey} title="Simpan API Key di Browser" className="hover:text-cyan-400 text-slate-400 transition-colors">
                     <FileText size={14} />
                  </button>
               </div>
               <div className="text-[9px] text-slate-400 bg-slate-900 border border-slate-800 px-2 py-1 rounded font-mono">
                  <span className="text-cyan-400">MODEL:</span> gemini-2.5-flash
               </div>
            </div>
         </header>

         <div className="flex-1 overflow-y-auto p-6 scroll-smooth custom-scrollbar">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 max-w-7xl mx-auto">
               
               {/* SISI KIRI: INSTRUMEN DAN KONTROL MIKROSKOP */}
               <section className="lg:col-span-3 space-y-5">
                  <div className={`${innerCardBg} border border-white/10 rounded-2xl p-5 space-y-4 relative overflow-hidden backdrop-blur-md`}>
                     <div className="flex justify-between items-center border-b border-white/10 pb-2">
                        <h3 className="font-mono text-xs tracking-wider text-cyan-400 flex items-center gap-2"><Sliders size={14} /> KONTROL LENSA</h3>
                        <span className="text-[9px] text-slate-500 font-mono">SYS_CTRL_A</span>
                     </div>

                     {/* Zoom Controller */}
                     <div className="space-y-2">
                        <label className="text-[10px] text-slate-400 block tracking-wide font-mono uppercase">Zoom Digital Lensa</label>
                        <div className="grid grid-cols-4 gap-1.5">
                           {[1, 2, 4, 8].map((z) => (
                              <button 
                                 key={z}
                                 onClick={() => {
                                    setZoom(z);
                                    triggerStatusMessage(`Pembesaran diatur ke ${z}X.`);
                                 }}
                                 className={`py-1 text-xs font-mono rounded border transition-all ${zoom === z ? 'border-cyan-400 bg-cyan-950/40 text-cyan-400 font-bold' : 'border-white/5 bg-black/20 text-slate-400 hover:border-cyan-400/40 hover:text-white'}`}
                              >
                                 {z}X
                              </button>
                           ))}
                        </div>
                     </div>

                     {/* Aperture Light Simulator */}
                     <div className="space-y-2">
                        <div className="flex justify-between text-xs font-mono">
                           <span className="text-slate-400">INTENSITAS CAHAYA</span>
                           <span className="text-[#00f0ff]">{light}%</span>
                        </div>
                        <input 
                           type="range" 
                           min="10" 
                           max="100" 
                           value={light} 
                           onChange={(e) => setLight(Number(e.target.value))}
                           className="w-full accent-cyan-400 bg-slate-800 h-1 rounded-lg appearance-none cursor-pointer" 
                        />
                     </div>

                     {/* Preset Sayatan Bawaan */}
                     <div className="space-y-2">
                        <label className="text-[10px] text-slate-400 block tracking-wide font-mono uppercase">Sampel Prapemuatan</label>
                        <div className="grid grid-cols-2 gap-2">
                           <button onClick={() => loadPreset('granite')} className={`p-2 rounded border text-left transition-all flex flex-col justify-between h-14 ${selectedPreset === 'granite' && !customImage ? 'border-cyan-400 bg-cyan-950/20' : 'border-white/5 bg-black/40 hover:border-cyan-500/50'}`}>
                              <span className="font-bold text-slate-300 text-[11px]">Granit</span>
                              <span className="text-[8px] text-cyan-400 font-mono">BEKU PLUTONIK</span>
                           </button>
                           <button onClick={() => loadPreset('sandstone')} className={`p-2 rounded border text-left transition-all flex flex-col justify-between h-14 ${selectedPreset === 'sandstone' && !customImage ? 'border-cyan-400 bg-cyan-950/20' : 'border-white/5 bg-black/40 hover:border-cyan-500/50'}`}>
                              <span className="font-bold text-slate-300 text-[11px]">Batu Pasir</span>
                              <span className="text-[8px] text-amber-500 font-mono">SEDIMEN</span>
                           </button>
                           <button onClick={() => loadPreset('basalt')} className={`p-2 rounded border text-left transition-all flex flex-col justify-between h-14 ${selectedPreset === 'basalt' && !customImage ? 'border-cyan-400 bg-cyan-950/20' : 'border-white/5 bg-black/40 hover:border-cyan-500/50'}`}>
                              <span className="font-bold text-slate-300 text-[11px]">Basalt</span>
                              <span className="text-[8px] text-emerald-500 font-mono">VOLKANIK</span>
                           </button>
                           <button onClick={() => loadPreset('schist')} className={`p-2 rounded border text-left transition-all flex flex-col justify-between h-14 ${selectedPreset === 'schist' && !customImage ? 'border-cyan-400 bg-cyan-950/20' : 'border-white/5 bg-black/40 hover:border-cyan-500/50'}`}>
                              <span className="font-bold text-slate-300 text-[11px]">Sekis Mika</span>
                              <span className="text-[8px] text-purple-500 font-mono">METAMORF</span>
                           </button>
                        </div>
                     </div>

                     {/* Upload Sayatan Mandiri */}
                     <div className="pt-2">
                        <label className="text-[10px] text-slate-400 block tracking-wide font-mono uppercase mb-1.5">Unggah Sayatan Mandiri</label>
                        <div className="relative border border-dashed border-cyan-400/30 rounded-lg p-2.5 hover:bg-cyan-500/5 transition-all text-center cursor-pointer">
                           <Upload size={16} className="text-cyan-400 mx-auto mb-1" />
                           <span className="block text-[10px] text-slate-300 font-mono">PILIH GAMBAR</span>
                           <input type="file" accept="image/*" onChange={handleCustomUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                        </div>
                     </div>

                     {/* Toggle Point Counting Grid */}
                     <div className="pt-2">
                        <label className="flex items-center gap-3 cursor-pointer p-2.5 bg-black/40 rounded-lg border border-white/5 hover:border-cyan-400/50 transition-colors">
                           <input type="checkbox" checked={usePointCounting} onChange={(e) => setUsePointCounting(e.target.checked)} className="w-4 h-4 rounded text-[#00f0ff] accent-[#00f0ff] bg-black border-white/20" />
                           <span className="text-[10px] opacity-80 font-mono text-cyan-400 uppercase">Point Counting Grid (8x8)</span>
                        </label>
                     </div>
                  </div>

                  {/* MATRIKS PARAMETER AI ENGINE */}
                  <div className={`${innerCardBg} border border-white/10 rounded-2xl p-5 space-y-4 backdrop-blur-md`}>
                     <div className="flex justify-between items-center border-b border-white/10 pb-2">
                        <h3 className="font-mono text-xs tracking-wider text-cyan-400 flex items-center gap-2"><Cpu size={14} /> AI ENGINE DETECTOR</h3>
                        <span className="text-[9px] text-slate-500 font-mono">CORE_V2</span>
                     </div>

                     <div className="grid grid-cols-2 gap-3 text-xs">
                        <div className="bg-black/30 p-2 rounded border border-slate-800">
                           <span className="text-slate-500 text-[8px] block uppercase font-mono">Confidence</span>
                           <span className="text-cyan-400 font-mono font-bold text-xs">{activeData.confidence}%</span>
                        </div>
                        <div className="bg-black/30 p-2 rounded border border-slate-800">
                           <span className="text-slate-500 text-[8px] block uppercase font-mono">Scan Speed</span>
                           <span className="text-cyan-400 font-mono font-bold text-xs">~1.2s</span>
                        </div>
                        <div className="bg-black/30 p-2 rounded border border-slate-800 col-span-2">
                           <span className="text-slate-500 text-[8px] block uppercase font-mono font-bold">Dynamic Prompt</span>
                           <p className="text-[9px] text-slate-400 italic line-clamp-2">"Identify minerals, rock type, porosity, texture, and possible depositional..."</p>
                        </div>
                     </div>
                  </div>
               </section>

               {/* KANAL TENGAH: LIVE MICROSCOPE VIEWER */}
               <section className="lg:col-span-5 space-y-4">
                  <div className={`${innerCardBg} border border-white/10 rounded-2xl p-4 relative overflow-hidden backdrop-blur-md`}>
                     
                     {/* Informasi Koordinat Layar */}
                     <div className="absolute inset-x-0 top-3 px-3 flex justify-between items-center text-[10px] font-mono text-cyan-400 select-none pointer-events-none z-50">
                        <div className="flex items-center gap-1.5 bg-black/60 px-2 py-0.5 rounded border border-white/5">
                           <span className="h-1.5 w-1.5 rounded-full bg-red-500 animate-pulse"></span>
                           <span>LIVE VIDEO [SYS_01]</span>
                        </div>
                        <div className="bg-black/60 px-2 py-0.5 rounded border border-white/5">X: {coordinates.x} | Y: {coordinates.y}</div>
                     </div>

                     {/* Area Lensa Optik Utama */}
                     <div 
                        onMouseMove={handleMouseMove}
                        className="relative w-full aspect-square rounded-xl overflow-hidden border border-cyan-400/20 bg-black flex items-center justify-center cursor-crosshair shadow-[0_0_50px_rgba(0,0,0,0.8)]"
                     >
                        {/* Lensa Gelas Ring */}
                        <div className="absolute inset-0 border-[20px] border-black/50 rounded-xl z-20 pointer-events-none"></div>

                        {/* Reticle bidik optik */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10 select-none opacity-20">
                           <div className="w-56 h-56 border border-dashed border-cyan-400 rounded-full animate-spin [animation-duration:40s]"></div>
                           <div className="absolute w-72 h-72 border border-cyan-400/20 rounded-full"></div>
                           <div className="absolute h-full w-[0.5px] bg-cyan-400"></div>
                           <div className="absolute w-full h-[0.5px] bg-cyan-400"></div>
                        </div>

                        {/* Garis pemindai sinar laser AI saat bekerja */}
                        {isAnalyzing && (
                           <div className="absolute inset-x-0 h-12 bg-gradient-to-b from-transparent via-cyan-400/40 to-transparent top-0 animate-bounce z-40 pointer-events-none"></div>
                        )}

                        {/* Layar loading scanning */}
                        {isAnalyzing && (
                           <div className="absolute inset-0 bg-black/85 z-50 flex flex-col items-center justify-center gap-4">
                              <RefreshCw size={36} className="text-cyan-400 animate-spin" />
                              <div className="text-center font-mono text-cyan-400 text-xs uppercase tracking-widest animate-pulse">Scanning Minerals via Gemini AI...</div>
                           </div>
                        )}

                        {/* Element Display Utama (Kamera Video) - Selalu render agar stream tetap aktif */}
                        <video 
                           ref={videoRef} 
                           id="mainMicroscopeVideo"
                           autoPlay 
                           playsInline 
                           muted={true}
                           className={`absolute inset-0 w-full h-full object-cover transition-transform ${isCameraActive ? 'opacity-100 z-0' : 'opacity-0 -z-10 pointer-events-none'}`} 
                           style={{ 
                              transform: `scale(${zoom})`, 
                              filter: `brightness(${mappedBrightness})` 
                           }}
                        />

                        {/* Element Display Utama (Gambar Statis) */}
                        <img 
                           id="mainMicroscopeFrame"
                           src={currentDisplayImage} 
                           alt="Thin Section Frame"
                           className={`absolute inset-0 w-full h-full object-cover transition-all ${!isCameraActive ? 'opacity-100 z-0' : 'opacity-0 -z-10 pointer-events-none'}`}
                           style={{ 
                              transform: `scale(${zoom})`, 
                              filter: `brightness(${mappedBrightness})` 
                           }}
                           crossOrigin="anonymous"
                        />

                        {/* Grid Interaktif Point Counting (Z-Index Super Tinggi) */}
                        {usePointCounting && <InteractiveGrid gridData={gridData} selectedCell={selectedCell} onSelect={setSelectedCell} ringClass="ring-[#00f0ff]" />}

                        {/* Kanvas Overlay Segmentasi AI */}
                        <canvas 
                           ref={canvasRef} 
                           className={`absolute inset-0 w-full h-full object-cover z-20 pointer-events-none transition-opacity duration-300 ${isOverlayActive ? 'opacity-100' : 'opacity-0'}`} 
                        />
                     </div>

                     {/* Info Box untuk Grid yang dipilih */}
                     {usePointCounting && selectedCell !== null && gridData.length > 0 && (
                         <div className="mt-3 p-3 rounded-xl border border-[#00f0ff]/50 bg-[#00f0ff]/10 flex items-center justify-between animate-in slide-in-from-top-2">
                             <div className="flex items-center gap-3">
                                 <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(255,255,255,0.2)]" style={{backgroundColor: gridData.find(c => c.index === selectedCell)?.colorHex}}>
                                     <MousePointer2 size={14} className="text-white drop-shadow-md" />
                                 </div>
                                 <div>
                                     <div className="text-[9px] font-mono text-cyan-400 opacity-80 mb-0.5 uppercase tracking-widest">Titik #{selectedCell + 1} / 64</div>
                                     <div className="text-white font-bold text-xs">{gridData.find(c => c.index === selectedCell)?.mineral || 'Mineral Tidak Diketahui'}</div>
                                 </div>
                             </div>
                             <button onClick={() => setSelectedCell(null)} className="opacity-50 hover:opacity-100 hover:text-red-400 transition-colors bg-black/20 p-1.5 rounded-full">
                                 <X size={14} />
                             </button>
                         </div>
                     )}

                     {/* Toolbar Kontrol Bawah Mikroskop */}
                     <div className="mt-4 flex justify-between items-center gap-2">
                        <div className="flex items-center gap-2">
                           <button 
                              onClick={toggleCamera} 
                              className={`px-3 py-1.5 rounded-lg border text-[10px] font-mono transition-all flex items-center gap-1.5 ${isCameraActive ? 'bg-cyan-950 border-cyan-400 text-cyan-400 shadow-[0_0_10px_rgba(0,240,255,0.2)]' : 'bg-black/40 border-white/5 text-slate-300 hover:border-cyan-400/50'}`}
                           >
                              <Video size={12} /> {isCameraActive ? 'PUTUS OPTICS' : 'CONNECT CAMERA'}
                           </button>
                           <button 
                              onClick={() => setIsOverlayActive(!isOverlayActive)} 
                              className={`px-3 py-1.5 rounded-lg border text-[10px] font-mono transition-all flex items-center gap-1.5 ${isOverlayActive ? 'bg-cyan-950 border-cyan-400 text-cyan-400 shadow-[0_0_10px_rgba(0,240,255,0.2)]' : 'bg-black/40 border-white/5 text-slate-300 hover:border-cyan-400/50'}`}
                           >
                              <Layers size={12} /> SEGMENT MAP
                           </button>
                        </div>

                        <button 
                           onClick={startAIAnalysis}
                           disabled={isAnalyzing}
                           className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-mono font-black text-xs rounded-lg shadow-[0_0_15px_rgba(0,240,255,0.25)] flex items-center gap-1.5 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                           <FlaskConical size={14} /> ANALYZE SAMPLE
                        </button>
                     </div>
                  </div>

                  {/* Kalibrasi Status Bar */}
                  <div className={`${innerCardBg} border border-white/10 rounded-2xl p-4 flex items-center justify-between backdrop-blur-md`}>
                     <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-cyan-950/60 border border-cyan-400/30 flex items-center justify-center">
                           <Activity className="text-cyan-400 animate-pulse" size={16} />
                        </div>
                        <div>
                           <div className="text-[9px] text-slate-500 font-mono uppercase">Calibration Optics</div>
                           <div className="text-xs text-slate-300 font-mono">POLARIZATION: CPL | FLUID: AIR</div>
                        </div>
                     </div>
                     <div className="text-right">
                        <div className="text-[9px] text-slate-500 font-mono">INTEGRITY</div>
                        <div className="text-xs text-emerald-400 font-mono font-bold">100% NOMINAL</div>
                     </div>
                  </div>
               </section>

               {/* SISI KANAN: STATUS REPORT AI & SPEKTRUM MINERAL */}
               <section className="lg:col-span-4 space-y-4">
                  
                  {/* AI Report Card */}
                  <div className={`${innerCardBg} border border-cyan-400/20 shadow-[0_0_20px_rgba(0,240,255,0.05)] rounded-2xl p-5 space-y-4 relative overflow-hidden backdrop-blur-md`}>
                     <div className="absolute -top-12 -right-12 w-28 h-28 bg-cyan-500/5 rounded-full blur-xl border border-cyan-400/10"></div>
                     
                     <div className="flex justify-between items-center border-b border-white/10 pb-2">
                        <h3 className="font-mono text-xs tracking-wider text-cyan-400 flex items-center gap-2"><CheckCircle2 size={14} /> AI DIAGNOSIS</h3>
                        <span className="text-[9px] text-slate-500 font-mono">SEC_THIN_891</span>
                     </div>

                     <div className="grid grid-cols-2 gap-3">
                        <div className="bg-black/50 border border-slate-800 p-2 rounded">
                           <span className="text-[8px] text-slate-500 block uppercase font-mono">SPESIMEN BATUAN</span>
                           <span className="text-white font-bold text-xs tracking-wide uppercase">{activeData.rockType}</span>
                        </div>
                        <div className="bg-black/50 border border-slate-800 p-2 rounded">
                           <span className="text-[8px] text-slate-500 block uppercase font-mono">AKURASI AI</span>
                           <div className="flex items-center gap-1">
                              <span className="text-emerald-400 font-mono font-bold text-xs">{activeData.confidence}%</span>
                              <ShieldCheck size={12} className="text-emerald-400" />
                           </div>
                        </div>
                     </div>

                     {/* Deep Geological Metadata */}
                     <div className="space-y-2 text-xs font-mono">
                        <div className="flex justify-between items-center bg-black/30 p-2 rounded border border-slate-800/50">
                           <span className="text-slate-400 text-[10px]">Reservoir Type:</span>
                           <span className="font-bold text-slate-200 text-[11px]">{activeData.reservoirType}</span>
                        </div>
                        <div className="flex justify-between items-center bg-black/30 p-2 rounded border border-slate-800/50">
                           <span className="text-slate-400 text-[10px]">Porosity (Ø):</span>
                           <span className="font-bold text-cyan-400 text-[11px]">{activeData.porosity}%</span>
                        </div>
                        <div className="flex justify-between items-center bg-black/30 p-2 rounded border border-slate-800/50">
                           <span className="text-slate-400 text-[10px]">Formasi Geologi:</span>
                           <span className="font-bold text-slate-200 text-[11px]">{activeData.formationName}</span>
                        </div>
                        <div className="flex justify-between items-center bg-black/30 p-2 rounded border border-slate-800/50">
                           <span className="text-slate-400 text-[10px]">Kedalaman Estimasi:</span>
                           <span className="font-bold text-slate-200 text-[11px]">{activeData.estimatedDepth}</span>
                        </div>

                        <div className="space-y-1 pt-1">
                           <span className="text-slate-400 text-[10px] block font-bold">Struktur Tekstur & Matriks:</span>
                           <p className="text-[10px] text-slate-300 leading-relaxed bg-black/40 p-2 rounded border border-slate-800">{activeData.texture}</p>
                        </div>

                        <div className="space-y-1 pt-1">
                           <span className="text-slate-400 text-[10px] block font-bold">Interpretasi Deposisi Bumi:</span>
                           <p className="text-[10px] text-slate-300 leading-relaxed bg-black/40 p-2 rounded border border-slate-800">{activeData.interpretation}</p>
                        </div>
                     </div>
                  </div>

                  {/* Mineral Spectrum Donut Chart */}
                  <div className={`${innerCardBg} border border-white/10 rounded-2xl p-5 space-y-4 backdrop-blur-md`}>
                     <div className="flex justify-between items-center border-b border-white/10 pb-2">
                        <h3 className="font-mono text-xs tracking-wider text-cyan-400 flex items-center gap-2"><Grid size={14} /> SPEKTRUM MINERAL %</h3>
                        <span className="text-[9px] text-slate-500 font-mono">SPEC_PCT</span>
                     </div>

                     <div className="flex flex-col sm:flex-row items-center gap-4 justify-around">
                        <div className="relative w-24 h-24 flex items-center justify-center">
                           <canvas ref={pieChartRef} width="100" height="100" className="z-10" />
                           <div className="absolute inset-0 border border-cyan-400/10 rounded-full animate-pulse"></div>
                        </div>

                        {/* Chart Legend */}
                        <div className="space-y-1.5 flex-1 w-full text-[10px] font-mono">
                           {activeData.minerals.map((m, idx) => (
                              <div key={idx} className="flex justify-between items-center bg-black/20 px-2 py-0.5 rounded border border-slate-800/40">
                                 <div className="flex items-center gap-1.5 truncate">
                                    <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: m.color }} />
                                    <span className="text-slate-300 truncate">{m.name}</span>
                                 </div>
                                 <span className="text-cyan-400 font-bold">{m.percentage}%</span>
                              </div>
                           ))}
                        </div>
                     </div>
                  </div>

                  {/* Log Riwayat Analisa Terbaru */}
                  <div className={`${innerCardBg} border border-white/10 rounded-2xl p-5 space-y-3 backdrop-blur-md`}>
                     <h4 className="font-mono text-xs tracking-wider text-slate-400 uppercase">RIWAYAT SCAN SENSING</h4>
                     <div className="space-y-2 max-h-24 overflow-y-auto pr-1 custom-scrollbar">
                        {logs.map((log) => (
                           <div key={log.id} className="flex items-center justify-between p-2 bg-black/40 border border-slate-800 rounded hover:border-cyan-400/30 transition-colors">
                              <div>
                                 <div className="text-[10px] font-mono text-white font-bold">{log.name}</div>
                                 <div className="text-[8px] text-slate-500 font-mono">{log.date}</div>
                              </div>
                              <span className="text-[9px] bg-slate-900 border border-slate-800 px-1.5 py-0.5 rounded text-cyan-400 font-mono">{log.type}</span>
                           </div>
                        ))}
                     </div>
                  </div>

               </section>

            </div>
         </div>
      </main>

      {/* Floating Status Message Notification */}
      {statusMsg && (
         <div className={`fixed bottom-6 left-6 z-[999] px-4 py-3 rounded-xl border text-xs font-mono shadow-xl flex items-center gap-2 transition-all transform animate-bounce ${statusMsg.isWarning ? 'bg-red-950 border-red-500 text-red-400' : 'bg-[#0a0f1e] border-cyan-400 text-cyan-400'}`}>
            <Info size={14} /> <span>{statusMsg.text}</span>
         </div>
      )}
    </div>
  );
}
