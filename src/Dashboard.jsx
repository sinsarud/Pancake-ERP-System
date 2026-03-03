import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./supabase";

// 🌐 ระบบแปลภาษา 100%
const translations = {
  TH: {
    menuDash: "หน้าแรก (Dashboard)", menuHist: "ข้อมูลการลา (History)", menuAdjust: "แจ้งปรับปรุง (Adjust)", menuCheck: "ลงเวลา (Timestamp)", menuApprove: "อนุมัติคำขอ", menuLogout: "ออกจากระบบ",
    welcome: "ยินดีต้อนรับกลับมา 🚀", adminCenter: "ศูนย์อนุมัติคำขอ (Admin Center)", createBtn: "สร้างใหม่ (ลางาน)", adjustBtn: "แจ้งปรับปรุงเวลา",
    stat1: "สิทธิ์วันลาคงเหลือรวม", stat2: "% อัตราการอนุมัติ", stat3: "พนักงานเข้างาน (วันนี้)", stat4: "ความสมบูรณ์ระบบ",
    boxPending: "รายการรออนุมัติ", boxStats: "สถิติการลา (ปีนี้)", boxQuota: "โควต้าวันลาคงเหลือ", boxCal: "ปฏิทินทีม",
    seeAll: "ดูทั้งหมด", noPending: "🎉 เยี่ยมมาก! ไม่มีรายการค้างพิจารณา",
    thType: "ประเภท", thTotal: "สิทธิ์รวม", thUsed: "ใช้ไป", thRemain: "คงเหลือ",
    chartPie: "วงกลม", chartBar: "กราฟแท่ง", chartLine: "กราฟเส้น",
    monthNames: ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"],
    dayNames: ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส']
  },
  EN: {
    menuDash: "Dashboard", menuHist: "Leave History", menuAdjust: "Adjustments", menuCheck: "Timestamp", menuApprove: "Approvals", menuLogout: "Logout",
    welcome: "Welcome back 🚀", adminCenter: "Approval Center (Admin)", createBtn: "New Leave", adjustBtn: "New Adjustment",
    stat1: "Total Leave Balance", stat2: "Approval Rate", stat3: "Active Staff (Today)", stat4: "System Health",
    boxPending: "Pending Approvals", boxStats: "Leave Statistics", boxQuota: "Leave Quotas", boxCal: "Team Calendar",
    seeAll: "See All", noPending: "🎉 Great! No pending requests.",
    thType: "Type", thTotal: "Total", thUsed: "Used", thRemain: "Remaining",
    chartPie: "Pie", chartBar: "Bar", chartLine: "Line",
    monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
    dayNames: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
  }
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [user] = useState(JSON.parse(localStorage.getItem("titan_user")));
  const [isLoading, setIsLoading] = useState(true);
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState("dashboard"); 
  const [lang, setLang] = useState(localStorage.getItem("titan_lang") || "TH");
  const t = translations[lang];

  const changeLang = (newLang) => {
    setLang(newLang);
    localStorage.setItem("titan_lang", newLang);
  };

  // State ข้อมูล Database
  const [activeStaff, setActiveStaff] = useState(0);
  const [pendingLeaves, setPendingLeaves] = useState([]);
  const [leaveBalances, setLeaveBalances] = useState([]);
  const [allLeaves, setAllLeaves] = useState([]); 
  const [allAdjustments, setAllAdjustments] = useState([]); // เก็บประวัติแจ้งปรับปรุง
  const [approvedPercent, setApprovedPercent] = useState(0);
  
  // State ฝั่ง Admin
  const [adminLeaves, setAdminLeaves] = useState([]);
  const [adminAdjustments, setAdminAdjustments] = useState([]);
  const [adminTab, setAdminTab] = useState('leaves'); // 'leaves' หรือ 'adjustments'

  const [chartType, setChartType] = useState("pie");
  const [filterType, setFilterType] = useState("ALL");
  const [filterStatus, setFilterStatus] = useState("ALL");

  // 📝 Modal ลางาน
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [leaveForm, setLeaveForm] = useState({ type: "ลาป่วย", startDate: "", startTime: "08:00", endDate: "", endTime: "17:00", reason: "" });
  const [calculatedTime, setCalculatedTime] = useState(null);

  // 🛠️ Modal แจ้งปรับปรุง
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [adjustForm, setAdjustForm] = useState({
    tab: "swap", // 'swap' = สลับวันหยุด, 'edit' = แก้ไขเวลา
    oldDate: "", newDate: "",
    incidentDate: "", timeType: "เข้างาน (IN)", oldTime: "", newTime: "",
    reason: ""
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const today = new Date();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).getDay();
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanksArray = Array.from({ length: firstDay }, (_, i) => i);

  useEffect(() => {
    if (!user) return navigate('/login');
    fetchDashboardData();
  }, [user, navigate]);

  const formatDuration = (totalMins) => {
    if (!totalMins || totalMins <= 0) return "0 นาที";
    const d = Math.floor(totalMins / 480);
    const h = Math.floor((totalMins % 480) / 60);
    const m = totalMins % 60;
    let res = [];
    if (d > 0) res.push(`${d} วัน`);
    if (h > 0) res.push(`${h} ชม.`);
    if (m > 0) res.push(`${m} นาที`);
    return res.join(' ');
  };

  useEffect(() => {
    if (leaveForm.startDate && leaveForm.startTime && leaveForm.endDate && leaveForm.endTime) {
      const start = new Date(`${leaveForm.startDate}T${leaveForm.startTime}`);
      const end = new Date(`${leaveForm.endDate}T${leaveForm.endTime}`);
      const diffMs = end - start;
      if (diffMs > 0) {
        const totalMins = Math.floor(diffMs / 60000);
        setCalculatedTime({ text: `ระยะเวลา: ${formatDuration(totalMins)}`, mins: totalMins, isError: false });
      } else {
        setCalculatedTime({ text: "⚠️ วันที่และเวลาสิ้นสุด ต้องมากกว่าเวลาเริ่มต้น", mins: 0, isError: true });
      }
    } else { setCalculatedTime(null); }
  }, [leaveForm]);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const todayStr = new Date().toISOString().split('T')[0];
      const { data: attendance } = await supabase.from('attendance_logs').select('employee_id').gte('created_at', `${todayStr}T00:00:00`);
      setActiveStaff(new Set(attendance?.map(a => a.employee_id)).size || 0);

      const { data: leaves } = await supabase.from('leave_requests').select('*').eq('employee_id', user.id).order('created_at', { ascending: false });
      setAllLeaves(leaves || []);
      setPendingLeaves(leaves?.filter(l => l.status === 'รออนุมัติ').slice(0, 4) || []);

      const { data: adjusts } = await supabase.from('adjustment_requests').select('*').eq('employee_id', user.id).order('created_at', { ascending: false });
      setAllAdjustments(adjusts || []);

      const { data: balances } = await supabase.from('leave_balances').select('*').eq('employee_id', user.id);
      setLeaveBalances(balances?.sort((a, b) => b.total_days - a.total_days) || []);

      if (leaves?.length > 0) {
        const approvedCount = leaves.filter(l => l.status === 'อนุมัติ').length;
        setApprovedPercent(Math.round((approvedCount / leaves.length) * 100));
      } else { setApprovedPercent(100); }

      if (user.role === 'admin' || user.role === 'ceo') {
        const { data: allPendingLeaves } = await supabase.from('leave_requests').select(`*, employees(full_name, email)`).eq('status', 'รออนุมัติ').order('created_at', { ascending: false });
        setAdminLeaves(allPendingLeaves || []);

        const { data: allPendingAdjusts } = await supabase.from('adjustment_requests').select(`*, employees(full_name, email)`).eq('status', 'รออนุมัติ').order('created_at', { ascending: false });
        setAdminAdjustments(allPendingAdjusts || []);
      }
    } catch (error) { console.error(error); } finally { setIsLoading(false); }
  };

  // 🚀 ส่งคำขอลา
  const handleSubmitLeave = async (e) => {
    e.preventDefault();
    if (calculatedTime?.isError || !calculatedTime) return alert("กรุณาระบุวันเวลาให้ถูกต้อง");
    setIsSubmitting(true);
    try {
      const { error } = await supabase.from('leave_requests').insert([{
        employee_id: user.id, leave_type: leaveForm.type, start_date: leaveForm.startDate, start_time: leaveForm.startTime,
        end_date: leaveForm.endDate, end_time: leaveForm.endTime, duration_minutes: calculatedTime.mins, reason: leaveForm.reason, status: 'รออนุมัติ'
      }]);
      if (error) throw error;
      
      await fetch('/api/send-line', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetId: import.meta.env.VITE_LINE_ADMIN_ID, messageText: `🔔 [ใบลาใหม่]\nพนักงาน: ${user.full_name}\nประเภท: ${leaveForm.type}\nสถานะ: รออนุมัติ` })
      }).catch(err => console.error(err));

      alert("🎉 ส่งคำขอลาหยุดเรียบร้อยแล้ว!");
      setIsLeaveModalOpen(false);
      setLeaveForm({ type: "ลาป่วย", startDate: "", startTime: "08:00", endDate: "", endTime: "17:00", reason: "" });
      fetchDashboardData();
    } catch (error) { alert("Error: " + error.message); } finally { setIsSubmitting(false); }
  };

  // 🛠️ ส่งคำขอปรับปรุง
  const handleSubmitAdjustment = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const reqType = adjustForm.tab === 'swap' ? 'สลับวันหยุด' : 'แก้ไขเวลา';
      const payload = {
        employee_id: user.id,
        request_type: reqType,
        status: 'รออนุมัติ',
        reason: adjustForm.reason,
        old_date: adjustForm.tab === 'swap' ? adjustForm.oldDate : null,
        new_date: adjustForm.tab === 'swap' ? adjustForm.newDate : null,
        incident_date: adjustForm.tab === 'edit' ? adjustForm.incidentDate : null,
        time_type: adjustForm.tab === 'edit' ? adjustForm.timeType : null,
        old_time: adjustForm.tab === 'edit' ? adjustForm.oldTime : null,
        new_time: adjustForm.tab === 'edit' ? adjustForm.newTime : null,
      };

      const { error } = await supabase.from('adjustment_requests').insert([payload]);
      if (error) throw error;
      
      await fetch('/api/send-line', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetId: import.meta.env.VITE_LINE_ADMIN_ID, messageText: `🛠️ [แจ้งปรับปรุง]\nพนักงาน: ${user.full_name}\nประเภท: ${reqType}\nสถานะ: รออนุมัติ` })
      }).catch(err => console.error(err));

      alert("🎉 ส่งคำขอปรับปรุงเรียบร้อยแล้ว!");
      setIsAdjustModalOpen(false);
      setAdjustForm({ tab: "swap", oldDate: "", newDate: "", incidentDate: "", timeType: "เข้างาน (IN)", oldTime: "", newTime: "", reason: "" });
      fetchDashboardData();
    } catch (error) { alert("Error: " + error.message); } finally { setIsSubmitting(false); }
  };

  // 👑 อนุมัติการลา (Admin)
  const handleApproveLeave = async (id, email, name, status, mins, empId, type) => {
    try {
      await supabase.from('leave_requests').update({ status }).eq('id', id);
      if (status === 'อนุมัติ') {
        const { data: bal } = await supabase.from('leave_balances').select('used_minutes').eq('employee_id', empId).eq('leave_type', type).single();
        if (bal) await supabase.from('leave_balances').update({ used_minutes: bal.used_minutes + mins }).eq('employee_id', empId).eq('leave_type', type);
      }
      alert(`บันทึกสถานะเรียบร้อยแล้ว`);
      fetchDashboardData();
    } catch (error) { alert("เกิดข้อผิดพลาด: " + error.message); }
  };

  // 👑 อนุมัติปรับปรุง (Admin)
  const handleApproveAdjust = async (id, email, name, status) => {
    try {
      await supabase.from('adjustment_requests').update({ status }).eq('id', id);
      alert(`บันทึกสถานะเรียบร้อยแล้ว`);
      fetchDashboardData();
    } catch (error) { alert("เกิดข้อผิดพลาด: " + error.message); }
  };

  const filteredLeaves = allLeaves.filter(l => (filterType === "ALL" || l.leave_type === filterType) && (filterStatus === "ALL" || l.status === filterStatus));
  const filteredAdjusts = allAdjustments.filter(a => (filterType === "ALL" || a.request_type === filterType) && (filterStatus === "ALL" || a.status === filterStatus));
  
  const totalLeavesCount = allLeaves.length;
  const sickP = totalLeavesCount === 0 ? 45 : Math.round((allLeaves.filter(l=>l.leave_type==='ลาป่วย').length / totalLeavesCount) * 100);
  const persP = totalLeavesCount === 0 ? 30 : Math.round((allLeaves.filter(l=>l.leave_type==='ลากิจ').length / totalLeavesCount) * 100);
  const vacP = totalLeavesCount === 0 ? 15 : Math.round((allLeaves.filter(l=>l.leave_type==='ลาพักร้อน').length / totalLeavesCount) * 100);

  const monthlyData = Array(12).fill(0);
  allLeaves.forEach(l => { monthlyData[new Date(l.created_at).getMonth()] += 1; });
  const maxMonthly = Math.max(...monthlyData, 1);

  if (isLoading) return <div className="h-screen flex items-center justify-center bg-[#F8F4FF] text-pink-500 font-bold text-xl">⏳ Loading Pancake ERP...</div>;

  return (
    <div className="flex h-screen bg-[#F8F4FF] font-sans overflow-hidden relative">
      
      {isSidebarOpen && <div className="fixed inset-0 bg-slate-900/50 z-30 lg:hidden backdrop-blur-sm" onClick={() => setIsSidebarOpen(false)}></div>}

      {/* 🟣 Sidebar */}
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
            <div className="flex items-center gap-3 bg-white/10 p-3 rounded-xl border border-white/20">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-pink-600 font-black text-xl">{user?.full_name?.charAt(0) || 'U'}</div>
              <div className="flex flex-col overflow-hidden">
                <span className="font-bold text-sm truncate">{user?.full_name}</span>
                <span className="text-xs text-pink-200 capitalize font-medium">{user?.role || 'Staff'}</span>
              </div>
            </div>
          </div>
          <nav className="space-y-2 px-4">
            <button onClick={() => { setCurrentView("dashboard"); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-xl font-bold text-sm transition-all border ${currentView === 'dashboard' ? 'bg-white/20 border-white/10 text-white shadow-sm' : 'border-transparent text-white/70 hover:bg-white/10 hover:text-white'}`}>🏠 {t.menuDash}</button>
            <button onClick={() => { setCurrentView("history"); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-xl font-bold text-sm transition-all border ${currentView === 'history' ? 'bg-white/20 border-white/10 text-white shadow-sm' : 'border-transparent text-white/70 hover:bg-white/10 hover:text-white'}`}>📋 {t.menuHist}</button>
            
            {/* 🛠️ เมนูใหม่: แจ้งปรับปรุง */}
            <button onClick={() => { setCurrentView("adjustments"); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-xl font-bold text-sm transition-all border ${currentView === 'adjustments' ? 'bg-white/20 border-white/10 text-white shadow-sm' : 'border-transparent text-white/70 hover:bg-white/10 hover:text-white'}`}>🛠️ {t.menuAdjust}</button>

            <button onClick={() => navigate('/check-in')} className="w-full flex items-center gap-3 text-white/70 hover:bg-white/10 hover:text-white px-5 py-3.5 rounded-xl font-bold text-sm transition-all border border-transparent">⏰ {t.menuCheck}</button>
            
            {(user?.role === 'admin' || user?.role === 'ceo') && (
              <button onClick={() => { setCurrentView("approvals"); setIsSidebarOpen(false); }} className={`w-full flex items-center justify-between px-5 py-3.5 rounded-xl font-bold text-sm transition-all border mt-4 ${currentView === 'approvals' ? 'bg-rose-500/80 border-rose-300 text-white shadow-lg' : 'border-rose-500/30 text-rose-100 hover:bg-rose-500/50'}`}>
                <span className="flex items-center gap-3">✅ {t.menuApprove}</span>
                {(adminLeaves.length + adminAdjustments.length) > 0 && <span className="bg-white text-rose-600 text-xs px-2 py-0.5 rounded-full">{adminLeaves.length + adminAdjustments.length}</span>}
              </button>
            )}
          </nav>
        </div>
        <div className="p-4">
          <button onClick={() => { localStorage.removeItem('titan_user'); navigate('/login'); }} className="w-full flex items-center justify-center gap-2 text-white/70 hover:bg-rose-500 hover:text-white px-4 py-3.5 rounded-xl font-bold text-sm transition-all">🚪 {t.menuLogout}</button>
        </div>
      </div>

      {/* ⚪ Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto relative w-full">
        <div className="absolute top-0 right-0 w-96 h-96 bg-pink-200 rounded-full blur-[100px] opacity-40 mix-blend-multiply pointer-events-none"></div>

        {/* 📱 Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 md:p-8 z-10 gap-4">
          <div className="flex items-center gap-3 w-full md:w-auto">
            <button className="lg:hidden text-slate-800 bg-white p-2 rounded-lg shadow-sm" onClick={() => setIsSidebarOpen(true)}>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            <div>
              <p className="text-pink-500 font-bold text-xs md:text-sm tracking-widest uppercase mb-1">{currentView === 'approvals' ? t.adminCenter : t.welcome}</p>
              <h2 className="text-xl md:text-3xl font-black text-slate-800 tracking-tight">{currentView === 'approvals' ? 'Admin Center' : user?.full_name}</h2>
            </div>
          </div>
          
          <div className="flex items-center gap-2 md:gap-4 w-full md:w-auto justify-end">
            <div className="bg-white p-1 rounded-full shadow-sm border border-slate-200 flex items-center">
              <button onClick={() => changeLang("TH")} className={`px-3 md:px-4 py-1.5 rounded-full font-bold text-[10px] md:text-xs transition-all ${lang === "TH" ? "bg-slate-800 text-white shadow-md" : "text-slate-400 hover:text-slate-600"}`}>TH</button>
              <button onClick={() => changeLang("EN")} className={`px-3 md:px-4 py-1.5 rounded-full font-bold text-[10px] md:text-xs transition-all ${lang === "EN" ? "bg-slate-800 text-white shadow-md" : "text-slate-400 hover:text-slate-600"}`}>EN</button>
            </div>
            
            {/* ปุ่มสร้างใบลา (ซ่อนในมือถือถ้ามีพื้นที่น้อย) */}
            <button onClick={() => setIsLeaveModalOpen(true)} className="hidden sm:flex bg-gradient-to-r from-pink-500 to-rose-500 text-white px-4 md:px-6 py-2.5 rounded-full font-black text-xs md:text-sm shadow-md hover:-translate-y-0.5 transition-all items-center gap-2 whitespace-nowrap">
              <span>+</span> {t.createBtn}
            </button>
            
            {/* 🛠️ ปุ่มแจ้งปรับปรุง */}
            <button onClick={() => setIsAdjustModalOpen(true)} className="bg-white border-2 border-slate-100 hover:border-purple-300 text-purple-600 px-4 md:px-6 py-2 rounded-full font-black text-xs md:text-sm shadow-sm transition-all flex items-center gap-2 whitespace-nowrap">
              <span>🛠️</span> <span className="hidden sm:inline">{t.adjustBtn}</span>
            </button>
          </div>
        </div>

        {/* ✅ VIEW: DASHBOARD */}
        {currentView === "dashboard" && (
          <div className="px-4 md:px-8 space-y-6 z-10 pb-8">
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                <div className="bg-gradient-to-br from-pink-400 to-purple-500 rounded-[1.5rem] md:rounded-[2rem] p-5 md:p-6 text-white shadow-lg relative overflow-hidden"><p className="font-bold text-xs md:text-sm opacity-90">{t.stat1}</p><h3 className="text-2xl md:text-3xl font-black mt-1 md:mt-2">{formatDuration(leaveBalances.reduce((sum, b) => sum + ((b.total_days * 480) - b.used_minutes), 0))}</h3></div>
                <div className="bg-gradient-to-br from-purple-400 to-indigo-500 rounded-[1.5rem] md:rounded-[2rem] p-5 md:p-6 text-white shadow-lg"><p className="font-bold text-xs md:text-sm opacity-90">{t.stat2}</p><h3 className="text-2xl md:text-3xl font-black mt-1 md:mt-2">{approvedPercent}%</h3></div>
                <div className="bg-gradient-to-br from-pink-500 to-rose-500 rounded-[1.5rem] md:rounded-[2rem] p-5 md:p-6 text-white shadow-lg"><p className="font-bold text-xs md:text-sm opacity-90">{t.stat3}</p><h3 className="text-2xl md:text-3xl font-black mt-1 md:mt-2">{activeStaff}</h3></div>
                <div className="bg-gradient-to-br from-emerald-400 to-teal-500 rounded-[1.5rem] md:rounded-[2rem] p-5 md:p-6 text-white shadow-lg"><p className="font-bold text-xs md:text-sm opacity-90">{t.stat4}</p><h3 className="text-2xl md:text-3xl font-black mt-1 md:mt-2">100%</h3></div>
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                <div className="bg-white/80 backdrop-blur-xl rounded-[1.5rem] md:rounded-[2rem] p-5 md:p-7 shadow-sm border border-white h-[350px] md:h-[380px] flex flex-col">
                  <div className="flex justify-between items-center mb-4 md:mb-5">
                     <h4 className="font-black text-slate-800 flex items-center gap-2 md:gap-3 text-base md:text-lg"><span className="p-1.5 md:p-2 bg-pink-100 text-pink-500 rounded-lg md:rounded-xl">📝</span> {t.boxPending}</h4>
                     <button onClick={() => setCurrentView("history")} className="text-[10px] md:text-xs font-bold text-pink-500 hover:underline">{t.seeAll}</button>
                  </div>
                  <div className="flex-1 overflow-y-auto pr-1 md:pr-2 space-y-2 md:space-y-3">
                    {pendingLeaves.length === 0 ? <div className="h-full flex flex-col items-center justify-center text-slate-400 font-bold text-xs md:text-sm">{t.noPending}</div> : (
                      pendingLeaves.map(leave => (
                        <div key={leave.id} className="flex justify-between items-center p-2.5 md:p-3 bg-slate-50 hover:bg-pink-50 rounded-xl md:rounded-2xl transition-colors border border-slate-100"><span className="text-[10px] md:text-sm text-slate-500 font-medium bg-white px-2 md:px-3 py-1 rounded-md md:rounded-lg border border-slate-100">{new Date(leave.created_at).toLocaleDateString(lang === 'TH' ? 'th-TH' : 'en-US')}</span><span className="text-xs md:text-sm font-black text-slate-700 truncate mx-2">{leave.leave_type}</span><span className="text-[10px] md:text-xs bg-amber-100 text-amber-600 px-2 md:px-3 py-1 md:py-1.5 rounded-full font-black tracking-wide whitespace-nowrap">{leave.status}</span></div>
                      ))
                    )}
                  </div>
                </div>

                <div className="bg-white/80 backdrop-blur-xl rounded-[1.5rem] md:rounded-[2rem] p-5 md:p-7 shadow-sm border border-white h-[350px] md:h-[380px] flex flex-col">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-2">
                    <h4 className="font-black text-slate-800 flex items-center gap-2 md:gap-3 text-base md:text-lg"><span className="p-1.5 md:p-2 bg-purple-100 text-purple-500 rounded-lg md:rounded-xl">📊</span> {t.boxStats}</h4>
                    <div className="flex bg-slate-100 p-1 rounded-lg w-full sm:w-auto overflow-x-auto">
                      <button onClick={()=>setChartType('pie')} className={`flex-1 sm:flex-none px-2 md:px-3 py-1 text-[10px] md:text-xs font-bold rounded-md transition-all whitespace-nowrap ${chartType==='pie' ? 'bg-white text-purple-600 shadow-sm':'text-slate-400'}`}>⭕ {t.chartPie}</button>
                      <button onClick={()=>setChartType('bar')} className={`flex-1 sm:flex-none px-2 md:px-3 py-1 text-[10px] md:text-xs font-bold rounded-md transition-all whitespace-nowrap ${chartType==='bar' ? 'bg-white text-purple-600 shadow-sm':'text-slate-400'}`}>📊 {t.chartBar}</button>
                      <button onClick={()=>setChartType('line')} className={`flex-1 sm:flex-none px-2 md:px-3 py-1 text-[10px] md:text-xs font-bold rounded-md transition-all whitespace-nowrap ${chartType==='line' ? 'bg-white text-purple-600 shadow-sm':'text-slate-400'}`}>📈 {t.chartLine}</button>
                    </div>
                  </div>
                  <div className="flex-1 flex items-center justify-center pt-2">
                    {chartType === 'pie' && (<div className="flex flex-col sm:flex-row items-center justify-center gap-6 md:gap-8 w-full"><div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full shadow-inner flex-shrink-0" style={{ background: `conic-gradient(#F472B6 0% ${sickP}%, #A855F7 ${sickP}% ${sickP+persP}%, #34D399 ${sickP+persP}% ${sickP+persP+vacP}%, #FBBF24 ${sickP+persP+vacP}% 100%)` }}><div className="absolute inset-3 md:inset-4 bg-white rounded-full flex flex-col items-center justify-center shadow-inner"><span className="text-xl md:text-2xl font-black">{totalLeavesCount}</span><span className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase">Requests</span></div></div><div className="space-y-2 md:space-y-3 w-full sm:w-auto grid grid-cols-2 sm:grid-cols-1 gap-2 sm:gap-0"><div className="flex gap-2 items-center"><div className="w-3 h-3 rounded-sm bg-[#F472B6]"></div><span className="text-[10px] md:text-xs font-bold text-slate-600">ลาป่วย ({sickP}%)</span></div><div className="flex gap-2 items-center"><div className="w-3 h-3 rounded-sm bg-[#A855F7]"></div><span className="text-[10px] md:text-xs font-bold text-slate-600">ลากิจ ({persP}%)</span></div><div className="flex gap-2 items-center"><div className="w-3 h-3 rounded-sm bg-[#34D399]"></div><span className="text-[10px] md:text-xs font-bold text-slate-600">พักร้อน ({vacP}%)</span></div><div className="flex gap-2 items-center"><div className="w-3 h-3 rounded-sm bg-[#FBBF24]"></div><span className="text-[10px] md:text-xs font-bold text-slate-600">อื่นๆ</span></div></div></div>)}
                    {chartType === 'bar' && (<div className="w-full h-full flex items-end justify-between gap-0.5 md:gap-1 px-1 md:px-2 pb-2">{monthlyData.map((val, i) => (<div key={i} className="flex flex-col items-center flex-1 group"><div className="w-full bg-slate-50 rounded-t-sm relative flex items-end justify-center" style={{ height: '140px' }}><div className="w-full bg-gradient-to-t from-pink-500 to-purple-400 rounded-t-sm transition-all duration-500 group-hover:opacity-80" style={{ height: `${(val/maxMonthly)*100}%` }}></div>{val > 0 && <span className="absolute -top-4 text-[8px] md:text-[10px] font-bold text-pink-600">{val}</span>}</div><span className="text-[8px] md:text-[10px] font-bold text-slate-400 mt-1 md:mt-2 truncate w-full text-center">{t.monthNames[i].substring(0,3)}</span></div>))}</div>)}
                    {chartType === 'line' && (<div className="w-full h-full flex flex-col justify-end px-1 md:px-2 pb-2 relative"><svg viewBox="0 0 100 100" className="w-full h-[140px] overflow-visible" preserveAspectRatio="none"><polyline points={monthlyData.map((val, i) => `${(i/11)*100},${100 - ((val/maxMonthly)*100)}`).join(" ")} fill="none" stroke="#A855F7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />{monthlyData.map((val, i) => <circle key={i} cx={`${(i/11)*100}`} cy={`${100 - ((val/maxMonthly)*100)}`} r="1.5" fill="#F472B6" />)}</svg><div className="flex justify-between w-full mt-2">{monthlyData.map((_, i) => <span key={i} className="text-[8px] md:text-[10px] font-bold text-slate-400 w-full text-center truncate">{t.monthNames[i].substring(0,3)}</span>)}</div></div>)}
                  </div>
                </div>
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                <div className="bg-white/80 backdrop-blur-xl rounded-[1.5rem] md:rounded-[2rem] p-5 md:p-7 shadow-sm border border-white h-[350px] flex flex-col overflow-hidden">
                  <h4 className="font-black text-slate-800 flex items-center gap-2 md:gap-3 mb-4 md:mb-5 text-base md:text-lg"><span className="p-1.5 md:p-2 bg-emerald-100 text-emerald-500 rounded-lg md:rounded-xl">📑</span> {t.boxQuota}</h4>
                  <div className="flex-1 overflow-x-auto overflow-y-auto pr-1 md:pr-2 w-full"><table className="w-full text-left border-separate border-spacing-y-2 min-w-[400px]"><thead className="text-[10px] md:text-xs text-slate-400 bg-slate-50 sticky top-0 z-10"><tr><th className="p-2 md:p-3 rounded-l-lg md:rounded-l-xl">{t.thType}</th><th className="p-2 md:p-3 text-center">{t.thTotal}</th><th className="p-2 md:p-3 text-center">{t.thUsed}</th><th className="p-2 md:p-3 text-right rounded-r-lg md:rounded-r-xl">{t.thRemain}</th></tr></thead><tbody>{leaveBalances.map(b => (<tr key={b.id} className="bg-white shadow-sm hover:border-pink-200 transition-colors"><td className="p-2 md:p-3 font-bold text-slate-700 text-xs md:text-sm rounded-l-lg md:rounded-l-xl whitespace-nowrap">{b.leave_type}</td><td className="p-2 md:p-3 text-slate-400 text-center text-[10px] md:text-xs whitespace-nowrap">{formatDuration(b.total_days * 480)}</td><td className="p-2 md:p-3 text-rose-500 font-bold text-center text-[10px] md:text-xs whitespace-nowrap">{formatDuration(b.used_minutes)}</td><td className="p-2 md:p-3 text-emerald-500 font-black text-right text-xs md:text-sm rounded-r-lg md:rounded-r-xl whitespace-nowrap">{formatDuration((b.total_days * 480) - b.used_minutes)}</td></tr>))}</tbody></table></div>
                </div>
                <div className="bg-white/80 backdrop-blur-xl rounded-[1.5rem] md:rounded-[2rem] p-5 md:p-7 shadow-sm border border-white h-[350px] flex flex-col">
                  <div className="flex justify-between items-center mb-4 md:mb-6"><h4 className="font-black text-slate-800 flex items-center gap-2 md:gap-3 text-base md:text-lg"><span className="p-1.5 md:p-2 bg-rose-100 text-rose-500 rounded-lg md:rounded-xl">📆</span> {t.boxCal}</h4><div className="font-bold text-pink-500 bg-pink-50 px-3 md:px-4 py-1 md:py-1.5 rounded-full text-[10px] md:text-sm">{t.monthNames[today.getMonth()]} {lang === 'TH' ? today.getFullYear() + 543 : today.getFullYear()}</div></div>
                  <div className="flex-1 flex flex-col justify-center"><div className="grid grid-cols-7 gap-1 text-center mb-1 md:mb-2">{t.dayNames.map(d => <div key={d} className="text-[10px] md:text-xs font-black text-slate-400 py-1">{d}</div>)}</div><div className="grid grid-cols-7 gap-1 md:gap-1 text-center">{blanksArray.map(b => <div key={`blank-${b}`} className="p-1 md:p-2"></div>)}{daysArray.map(day => (<div key={day} className={`p-0.5 md:p-1 flex justify-center items-center`}><span className={`w-6 h-6 md:w-8 md:h-8 flex items-center justify-center rounded-full font-bold text-[10px] md:text-sm transition-all cursor-default ${day === today.getDate() ? 'bg-gradient-to-tr from-pink-500 to-rose-400 text-white shadow-md transform scale-110' : 'text-slate-600 hover:bg-slate-100'}`}>{day}</span></div>))}</div></div>
                </div>
             </div>
          </div>
        )}

        {/* ✅ VIEW: HISTORY (ประวัติการลา) */}
        {currentView === "history" && (
          <div className="px-4 md:px-8 pb-8 z-10 flex-1 flex flex-col w-full overflow-hidden">
            <div className="bg-white/80 backdrop-blur-xl rounded-[1.5rem] md:rounded-[2rem] p-5 md:p-7 shadow-sm border border-white flex-1 flex flex-col w-full">
              <div className="flex flex-col sm:flex-row justify-between gap-3 md:gap-4 mb-4 md:mb-6 pb-4 md:pb-6 border-b border-slate-100">
                <h3 className="font-black text-slate-800 text-lg md:text-xl flex items-center gap-2">📋 ประวัติการลาของฉัน</h3>
                <div className="flex gap-2 w-full sm:w-auto">
                  <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="flex-1 sm:flex-none bg-slate-50 border border-slate-200 rounded-lg md:rounded-xl px-2 md:px-4 py-2 font-bold outline-none text-[10px] md:text-sm"><option value="ALL">ทุกประเภท</option><option value="ลาป่วย">ลาป่วย</option><option value="ลากิจ">ลากิจ</option><option value="ลาพักร้อน">ลาพักร้อน</option><option value="ลาฉุกเฉิน">ลาฉุกเฉิน</option></select>
                  <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="flex-1 sm:flex-none bg-slate-50 border border-slate-200 rounded-lg md:rounded-xl px-2 md:px-4 py-2 font-bold outline-none text-[10px] md:text-sm"><option value="ALL">ทุกสถานะ</option><option value="รออนุมัติ">รออนุมัติ</option><option value="อนุมัติ">อนุมัติ</option><option value="ไม่อนุมัติ">ไม่อนุมัติ</option></select>
                </div>
              </div>
              <div className="flex-1 overflow-x-auto overflow-y-auto w-full">
                <table className="w-full text-left border-separate border-spacing-y-2 min-w-[600px] md:min-w-full">
                  <thead className="text-[10px] md:text-xs text-slate-400 uppercase bg-slate-50 sticky top-0 z-10">
                    <tr><th className="p-3 md:p-4 rounded-l-lg md:rounded-l-xl">วันที่ยื่น</th><th className="p-3 md:p-4">ประเภท</th><th className="p-3 md:p-4">ระยะเวลา</th><th className="p-3 md:p-4 text-right rounded-r-lg md:rounded-r-xl">สถานะ</th></tr>
                  </thead>
                  <tbody>
                    {filteredLeaves.map(l => (
                      <tr key={l.id} className="bg-white shadow-sm border border-slate-50"><td className="p-3 md:p-4 text-xs md:text-sm font-bold text-slate-500 rounded-l-lg md:rounded-l-xl whitespace-nowrap">{new Date(l.created_at).toLocaleDateString(lang==='TH'?'th-TH':'en-US')}</td><td className="p-3 md:p-4 text-xs md:text-sm font-black text-slate-700 whitespace-nowrap">{l.leave_type}</td><td className="p-3 md:p-4 text-xs md:text-sm font-black text-rose-500 whitespace-nowrap">{formatDuration(l.duration_minutes)}</td><td className="p-3 md:p-4 text-right rounded-r-lg md:rounded-r-xl whitespace-nowrap"><span className={`text-[10px] md:text-xs px-2 md:px-3 py-1 md:py-1.5 rounded-full font-black ${l.status==='อนุมัติ'?'bg-emerald-100 text-emerald-600':l.status==='รออนุมัติ'?'bg-amber-100 text-amber-600':'bg-rose-100 text-rose-600'}`}>{l.status}</span></td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 🛠️ VIEW: ADJUSTMENTS (ประวัติการแจ้งปรับปรุง - เมนูใหม่) */}
        {currentView === "adjustments" && (
          <div className="px-4 md:px-8 pb-8 z-10 flex-1 flex flex-col w-full overflow-hidden">
            <div className="bg-white/80 backdrop-blur-xl rounded-[1.5rem] md:rounded-[2rem] p-5 md:p-7 shadow-sm border border-white flex-1 flex flex-col w-full">
              <div className="flex flex-col sm:flex-row justify-between gap-3 md:gap-4 mb-4 md:mb-6 pb-4 md:pb-6 border-b border-slate-100">
                <h3 className="font-black text-slate-800 text-lg md:text-xl flex items-center gap-2">🛠️ ประวัติคำขอปรับปรุงเวลา/วันหยุด</h3>
                <div className="flex gap-2 w-full sm:w-auto">
                  <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="flex-1 sm:flex-none bg-slate-50 border border-slate-200 rounded-lg md:rounded-xl px-2 md:px-4 py-2 font-bold outline-none text-[10px] md:text-sm"><option value="ALL">ทุกประเภท</option><option value="สลับวันหยุด">สลับวันหยุด</option><option value="แก้ไขเวลา">แก้ไขเวลา</option></select>
                  <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="flex-1 sm:flex-none bg-slate-50 border border-slate-200 rounded-lg md:rounded-xl px-2 md:px-4 py-2 font-bold outline-none text-[10px] md:text-sm"><option value="ALL">ทุกสถานะ</option><option value="รออนุมัติ">รออนุมัติ</option><option value="อนุมัติ">อนุมัติ</option><option value="ไม่อนุมัติ">ไม่อนุมัติ</option></select>
                </div>
              </div>
              <div className="flex-1 overflow-x-auto overflow-y-auto w-full">
                <table className="w-full text-left border-separate border-spacing-y-2 min-w-[600px] md:min-w-full">
                  <thead className="text-[10px] md:text-xs text-slate-400 uppercase bg-slate-50 sticky top-0 z-10">
                    <tr><th className="p-3 md:p-4 rounded-l-lg md:rounded-l-xl">วันที่ยื่นเรื่อง</th><th className="p-3 md:p-4">ประเภทการปรับปรุง</th><th className="p-3 md:p-4">รายละเอียด</th><th className="p-3 md:p-4 text-right rounded-r-lg md:rounded-r-xl">สถานะ</th></tr>
                  </thead>
                  <tbody>
                    {filteredAdjusts.length === 0 ? <tr><td colSpan="4" className="text-center py-10 text-slate-400 font-bold">ไม่พบประวัติการแจ้งปรับปรุง</td></tr> : (
                      filteredAdjusts.map(a => (
                        <tr key={a.id} className="bg-white shadow-sm border border-slate-50">
                          <td className="p-3 md:p-4 text-xs md:text-sm font-bold text-slate-500 rounded-l-lg md:rounded-l-xl whitespace-nowrap">{new Date(a.created_at).toLocaleDateString('th-TH')}</td>
                          <td className="p-3 md:p-4 text-xs md:text-sm font-black text-purple-600 whitespace-nowrap">{a.request_type}</td>
                          <td className="p-3 md:p-4 text-[10px] md:text-xs font-medium text-slate-500">
                            {a.request_type === 'สลับวันหยุด' ? (
                              <span>เปลี่ยนจาก <strong className="text-rose-500">{new Date(a.old_date).toLocaleDateString('th-TH')}</strong> เป็น <strong className="text-emerald-500">{new Date(a.new_date).toLocaleDateString('th-TH')}</strong></span>
                            ) : (
                              <span>วันที่ {new Date(a.incident_date).toLocaleDateString('th-TH')} ({a.time_type}): แก้จาก <strong className="text-rose-500">{a.old_time?.slice(0,5)}</strong> เป็น <strong className="text-emerald-500">{a.new_time?.slice(0,5)}</strong></span>
                            )}
                          </td>
                          <td className="p-3 md:p-4 text-right rounded-r-lg md:rounded-r-xl whitespace-nowrap"><span className={`text-[10px] md:text-xs px-2 md:px-3 py-1 md:py-1.5 rounded-full font-black ${a.status==='อนุมัติ'?'bg-emerald-100 text-emerald-600':a.status==='รออนุมัติ'?'bg-amber-100 text-amber-600':'bg-rose-100 text-rose-600'}`}>{a.status}</span></td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 👑 VIEW: APPROVALS (ระบบ Admin) */}
        {currentView === "approvals" && (
          <div className="px-4 md:px-8 pb-8 z-10 flex-1 flex flex-col">
            <div className="bg-white/80 backdrop-blur-xl rounded-[1.5rem] md:rounded-[2rem] p-5 md:p-7 shadow-lg border border-rose-100 flex-1 flex flex-col">
              
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 md:mb-6 pb-4 md:pb-6 border-b border-slate-100 gap-4">
                <h3 className="font-black text-slate-800 text-lg md:text-xl flex items-center gap-2"><span className="p-1.5 md:p-2 bg-rose-100 text-rose-500 rounded-lg md:rounded-xl text-xl md:text-2xl">✅</span> รายการรออนุมัติทั้งหมด</h3>
                {/* 👑 Tabs สำหรับสลับดู ลางาน กับ แจ้งปรับปรุง */}
                <div className="flex bg-slate-100 p-1 rounded-xl w-full md:w-auto">
                  <button onClick={() => setAdminTab('leaves')} className={`flex-1 md:flex-none px-4 py-2 text-xs md:text-sm font-bold rounded-lg transition-all ${adminTab==='leaves' ? 'bg-white text-rose-500 shadow-sm' : 'text-slate-400'}`}>ลางาน ({adminLeaves.length})</button>
                  <button onClick={() => setAdminTab('adjustments')} className={`flex-1 md:flex-none px-4 py-2 text-xs md:text-sm font-bold rounded-lg transition-all ${adminTab==='adjustments' ? 'bg-white text-purple-600 shadow-sm' : 'text-slate-400'}`}>แจ้งปรับปรุง ({adminAdjustments.length})</button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto pr-1 md:pr-2">
                <div className="space-y-3 md:space-y-4">
                  {/* แสดงรายการลางาน */}
                  {adminTab === 'leaves' && (adminLeaves.length === 0 ? <div className="text-center py-10 md:py-20 text-slate-400 font-bold text-sm md:text-lg">{t.noPending}</div> : (
                    adminLeaves.map(req => (
                      <div key={req.id} className="bg-white border-2 border-slate-100 rounded-xl md:rounded-2xl p-4 md:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between hover:border-pink-300 transition-colors shadow-sm gap-4">
                        <div className="flex gap-3 md:gap-4 items-center w-full sm:w-auto overflow-hidden"><div className="w-10 h-10 md:w-12 md:h-12 flex-shrink-0 bg-gradient-to-tr from-pink-400 to-purple-500 rounded-full flex items-center justify-center text-white font-black text-lg md:text-xl shadow-md">{req.employees?.full_name?.charAt(0)}</div><div className="overflow-hidden"><h4 className="font-black text-slate-800 text-sm md:text-lg truncate">{req.employees?.full_name}</h4><p className="text-[10px] md:text-sm font-bold text-pink-500 mt-0.5 md:mt-1 truncate">{req.leave_type} <span className="text-slate-400 font-medium">| {formatDuration(req.duration_minutes)}</span></p></div></div>
                        <div className="flex gap-2 w-full sm:w-auto"><button onClick={() => handleApproveLeave(req.id, req.employees?.email, req.employees?.full_name, 'ไม่อนุมัติ', req.duration_minutes, req.employee_id, req.leave_type)} className="flex-1 sm:flex-none px-4 py-2 bg-rose-50 text-rose-600 rounded-lg font-black text-xs md:text-sm">ปฏิเสธ</button><button onClick={() => handleApproveLeave(req.id, req.employees?.email, req.employees?.full_name, 'อนุมัติ', req.duration_minutes, req.employee_id, req.leave_type)} className="flex-1 sm:flex-none px-4 py-2 bg-emerald-500 text-white rounded-lg font-black text-xs md:text-sm">✅ อนุมัติ</button></div>
                      </div>
                    ))
                  ))}

                  {/* แสดงรายการแจ้งปรับปรุง */}
                  {adminTab === 'adjustments' && (adminAdjustments.length === 0 ? <div className="text-center py-10 md:py-20 text-slate-400 font-bold text-sm md:text-lg">🎉 ไม่มีคำขอปรับปรุงเวลา</div> : (
                    adminAdjustments.map(req => (
                      <div key={req.id} className="bg-white border-2 border-slate-100 rounded-xl md:rounded-2xl p-4 md:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between hover:border-purple-300 transition-colors shadow-sm gap-4">
                        <div className="flex gap-3 md:gap-4 items-center w-full sm:w-auto overflow-hidden"><div className="w-10 h-10 md:w-12 md:h-12 flex-shrink-0 bg-gradient-to-tr from-purple-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-black text-lg md:text-xl shadow-md">{req.employees?.full_name?.charAt(0)}</div><div className="overflow-hidden"><h4 className="font-black text-slate-800 text-sm md:text-lg truncate">{req.employees?.full_name}</h4><p className="text-[10px] md:text-sm font-bold text-purple-600 mt-0.5 md:mt-1 truncate">{req.request_type}</p></div></div>
                        <div className="flex gap-2 w-full sm:w-auto"><button onClick={() => handleApproveAdjust(req.id, req.employees?.email, req.employees?.full_name, 'ไม่อนุมัติ')} className="flex-1 sm:flex-none px-4 py-2 bg-rose-50 text-rose-600 rounded-lg font-black text-xs md:text-sm">ปฏิเสธ</button><button onClick={() => handleApproveAdjust(req.id, req.employees?.email, req.employees?.full_name, 'อนุมัติ')} className="flex-1 sm:flex-none px-4 py-2 bg-emerald-500 text-white rounded-lg font-black text-xs md:text-sm">✅ อนุมัติ</button></div>
                      </div>
                    ))
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* 🚀 MODAL: ยื่นใบลา (คงของเดิมไว้ให้ครบถ้วน) */}
      {isLeaveModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[1.5rem] md:rounded-[2rem] shadow-2xl w-full max-w-[90%] md:max-w-md overflow-hidden border border-white max-h-[90vh] flex flex-col">
            <div className="p-4 md:p-6 pb-2 md:pb-4 text-center shrink-0"><div className="w-10 h-10 md:w-14 md:h-14 bg-gradient-to-br from-pink-400 to-purple-600 rounded-xl md:rounded-2xl mx-auto flex items-center justify-center shadow-md mb-2 md:mb-4"><span className="text-lg md:text-2xl text-white">💌</span></div><h3 className="font-black text-lg md:text-2xl text-slate-800">ยื่นคำขอลาพักผ่อน</h3></div>
            <form onSubmit={handleSubmitLeave} className="px-4 md:px-6 pb-4 md:pb-6 space-y-3 md:space-y-4 overflow-y-auto flex-1">
              {/* ฟอร์มขอลาย่อเพื่อความกระชับ แต่ใช้งานได้ปกติ */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 border border-slate-200 p-3 rounded-xl bg-slate-50">
                <div><label className="text-[10px] font-bold text-slate-500 mb-1 block">🏷️ ประเภท</label><select value={leaveForm.type} onChange={(e) => setLeaveForm({...leaveForm, type: e.target.value})} className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 font-bold outline-none text-xs"><option value="ลาป่วย">ลาป่วย</option><option value="ลากิจ">ลากิจ</option><option value="ลาพักร้อน">ลาพักร้อน</option><option value="ลาฉุกเฉิน">ลาฉุกเฉิน</option></select></div>
                <div><label className="text-[10px] font-bold text-slate-500 mb-1 block">👤 ผู้ขอลา</label><input type="text" readOnly value={user?.full_name} className="w-full bg-slate-100 border border-slate-200 rounded-lg px-2 py-1.5 font-bold text-slate-400 outline-none text-xs"/></div>
              </div>
              <div className="border border-slate-200 p-3 rounded-xl bg-slate-50 space-y-3">
                <div className="flex items-center gap-2"><span className="text-emerald-500 font-black text-[10px] w-10">START</span><input type="date" required value={leaveForm.startDate} onChange={(e) => setLeaveForm({...leaveForm, startDate: e.target.value})} className="flex-1 bg-white border border-slate-200 rounded-lg px-2 py-1.5 font-bold text-xs"/><input type="time" required value={leaveForm.startTime} onChange={(e) => setLeaveForm({...leaveForm, startTime: e.target.value})} className="w-20 bg-white border border-slate-200 rounded-lg px-2 py-1.5 font-bold text-xs"/></div>
                <div className="flex items-center gap-2"><span className="text-rose-500 font-black text-[10px] w-10">END</span><input type="date" required value={leaveForm.endDate} onChange={(e) => setLeaveForm({...leaveForm, endDate: e.target.value})} className="flex-1 bg-white border border-slate-200 rounded-lg px-2 py-1.5 font-bold text-xs"/><input type="time" required value={leaveForm.endTime} onChange={(e) => setLeaveForm({...leaveForm, endTime: e.target.value})} className="w-20 bg-white border border-slate-200 rounded-lg px-2 py-1.5 font-bold text-xs"/></div>
              </div>
              <textarea rows="2" placeholder="เหตุผลการลา..." value={leaveForm.reason} onChange={(e) => setLeaveForm({...leaveForm, reason: e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2 font-medium outline-none text-xs resize-none shrink-0"></textarea>
              <div className="flex gap-2 pt-1 shrink-0"><button type="submit" disabled={isSubmitting || calculatedTime?.isError} className="flex-1 py-2.5 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-lg font-black text-xs shadow-lg disabled:opacity-50">🚀 ยืนยันคำขอ</button><button type="button" onClick={() => setIsLeaveModalOpen(false)} className="px-4 py-2.5 bg-slate-100 text-slate-600 rounded-lg font-bold text-xs hover:bg-slate-200">ยกเลิก</button></div>
            </form>
          </div>
        </div>
      )}

      {/* 🛠️ MODAL: แจ้งปรับปรุงเวลา (จำลองแบบ 100% จากรูป Mockup) */}
      {isAdjustModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[1.5rem] md:rounded-[2rem] shadow-2xl w-full max-w-[90%] md:max-w-md overflow-hidden border border-white max-h-[90vh] flex flex-col">
            
            <div className="p-4 md:p-6 pb-2 text-center shrink-0">
              <div className="w-12 h-12 bg-pink-100 rounded-2xl mx-auto flex items-center justify-center shadow-inner mb-2"><span className="text-2xl text-pink-500">🛠️</span></div>
              <h3 className="font-black text-xl md:text-2xl text-pink-500">คำขอปรับปรุง</h3>
              <p className="text-xs md:text-sm text-slate-500 font-bold mt-1">แจ้งขอปรับปรุงข้อมูลเวลาหรือวันหยุด</p>
            </div>
            
            <div className="px-4 md:px-6 pt-2 shrink-0">
              {/* ปุ่ม Toggle แบบ 2 แท็บ */}
              <div className="flex bg-slate-100 p-1 rounded-xl">
                <button type="button" onClick={() => setAdjustForm({...adjustForm, tab: 'swap'})} className={`flex-1 py-2.5 text-xs md:text-sm font-black rounded-lg transition-all ${adjustForm.tab === 'swap' ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-md' : 'text-slate-500 hover:bg-slate-200'}`}>⇄ สลับวันหยุด</button>
                <button type="button" onClick={() => setAdjustForm({...adjustForm, tab: 'edit'})} className={`flex-1 py-2.5 text-xs md:text-sm font-black rounded-lg transition-all ${adjustForm.tab === 'edit' ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-md' : 'text-slate-500 hover:bg-slate-200'}`}>🕒 แก้ไขเวลา</button>
              </div>
            </div>

            <form onSubmit={handleSubmitAdjustment} className="px-4 md:px-6 py-4 space-y-4 overflow-y-auto flex-1 mt-2">
              
              {/* 🔄 โหมดสลับวันหยุด */}
              {adjustForm.tab === 'swap' && (
                <div className="space-y-4 animate-fade-in">
                  <h4 className="text-[10px] md:text-xs font-black text-slate-500 flex items-center gap-1">ℹ️ รายละเอียดการสลับวันหยุด</h4>
                  <div className="flex items-center gap-2 md:gap-4">
                    <div className="flex-1">
                      <label className="text-[10px] md:text-xs font-bold text-slate-400 block mb-1">วันหยุดเดิม</label>
                      <input type="date" required value={adjustForm.oldDate} onChange={(e) => setAdjustForm({...adjustForm, oldDate: e.target.value})} className="w-full bg-white border border-slate-200 focus:border-purple-400 rounded-lg md:rounded-xl px-3 py-2 md:py-3 font-bold text-slate-700 text-xs md:text-sm shadow-sm outline-none"/>
                    </div>
                    <div className="w-6 md:w-8 h-6 md:h-8 mt-5 md:mt-6 bg-slate-50 rounded-full flex items-center justify-center border border-slate-200 text-slate-400 font-black">→</div>
                    <div className="flex-1">
                      <label className="text-[10px] md:text-xs font-bold text-slate-400 block mb-1">วันหยุดใหม่</label>
                      <input type="date" required value={adjustForm.newDate} onChange={(e) => setAdjustForm({...adjustForm, newDate: e.target.value})} className="w-full bg-white border border-slate-200 focus:border-purple-400 rounded-lg md:rounded-xl px-3 py-2 md:py-3 font-bold text-slate-700 text-xs md:text-sm shadow-sm outline-none"/>
                    </div>
                  </div>
                </div>
              )}

              {/* 🕒 โหมดแก้ไขเวลา */}
              {adjustForm.tab === 'edit' && (
                <div className="space-y-4 animate-fade-in">
                  <div>
                    <label className="text-[10px] md:text-xs font-black text-slate-500 block mb-1">วันที่เกิดเหตุ</label>
                    <input type="date" required value={adjustForm.incidentDate} onChange={(e) => setAdjustForm({...adjustForm, incidentDate: e.target.value})} className="w-full bg-white border border-slate-200 focus:border-purple-400 rounded-lg md:rounded-xl px-3 py-2 md:py-3 font-bold text-slate-700 text-xs md:text-sm shadow-sm outline-none"/>
                  </div>
                  <div>
                    <label className="text-[10px] md:text-xs font-black text-slate-500 block mb-1">ประเภทเวลา</label>
                    <div className="flex gap-2">
                      <button type="button" onClick={() => setAdjustForm({...adjustForm, timeType: 'เข้างาน (IN)'})} className={`flex-1 py-2 rounded-lg md:rounded-xl font-bold text-xs md:text-sm transition-all border ${adjustForm.timeType === 'เข้างาน (IN)' ? 'bg-slate-800 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>เข้างาน (IN)</button>
                      <button type="button" onClick={() => setAdjustForm({...adjustForm, timeType: 'ออกงาน (OUT)'})} className={`flex-1 py-2 rounded-lg md:rounded-xl font-bold text-xs md:text-sm transition-all border ${adjustForm.timeType === 'ออกงาน (OUT)' ? 'bg-slate-800 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-500'}`}>ออกงาน (OUT)</button>
                    </div>
                  </div>
                  <h4 className="text-[10px] md:text-xs font-black text-slate-500 flex items-center gap-1 mt-4">🕒 แก้ไขเวลาให้ถูกต้อง</h4>
                  <div className="flex items-center gap-2 md:gap-4">
                    <div className="flex-1">
                      <label className="text-[10px] md:text-xs font-bold text-slate-400 block mb-1">เวลาเดิม</label>
                      <input type="time" required value={adjustForm.oldTime} onChange={(e) => setAdjustForm({...adjustForm, oldTime: e.target.value})} className="w-full bg-white border border-slate-200 focus:border-purple-400 rounded-lg md:rounded-xl px-3 py-2 md:py-3 font-bold text-slate-700 text-xs md:text-sm shadow-sm outline-none"/>
                    </div>
                    <div className="w-6 md:w-8 h-6 md:h-8 mt-5 md:mt-6 bg-slate-50 rounded-full flex items-center justify-center border border-slate-200 text-slate-400 font-black">→</div>
                    <div className="flex-1">
                      <label className="text-[10px] md:text-xs font-bold text-slate-400 block mb-1">เวลาที่ถูก</label>
                      <input type="time" required value={adjustForm.newTime} onChange={(e) => setAdjustForm({...adjustForm, newTime: e.target.value})} className="w-full bg-white border border-slate-200 focus:border-purple-400 rounded-lg md:rounded-xl px-3 py-2 md:py-3 font-bold text-slate-700 text-xs md:text-sm shadow-sm outline-none"/>
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-2">
                <label className="text-[10px] md:text-xs font-black text-slate-500 block mb-1">เหตุผล</label>
                <textarea rows="3" required placeholder="กรุณาระบุเหตุผลอย่างละเอียด..." value={adjustForm.reason} onChange={(e) => setAdjustForm({...adjustForm, reason: e.target.value})} className="w-full bg-white border border-slate-200 focus:border-purple-400 rounded-xl md:rounded-2xl px-3 md:px-4 py-2 md:py-3 font-medium outline-none text-xs md:text-sm resize-none shadow-sm"></textarea>
              </div>
              
              <div className="flex gap-2 md:gap-3 pt-2 shrink-0">
                <button type="submit" disabled={isSubmitting} className="flex-1 py-3 md:py-3.5 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg md:rounded-xl font-black text-xs md:text-sm shadow-lg shadow-purple-200 hover:-translate-y-0.5 transition-transform disabled:opacity-50 flex items-center justify-center gap-2">🚀 {isSubmitting ? 'กำลังส่ง...' : 'ส่งคำขอ'}</button>
                <button type="button" onClick={() => setIsAdjustModalOpen(false)} className="px-4 md:px-6 py-3 md:py-3.5 bg-slate-100 text-slate-600 rounded-lg md:rounded-xl font-bold text-xs md:text-sm hover:bg-slate-200 transition-colors">ยกเลิก</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}