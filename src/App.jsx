import React, { useState, useRef, useEffect } from 'react';
import { 
  Microscope, Upload, Scan, FlaskConical, Layers, Sun, Moon, 
  CheckCircle2, Grid, XCircle, MousePointer2, ZoomIn, BookOpen, 
  Activity, MapPin, Globe2, Fingerprint, Clock, Video, Film, PlayCircle,
  FileText, ListChecks, Eye, ChevronDown, ChevronUp, Info, AlignLeft, Ban,
  User, Lock, Mail, Facebook, Github, Linkedin, Chrome, AlertCircle, CheckCircle, ArrowRight,
  LogOut, Mountain, Gem, ChevronLeft, Map, MessageSquare, Send, X, Sparkles, Bot, Hexagon, LayoutDashboard, WifiOff,
  Search, Compass, Flame, Heart, Target, Zap, ShieldCheck
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

const GEMINI_API_ENDPOINT = "/api/gemini";

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

// ============ HELPER FUNCTIONS ============

const buildCompactPrompt = (modeTitle) => {
  return `Ahli geologi. Analisis sampel untuk: ${modeTitle}. 
Identifikasi batuan/mineral utama dari tekstur, warna, dan visual. 
Maksimal 5 mineral. Jawab JSON SAJA tanpa preamble.`;
};

const parsePercentage = (pctStr) => {
  return parseFloat(String(pctStr).replace(/[^0-9.]/g, '')) || 0;
};

const distributeGridCells = (minerals, totalCells = 64) => {
  const tempGrid = [];
  const totalPct = minerals.reduce((sum, m) => sum + parsePercentage(m.percentage), 0) || 100;
  
  let allocatedMinerals = [];
  let totalAssigned = 0;

  minerals.forEach(m => {
    const numericPct = parsePercentage(m.percentage);
    const count = Math.floor((numericPct / totalPct) * totalCells);
    totalAssigned += count;
    for (let i = 0; i < count; i++) {
      allocatedMinerals.push(m);
    }
  });

  let leftovers = totalCells - totalAssigned;
  if (leftovers > 0) {
    const sorted = [...minerals].sort((a, b) => {
      const remainA = ((parsePercentage(a.percentage) / totalPct) * totalCells) % 1;
      const remainB = ((parsePercentage(b.percentage) / totalPct) * totalCells) % 1;
      return remainB - remainA;
    });
    
    for (let i = 0; i < leftovers; i++) {
      allocatedMinerals.push(sorted[i % sorted.length]);
    }
  }

  for (let i = allocatedMinerals.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [allocatedMinerals[i], allocatedMinerals[j]] = [allocatedMinerals[j], allocatedMinerals[i]];
  }

  for (let i = 0; i < totalCells; i++) {
    const min = allocatedMinerals[i] || { name: 'Unknown', description: 'Komponen Utama' };
    tempGrid.push({
      index: i,
      mineral: min.name,
      colorHex: getMineralColor(min.name),
      feature: min.description || "Komponen Utama Batuan"
    });
  }
  
  return tempGrid;
};

const fetchWithRetry = async (url, options, retries = 3, delay = 1000) => {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      if ((response.status === 429 || response.status === 503) && retries > 0) {
        await new Promise(resolve => setTimeout(resolve, delay));
        return fetchWithRetry(url, options, retries - 1, delay * 2);
      }
      const errorDetail = await response.json().catch(() => ({}));
      throw new Error(errorDetail?.error?.message || `HTTP ${response.status}`);
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

const parseJSONResponse = (textContent) => {
  if (!textContent) throw new Error("Respons kosong dari AI");
  const jsonMatch = textContent.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error("Format JSON tidak valid");
  const parsed = JSON.parse(jsonMatch[0]);
  
  if (!parsed.rockName || !parsed.classificationType || !Array.isArray(parsed.minerals)) {
    throw new Error("Struktur JSON tidak sesuai harapan");
  }
  
  const limitedMinerals = parsed.minerals.slice(0, 5).map(m => ({
    name: String(m.name || 'Unknown').substring(0, 50),
    percentage: String(m.percentage || '0%').substring(0, 10),
    description: String(m.description || '').substring(0, 100)
  }));
  
  return {
    rockName: String(parsed.rockName).substring(0, 100),
    classificationType: String(parsed.classificationType).substring(0, 100),
    description: String(parsed.description || '').substring(0, 300),
    minerals: limitedMinerals
  };
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
      {screen === 'app' && <AmbasaltMainApp mode={appMode} onBackToSelection={handleGoToSelection} onBackToDashboard={handleBackToDashboard} user={user} isBlackMode={isBlackMode} />}
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

      const animate = () => {
          animationFrameId = requestAnimationFrame(animate);
          const time = clock.getElapsedTime();

          globe.rotation.z += 0.0003;
          
          crystals.forEach((crystal) => {
              crystal.rotation.x += crystal.userData.rx;
              crystal.rotation.y += crystal.userData.ry;
              crystal.position.y += Math.sin(time + crystal.userData.floatOffset) * 0.0008;
          });

          particlesMesh.rotation.y += 0.00005;
          
          terrainGroup.children[0].rotation.z += 0.00002;

          renderer.render(scene, camera);
      };
      animate();
    };

    const loadScript = (src) => {
      return new Promise((resolve) => {
        const script = document.createElement('script');
        script.src = src;
        script.async = true;
        script.onload = () => resolve();
        document.body.appendChild(script);
      });
    };

    loadScript('https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js').then(() => {
      initThreeJS();
    });

    const handleMouseMove = (event) => {
      mouseX = (event.clientX / window.innerWidth) * 2 - 1;
      mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isBlackMode]);

  const createRipple = (e) => {
    const button = e.currentTarget;
    const circle = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;
    circle.style.width = circle.style.height = diameter + 'px';
    circle.style.left = (e.clientX - button.offsetLeft - radius) + 'px';
    circle.style.top = (e.clientY - button.offsetTop - radius) + 'px';
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

      <div id="canvas-container" ref={canvasRef}></div>

      <div id="ui-container" className="text-[#F5F1E8]">
          
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
                  <Chrome size={18} /> Continue with Google
              </button>

              <div className="text-center mt-6">
                  <p className="text-xs text-[#F5F1E8]/50">Don't have account? <button onClick={(e) => toggleView('register', e)} className="text-[#C9A66B] hover:text-[#D4AF37] font-semibold hover:underline transition-colors">Sign Up</button></p>
              </div>
          </div>

          <div id="register-card" className={`glass-card w-full max-w-[420px] p-8 md:p-10 mx-auto ${view !== 'register' ? 'hide-view' : ''} ${loadedCards.register ? 'loaded' : ''}`}>
              <div className="text-center mb-8">
                  <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-white/5 border border-white/10 mb-4 logo-glow">
                      <Mountain size={36} className="text-[#C9A66B] fill-[#C9A66B]" />
                  </div>
                  <h1 className="text-2xl md:text-3xl font-bold tracking-wide text-white mb-2">Create Account</h1>
                  <p className="text-xs md:text-sm text-[#F5F1E8]/70 font-light">Join Ambasalt Community</p>
              </div>

              <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                      <label htmlFor="name" className="block text-xs font-medium text-[#F5F1E8]/80 mb-1.5 ml-1">Full Name</label>
                      <input type="text" name="fullname" id="name" required placeholder="Your name" 
                          className="custom-input w-full rounded-xl py-3 px-4 text-sm" />
                  </div>

                  <div>
                      <label htmlFor="reg-email" className="block text-xs font-medium text-[#F5F1E8]/80 mb-1.5 ml-1">Email Address</label>
                      <input type="email" name="email" id="reg-email" required placeholder="name@email.com" 
                          className="custom-input w-full rounded-xl py-3 px-4 text-sm" />
                  </div>

                  <div>
                      <label htmlFor="reg-password" className="block text-xs font-medium text-[#F5F1E8]/80 mb-1.5 ml-1">Password</label>
                      <input type={showRegPassword ? "text" : "password"} name="password" id="reg-password" required placeholder="••••••••" 
                          className="custom-input w-full rounded-xl py-3 px-4 text-sm" />
                  </div>

                  <button type="submit" className={`btn-gradient w-full rounded-xl py-3.5 mt-4 font-semibold text-sm flex items-center justify-center gap-2 relative ${isRegLoading ? 'btn-loading' : ''}`}>
                      <span className="btn-text">Create Account</span>
                      <ArrowRight size={16} strokeWidth={3} className="btn-text" />
                      <div className="loader"></div>
                  </button>
              </form>

              <div className="text-center mt-6">
                  <p className="text-xs text-[#F5F1E8]/50">Already have account? <button onClick={(e) => toggleView('login', e)} className="text-[#C9A66B] hover:text-[#D4AF37] font-semibold hover:underline transition-colors">Sign In</button></p>
              </div>
          </div>
      </div>
    </div>
  );
}

// --- 2. DASHBOARD SCREEN (LAYER 2) ---
function DashboardScreen({ onNavigateToSelection, onLogout, user, isBlackMode, toggleTheme }) {
  const cardBg = isBlackMode ? 'bg-zinc-900/80' : 'bg-[#2E2A24]/40';
  const innerCardBg = isBlackMode ? 'bg-zinc-900' : 'bg-[#2E2A24]/60';

  const cards = [
    {
      id: 'thin_section',
      icon: <Microscope size={32} />,
      title: 'Thin Section Analysis',
      desc: 'Analisis sayatan tipis batuan beku dan sedimen menggunakan optik polarisasi',
      color: '#C9A66B'
    },
    {
      id: 'rock',
      icon: <Mountain size={32} />,
      title: 'Hand Specimen ID',
      desc: 'Identifikasi specimen batuan tangan dengan analisis makroskopis',
      color: '#3b82f6'
    },
    {
      id: 'mineral',
      icon: <Gem size={32} />,
      title: 'Mineral Specimen',
      desc: 'Identifikasi mineral dan kristal dengan sifat optis dan fisik',
      color: '#10b981'
    }
  ];

  return (
    <div className={`h-screen w-full flex flex-col ${isBlackMode ? 'bg-black' : 'bg-[#1A1815]'} transition-colors`}>
       <nav className="h-16 border-b border-white/5 bg-black/20 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-10">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-lg bg-[#C9A66B] flex items-center justify-center text-[#1A1815] font-bold text-lg">A</div>
             <h1 className="text-xl font-bold">Ambasalt</h1>
          </div>
          <div className="flex items-center gap-4">
             <button onClick={toggleTheme} className="opacity-60 hover:opacity-100 transition-opacity">
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
             <h1 className="text-4xl md:text-5xl font-bold tracking-tight">Selamat Datang di Ambasalt</h1>
             <p className="opacity-60 text-lg max-w-2xl mx-auto">Platform analisis sampel geologi berbasis AI dengan akurasi tinggi. Pilih metode analisis di bawah untuk memulai.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full pb-10">
             {cards.map((card) => (
                <div 
                  key={card.id}
                  onClick={onNavigateToSelection}
                  className={`group relative ${cardBg} backdrop-blur-sm border border-white/10 rounded-3xl p-8 cursor-pointer overflow-hidden transition-all duration-300 hover:bg-black/40 hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.4)]`}
                >
                   <div className="absolute top-0 right-0 w-32 h-32 opacity-5 rounded-bl-[100px] -mr-6 -mt-6 transition-transform group-hover:scale-110" style={{backgroundColor: card.color}}></div>
                   
                   <div className={`w-16 h-16 rounded-2xl ${innerCardBg} border border-white/10 flex items-center justify-center mb-6 transition-transform duration-300 shadow-lg`} style={{color: card.color}}>
                      {card.icon}
                   </div>
                   
                   <h3 className="text-xl font-bold mb-3 transition-colors">{card.title}</h3>
                   <p className="opacity-60 text-sm leading-relaxed mb-8">{card.desc}</p>
                   
                   <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest opacity-50 group-hover:opacity-100 transition-colors" style={{color: card.color}}>
                      Pelajari <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                   </div>
                </div>
             ))}
          </div>
       </div>
    </div>
  );
}

// --- 3. SELECTION SCREEN (LAYER 3) ---
function SelectionScreen({ onSelect, onBack, onLogout, user, isBlackMode, toggleTheme }) {
  const cardBg = isBlackMode ? 'bg-zinc-900/80' : 'bg-[#2E2A24]/40';
  const innerCardBg = isBlackMode ? 'bg-zinc-900' : 'bg-[#2E2A24]/60';

  const cards = [
    {
      id: 'thin_section',
      icon: <Microscope size={32} />,
      title: 'Thin Section Analysis',
      desc: 'Analisis sayatan tipis batuan menggunakan mikroskop optik polarisasi',
      color: '#C9A66B'
    },
    {
      id: 'rock',
      icon: <Mountain size={32} />,
      title: 'Hand Specimen Identification',
      desc: 'Identifikasi specimen batuan tangan dengan metode makroskopis',
      color: '#3b82f6'
    },
    {
      id: 'mineral',
      icon: <Gem size={32} />,
      title: 'Mineral Specimen Analysis',
      desc: 'Analisis mineral dengan sifat optik dan karakteristik fisik',
      color: '#10b981'
    }
  ];

  return (
    <div className={`h-screen w-full flex flex-col ${isBlackMode ? 'bg-black' : 'bg-[#1A1815]'} transition-colors`}>
       <nav className="h-16 border-b border-white/5 bg-black/20 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-10">
          <button onClick={onBack} className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 hover:bg-white/10 opacity-70 hover:opacity-100 transition-all text-xs font-bold uppercase tracking-wider">
             <ChevronLeft size={14} /> <span className="hidden sm:block">Kembali</span>
          </button>
          <div className="flex items-center gap-4">
             <button onClick={toggleTheme} className="opacity-60 hover:opacity-100 transition-opacity">
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

// --- 4. INTERACTIVE GRID COMPONENT ---
function InteractiveGrid({ gridData, selectedCell, onSelect }) {
  if (!gridData || gridData.length === 0) return null;
  return (
    <div className="absolute inset-0 grid grid-cols-8 grid-rows-8 pointer-events-auto z-20">
      {gridData.map((cell) => (
         <div
           key={cell.index}
           onClick={() => onSelect(cell.index)}
           className={`border-[0.5px] border-white/15 hover:bg-white/20 cursor-pointer transition-all ${selectedCell === cell.index ? 'ring-2 ring-[#C9A66B] z-30' : ''}`}
           style={{ backgroundColor: selectedCell === cell.index ? cell.colorHex : 'transparent' }}
         />
      ))}
    </div>
  );
}

// --- 5. MAIN APP COMPONENT ---
function AmbasaltMainApp({ mode, onBackToSelection, onBackToDashboard, user, isBlackMode }) {
  const isThinSection = mode === 'thin_section';

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

        const mimeType = pplImage.split(';')[0].split(':')[1];
        const base64Data = pplImage.split(',')[1];

        const compactPrompt = buildCompactPrompt(config.title);

        const response = await fetchWithRetry(GEMINI_API_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [{
              role: "user",
              parts: [
                { text: compactPrompt },
                { inlineData: { mimeType: mimeType, data: base64Data } }
              ]
            }],
            generationConfig: {
              responseMimeType: "application/json",
              maxOutputTokens: 300
            }
          })
        });

        const data = await response.json();
        const textContent = data.candidates?.[0]?.content?.parts?.[0]?.text;
        
        if (textContent) {
          const apiResult = parseJSONResponse(textContent);

          if (mode === 'thin_section' && apiResult.minerals && apiResult.minerals.length > 0) {
            const gridResult = distributeGridCells(apiResult.minerals);
            setGridData(gridResult);
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
            
            <div className="lg:col-span-6 space-y-6">
              <div className={`${innerCardBg} border border-white/10 rounded-2xl p-1 shadow-xl transition-colors`}>
                <div className={`${pureBg} rounded-xl p-6 relative overflow-hidden transition-colors`}>
                  
                  <div className="grid grid-cols-2 gap-4">
                    {analysisMode === 'image' ? (
                      <>
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

                        {isThinSection && (
                          <div className="relative group">
                            <div className="relative border-2 border-dashed border-[#F5F1E8]/20 bg-black/30 hover:bg-black/50 hover:border-[#C9A66B] transition-all flex items-center justify-center overflow-hidden rounded-full aspect-square shadow-[0_0_40px_rgba(0,0,0,0.5)_inset]">
                              {xplImage ? (
                                <img src={xplImage} className="absolute inset-0 w-full h-full object-cover transition-transform" style={{transform: `scale(1.5) rotate(${stageRotation}deg)`}} />
                              ) : (
                                <div className="text-center opacity-50 p-4">
                                  <Moon className="mx-auto mb-2 opacity-50 text-[#5C6B4F]" />
                                  <span className="text-[10px] font-bold uppercase tracking-widest block">Upload XPL</span>
                                </div>
                              )}
                              <input type="file" accept="image/*" onChange={(e) => handleFileUpload(e, 'xpl')} className="absolute inset-0 opacity-0 cursor-pointer" />
                            </div>
                            <div className="absolute bottom-[-20px] left-0 right-0 text-center text-[9px] opacity-40 font-mono pointer-events-none z-0">NICOL SILANG (XPL)</div>
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="col-span-2">
                        <div className="relative border-2 border-dashed border-[#F5F1E8]/20 bg-black/30 hover:bg-black/50 hover:border-[#C9A66B] transition-all flex items-center justify-center overflow-hidden rounded-xl aspect-video">
                          {videoUrl ? (
                            <video src={videoUrl} controls className="absolute inset-0 w-full h-full object-cover" />
                          ) : (
                            <div className="text-center opacity-50 p-4">
                              <Film className="mx-auto mb-2 opacity-50" />
                              <span className="text-[10px] font-bold uppercase tracking-widest block">Upload Video</span>
                            </div>
                          )}
                          <input type="file" accept="video/*" onChange={(e) => handleFileUpload(e, 'video')} className="absolute inset-0 opacity-0 cursor-pointer" />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-8 pt-6 border-t border-white/10">
                    {isThinSection && analysisMode === 'image' && (
                      <div className="mb-6 space-y-4">
                        
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
