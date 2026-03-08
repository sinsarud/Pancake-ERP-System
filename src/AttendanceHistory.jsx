import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./supabase";
import Swal from "sweetalert2";

const translations = {
  TH: {
    menuDash: "🏠 กลับหน้าหลัก",
    menuCheck: "⏰ ลงเวลาเข้า-ออก",
    menuHistory: "📊 ประวัติลงเวลา",
    menuLogout: "🚪 ออกจากระบบ",
    title: "ประวัติการลงเวลาทำงาน",
    subtitle: "ตรวจสอบเวลาเข้า-ออก ล่วงเวลา และพิกัดสถานที่",
    colDate: "วันที่",
    colName: "พนักงาน",
    colBranch: "สาขา",
    colIn: "เวลาเข้า",
    colOut: "เวลาออก",
    colLate: "สาย",
    colOT: "ล่วงเวลา",
    colAction: "หลักฐาน",
    btnMap: "📍 พิกัด",
    btnPhoto: "📸 รูป",
    noData: "ไม่พบประวัติการลงเวลาในช่วงนี้",
    roleAdmin: "ผู้ดูแลระบบ",
    roleStaff: "พนักงาน",
    roleCEO: "ผู้บริหาร",
    filterTitle: "🔍 กรองข้อมูลตามวันที่",
    startDate: "ตั้งแต่วันที่:",
    endDate: "ถึงวันที่:",
    btnSearch: "ค้นหา",
    btnClear: "ล้างค่า",
  },
  EN: {
    menuDash: "🏠 Dashboard",
    menuCheck: "⏰ Timestamp",
    menuHistory: "📊 History",
    menuLogout: "🚪 Logout",
    title: "Attendance History",
    subtitle: "Check timestamps, overtime, and locations.",
    colDate: "Date",
    colName: "Employee",
    colBranch: "Branch",
    colIn: "Clock In",
    colOut: "Clock Out",
    colLate: "Late",
    colOT: "OT",
    colAction: "Evidence",
    btnMap: "📍 Map",
    btnPhoto: "📸 Photo",
    noData: "No attendance records found for this period.",
    roleAdmin: "Admin",
    roleStaff: "Staff",
    roleCEO: "CEO",
    filterTitle: "🔍 Filter by Date",
    startDate: "Start Date:",
    endDate: "End Date:",
    btnSearch: "Search",
    btnClear: "Clear",
  }
};

export default function AttendanceHistory() {
  const [user] = useState(JSON.parse(localStorage.getItem("titan_user")));
  const navigate = useNavigate();
  const [lang] = useState(localStorage.getItem("titan_lang") || "TH");
  const t = translations[lang];

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 📅 State สำหรับตัวกรองวันที่
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // 📊 ดึงข้อมูลประวัติการลงเวลา (รองรับการกรองวันที่)
  const fetchHistory = async () => {
    setIsLoading(true);
    try {
      let query = supabase.from("attendance_logs")
        .select(`
          id, created_at, check_in, check_out, late_minutes, ot_minutes, lat, lng, selfie_url, log_type,
          employees ( full_name, employee_code, role ),
          branches ( name )
        `)
        .order("created_at", { ascending: false });

      // 🛡️ เช็คสิทธิ์: ถ้าเป็นพนักงาน ให้ดึงแค่ของตัวเอง
      if (user.role !== 'admin' && user.role !== 'ceo') {
        query = query.eq('employee_id', user.id);
      }

      // 🔍 กรองตามวันที่ ถ้ามีการเลือกไว้
      if (startDate) {
        query = query.gte('created_at', `${startDate}T00:00:00`);
      }
      if (endDate) {
        query = query.lte('created_at', `${endDate}T23:59:59`);
      }

      const { data, error } = await query;
      if (error) throw error;
      
      // จัดกลุ่มข้อมูล เนื่องจากโครงสร้าง DB เก็บ check_in และ check_out แยกบรรทัดกัน (log_type)
      // เราจะรวมให้แสดงผลในตารางเป็น 1 แถวต่อ 1 วันต่อคน ให้ดูง่ายขึ้น
      const groupedLogs = [];
      const logMap = new Map();

      (data || []).forEach(log => {
        const empId = log.employees?.employee_code || "unknown";
        const dateStr = new Date(log.created_at).toLocaleDateString('en-CA'); // YYYY-MM-DD
        const key = `${empId}_${dateStr}`;

        if (!logMap.has(key)) {
          logMap.set(key, {
            id: log.id,
            date: log.created_at,
            employee: log.employees?.full_name || "ไม่ทราบชื่อ",
            branch: log.branches?.name || "-",
            check_in: null,
            check_out: null,
            late_minutes: 0,
            ot_minutes: 0,
            in_lat: null, in_lng: null, out_lat: null, out_lng: null,
            in_selfie: null, out_selfie: null
          });
        }

        const entry = logMap.get(key);
        if (log.log_type === 'check_in') {
          entry.check_in = log.check_in;
          entry.late_minutes = log.late_minutes || 0;
          entry.in_lat = log.lat;
          entry.in_lng = log.lng;
          entry.in_selfie = log.selfie_url;
        } else if (log.log_type === 'check_out') {
          entry.check_out = log.check_out;
          entry.ot_minutes = log.ot_minutes || 0;
          entry.out_lat = log.lat;
          entry.out_lng = log.lng;
          entry.out_selfie = log.selfie_url;
        }
      });

      setLogs(Array.from(logMap.values()));
    } catch (err) {
      Swal.fire('เกิดข้อผิดพลาด!', err.message, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!user) return navigate("/login");
    // ตั้งค่าเริ่มต้นให้ดึงข้อมูลของเดือนนี้
    const today = new Date();
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).toLocaleDateString('en-CA');
    const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0).toLocaleDateString('en-CA');
    setStartDate(firstDay);
    setEndDate(lastDay);
  }, [user, navigate]);

  // ดึงข้อมูลเมื่อ startDate หรือ endDate เปลี่ยนแปลง (หลังจากตั้งค่าเริ่มต้นเสร็จ)
  useEffect(() => {
    if (startDate && endDate) {
      fetchHistory();
    }
  }, [startDate, endDate]);

  const handleClearFilter = () => {
    setStartDate("");
    setEndDate("");
    // ใช้ setTimeout เพื่อให้ State อัปเดตก่อนดึงข้อมูล
    setTimeout(() => fetchHistory(), 100);
  };

  // 🗺️ Popup โชว์พิกัด Google Maps
  const viewLocation = (lat, lng, empName) => {
    if (!lat || !lng) return Swal.fire('ไม่พบพิกัด', 'ไม่มีการบันทึกพิกัดในรายการนี้', 'warning');
    Swal.fire({
      title: `<span class="font-black text-slate-800 text-xl">📍 พิกัดของ ${empName}</span>`,
      html: `
        <div class="rounded-2xl overflow-hidden border-2 border-slate-200 mt-2 shadow-inner">
          <iframe 
            width="100%" height="300" 
            src="https://maps.google.com/maps?q=$?q=${lat},${lng}&z=16&output=embed" 
            frameborder="0" style="border:0;" allowfullscreen>
          </iframe>
        </div>
      `,
      buttonsStyling: false,
      customClass: {
        popup: 'rounded-[2rem] shadow-2xl border border-white',
        confirmButton: 'bg-slate-800 text-white rounded-2xl px-8 py-3 font-black mt-4 w-full shadow-md hover:bg-slate-700 transition-colors'
      },
      confirmButtonText: 'ปิดหน้าต่าง'
    });
  };

  // 📸 Popup โชว์รูปถ่ายเซลฟี่
  const viewSelfie = (urlIn, urlOut, empName) => {
    if (!urlIn && !urlOut) return Swal.fire('ไม่พบรูปภาพ', 'ไม่มีการบันทึกรูปเซลฟี่ในรายการนี้', 'warning');
    
    let htmlContent = `<div class="flex flex-col gap-4 mt-2">`;
    if (urlIn) htmlContent += `<div><p class="text-xs font-bold text-slate-500 mb-1">🌞 รูปเข้างาน</p><img src="${urlIn}" class="rounded-2xl border-4 border-emerald-100 object-cover w-full max-h-[250px]" alt="In" /></div>`;
    if (urlOut) htmlContent += `<div><p class="text-xs font-bold text-slate-500 mb-1">🌙 รูปออกงาน</p><img src="${urlOut}" class="rounded-2xl border-4 border-rose-100 object-cover w-full max-h-[250px]" alt="Out" /></div>`;
    htmlContent += `</div>`;

    Swal.fire({
      title: `<span class="font-black text-slate-800 text-lg">📸 หลักฐานของ ${empName}</span>`,
      html: htmlContent,
      buttonsStyling: false,
      customClass: {
        popup: 'rounded-[2rem] shadow-2xl border border-white',
        confirmButton: 'bg-pink-500 text-white rounded-2xl px-8 py-3 font-black mt-4 w-full shadow-md hover:bg-pink-600 transition-colors'
      },
      confirmButtonText: 'ปิดหน้าต่าง'
    });
  };

  return (
    <div className="flex h-screen bg-[#F8F4FF] font-sans overflow-hidden">
      
      {/* 🍔 Mobile Sidebar Overlay */}
      {isSidebarOpen && <div className="fixed inset-0 bg-slate-900/50 z-30 lg:hidden backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)}></div>}

      {/* 🧭 Sidebar */}
      <div className={`fixed lg:static inset-y-0 left-0 w-64 bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white flex flex-col justify-between shadow-2xl z-40 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div>
          <div className="p-6 flex items-center justify-between border-b border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg"><span className="text-xl">🥞</span></div>
              <h1 className="text-lg font-black tracking-widest text-white uppercase">Pancake</h1>
            </div>
            <button className="lg:hidden text-white/50 hover:text-white text-2xl" onClick={() => setIsSidebarOpen(false)}>✕</button>
          </div>
          <div className="p-6">
            <div className="flex items-center gap-4 bg-white/5 p-4 rounded-2xl border border-white/10 shadow-inner">
              <div className="w-12 h-12 bg-gradient-to-tr from-pink-400 to-pink-600 rounded-full flex items-center justify-center text-white font-black text-xl shadow-md">{user?.full_name?.charAt(0) || 'U'}</div>
              <div className="flex flex-col overflow-hidden">
                <span className="font-bold text-sm truncate text-slate-100">{user?.full_name}</span>
                <span className="text-[10px] text-pink-400 uppercase tracking-widest font-black mt-0.5">{user?.role === 'ceo' ? t.roleCEO : (user?.role === 'admin' ? t.roleAdmin : t.roleStaff)}</span>
              </div>
            </div>
          </div>
          <nav className="space-y-2 px-4">
            <button onClick={() => navigate('/dashboard')} className="w-full flex items-center gap-3 px-5 py-4 rounded-2xl font-bold text-sm transition-all text-slate-400 hover:bg-white/5 hover:text-white">{t.menuDash}</button>
            <button onClick={() => navigate('/checkin')} className="w-full flex items-center gap-3 px-5 py-4 rounded-2xl font-bold text-sm transition-all text-slate-400 hover:bg-white/5 hover:text-white">{t.menuCheck}</button>
            <button className="w-full flex items-center gap-3 px-5 py-4 rounded-2xl font-bold text-sm transition-all border bg-gradient-to-r from-pink-500/20 to-purple-600/20 border-pink-500/30 text-pink-100 shadow-sm relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-pink-500 rounded-r-full"></div>
              {t.menuHistory}
            </button>
          </nav>
        </div>
        <div className="p-6">
          <button onClick={() => { localStorage.removeItem('titan_user'); navigate('/login'); }} className="w-full flex items-center justify-center gap-2 text-slate-400 hover:bg-rose-500/10 hover:text-rose-400 hover:border-rose-500/30 border border-transparent px-4 py-4 rounded-2xl font-bold text-sm transition-all">{t.menuLogout}</button>
        </div>
      </div>

      {/* 📱 Main Content Area */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto relative p-4 md:p-8 w-full bg-[#F8F4FF]">
        
        {/* 🎨 Background Blur Elements */}
        <div className="absolute top-0 right-0 w-72 h-72 bg-pink-300 rounded-full blur-[100px] opacity-20 mix-blend-multiply pointer-events-none"></div>
        
        {/* Mobile Header */}
        <div className="w-full flex items-center justify-between mb-6 z-10 lg:hidden">
          <button className="text-slate-800 bg-white/80 backdrop-blur-md p-3 rounded-2xl shadow-sm border border-white" onClick={() => setIsSidebarOpen(true)}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>
        </div>

        {/* 📋 Header Section */}
        <div className="z-10 mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tighter mb-2">{t.title}</h1>
            <p className="text-slate-500 font-bold text-sm">{t.subtitle} {(user?.role === 'admin' || user?.role === 'ceo') ? "(สิทธิ์ผู้บริหาร: ดูได้ทุกคน)" : "(สิทธิ์พนักงาน: ดูได้เฉพาะตัวเอง)"}</p>
          </div>

          {/* 🔍 Date Filter Section */}
          <div className="bg-white/80 backdrop-blur-md p-3 rounded-[1.5rem] shadow-sm border border-slate-100 flex flex-col sm:flex-row items-center gap-3">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{t.startDate}</span>
              <input 
                type="date" 
                value={startDate} 
                onChange={(e) => setStartDate(e.target.value)} 
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-bold text-slate-600 outline-none focus:border-pink-400 w-full sm:w-auto"
              />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest">{t.endDate}</span>
              <input 
                type="date" 
                value={endDate} 
                onChange={(e) => setEndDate(e.target.value)} 
                className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm font-bold text-slate-600 outline-none focus:border-pink-400 w-full sm:w-auto"
              />
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <button onClick={fetchHistory} className="flex-1 sm:flex-none bg-slate-800 text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-slate-700 transition-colors">{t.btnSearch}</button>
              <button onClick={handleClearFilter} className="flex-1 sm:flex-none bg-rose-50 text-rose-500 px-4 py-2 rounded-xl font-bold text-sm hover:bg-rose-100 transition-colors">{t.btnClear}</button>
            </div>
          </div>
        </div>

        {/* 📊 Data Table Card */}
        <div className="bg-white/90 backdrop-blur-xl rounded-[2rem] shadow-sm border border-white overflow-hidden z-10 flex-1 flex flex-col">
          {isLoading ? (
            <div className="flex-1 flex items-center justify-center text-pink-500 font-black animate-pulse text-lg tracking-widest">กำลังดึงข้อมูล...</div>
          ) : (
            <div className="overflow-x-auto p-4 md:p-6">
              <table className="w-full text-left border-separate border-spacing-y-2">
                <thead>
                  <tr className="text-[11px] text-slate-400 uppercase tracking-widest font-black">
                    <th className="px-4 py-3">{t.colDate}</th>
                    {(user?.role === 'admin' || user?.role === 'ceo') && <th className="px-4 py-3">{t.colName}</th>}
                    <th className="px-4 py-3">{t.colBranch}</th>
                    <th className="px-4 py-3 text-center">{t.colIn}</th>
                    <th className="px-4 py-3 text-center">{t.colOut}</th>
                    <th className="px-4 py-3 text-center">{t.colLate}</th>
                    <th className="px-4 py-3 text-center">{t.colOT}</th>
                    <th className="px-4 py-3 text-right">{t.colAction}</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.length === 0 ? (
                    <tr><td colSpan="8" className="text-center py-12 text-slate-400 font-bold bg-slate-50 rounded-2xl">{t.noData}</td></tr>
                  ) : (
                    logs.map((log) => {
                      const dateObj = new Date(log.date);
                      const displayDate = dateObj.toLocaleDateString('th-TH', { day: '2-digit', month: 'short', year: 'numeric' });
                      
                      return (
                        <tr key={log.id} className="bg-slate-50 hover:bg-white hover:shadow-md transition-all group">
                          <td className="px-4 py-4 rounded-l-2xl font-bold text-slate-600 text-sm">{displayDate}</td>
                          
                          {(user?.role === 'admin' || user?.role === 'ceo') && (
                            <td className="px-4 py-4 font-black text-slate-800 text-sm">{log.employee}</td>
                          )}
                          
                          <td className="px-4 py-4 text-xs font-bold text-slate-500">{log.branch}</td>
                          
                          <td className="px-4 py-4 text-center">
                            {log.check_in ? <span className="bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-lg font-black text-xs">{log.check_in}</span> : "-"}
                          </td>
                          <td className="px-4 py-4 text-center">
                            {log.check_out ? <span className="bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg font-black text-xs">{log.check_out}</span> : "-"}
                          </td>
                          
                          <td className="px-4 py-4 text-center">
                            {log.late_minutes > 0 ? <span className="text-rose-500 font-black text-xs">{log.late_minutes} นาที</span> : <span className="text-slate-300 font-bold text-xs">-</span>}
                          </td>
                          <td className="px-4 py-4 text-center">
                            {log.ot_minutes > 0 ? <span className="text-indigo-500 font-black text-xs">+{log.ot_minutes} นาที</span> : <span className="text-slate-300 font-bold text-xs">-</span>}
                          </td>
                          
                          <td className="px-4 py-4 rounded-r-2xl text-right">
                            <div className="flex gap-2 justify-end opacity-80 group-hover:opacity-100 transition-opacity">
                              <button 
                                onClick={() => viewLocation(log.in_lat || log.out_lat, log.in_lng || log.out_lng, log.employee)}
                                className="bg-white border border-slate-200 hover:border-blue-400 text-blue-500 px-3 py-1.5 rounded-xl font-black text-[10px] shadow-sm flex items-center gap-1 transition-all"
                              >
                                {t.btnMap}
                              </button>
                              
                              {(log.in_selfie || log.out_selfie) && (
                                <button 
                                  onClick={() => viewSelfie(log.in_selfie, log.out_selfie, log.employee)}
                                  className="bg-pink-50 text-pink-500 hover:bg-pink-100 px-3 py-1.5 rounded-xl font-black text-[10px] shadow-sm flex items-center gap-1 transition-all"
                                >
                                  {t.btnPhoto}
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}