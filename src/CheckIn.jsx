import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./supabase";
import Swal from 'sweetalert2';

// 👑 Component โลโก้มงกุฎทอง (Premium Gold Crown SVG) - แบบเดียวกับหน้า Dashboard
const CrownLogo = ({ className = "w-12 h-12" }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="gold-grad" x1="0" y1="100" x2="100" y2="0">
        <stop offset="0%" stopColor="#D97706" /><stop offset="20%" stopColor="#FDE047" /><stop offset="50%" stopColor="#B45309" /><stop offset="80%" stopColor="#FEF08A" /><stop offset="100%" stopColor="#FFFBEB" />
      </linearGradient>
      <linearGradient id="gold-base" x1="0" y1="0" x2="100" y2="100">
        <stop offset="0%" stopColor="#B45309" /><stop offset="50%" stopColor="#FDE047" /><stop offset="100%" stopColor="#D97706" />
      </linearGradient>
      <filter id="glow-gold" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#D97706" floodOpacity="0.3" />
      </filter>
    </defs>
    <g filter="url(#glow-gold)">
      <path d="M 15 80 Q 50 85 85 80 L 80 65 Q 50 70 20 65 Z" fill="url(#gold-base)" />
      <path d="M 20 65 L 10 30 L 30 45 L 50 15 L 70 45 L 90 30 L 80 65 Q 50 70 20 65 Z" fill="url(#gold-grad)" stroke="#FEF08A" strokeWidth="1" />
      <circle cx="10" cy="30" r="4" fill="#FFFBEB" /><circle cx="30" cy="45" r="3" fill="#FFFBEB" /><circle cx="50" cy="15" r="5" fill="#FFFBEB" /><circle cx="70" cy="45" r="3" fill="#FFFBEB" /><circle cx="90" cy="30" r="4" fill="#FFFBEB" />
    </g>
  </svg>
);

const translations = {
  TH: {
    menuDash: "🏠 กลับหน้าหลัก", menuCheck: "⏰ ลงเวลาเข้า-ออก", menuLogout: "ออกจากระบบ",
    appName: "Pancake Lovely Enrichment HR", title: "บันทึกเวลาทำงาน", subtitle: "กรุณาถ่ายภาพเซลฟี่เพื่อยืนยันตัวตนในพื้นที่",
    statusScanning: "กำลังสแกนพื้นที่...", errNoMap: "⚠️ ยังไม่ได้ตั้งค่าแผนที่สาขา", errGpsWeak: "⚠️ สัญญาณ GPS อ่อน",
    errGpsMove: "ม. กรุณาขยับหาสัญญาณ", successLocation: "✅ คุณอยู่ในพื้นที่:", errOutZone: "❌ คุณอยู่นอกเขตพื้นที่ทำงาน",
    errNoGps: "❌ ไม่สามารถเข้าถึง GPS ได้", distLabel: "ระยะห่างจากจุดศูนย์กลาง:", unitMeter: "เมตร",
    btnClockIn: "🌞 ลงเวลา เข้างาน", btnClockOut: "🌙 ลงเวลา ออกงาน", btnSnap: "📸 ถ่ายภาพยืนยัน",
    btnSaving: "⏳ กำลังบันทึกข้อมูล...", btnConfirmIn: "🚀 ยืนยัน ลงเวลาเข้างาน", btnConfirmOut: "🚀 ยืนยัน ลงเวลาออกงาน",
    btnRetake: "🔄 ถ่ายใหม่อีกครั้ง", btnCancel: "❌ ยกเลิก", alertCheckedIn: "⚠️ วันนี้คุณได้บันทึกเวลาเข้างานไปแล้ว",
    alertCheckedOut: "⚠️ วันนี้คุณได้บันทึกเวลาออกงานไปแล้ว", alertSuccess: "🎉 บันทึกเวลาสำเร็จ!", roleAdmin: "ผู้ดูแลระบบ",
    roleStaff: "พนักงาน", statusIn: "เข้างานแล้ว:", statusOut: "ออกงานแล้ว:", errorPrefix: "เกิดข้อผิดพลาด: "
  },
  EN: {
    menuDash: "🏠 Back to Dashboard", menuCheck: "⏰ Timestamp", menuLogout: "Logout",
    appName: "Pancake Lovely Enrichment HR", title: "Attendance Recording", subtitle: "Please take a selfie to verify your location.",
    statusScanning: "Scanning...", errNoMap: "⚠️ No map setup.", errGpsWeak: "⚠️ Weak GPS",
    errGpsMove: "m. Please move.", successLocation: "✅ Work Zone:", errOutZone: "❌ Out of Zone",
    errNoGps: "❌ GPS Access Denied", distLabel: "Distance:", unitMeter: "m.",
    btnClockIn: "🌞 Clock In", btnClockOut: "🌙 Clock Out", btnSnap: "📸 Capture",
    btnSaving: "⏳ Saving...", btnConfirmIn: "🚀 Confirm In", btnConfirmOut: "🚀 Confirm Out",
    btnRetake: "🔄 Retake", btnCancel: "❌ Cancel", alertCheckedIn: "⚠️ Already clocked in.",
    alertCheckedOut: "⚠️ Already clocked out.", alertSuccess: "🎉 Recorded!", roleAdmin: "Admin",
    roleStaff: "Staff", statusIn: "In at:", statusOut: "Out at:", errorPrefix: "Error: "
  }
};

export default function CheckIn() {
  const [user] = useState(JSON.parse(localStorage.getItem("titan_user")));
  const navigate = useNavigate();
  const [lang, setLang] = useState(localStorage.getItem("titan_lang") || "TH");
  const t = translations[lang];
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [location, setLocation] = useState(null);
  const [statusMsg, setStatusMsg] = useState(t.statusScanning);
  const [isInside, setIsInside] = useState(false);
  const [distance, setDistance] = useState(null);
  const [nearestBranch, setNearestBranch] = useState(null);
  const [hasCheckedIn, setHasCheckedIn] = useState(false);
  const [hasCheckedOut, setHasCheckedOut] = useState(false);
  const [checkInTime, setCheckInTime] = useState(null);
  const [checkOutTime, setCheckOutTime] = useState(null);
  const [timestampType, setTimestampType] = useState(null); 
  const [imageSrc, setImageSrc] = useState(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const stopCamera = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  }, []);

  const addNotificationToBell = (title, message) => {
    const savedNotifs = localStorage.getItem("titan_notifications");
    const currentNotifs = savedNotifs ? JSON.parse(savedNotifs) : [];
    const newNotif = { id: Date.now(), title, message, isRead: false, time: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) + ' น.' };
    localStorage.setItem("titan_notifications", JSON.stringify([newNotif, ...currentNotifs]));
  };

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3;
    const φ1 = (lat1 * Math.PI) / 180; const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180; const Δλ = ((lon2 - lon1) * Math.PI) / 180;
    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    return Math.round(R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))));
  };

  const fetchBranches = async () => {
    const { data } = await supabase.from("branches").select("*");
    if (!data || data.length === 0) return setStatusMsg(t.errNoMap);
    navigator.geolocation.getCurrentPosition((pos) => {
      const { latitude, longitude, accuracy } = pos.coords;
      if (accuracy > 150) { setStatusMsg(`${t.errGpsWeak} (${Math.round(accuracy)} ${t.errGpsMove})`); return; }
      setLocation({ lat: latitude, lng: longitude });
      let closest = null; let minDistance = Infinity;
      data.forEach((b) => {
        const d = calculateDistance(latitude, longitude, b.lat, b.lng);
        if (d < minDistance) { minDistance = d; closest = b; }
      });
      if (closest && minDistance <= closest.radius_m) {
        setNearestBranch(closest); setDistance(minDistance); setIsInside(true);
        setStatusMsg(`${t.successLocation} ${closest.name}`);
      } else { setIsInside(false); setStatusMsg(t.errOutZone); }
    }, () => setStatusMsg(t.errNoGps), { enableHighAccuracy: true });
  };

  const fetchTodayLog = async () => {
    const today = new Date().toISOString().split("T")[0];
    const { data } = await supabase.from("attendance_logs").select("*").eq("employee_id", user.id).gte("created_at", `${today}T00:00:00`).lte("created_at", `${today}T23:59:59`);
    if (data) {
      const inLog = data.find(log => log.log_type === 'check_in');
      const outLog = data.find(log => log.log_type === 'check_out');
      setHasCheckedIn(!!inLog); setHasCheckedOut(!!outLog);
      if (inLog) setCheckInTime(new Date(inLog.timestamp).toLocaleTimeString('th-TH'));
      if (outLog) setCheckOutTime(new Date(outLog.timestamp).toLocaleTimeString('th-TH'));
    }
  };

  useEffect(() => {
    if (!user) return navigate("/login");
    fetchBranches(); fetchTodayLog();
    return () => stopCamera();
  }, [user, navigate, stopCamera]);

  const openCameraFor = async (type) => {
    if (type === 'IN' && hasCheckedIn) return alert(t.alertCheckedIn);
    if (type === 'OUT' && hasCheckedOut) return alert(t.alertCheckedOut);
    setTimestampType(type); setIsCameraOpen(true);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
      if (videoRef.current) videoRef.current.srcObject = stream;
    } catch (err) { alert(t.errorPrefix + err.message); setIsCameraOpen(false); }
  };

  const capturePhoto = () => {
    const canvas = canvasRef.current; const video = videoRef.current; const ctx = canvas.getContext('2d');
    canvas.width = video.videoWidth || 300; canvas.height = video.videoHeight || 225;
    ctx.translate(canvas.width, 0); ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    setImageSrc(canvas.toDataURL('image/jpeg', 0.8)); stopCamera(); setIsCameraOpen(false);
  };

  const handleCheckIn = async () => {
    if (!imageSrc || isUploading) return;
    setIsUploading(true);
    try {
      const res = await fetch(imageSrc); const blob = await res.blob();
      const fileName = `${user.employee_code}_${Date.now()}.jpg`;
      await supabase.storage.from("selfies").upload(fileName, blob);
      const { data: urlData } = supabase.storage.from("selfies").getPublicUrl(fileName);
      const now = new Date(); let lateMins = 0; let otMins = 0; let logStatus = 'normal';
      if (timestampType === 'IN') {
        const shiftStart = new Date(); shiftStart.setHours(8, 30, 0, 0);
        if (now > shiftStart) { lateMins = Math.floor((now - shiftStart) / 60000); logStatus = 'late'; }
      } else if (timestampType === 'OUT') {
        const shiftEnd = new Date(); shiftEnd.setHours(17, 30, 0, 0);
        if (now > shiftEnd) otMins = Math.floor((now - shiftEnd) / 60000);
      }
      const logEntry = { employee_id: user.id, branch_id: nearestBranch.id, lat: location.lat, lng: location.lng, distance_m: distance, is_within_radius: true, selfie_url: urlData.publicUrl, log_type: timestampType === 'IN' ? 'check_in' : 'check_out', status: logStatus, late_minutes: lateMins, ot_minutes: otMins };
      await supabase.from("attendance_logs").insert([logEntry]);
      const timeStr = now.toLocaleTimeString('th-TH');
      let lineMsg = `📍 [ลงเวลา${timestampType === 'IN' ? 'เข้า' : 'ออก'}สำเร็จ]\nพนักงาน: ${user.full_name}\nสถานที่: ${nearestBranch.name}\nเวลา: ${timeStr}`;
      if (lateMins > 0) lineMsg += `\n⚠️ สาย: ${lateMins} นาที`;
      if (otMins > 0) lineMsg += `\n💰 OT: ${otMins} นาที`;
      
      fetch("https://script.google.com/macros/s/AKfycbxBMRd9gKYzHU7Pz0-189-BOYVb15eS7PmF9zKiUYCiHlDUhjpe39vi7Y3Vx1sMr2VEoA/exec", {
        method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ to: ["C0df0123907f46aa88c44ef72e88ea30f", "Uc947fe424b3b5033648ab52f3353ecb7"], messages: [{ type: "text", text: lineMsg }] })
      }).catch(err => console.error("LINE Fetch Error:", err));

      if (timestampType === 'IN') addNotificationToBell("ลงเวลาเข้างานสำเร็จ ⏰", "ระบบได้บันทึกเวลาเข้างานของคุณเรียบร้อยแล้ว ขอให้ทำงานอย่างมีความสุขครับ!");
      else if (timestampType === 'OUT') addNotificationToBell("ลงเวลาออกงานสำเร็จ 🏠", "ระบบได้บันทึกเวลาออกงานของคุณเรียบร้อยแล้ว เดินทางกลับบ้านปลอดภัยครับ!");

      Swal.fire({ icon: 'success', title: t.alertSuccess, confirmButtonColor: '#881337', customClass: { popup: 'rounded-[2rem]' } });
      setImageSrc(null); setTimestampType(null); fetchTodayLog();
    } catch (err) { alert(t.errorPrefix + err.message); } finally { setIsUploading(false); }
  };

  const changeLang = (newLang) => { setLang(newLang); localStorage.setItem("titan_lang", newLang); };

  return (
    <div className="flex h-screen bg-[#fffbfb] font-sans overflow-hidden relative">
      
      {isSidebarOpen && <div className="fixed inset-0 bg-slate-900/60 z-[90] lg:hidden backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)}></div>}

      {/* 👑 Sidebar Luxury Edition (มงกุฎทอง + ชื่อแบรนด์พรีเมียม) */}
      <div className={`fixed lg:static inset-y-0 left-0 z-[100] w-72 bg-gradient-to-b from-[#881337] via-[#9f1239] to-[#4c0519] transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"} transition-transform duration-300 shadow-2xl flex flex-col justify-between`}>
        <div className="flex-1 flex flex-col overflow-hidden">
          
          {/* Header Sidebar: มงกุฎทองตามแบบหน้า Dashboard */}
          <div className="p-8 flex flex-col items-center justify-center border-b border-rose-300/20 relative flex-shrink-0">
            <div className="relative mb-3">
              <CrownLogo className="w-16 h-16 drop-shadow-[0_0_15px_rgba(253,224,71,0.4)] transition-transform hover:scale-110" />
              <div className="absolute inset-0 bg-amber-400 blur-2xl opacity-20 -z-10 animate-pulse"></div>
            </div>
            <h2 className="text-white font-serif font-black text-2xl tracking-tighter text-center leading-tight">Pancake</h2>
            <p className="text-[10px] font-bold text-rose-300 uppercase tracking-[0.15em] mt-1 text-center italic">Lovely Enrichment HR</p>
            <p className="text-[8px] text-amber-400/80 font-black uppercase tracking-widest mt-1">Premium HR Platform</p>
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden absolute top-4 right-4 text-rose-200/50 hover:text-white text-xl">✕</button>
          </div>
          
          {/* 👤 ส่วนข้อมูลพนักงาน (ปรับสไตล์ตามรูปแนบ) */}
          <div className="px-6 py-6 flex-shrink-0">
            <div className="flex items-center gap-3 bg-white/10 p-3 rounded-2xl border border-white/10 shadow-inner">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#881337] font-black text-xl shadow-md">
                {lang === 'EN' && user?.name_en ? user.name_en.charAt(0) : (user?.full_name?.charAt(0) || 'U')}
              </div>
              <div className="flex flex-col overflow-hidden text-left text-white">
                <span className="font-bold text-sm truncate">{user?.full_name || 'ไม่ระบุชื่อ'}</span>
                <span className="text-[10px] font-medium text-rose-200 truncate">{user?.position || 'Staff'}</span>
                <span className="text-[8px] px-1.5 py-0.5 bg-amber-500/80 rounded text-white font-black tracking-wider uppercase mt-1 w-fit border border-amber-400/50 shadow-sm">
                  ROLE: {user?.role === 'admin' ? 'SUPER ADMIN' : user?.role === 'ceo' ? 'CEO' : 'USER'}
                </span>
              </div>
            </div>
          </div>

          <nav className="flex-1 px-4 pb-4 space-y-1 overflow-y-auto custom-scrollbar">
            {/* ✨ แก้ไข: ลบไอคอนซ้ำซ้อน เพราะไอคอนอยู่ใน t.menuDash/menuCheck อยู่แล้ว */}
            <button onClick={() => navigate('/dashboard')} className="w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl font-bold text-sm text-rose-200/70 hover:bg-white/5 hover:text-white transition-all">
              {t.menuDash}
            </button>
            <button className="w-full flex items-center gap-3 px-5 py-3.5 rounded-2xl font-bold text-sm bg-white/20 text-white shadow-lg border border-white/10">
              {t.menuCheck}
            </button>
          </nav>
        </div>
        <div className="p-6 border-t border-rose-300/10 flex-shrink-0">
          <button onClick={() => { stopCamera(); localStorage.removeItem('titan_user'); navigate('/login'); }} className="w-full flex items-center justify-center gap-2 py-3.5 bg-rose-950/40 hover:bg-rose-500 text-rose-200 hover:text-white rounded-xl font-bold text-xs uppercase tracking-widest border border-rose-800/50 shadow-sm transition-all">🚪 {t.menuLogout}</button>
        </div>
      </div>

      {/* 📱 Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto relative items-center p-4 md:p-8 w-full bg-[#fffbfb]">
        
        {/* แสงฟุ้งพื้นหลัง */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-rose-100 rounded-full blur-[120px] opacity-30 mix-blend-multiply pointer-events-none"></div>

        {/* Top Header Mobile */}
        <div className="w-full flex items-center justify-between mb-6 z-10 lg:hidden">
          <button className="text-slate-800 bg-white p-2.5 rounded-xl shadow-sm border border-slate-100" onClick={() => setIsSidebarOpen(true)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
          <div className="bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm border border-rose-100 flex items-center gap-2">
            <CrownLogo className="w-5 h-5" />
            <span className="text-[#881337] font-black text-[10px] uppercase tracking-widest leading-none">Pancake HR</span>
          </div>
        </div>

        {/* Language Switcher Desktop */}
        <div className="hidden lg:flex absolute top-6 right-8 z-20 bg-white p-1 rounded-full shadow-sm border border-rose-200 items-center">
           <button onClick={() => changeLang("TH")} className={`px-4 py-1.5 rounded-full font-bold text-xs transition-all ${lang === "TH" ? "bg-slate-800 text-white shadow-md" : "text-slate-400 hover:text-slate-600"}`}>TH</button>
           <button onClick={() => changeLang("EN")} className={`px-4 py-1.5 rounded-full font-bold text-xs transition-all ${lang === "EN" ? "bg-slate-800 text-white shadow-md" : "text-slate-400 hover:text-slate-600"}`}>EN</button>
        </div>

        <div className="w-full max-w-md space-y-4 md:space-y-6 z-10 flex-1 flex flex-col justify-start mt-4">
          <div className="bg-white/80 backdrop-blur-xl p-6 md:p-8 rounded-[2.5rem] shadow-sm border border-white text-center">
            <h1 className="text-2xl md:text-3xl font-serif font-black text-[#881337] tracking-tight mb-2">{t.title}</h1>
            <p className="text-slate-500 font-medium text-xs md:text-sm italic">{t.subtitle}</p>
          </div>

          <div className={`p-6 rounded-[2.5rem] shadow-sm border text-center transition-all duration-500 ${isInside ? 'bg-emerald-50 border-emerald-100' : 'bg-rose-50 border-rose-100'}`}>
            <div className="flex flex-col items-center justify-center space-y-2">
              <span className={`text-3xl md:text-4xl animate-pulse`}>{isInside ? '👑' : '📍'}</span>
              <p className={`text-lg md:text-xl font-black tracking-tight ${isInside ? 'text-emerald-700' : 'text-rose-700'}`}>{statusMsg}</p>
              {distance !== null && <p className="text-[10px] md:text-xs font-bold text-slate-500 bg-white px-4 py-1.5 rounded-full border border-slate-100 shadow-inner">{t.distLabel} {distance} {t.unitMeter}</p>}
            </div>
          </div>

          {isInside && !isCameraOpen && !imageSrc && (
            <div className="grid grid-cols-1 gap-4">
              <button onClick={() => openCameraFor('IN')} disabled={hasCheckedIn} className={`flex items-center gap-4 p-5 rounded-[1.5rem] border-2 transition-all ${hasCheckedIn ? 'bg-slate-50 border-slate-100 opacity-60' : 'bg-white border-rose-100 hover:border-rose-300 shadow-sm active:scale-95'}`}>
                <span className="text-4xl bg-rose-50 p-2 rounded-2xl">🌞</span>
                <div className="text-left">
                  <span className="font-black text-slate-800 text-base block">{t.btnClockIn}</span>
                  {hasCheckedIn ? <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">{t.statusIn} {checkInTime}</span> : <span className="text-[10px] text-rose-400 font-bold uppercase tracking-widest">Ready to Work</span>}
                </div>
              </button>
              <button onClick={() => openCameraFor('OUT')} disabled={!hasCheckedIn || hasCheckedOut} className={`flex items-center gap-4 p-5 rounded-[1.5rem] border-2 transition-all ${(!hasCheckedIn || hasCheckedOut) ? 'bg-slate-50 border-slate-100 opacity-60' : 'bg-white border-amber-100 hover:border-amber-300 shadow-sm active:scale-95'}`}>
                <span className="text-4xl bg-amber-50 p-2 rounded-2xl">🌙</span>
                <div className="text-left">
                  <span className="font-black text-slate-800 text-base block">{t.btnClockOut}</span>
                  {hasCheckedOut ? <span className="text-[10px] text-rose-600 font-bold bg-rose-50 px-2 py-0.5 rounded-md">{t.statusOut} {checkOutTime}</span> : <span className="text-[10px] text-amber-500 font-bold uppercase tracking-widest">Finish Mission</span>}
                </div>
              </button>
            </div>
          )}

          {isInside && (isCameraOpen || imageSrc) && (
            <div className="bg-white/80 backdrop-blur-xl p-5 md:p-6 rounded-[2.5rem] shadow-xl border border-white animate-pop-in">
              <canvas ref={canvasRef} className="hidden"></canvas>
              {!imageSrc ? (
                <>
                  <div className="flex justify-between items-center mb-4 px-2">
                    <p className="font-black text-[#881337] text-sm">📸 {timestampType === 'IN' ? t.btnClockIn : t.btnClockOut}</p>
                    <button onClick={() => { stopCamera(); setIsCameraOpen(false); }} className="text-rose-500 text-[10px] font-black bg-rose-50 px-3 py-1.5 rounded-full border border-rose-100 uppercase">{t.btnCancel}</button>
                  </div>
                  <div className="relative rounded-3xl overflow-hidden border-4 border-rose-50 bg-slate-900 w-full aspect-[4/3] flex items-center justify-center shadow-inner group">
                    <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover scale-x-[-1]"></video>
                    <button onClick={capturePhoto} className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-gradient-to-r from-rose-500 to-rose-400 text-white w-14 h-14 rounded-full flex items-center justify-center shadow-lg border-4 border-white transition-all active:scale-90">📸</button>
                  </div>
                </>
              ) : (
                <div className="space-y-4">
                  <img src={imageSrc} className="w-full aspect-[4/3] object-cover rounded-3xl border-4 border-emerald-100 shadow-md" alt="selfie" />
                  <button onClick={handleCheckIn} disabled={isUploading} className="w-full py-4 bg-gradient-to-r from-[#881337] to-[#be123c] text-white rounded-2xl font-black text-lg shadow-lg shadow-rose-200 transition-all active:scale-95 disabled:opacity-50">
                    {isUploading ? t.btnSaving : (timestampType === 'IN' ? t.btnConfirmIn : t.btnConfirmOut)}
                  </button>
                  <div className="flex gap-2">
                    <button onClick={() => { setImageSrc(null); openCameraFor(timestampType); }} className="flex-1 py-3 text-slate-500 hover:text-slate-800 font-bold text-xs bg-slate-50 rounded-xl transition-all">{t.btnRetake}</button>
                    <button onClick={() => { setImageSrc(null); setIsCameraOpen(false); setTimestampType(null); }} className="flex-1 py-3 text-rose-400 hover:text-rose-600 font-bold text-xs bg-rose-50 rounded-xl transition-all">{t.btnCancel}</button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}