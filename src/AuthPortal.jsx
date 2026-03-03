import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./supabase";

export default function AuthPortal() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem("titan_saved_username");
    const savedPass = localStorage.getItem("titan_saved_password");
    if (savedUser && savedPass) {
      setUsername(savedUser);
      setPassword(savedPass);
      setRememberMe(true);
    }
  }, []);

  // ฟังก์ชันกลางสำหรับตรวจสอบการล็อกอิน
  const handleAuthenticate = async (targetRoute) => {
    if (!username || !password) return alert("⚠️ กรุณากรอก Username และ Password");
    setIsLoading(true);

    try {
      const { data, error } = await supabase
        .from("employees")
        .select("*")
        .eq("username", username)
        .eq("password", password)
        .single();

      if (error || !data) {
        alert("❌ Username หรือ Password ไม่ถูกต้อง");
        setIsLoading(false);
        return;
      }

      localStorage.setItem("titan_user", JSON.stringify(data));

      if (rememberMe) {
        localStorage.setItem("titan_saved_username", username);
        localStorage.setItem("titan_saved_password", password);
      } else {
        localStorage.removeItem("titan_saved_username");
        localStorage.removeItem("titan_saved_password");
      }

      // พุ่งไปหน้าที่เลือก (Dashboard หรือ Check-in)
      navigate(targetRoute);
    } catch (err) {
      alert("Error: " + err.message);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden font-sans">
      {/* Background Elements */}
      <div className="absolute w-[40rem] h-[40rem] bg-pink-200 rounded-full blur-[100px] opacity-50 top-[-10%] left-[-10%] animate-pulse"></div>
      <div className="absolute w-[40rem] h-[40rem] bg-purple-200 rounded-full blur-[100px] opacity-50 bottom-[-10%] right-[-10%] animate-pulse"></div>

      <div className="w-full max-w-[420px] bg-white/80 backdrop-blur-2xl p-10 rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white z-10">
        
        {/* Logo & Header */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-pink-200 mb-6 transform -rotate-6">
            <span className="text-3xl text-white font-black">P</span>
          </div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Pancake ERP</h1>
          <p className="text-slate-400 font-medium text-sm mt-1">Welcome back, please login to your account.</p>
        </div>

        <div className="space-y-5">
          {/* Inputs */}
          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block ml-1">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 focus:border-pink-500 focus:ring-4 focus:ring-pink-500/10 rounded-xl px-5 py-4 text-slate-700 font-bold placeholder-slate-400 outline-none transition-all"
              placeholder="Enter your username"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block ml-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 focus:border-pink-500 focus:ring-4 focus:ring-pink-500/10 rounded-xl px-5 py-4 text-slate-700 font-bold placeholder-slate-400 outline-none transition-all"
              placeholder="••••••••"
            />
          </div>

          {/* Remember Me */}
          <div className="flex items-center pt-2">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-5 h-5 rounded border-slate-300 text-pink-500 focus:ring-pink-500/30 transition-all cursor-pointer"
              />
              <span className="text-sm font-bold text-slate-600">Remember me</span>
            </label>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 space-y-3">
            {/* ปุ่ม 1: เข้าสู่ Dashboard */}
            <button
              onClick={() => handleAuthenticate("/dashboard")}
              disabled={isLoading}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white rounded-xl font-bold text-base shadow-[0_10px_20px_rgba(236,72,153,0.2)] transition-all transform hover:-translate-y-0.5"
            >
              {isLoading ? 'Loading...' : '🚀 เข้าสู่ระบบ (Dashboard)'}
            </button>

            {/* ปุ่ม 2: ลงเวลา Timestamp */}
            <button
              onClick={() => handleAuthenticate("/check-in")}
              disabled={isLoading}
              className="w-full py-4 bg-white border-2 border-slate-200 hover:border-pink-500 hover:text-pink-600 text-slate-600 rounded-xl font-bold text-base shadow-sm transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              ⏰ ลงเวลาทำงาน (Timestamp)
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}