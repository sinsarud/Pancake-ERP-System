import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./supabase";

// 🌐 พจนานุกรมแปลภาษา 100% (ทุกข้อความในหน้านี้อยู่ที่นี่)
const translations = {
  TH: {
    menuDash: "🏠 กลับหน้าหลัก (Dashboard)",
    menuCheck: "⏰ ลงเวลา (Timestamp)",
    menuLogout: "🚪 ออกจากระบบ",
    appName: "Pancake Timestamp",
    title: "บันทึกเวลาเข้างาน",
    subtitle: "กรุณาถ่ายภาพเซลฟี่เพื่อยืนยันตัวตนในพื้นที่",
    statusScanning: "กำลังสแกนพื้นที่...",
    errNoMap: "⚠️ ยังไม่ได้ตั้งค่าแผนที่ (Geofence)",
    errGpsWeak: "⚠️ สัญญาณ GPS อ่อน",
    errGpsMove: "ม. กรุณาขยับหาสัญญาณ",
    successLocation: "✅ คุณอยู่ที่:",
    errOutZone: "❌ นอกเขตพื้นที่ทำงาน",
    errNoGps: "❌ ไม่สามารถเข้าถึง GPS ได้",
    distLabel: "ระยะห่างจากจุดปักหมุด:",
    unitMeter: "เมตร",
    btnSnap: "📸 แชะ!",
    btnOpenCam: "📸 เปิดกล้องเซลฟี่",
    btnSaving: "⏳ กำลังบันทึกข้อมูล...",
    btnConfirm: "🚀 ยืนยันลงเวลาเข้างาน",
    btnRetake: "🔄 ถ่ายใหม่อีกครั้ง",
    alertCheckedIn: "⚠️ วันนี้คุณได้บันทึกเวลาเข้างานไปแล้ว",
    alertSuccess: "🎉 ลงเวลาเข้างานสำเร็จ!",
    roleAdmin: "Admin",
    roleStaff: "Staff",
    errorPrefix: "เกิดข้อผิดพลาด: "
  },
  EN: {
    menuDash: "🏠 Back to Dashboard",
    menuCheck: "⏰ Timestamp",
    menuLogout: "🚪 Logout",
    appName: "Pancake Timestamp",
    title: "Timestamp (Check-in)",
    subtitle: "Please take a selfie to verify your location.",
    statusScanning: "Scanning location...",
    errNoMap: "⚠️ Geofence not configured.",
    errGpsWeak: "⚠️ Weak GPS signal",
    errGpsMove: "m. Please move to a clear area.",
    successLocation: "✅ You are at:",
    errOutZone: "❌ Out of work zone",
    errNoGps: "❌ GPS access denied",
    distLabel: "Distance from pin:",
    unitMeter: "meters",
    btnSnap: "📸 Snap!",
    btnOpenCam: "📸 Open Camera",
    btnSaving: "⏳ Saving data...",
    btnConfirm: "🚀 Confirm Check-in",
    btnRetake: "🔄 Retake Photo",
    alertCheckedIn: "⚠️ You have already checked in today.",
    alertSuccess: "🎉 Check-in successful!",
    roleAdmin: "Admin",
    roleStaff: "Staff",
    errorPrefix: "Error: "
  }
};

export default function CheckIn() {
  const [user] = useState(JSON.parse(localStorage.getItem("titan_user")));
  const navigate = useNavigate();

  // 🌐 ระบบจดจำภาษาข้ามหน้าเว็บ
  const [lang, setLang] = useState(localStorage.getItem("titan_lang") || "TH");
  const t = translations[lang];

  const changeLang = (newLang) => {
    setLang(newLang);
    localStorage.setItem("titan_lang", newLang);
  };

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [location, setLocation] = useState(null);
  const [statusMsg, setStatusMsg] = useState(t.statusScanning);
  const [isInside, setIsInside] = useState(false);
  const [distance, setDistance] = useState(null);
  const [nearestBranch, setNearestBranch] = useState(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371e3;
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;
    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    return Math.round(R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))));
  };

  // 🔄 สั่งให้อัปเดตข้อความ Status ทุกครั้งที่กดเปลี่ยนภาษา
  useEffect(() => {
    setStatusMsg(t.statusScanning);
    fetchBranches();
  }, [lang]);

  const fetchBranches = async () => {
    const { data } = await supabase.from("branches").select("*");
    if (!data || data.length === 0) return setStatusMsg(t.errNoMap);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude, accuracy } = pos.coords;
        if (accuracy > 150) {
          setStatusMsg(`${t.errGpsWeak} (${Math.round(accuracy)} ${t.errGpsMove})`);
          return;
        }

        setLocation({ lat: latitude, lng: longitude });
        let closest = null; let minDistance = Infinity;

        data.forEach((b) => {
          const d = calculateDistance(latitude, longitude, b.lat, b.lng);
          if (d < minDistance) { minDistance = d; closest = b; }
        });

        if (closest && minDistance <= closest.radius_m) {
          setNearestBranch(closest); setDistance(minDistance); setIsInside(true);
          setStatusMsg(`${t.successLocation} ${closest.name}`);
        } else {
          setIsInside(false); setStatusMsg(t.errOutZone);
        }
      },
      () => setStatusMsg(t.errNoGps),
      { enableHighAccuracy: true }
    );
  };

  useEffect(() => {
    if (!user) return navigate("/login");
    fetchBranches();
  }, [user, navigate]);

  const alreadyCheckedInToday = async () => {
    const today = new Date().toISOString().split("T")[0];
    const { data } = await supabase.from("attendance_logs").select("*").eq("employee_id", user.id).gte("created_at", `${today}T00:00:00`).lte("created_at", `${today}T23:59:59`);
    return data && data.length > 0;
  };

  const handleCheckIn = async () => {
    if (!imageSrc || isUploading) return;
    if (await alreadyCheckedInToday()) { alert(t.alertCheckedIn); return; }
    
    setIsUploading(true);
    try {
      const res = await fetch(imageSrc);
      const blob = await res.blob();
      const fileName = `${user.employee_code}_${Date.now()}.jpg`;
      await supabase.storage.from("selfies").upload(fileName, blob);
      const { data: urlData } = supabase.storage.from("selfies").getPublicUrl(fileName);

      const logEntry = {
        employee_id: user.id, branch_id: nearestBranch.id, lat: location.lat, lng: location.lng,
        distance_m: distance, is_within_radius: true, selfie_url: urlData.publicUrl,
      };

      await supabase.from("attendance_logs").insert([logEntry]);
      
      await fetch('/api/send-line', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetId: import.meta.env.VITE_LINE_ADMIN_ID, messageText: `📍 [ลงเวลาสำเร็จ]\nพนักงาน: ${user.full_name}\nสถานที่: ${nearestBranch.name}\nระยะห่าง: ${distance} เมตร\nเวลา: ${new Date().toLocaleTimeString('th-TH')}` })
      }).catch(err => console.error("LINE Error:", err));

      alert(t.alertSuccess);
      setImageSrc(null);
      navigate('/dashboard'); 
    } catch (err) { alert(t.errorPrefix + err.message); } finally { setIsUploading(false); }
  };

  const capturePhoto = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = video.videoWidth || 300;
    canvas.height = video.videoHeight || 225;
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    setImageSrc(canvas.toDataURL('image/jpeg', 0.8));
    video.srcObject.getTracks().forEach(tr => tr.stop());
    setIsCameraOpen(false);
  };

  return (
    <div className="flex h-screen bg-[#F8F4FF] font-sans overflow-hidden relative">
      
      {isSidebarOpen && <div className="fixed inset-0 bg-slate-900/50 z-30 lg:hidden backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)}></div>}

      <div className={`fixed lg:static inset-y-0 left-0 w-64 bg-gradient-to-b from-pink-500 to-purple-800 text-white flex flex-col justify-between shadow-2xl z-40 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div>
          <div className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-lg"><span className="text-2xl">🥞</span></div>
              <h1 className="text-xl font-black tracking-widest text-white">PANCAKE</h1>
            </div>
            <button className="lg:hidden text-white/70 hover:text-white text-2xl" onClick={() => setIsSidebarOpen(false)}>✕</button>
          </div>
          <div className="px-6 pb-6">
            <div className="flex items-center gap-3 bg-white/10 p-3 rounded-xl border border-white/20 shadow-inner">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-pink-600 font-black text-xl">{user?.full_name?.charAt(0) || 'U'}</div>
              <div className="flex flex-col overflow-hidden">
                <span className="font-bold text-sm truncate">{user?.full_name}</span>
                <span className="text-xs text-pink-200 capitalize font-medium">{user?.role === 'admin' ? t.roleAdmin : t.roleStaff}</span>
              </div>
            </div>
          </div>
          <nav className="space-y-2 px-4 mt-2">
            <button onClick={() => navigate('/dashboard')} className="w-full flex items-center gap-3 px-5 py-3.5 rounded-xl font-bold text-sm transition-all border border-transparent text-white/70 hover:bg-white/10 hover:text-white">{t.menuDash}</button>
            <button className="w-full flex items-center gap-3 px-5 py-3.5 rounded-xl font-bold text-sm transition-all border bg-white/20 border-white/10 text-white shadow-sm">{t.menuCheck}</button>
          </nav>
        </div>
        <div className="p-4">
          <button onClick={() => { localStorage.removeItem('titan_user'); navigate('/login'); }} className="w-full flex items-center justify-center gap-2 text-white/70 hover:bg-rose-500 hover:text-white hover:shadow-lg px-4 py-3.5 rounded-xl font-bold text-sm transition-all">{t.menuLogout}</button>
        </div>
      </div>

      <div className="flex-1 flex flex-col h-screen overflow-y-auto relative items-center p-4 md:p-8 w-full">
        
        {/* 🌐 ปุ่มเปลี่ยนภาษาสำหรับหน้าจอใหญ่ (Desktop) */}
        <div className="hidden lg:flex absolute top-6 right-8 z-20 bg-white p-1 rounded-full shadow-sm border border-slate-200 items-center">
           <button onClick={() => changeLang("TH")} className={`px-4 py-2 rounded-full font-bold text-xs transition-all ${lang === "TH" ? "bg-slate-800 text-white shadow-md" : "text-slate-400 hover:text-slate-600"}`}>TH</button>
           <button onClick={() => changeLang("EN")} className={`px-4 py-2 rounded-full font-bold text-xs transition-all ${lang === "EN" ? "bg-slate-800 text-white shadow-md" : "text-slate-400 hover:text-slate-600"}`}>EN</button>
        </div>

        <div className="absolute top-0 right-0 w-64 md:w-96 h-64 md:h-96 bg-pink-200 rounded-full blur-[80px] md:blur-[100px] opacity-40 mix-blend-multiply pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-64 md:w-96 h-64 md:h-96 bg-purple-200 rounded-full blur-[80px] md:blur-[100px] opacity-40 mix-blend-multiply pointer-events-none"></div>

        {/* 📱 Mobile Header (แฮมเบอร์เกอร์ + เปลี่ยนภาษา) */}
        <div className="w-full flex items-center justify-between mb-6 md:mb-8 z-10 lg:hidden">
          <div className="flex items-center gap-2">
            <button className="text-slate-800 bg-white p-2.5 rounded-xl shadow-sm border border-slate-100" onClick={() => setIsSidebarOpen(true)}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            <div className="bg-white p-1 rounded-full shadow-sm border border-slate-200 flex items-center">
              <button onClick={() => changeLang("TH")} className={`px-3 py-1.5 rounded-full font-bold text-[10px] transition-all ${lang === "TH" ? "bg-slate-800 text-white shadow-md" : "text-slate-400"}`}>TH</button>
              <button onClick={() => changeLang("EN")} className={`px-3 py-1.5 rounded-full font-bold text-[10px] transition-all ${lang === "EN" ? "bg-slate-800 text-white shadow-md" : "text-slate-400"}`}>EN</button>
            </div>
          </div>
          <div className="bg-white px-3 py-1.5 rounded-full shadow-sm border border-slate-100">
            <span className="text-pink-500 font-bold text-xs truncate max-w-[100px] block">{t.appName}</span>
          </div>
        </div>

        <div className="w-full max-w-md space-y-4 md:space-y-6 z-10 flex-1 flex flex-col justify-center">
          
          <div className="bg-white/80 backdrop-blur-xl p-6 md:p-8 rounded-[1.5rem] md:rounded-[2rem] shadow-sm border border-white text-center">
            <h1 className="text-2xl md:text-3xl font-black text-slate-800 tracking-tight mb-1 md:mb-2">{t.title}</h1>
            <p className="text-slate-500 font-medium text-xs md:text-sm">{t.subtitle}</p>
          </div>

          <div className={`p-5 md:p-6 rounded-[1.5rem] md:rounded-[2rem] shadow-sm border text-center transition-all duration-500 backdrop-blur-xl ${isInside ? 'bg-emerald-50/80 border-emerald-200' : 'bg-rose-50/80 border-rose-200'}`}>
            <div className="flex flex-col items-center justify-center space-y-2">
              <span className={`text-3xl md:text-4xl ${isInside ? 'text-emerald-500' : 'text-rose-500'}`}>{isInside ? '✅' : '📍'}</span>
              <p className={`text-lg md:text-xl font-black tracking-tight ${isInside ? 'text-emerald-700' : 'text-rose-700'}`}>{statusMsg}</p>
              {distance !== null && <p className="text-[10px] md:text-sm font-bold text-slate-500 bg-white/60 px-3 py-1.5 rounded-full border border-slate-100">{t.distLabel} {distance} {t.unitMeter}</p>}
            </div>
          </div>

          {isInside && (
            <div className="bg-white/80 backdrop-blur-xl p-5 md:p-6 rounded-[1.5rem] md:rounded-[2rem] shadow-lg border border-white">
              <canvas ref={canvasRef} className="hidden"></canvas>
              
              {!imageSrc ? (
                <>
                  {isCameraOpen ? (
                    <div className="relative rounded-xl md:rounded-2xl overflow-hidden border-4 border-emerald-300 shadow-inner bg-black w-full aspect-[4/3] flex items-center justify-center">
                      <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover scale-x-[-1] opacity-90"></video>
                      <button onClick={capturePhoto} className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 bg-emerald-500 hover:bg-emerald-400 text-white px-6 md:px-8 py-3 md:py-4 rounded-full font-black text-lg md:text-xl shadow-[0_0_20px_rgba(16,185,129,0.5)] transform hover:scale-105 transition-all">{t.btnSnap}</button>
                    </div>
                  ) : (
                    <button onClick={async () => {
                      setIsCameraOpen(true);
                      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
                      videoRef.current.srcObject = stream;
                    }} className="w-full py-5 md:py-6 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white rounded-[1.2rem] md:rounded-[2rem] font-black text-lg md:text-xl shadow-[0_10px_20px_rgba(244,114,182,0.3)] transform hover:-translate-y-1 transition-all">{t.btnOpenCam}</button>
                  )}
                </>
              ) : (
                <div className="space-y-3 md:space-y-4">
                  <img src={imageSrc} className="w-full aspect-[4/3] object-cover rounded-[1.2rem] md:rounded-[2rem] border-4 border-emerald-300 shadow-sm" alt="selfie" />
                  <button onClick={handleCheckIn} disabled={isUploading} className="w-full py-4 md:py-5 bg-gradient-to-r from-emerald-400 to-teal-500 hover:from-emerald-500 hover:to-teal-600 text-white rounded-[1.2rem] md:rounded-[2rem] font-black text-lg md:text-xl shadow-[0_10px_20px_rgba(52,211,153,0.3)] transform hover:-translate-y-1 transition-all disabled:opacity-50 disabled:transform-none">
                    {isUploading ? t.btnSaving : t.btnConfirm}
                  </button>
                  <button onClick={() => setImageSrc(null)} className="w-full py-2 md:py-3 text-slate-400 hover:text-pink-500 font-bold text-sm transition-all">{t.btnRetake}</button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}