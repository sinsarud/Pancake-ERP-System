import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./supabase";
import Swal from 'sweetalert2';

// 👑 Component โลโก้มงกุฎทอง (Premium Gold Crown SVG)
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
      <ellipse cx="50" cy="74" rx="4" ry="2" fill="#FFFBEB" />
      <ellipse cx="30" cy="72" rx="3" ry="1.5" fill="#FFFBEB" />
      <ellipse cx="70" cy="72" rx="3" ry="1.5" fill="#FFFBEB" />
    </g>
  </svg>
);

// 🌐 ระบบคำแปล (หน้า Login ใช้ EN ล้วน)
const translations = {
  EN: {
    appName: "Pancake", appSub: "Lovely Enrichment HR", appTag: "Premium HR Platform",
    usernameLabel: "Username", usernamePlace: "Enter your username",
    passwordLabel: "Password",
    forgotPass: "Forgot password?", remember: "Remember me",
    btnLogin: "👑 Login", btnCheckin: "⏰ Timestamp",
    loadingText: "Loading...",
    errEmpty: "⚠️ Please enter Username and Password", errLogin: "❌ Invalid Username or Password",
    swalForgotTitle: "Forgot Password?", swalForgotText: "Please enter your Username", swalForgotPlace: "e.g. somchai123", swalForgotBtn: "Send Temp Password",
    swalLoading: "Processing...", swalErrNotFound: "Username not found in the system.", swalErrNoEmail: "No email registered for this user. Please contact Admin.",
    swalSuccessTitle: "Email Sent!", swalSuccessHtml: "A temporary password has been sent to <b class='text-rose-600'>{email}</b>.", swalErrorTitle: "Error",
    emailSubject: "👑 [Pancake HR] Your Temporary Password", emailTitle: "Password Recovery", emailGreeting: "Dear", emailDesc: "Here is your temporary password to access the system:", emailTempLabel: "Temporary Password", emailWarning: "⚠️ Please login and change your password immediately for security.", emailLoginBtn: "Login Now", btnCancel: "Cancel"
  }
};

export default function AuthPortal() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  // ✨ บังคับใช้ภาษาอังกฤษ (EN) สำหรับหน้านี้โดยเฉพาะ
  const t = translations.EN;

  useEffect(() => {
    const savedUser = localStorage.getItem("titan_saved_username");
    const savedPass = localStorage.getItem("titan_saved_password");
    if (savedUser && savedPass) {
      setUsername(savedUser);
      setPassword(savedPass);
      setRememberMe(true);
    }
  }, []);

  const notifyLineOA = async (userFullName) => {
    try {
      const googleScriptUrl = "https://script.google.com/macros/s/AKfycbxBMRd9gKYzHU7Pz0-189-BOYVb15eS7PmF9zKiUYCiHlDUhjpe39vi7Y3Vx1sMr2VEoA/exec";
      const hrGroupId = "C0df0123907f46aa88c44ef72e88ea30f";
      const adminUserId = "Uc947fe424b3b5033648ab52f3353ecb7";

      await fetch(googleScriptUrl, {
        method: "POST",
        body: JSON.stringify({
          to: [hrGroupId, adminUserId], 
          messages: [
            { 
              type: "text", 
              text: `👑 แจ้งเตือนจากระบบ!\nพนักงาน ${userFullName} ได้เข้าสู่ระบบ/ลงเวลา\nเวลา: ${new Date().toLocaleString('th-TH')}` 
            }
          ]
        })
      });
    } catch (error) {
      console.error("❌ การแจ้งเตือน LINE ล้มเหลว:", error);
    }
  };

const handleAuthenticate = async (targetRoute) => {
    if (!username || !password) {
      Swal.fire({
        icon: 'warning',
        title: 'ข้อมูลไม่ครบถ้วน',
        text: 'กรุณากรอก Username และ Password ให้ครบถ้วน',
        confirmButtonText: 'ตกลง',
        confirmButtonColor: '#f59e0b',
        background: '#ffffff',
        backdrop: `rgba(15, 23, 42, 0.6) backdrop-blur-sm`,
        customClass: {
          popup: 'rounded-[2rem] shadow-2xl border border-amber-100',
          title: 'text-amber-600 font-black text-xl mt-2',
          confirmButton: 'px-8 py-3 rounded-xl font-bold hover:scale-105 transition-transform shadow-md'
        }
      });
      return;
    }

    setIsLoading(true);

    // 🛑 บังคับขอ GPS ก่อนล็อกอิน (ถ้าไม่ให้ = อดเข้าเว็บ)
    if (!navigator.geolocation) {
      Swal.fire({ icon: 'error', title: 'ไม่รองรับ GPS', text: 'เบราว์เซอร์ของคุณไม่รองรับการระบุตำแหน่ง ไม่สามารถใช้งานได้ครับ', customClass: { popup: 'rounded-[2rem]' } });
      setIsLoading(false);
      return;
    }

    // 📍 สั่งเด้ง Popup ขอพิกัดทันทีที่กดปุ่ม Login
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        // ✅ 1. พนักงานกด Allow GPS แล้ว -> ดำเนินการเช็ครหัสผ่านและให้ล็อกอินต่อได้
        try {
          const { data, error } = await supabase
            .from("employees")
            .select("*")
            .ilike("username", username.trim());

          if (error || !data || data.length === 0) {
            Swal.fire({
              icon: 'error',
              title: 'เข้าสู่ระบบไม่สำเร็จ!',
              text: 'ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง',
              confirmButtonText: 'ลองใหม่อีกครั้ง',
              confirmButtonColor: '#f43f5e',
              background: '#ffffff',
              backdrop: `rgba(15, 23, 42, 0.6) backdrop-blur-sm`,
              customClass: {
                popup: 'rounded-[2rem] shadow-2xl border border-rose-100',
                title: 'text-rose-600 font-black text-xl mt-2',
                confirmButton: 'px-8 py-3 rounded-xl font-bold hover:scale-105 transition-transform shadow-md'
              }
            });
            setIsLoading(false);
            return;
          }

          const userData = data[0];

          if (String(userData.password) !== String(password)) {
            Swal.fire({
              icon: 'error',
              title: 'เข้าสู่ระบบไม่สำเร็จ!',
              text: 'ชื่อผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง กรุณาลองใหม่อีกครั้ง',
              confirmButtonText: 'ลองใหม่อีกครั้ง',
              confirmButtonColor: '#f43f5e',
              background: '#ffffff',
              backdrop: `rgba(15, 23, 42, 0.6) backdrop-blur-sm`,
              customClass: {
                popup: 'rounded-[2rem] shadow-2xl border border-rose-100',
                title: 'text-rose-600 font-black text-xl mt-2',
                confirmButton: 'px-8 py-3 rounded-xl font-bold hover:scale-105 transition-transform shadow-md'
              }
            });
            setIsLoading(false);
            return;
          }

          localStorage.setItem("titan_user", JSON.stringify(userData));

          if (rememberMe) {
            localStorage.setItem("titan_saved_username", username);
            localStorage.setItem("titan_saved_password", password);
          } else {
            localStorage.removeItem("titan_saved_username");
            localStorage.removeItem("titan_saved_password");
          }

          // ทันทีที่ล็อกอินผ่าน บังคับให้ระบบหลังจากนี้จำค่าเป็น "TH" อัตโนมัติ
          localStorage.setItem("titan_lang", "TH");
          notifyLineOA(userData.username);
          
          // 🌟 แจ้งเตือนเข้าสู่ระบบสำเร็จ (Success Popup หรูหรา)
          await Swal.fire({
            icon: 'success',
            title: 'เข้าสู่ระบบสำเร็จ!',
            text: `ยินดีต้อนรับคุณ ${userData.full_name || userData.username} 🎉`,
            showConfirmButton: false,
            timer: 1500,
            background: '#ffffff',
            backdrop: `rgba(15, 23, 42, 0.6) backdrop-blur-sm`,
            customClass: {
              popup: 'rounded-[2rem] shadow-2xl border border-emerald-100',
              title: 'text-emerald-600 font-black text-xl mt-2'
            }
          });

          navigate(targetRoute);

        } catch (err) {
          Swal.fire({
            icon: 'error',
            title: 'เกิดข้อผิดพลาด!',
            text: err.message,
            confirmButtonText: 'ตกลง',
            confirmButtonColor: '#f43f5e',
            background: '#ffffff',
            backdrop: `rgba(15, 23, 42, 0.6) backdrop-blur-sm`,
            customClass: {
              popup: 'rounded-[2rem] shadow-2xl border border-rose-100',
              title: 'text-rose-600 font-black text-xl mt-2',
              confirmButton: 'px-8 py-3 rounded-xl font-bold hover:scale-105 transition-transform shadow-md'
            }
          });
          setIsLoading(false);
        }
      },
      (error) => {
        // ❌ 2. พนักงานกด Block (ไม่อนุญาต) หรือหาพิกัดไม่ได้ -> เด้งออก ไม่ให้เข้าสู่ระบบเด็ดขาด!
        Swal.fire({
          icon: 'error',
          title: '⚠️ ไม่สามารถเข้าสู่ระบบได้',
          html: 'คุณต้องกด <b>"อนุญาต (Allow)"</b> โลเคชั่น (GPS)<br/>เพื่อเข้าใช้งานระบบครับ<br/><br/><span class="text-xs text-slate-500">หากเผลอกดปิดไปแล้ว กรุณารีเฟรชหน้าเว็บ หรือตั้งค่าเบราว์เซอร์ให้เปิด GPS ก่อนครับ</span>',
          confirmButtonColor: '#e11d48',
          customClass: { popup: 'rounded-[2rem] shadow-2xl border-2 border-rose-100' }
        });
        setIsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

const handleForgotPassword = async () => {
    const { value: targetUsername } = await Swal.fire({
      title: t.swalForgotTitle,
      text: t.swalForgotText,
      input: 'text',
      inputPlaceholder: t.swalForgotPlace,
      showCancelButton: true,
      confirmButtonColor: '#e11d48',
      cancelButtonText: t.btnCancel,
      confirmButtonText: t.swalForgotBtn,
      customClass: { popup: 'rounded-[2rem] shadow-2xl border-2 border-rose-100', input: 'rounded-xl text-center font-bold' }
    });

    if (targetUsername) {
      Swal.fire({ title: t.swalLoading, allowOutsideClick: false, didOpen: () => Swal.showLoading() });

      try {
        const { data: emp, error } = await supabase.from('employees').select('*').ilike('username', targetUsername.trim()).single();
        if (error || !emp) throw new Error(t.swalErrNotFound);
        if (!emp.email) throw new Error(t.swalErrNoEmail);

        const tempPass = Math.random().toString(36).slice(-4).toUpperCase() + Math.floor(Math.random() * 100);
        
        const { error: updateErr } = await supabase.from('employees').update({ 
          password: tempPass, 
          require_password_change: true 
        }).eq('id', emp.id);

        if (updateErr) throw updateErr;

        await supabase.from('system_logs').insert([{ action: 'RESET_PASSWORD', details: `รีเซ็ตรหัสผ่านชั่วคราวเป็น: ${tempPass}`, employee_id: emp.id }]);

        const emailHtml = `
          <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #fffbfb; padding: 20px; border: 1px solid #fce7f3; border-radius: 30px;">
            <div style="background-color: #ffffff; padding: 40px; border-radius: 24px; box-shadow: 0 10px 25px rgba(136, 19, 55, 0.05);">
              <div style="text-align: center; margin-bottom: 30px;">
                <div style="font-size: 50px; margin-bottom: 10px;">&#128081;</div>
                <h1 style="color: #881337; margin: 0; font-size: 28px; font-weight: 900; letter-spacing: -1px;">${t.appName}</h1>
                <p style="color: #be123c; margin: 5px 0 0; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; font-style: italic;">${t.appSub}</p>
              </div>
              <h2 style="color: #1e293b; font-size: 20px; text-align: center; font-weight: 800; border-bottom: 2px solid #fff1f2; padding-bottom: 20px; margin-bottom: 25px;">${t.emailTitle}</h2>
              <p style="color: #475569; font-size: 16px;">${t.emailGreeting} <strong>${emp.full_name}</strong>,</p>
              <p style="color: #475569; font-size: 16px; line-height: 1.6;">${t.emailDesc}</p>
              <div style="background-color: #fff7ed; border: 1px solid #ffedd5; padding: 30px; margin: 25px 0; border-radius: 20px; text-align: center;">
                <p style="margin: 0 0 5px; color: #9a3412; font-size: 11px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px;">${t.emailTempLabel}</p>
                <p style="margin: 0; color: #881337; font-size: 32px; font-weight: 900; letter-spacing: 4px;">${tempPass}</p>
              </div>
              <p style="color: #be123c; font-size: 13px; font-weight: 700; text-align: center; background-color: #fff1f2; padding: 15px; border-radius: 12px; margin-top: 20px;">
                ${t.emailWarning}
              </p>
              <div style="text-align: center; margin-top: 30px;">
                <a href="${window.location.origin}/login" style="display: inline-block; background: #881337; color: #ffffff; padding: 16px 35px; border-radius: 15px; text-decoration: none; font-weight: 900; font-size: 14px; box-shadow: 0 4px 10px rgba(136, 19, 55, 0.2);">${t.emailLoginBtn}</a>
              </div>
            </div>
          </div>
        `;

        // ✨ เอาอิโมจิออกจากหัวข้ออีเมล
        const cleanSubject = lang === 'TH' ? "[Pancake HR] รหัสผ่านชั่วคราวของคุณ" : "[Pancake HR] Your Temporary Password";

        await fetch("https://script.google.com/macros/s/AKfycbxBMRd9gKYzHU7Pz0-189-BOYVb15eS7PmF9zKiUYCiHlDUhjpe39vi7Y3Vx1sMr2VEoA/exec", {
          method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain;charset=utf-8' },
          body: JSON.stringify({ email: emp.email, subject: cleanSubject, html: emailHtml })
        });

        Swal.fire({ 
          icon: 'success', title: t.swalSuccessTitle, 
          html: t.swalSuccessHtml.replace('{email}', emp.email),
          customClass: { popup: 'rounded-[2rem]' }
        });

      } catch (err) {
        Swal.fire({ icon: 'error', title: t.swalErrorTitle, text: err.message, customClass: { popup: 'rounded-[2rem]' }});
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fffbfb] relative overflow-hidden font-sans p-4">
      
      <div className="absolute w-[40rem] h-[40rem] bg-rose-200 rounded-full blur-[120px] opacity-40 top-[-10%] left-[-10%] animate-pulse"></div>
      <div className="absolute w-[40rem] h-[40rem] bg-amber-200 rounded-full blur-[120px] opacity-40 bottom-[-10%] right-[-10%] animate-pulse"></div>

      <div className="w-[90%] sm:w-full max-w-[400px] bg-white/80 backdrop-blur-2xl p-6 sm:p-10 rounded-[2rem] shadow-[0_20px_60px_rgba(225,29,72,0.08)] border border-rose-50 z-10">
        
        <div className="text-center mb-6 sm:mb-8">
          <CrownLogo className="w-20 h-20 sm:w-24 sm:h-24 mx-auto mb-3 sm:mb-4 drop-shadow-2xl animate-fade-in" />
          <h1 className="text-2xl sm:text-3xl font-serif font-black text-[#881337] tracking-tight">{t.appName}</h1>
          <h2 className="text-[13px] sm:text-[15px] font-bold text-[#be123c] mt-1 font-serif italic">{t.appSub}</h2>
          <div className="flex items-center justify-center gap-2 mt-3">
            <span className="h-px w-8 bg-gradient-to-r from-transparent to-amber-400"></span>
            <span className="text-[9px] sm:text-[10px] font-black text-amber-600 uppercase tracking-widest">{t.appTag}</span>
            <span className="h-px w-8 bg-gradient-to-l from-transparent to-amber-400"></span>
          </div>
        </div>

        <div className="space-y-3 sm:space-y-4">
          <div>
            <label className="text-[10px] sm:text-xs font-bold text-rose-800/60 uppercase tracking-widest mb-1 sm:mb-2 block ml-1">{t.usernameLabel}</label>
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full bg-rose-50/50 border border-rose-100 focus:border-amber-400 focus:ring-4 focus:ring-amber-400/20 rounded-xl px-4 sm:px-5 py-3 sm:py-3.5 text-rose-900 font-bold placeholder-rose-300 outline-none transition-all text-xs sm:text-sm" placeholder={t.usernamePlace} />
          </div>

          <div>
            <label className="text-[10px] sm:text-xs font-bold text-rose-800/60 uppercase tracking-widest mb-1 sm:mb-2 block ml-1">{t.passwordLabel}</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-rose-50/50 border border-rose-100 focus:border-amber-400 focus:ring-4 focus:ring-amber-400/20 rounded-xl px-4 sm:px-5 py-3 sm:py-3.5 text-rose-900 font-bold placeholder-rose-300 outline-none transition-all text-xs sm:text-sm" placeholder="••••••••" />
          </div>

          <div className="flex justify-end mt-1">
            <button type="button" onClick={handleForgotPassword} className="text-[10px] sm:text-xs font-bold text-amber-600 hover:text-amber-700 transition-colors">
              {t.forgotPass}
            </button>
          </div>

          <div className="flex items-center pt-1">
            <label className="flex items-center space-x-2 sm:space-x-3 cursor-pointer">
              <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="w-4 h-4 sm:w-5 sm:h-5 rounded border-rose-200 text-rose-500 focus:ring-rose-500/30 transition-all cursor-pointer" />
              <span className="text-[11px] sm:text-sm font-bold text-rose-800/70">{t.remember}</span>
            </label>
          </div>

          <div className="pt-2 sm:pt-4 space-y-2.5 sm:space-y-3">
            <button onClick={() => handleAuthenticate("/dashboard")} disabled={isLoading} className="w-full py-3.5 sm:py-4 bg-gradient-to-r from-rose-500 to-rose-400 hover:from-rose-600 hover:to-rose-500 text-white rounded-xl font-bold text-xs sm:text-sm shadow-[0_10px_20px_rgba(244,63,94,0.2)] transition-all transform hover:-translate-y-0.5 tracking-wide">
              {isLoading ? t.loadingText : t.btnLogin}
            </button>
            <button onClick={() => handleAuthenticate("/check-in")} disabled={isLoading} className="w-full py-3.5 sm:py-4 bg-white border border-amber-200 hover:border-amber-400 hover:text-amber-700 text-amber-600 rounded-xl font-bold text-xs sm:text-sm shadow-sm transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2">
              {t.btnCheckin}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}