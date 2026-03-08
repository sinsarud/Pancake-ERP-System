import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "./supabase";
import Swal from 'sweetalert2';

// 👑 Component โลโก้มงกุฎทอง (Premium Gold Crown SVG) - วาดใหม่ให้หรูหรา
const CrownLogo = ({ className = "w-12 h-12" }) => (
  <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <defs>
      <linearGradient id="gold-grad" x1="0" y1="100" x2="100" y2="0">
        <stop offset="0%" stopColor="#D97706" />
        <stop offset="20%" stopColor="#FDE047" />
        <stop offset="50%" stopColor="#B45309" />
        <stop offset="80%" stopColor="#FEF08A" />
        <stop offset="100%" stopColor="#FFFBEB" />
      </linearGradient>
      <linearGradient id="gold-base" x1="0" y1="0" x2="100" y2="100">
        <stop offset="0%" stopColor="#B45309" />
        <stop offset="50%" stopColor="#FDE047" />
        <stop offset="100%" stopColor="#D97706" />
      </linearGradient>
      <filter id="glow-gold" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#D97706" floodOpacity="0.3" />
      </filter>
    </defs>
    
    <g filter="url(#glow-gold)">
      {/* ฐานมงกุฎ */}
      <path d="M 15 80 Q 50 85 85 80 L 80 65 Q 50 70 20 65 Z" fill="url(#gold-base)" />
      
      {/* ยอดมงกุฎ */}
      <path d="M 20 65 L 10 30 L 30 45 L 50 15 L 70 45 L 90 30 L 80 65 Q 50 70 20 65 Z" fill="url(#gold-grad)" stroke="#FEF08A" strokeWidth="1" />
               
      {/* เพชรประดับยอด */}
      <circle cx="10" cy="30" r="4" fill="#FFFBEB" />
      <circle cx="30" cy="45" r="3" fill="#FFFBEB" />
      <circle cx="50" cy="15" r="5" fill="#FFFBEB" />
      <circle cx="70" cy="45" r="3" fill="#FFFBEB" />
      <circle cx="90" cy="30" r="4" fill="#FFFBEB" />
      
      {/* เพชรประดับฐาน */}
      <ellipse cx="50" cy="74" rx="4" ry="2" fill="#FFFBEB" />
      <ellipse cx="30" cy="72" rx="3" ry="1.5" fill="#FFFBEB" />
      <ellipse cx="70" cy="72" rx="3" ry="1.5" fill="#FFFBEB" />
    </g>
  </svg>
);

// 🎆 Component ดอกไม้ไฟฉลองชัยชนะ (Victory Overlay)
const VictoryFireworks = () => (
  <div className="fixed inset-0 z-[9999] pointer-events-none overflow-hidden flex items-center justify-center animate-fade-in">
    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"></div>
    {[...Array(15)].map((_, i) => (
      <div key={i} className={`absolute animate-bounce`} style={{ 
        top: `${Math.random() * 80}%`, left: `${Math.random() * 90}%`,
        fontSize: `${30 + Math.random() * 40}px`, animationDelay: `${Math.random() * 1}s`, animationDuration: `${1 + Math.random() * 2}s`
      }}>
        {['🎉', '🎊', '✨', '🔥', '🏆', '💎', '💰'][Math.floor(Math.random() * 7)]}
      </div>
    ))}
    <div className="relative z-10 text-center animate-pop-in bg-white/10 backdrop-blur-md p-10 rounded-[3rem] border border-white/20 shadow-[0_0_100px_rgba(251,191,36,0.3)]">
      <div className="text-6xl mb-4 animate-bounce">🏆</div>
      <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-200 drop-shadow-lg uppercase tracking-tighter mb-2">
        Goal Achieved!
      </h1>
      <p className="text-white font-black text-xl md:text-2xl mt-4 bg-black/30 py-2 px-6 rounded-full inline-block">
        ยินดีด้วย! บริษัททำยอดทะลุเป้า 100% แล้ว 🚀
      </p>
    </div>
  </div>
);

// 🌐 ระบบแปลภาษา (อัปเดต: เพิ่มตั้งค่า LINE OA และระบบยอดขาย)
const translations = {
  TH: {
    menuDash: "หน้าแรก", menuHist: "ประวัติการลา", menuAdjust: "แจ้งปรับปรุง", menuCheck: "ลงเวลาเข้า-ออก", menuApprove: "อนุมัติคำขอ", menuSettings: "ตั้งค่าระบบ", menuLogout: "ออกจากระบบ", menuAttendance: "ประวัติเข้าออกงาน", menuEmployees: "จัดการพนักงาน",
    welcome: "ยินดีต้อนรับ", adminCenter: "ศูนย์อนุมัติคำขอ", createBtn: "ยื่นใบลา", adjustBtn: "แจ้งปรับปรุง", stat1: "สิทธิ์วันลาคงเหลือ", stat2: "อัตราการอนุมัติ", stat3: "พนักงานเข้างาน (วันนี้)", stat4: "ความสมบูรณ์ระบบ", boxPending: "รายการรออนุมัติ", boxStats: "สถิติการลา (ปีนี้)", boxQuota: "โควต้าวันลาคงเหลือ", boxCal: "ปฏิทินทีม", seeAll: "ดูทั้งหมด", noPending: "🎉 เยี่ยมมาก! ไม่มีรายการค้างพิจารณา",
    thType: "ประเภท", thTotal: "สิทธิ์รวม", thUsed: "ใช้ไป", thRemain: "คงเหลือ", thDate: "วันที่ยื่น", thDuration: "ระยะเวลา", thStatus: "สถานะ", thEmp: "พนักงาน", thDetail: "รายละเอียด",
    chartPie: "วงกลม", chartBar: "กราฟแท่ง", chartLine: "กราฟเส้น", monthNames: ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"], dayNames: ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส'],
    myLeaveHistory: "ประวัติการลาของฉัน", allTypes: "ทุกประเภท", sickLeave: "ลาป่วย", personalLeave: "ลากิจ", annualLeave: "ลาพักร้อน", emergencyLeave: "ลาฉุกเฉิน", allStatus: "ทุกสถานะ", pending: "รออนุมัติ", approved: "อนุมัติ", rejected: "ไม่อนุมัติ",
    adjustHistory: "ประวัติคำขอปรับปรุง", adjustSwap: "สลับวันหยุด", adjustEdit: "แก้ไขเวลา",
    allPendingApprovals: "รายการรออนุมัติทั้งหมด", tabLeaves: "ลางาน", tabAdjusts: "แจ้งปรับปรุง", btnReject: "ปฏิเสธ", btnApprove: "อนุมัติ",
    notifTitle: "การแจ้งเตือน", notifReadAll: "อ่านทั้งหมด", notifClear: "ล้างทั้งหมด", notifEmpty: "ไม่มีการแจ้งเตือนใหม่", notifClose: "ปิดหน้าต่าง", viewPhoto: "ดูรูป",
    modalLeaveTitle: "ยื่นคำขอลาพักผ่อน", modalLeaveType: "ประเภทการลา", modalLeaveName: "ชื่อผู้ขอลา", modalLeaveDate: "กำหนดการลา (Date & Time)", modalLeaveReason: "ระบุเหตุผล เช่น ไปทำธุระที่ธนาคารครึ่งวันเช้า...", modalLeaveSubmit: "ยืนยันการส่งคำขอลา", modalCancel: "ยกเลิก",
    modalAdjTitle: "คำขอปรับปรุง", modalAdjDesc: "แจ้งขอปรับปรุงข้อมูลเวลาหรือวันหยุด", modalAdjDetailSwap: "รายละเอียดการสลับวันหยุด", modalAdjDetailEdit: "รายละเอียดการแก้ไขเวลา", modalAdjOldDate: "วันหยุดเดิม", modalAdjNewDate: "วันหยุดใหม่", modalAdjDate: "วันที่เกิดเหตุ", modalAdjTimeType: "ประเภทเวลา", modalAdjOldTime: "เวลาเดิม (ถ้ามี)", modalAdjNewTime: "เวลาใหม่ที่ต้องการ", modalAdjReason: "เหตุผล", modalAdjReasonHolder: "กรุณาระบุเหตุผลอย่างละเอียด...", modalAdjSubmit: "ส่งคำขอ",
    allAttendance: "ประวัติเข้าออกงานทั้งหมด", myAttendance: "ประวัติเข้าออกงานของฉัน", searchEmp: "ค้นหาชื่อพนักงาน...", filterNormal: "ปกติ", filterLate: "เข้าสาย", thTimeIn: "เข้างาน / รูป", thTimeOut: "ออกงาน / รูป", statusNormal: "ปกติ", statusLate: "สาย", noAttendance: "ไม่พบประวัติการลงเวลา", loadingText: "กำลังดึงข้อมูล... ⏳",
    settingsBranches: "ตั้งค่าสาขา", settingsDesc: "จัดการสาขาและพิกัดที่ตั้งพร้อมกำหนดรัศมีลงเวลา", formEditBranch: "📝 แก้ไขสาขา", formAddBranch: "➕ เพิ่มสาขาใหม่", labelBranchName: "ชื่อสาขา", placeBranchName: "ระบุชื่อสาขา...", labelRadius: "รัศมีการเช็คอิน (เมตร)", btnGetGPS: "📌 ดึงพิกัดตำแหน่งปัจจุบัน (GPS)", btnUpdate: "อัปเดตข้อมูล", btnSave: "บันทึกสาขา", tableBranchTitle: "รายชื่อสาขาในระบบ", thBranchName: "ชื่อสาขา", thCoords: "พิกัด", thRadius: "รัศมี", thManage: "จัดการ", noBranchData: "ยังไม่มีข้อมูลสาขา", btnEdit: "แก้ไข", btnDelete: "ลบ", btnMap: "แมพ 🗺️",
    empTitle: "รายชื่อพนักงานทั้งหมด", empSearch: "ค้นหาชื่อ, รหัสพนักงาน...", empAddBtn: "➕ เพิ่มพนักงาน", thEmpProfile: "ข้อมูลพนักงาน", thEmpPosition: "ตำแหน่ง & กะทำงาน", thEmpContact: "ติดต่อ", thEmpManage: "จัดการ", modalEmpTitle: "ข้อมูลพนักงาน", labelEmpCode: "รหัสพนักงาน", labelFullName: "ชื่อ-นามสกุล (TH)", labelNameEn: "ชื่อ-นามสกุล (EN)", labelUsername: "Username", labelPassword: "Password", labelPhone: "เบอร์โทรศัพท์", labelPosition: "ตำแหน่ง", labelShiftStart: "เวลาเข้างาน", labelShiftEnd: "เวลาออกงาน",
    settingsAllLeaves: "ประวัติการลาทั้งหมด", allLeavesDesc: "ตรวจสอบประวัติการลาของพนักงานทุกคน พร้อมพิกัดสถานที่ยื่นขอ (GPS)", allLeavesFilterAll: "ดูประวัติพนักงานทุกคน", thTypeDuration: "ประเภท / ระยะเวลา", thReason: "เหตุผล", thLocation: "พิกัด", btnViewMap: "ดูแผนที่", noLocation: "ไม่มีพิกัด", noLeaveHistory: "ไม่พบประวัติการลา",
    settingsQuotas: "จัดการสิทธิ์วันลา", quotaTitle: "จัดการโควต้าวันลาพนักงาน", quotaDesc: "กำหนดสิทธิ์วันลา (จำนวนวัน/ปี) ของพนักงานทั้งหมด", btnAddLeaveType: "➕ เพิ่มประเภทการลา", btnEditQuota: "แก้ไขโควต้า", swalNewTypeTitle: "เพิ่มประเภทการลาใหม่", swalNewTypePlace: "เช่น ลาบวช, ลาคลอด...", thLeaveWithoutPay: "ลาไม่รับเงินเดือน", quotaSaveBtn: "บันทึกโควต้า", quotaSavingBtn: "กำลังบันทึก...", thEmpName: "ชื่อพนักงาน",
    swalWarnTitle: "เดี๋ยวก่อนพี่!", swalWarnText: "กรุณากรอกชื่อและดึงพิกัด GPS ให้เรียบร้อยครับ", swalSuccessUpdate: "อัปเดตสาขาเรียบร้อย!", swalSuccessAdd: "บันทึกสาขาใหม่เรียบร้อย!", swalError: "เกิดข้อผิดพลาด!", swalDelTitle: "ลบสาขานี้ใช่ไหม?", swalDelText: "ลบแล้วกู้คืนไม่ได้นะครับพี่!", swalDelConfirm: "ใช่, ลบเลย!", swalDelSuccess: "ลบเรียบร้อย!", swalEmpSaved: "บันทึกข้อมูลพนักงานสำเร็จ!", swalEmpDeleted: "ลบพนักงานเรียบร้อย!",
    menuPTDayOff: "แจ้งวันหยุด (PT)", modalPTTitle: "แจ้งวันหยุดประจำสัปดาห์ (PT)", modalPTDate: "เลือกวันที่ต้องการหยุด", modalPTReason: "หมายเหตุ / เหตุผล", modalPTReasonHolder: "ระบุเหตุผลเพิ่มเติม (ถ้ามี)...", modalPTSubmit: "ส่งคำขอหยุด", defaultPTReason: "วันหยุดประจำสัปดาห์",
    settingsAllDayOffs: "รายการแจ้งหยุดทั้งหมด", ptDayOffDesc: "ตรวจสอบประวัติการแจ้งวันหยุดประจำสัปดาห์ของพนักงาน", thDayOffDate: "วันที่ขอหยุด",
    settingsAllAdjustments: "ประวัติแจ้งปรับปรุงทั้งหมด", allAdjustDesc: "ตรวจสอบประวัติการแจ้งสลับวันหยุดและแก้ไขเวลาของพนักงานทุกคน",
    settingsPermissions: "กำหนดสิทธิ์เมนู", permDesc: "เปิด-ปิด การมองเห็นเมนูต่างๆ ของพนักงานแต่ละระดับ", roleAdmin: "ผู้ดูแลระบบ", roleCEO: "ผู้บริหาร", roleEmp: "พนักงานทั่วไป",
    // ✨ ส่วนตั้งค่า LINE
    settingsLineOA: "ตั้งค่า LINE OA", lineDesc: "กำหนด LINE User ID หรือ Group ID สำหรับรับการแจ้งเตือนจากระบบ", labelLineId: "LINE ID ผู้รับการแจ้งเตือน", btnSaveLine: "บันทึก LINE ID",
    // ✨ ระบบยอดขาย (Sales)
    menuSales: "ยอดขายพนักงาน", mySalesTitle: "ยอดขายของฉัน", salesUpdated: "อัปเดตข้อมูลล่าสุดเมื่อ:", salesTarget: "เป้าหมายยอดขาย:", btnSetTarget: "ตั้งเป้าใหม่", estCommission: "คอมมิชชันที่คาดว่าจะได้รับ", commRate: "เรทค่าคอม", salesProgress: "ความคืบหน้าการทำยอดขาย", manageSalesTitle: "จัดการยอดขายพนักงาน", manageSalesDesc: "อัปเดตยอดขายปัจจุบันและเป้าหมายของพนักงานแต่ละคน", thSalesCurrent: "ยอดขาย (฿)", thSalesTarget: "เป้าหมาย (฿)", thCommRate: "เรทค่าคอม (%)", thCommEarned: "ยอดคอมที่ได้ (฿)", btnSaveGeneral: "บันทึก", selectEmp: "-- กรุณาเลือกพนักงาน --", permSelectPrompt: "👆 กรุณาเลือกพนักงานจากด้านบน เพื่อปรับสิทธิ์การเข้าถึงเมนู", labelSelectEmp: "👤 เลือกพนักงานที่ต้องการปรับสิทธิ์:", btnSavePerm: "บันทึกสิทธิ์", saving: "กำลังบันทึก...",
    // 💸 ระบบเงินเดือน (Payroll)
    menuPayroll: "เงินเดือนและสลิป", payrollTitle: "สรุปเงินเดือน (Payroll)", payrollDesc: "จัดการฐานเงินเดือน รายการหัก โบนัส และออกสลิปเงินเดือน", myPayrollTitle: "สลิปเงินเดือนของฉัน", thBaseSalary: "เงินเดือนพื้นฐาน", thNetSalary: "รับสุทธิ", btnGenerateSlip: "สร้างสลิป"
  },
  EN: {
    menuDash: "Dashboard", menuHist: "Leave History", menuAdjust: "Adjustments", menuCheck: "Timestamp", menuApprove: "Approvals", menuSettings: "Settings", menuLogout: "Logout", menuAttendance: "Attendance History", menuEmployees: "Employees",
    welcome: "Welcome", adminCenter: "Approval Center", createBtn: "New Leave", adjustBtn: "Adjustment", stat1: "Leave Balance", stat2: "Approval Rate", stat3: "Active Staff (Today)", stat4: "System Health", boxPending: "Pending Approvals", boxStats: "Leave Statistics", boxQuota: "Leave Quotas", boxCal: "Team Calendar", seeAll: "See All", noPending: "🎉 Great! No pending requests.",
    thType: "Type", thTotal: "Total", thUsed: "Used", thRemain: "Remaining", thDate: "Date", thDuration: "Duration", thStatus: "Status", thEmp: "Employee", thDetail: "Details",
    chartPie: "Pie", chartBar: "Bar", chartLine: "Line", monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"], dayNames: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
    myLeaveHistory: "My Leave History", allTypes: "All Types", sickLeave: "Sick Leave", personalLeave: "Personal Leave", annualLeave: "Annual Leave", emergencyLeave: "Emergency", allStatus: "All Status", pending: "Pending", approved: "Approved", rejected: "Rejected",
    adjustHistory: "Adjustment History", adjustSwap: "Swap Day", adjustEdit: "Edit Time",
    allPendingApprovals: "All Pending Approvals", tabLeaves: "Leaves", tabAdjusts: "Adjustments", btnReject: "Reject", btnApprove: "Approve",
    notifTitle: "Notifications", notifReadAll: "Read All", notifClear: "Clear All", notifEmpty: "No new notifications", notifClose: "Close Window", viewPhoto: "View Photo",
    modalLeaveTitle: "New Leave Request", modalLeaveType: "Leave Type", modalLeaveName: "Employee Name", modalLeaveDate: "Date & Time", modalLeaveReason: "Enter reason...", modalLeaveSubmit: "Submit Request", modalCancel: "Cancel",
    modalAdjTitle: "Adjustment Request", modalAdjDesc: "Request to adjust attendance or swap days", modalAdjDetailSwap: "Swap Day Details", modalAdjDetailEdit: "Edit Time Details", modalAdjOldDate: "Original Date", modalAdjNewDate: "New Date", modalAdjDate: "Incident Date", modalAdjTimeType: "Time Type", modalAdjOldTime: "Original Time (If any)", modalAdjNewTime: "Requested Time", modalAdjReason: "Reason", modalAdjReasonHolder: "Please specify the reason...", modalAdjSubmit: "Submit Request",
    allAttendance: "All Attendance History", myAttendance: "My Attendance History", searchEmp: "Search employee...", filterNormal: "Normal", filterLate: "Late", thTimeIn: "Time In / Photo", thTimeOut: "Time Out / Photo", statusNormal: "Normal", statusLate: "Late", noAttendance: "No attendance records found", loadingText: "Loading data... ⏳",
    settingsBranches: "Branches", settingsDesc: "Manage branches, locations, and check-in radius", formEditBranch: "📝 Edit Branch", formAddBranch: "➕ Add New Branch", labelBranchName: "Branch Name", placeBranchName: "Enter branch name...", labelRadius: "Check-in Radius (meters)", btnGetGPS: "📌 Get Current Location (GPS)", btnUpdate: "Update Data", btnSave: "Save Branch", tableBranchTitle: "Branch List", thBranchName: "Branch Name", thCoords: "Coordinates", thRadius: "Radius", thManage: "Manage", noBranchData: "No branch data available", btnEdit: "Edit", btnDelete: "Delete", btnMap: "Map 🗺️",
    empTitle: "All Employees", empSearch: "Search name, code...", empAddBtn: "➕ Add Employee", thEmpProfile: "Employee Profile", thEmpPosition: "Position & Shift", thEmpContact: "Contact", thEmpManage: "Manage", modalEmpTitle: "Employee Data", labelEmpCode: "Employee Code", labelFullName: "Full Name (TH)", labelNameEn: "Full Name (EN)", labelUsername: "Username", labelPassword: "Password", labelPhone: "Phone Number", labelPosition: "Position", labelShiftStart: "Shift Start", labelShiftEnd: "Shift End",
    settingsAllLeaves: "All Employee Leaves", allLeavesDesc: "Check all employee leave histories with GPS locations.", allLeavesFilterAll: "All Employees", thTypeDuration: "Type / Duration", thReason: "Reason", thLocation: "Location", btnViewMap: "View Map", noLocation: "No Location", noLeaveHistory: "No leave history found.",
    settingsQuotas: "Leave Quotas", quotaTitle: "Manage Leave Quotas", quotaDesc: "Set yearly leave quotas for all employees.", btnAddLeaveType: "➕ Add Leave Type", btnEditQuota: "Edit Quota", swalNewTypeTitle: "Add New Leave Type", swalNewTypePlace: "e.g., Maternity Leave...", thLeaveWithoutPay: "Leave Without Pay", quotaSaveBtn: "Save Quotas", quotaSavingBtn: "Saving...", thEmpName: "Employee Name",
    swalWarnTitle: "Wait a minute!", swalWarnText: "Please enter a name and get GPS coordinates.", swalSuccessUpdate: "Branch updated successfully!", swalSuccessAdd: "New branch saved successfully!", swalError: "Error occurred!", swalDelTitle: "Delete this branch?", swalDelText: "This action cannot be undone!", swalDelConfirm: "Yes, delete it!", swalDelSuccess: "Deleted successfully!", swalEmpSaved: "Employee saved successfully!", swalEmpDeleted: "Employee deleted!",
    menuPTDayOff: "Day Off (PT)", modalPTTitle: "Weekly Day Off (PT)", modalPTDate: "Select Date", modalPTReason: "Note / Reason", modalPTReasonHolder: "Additional details (optional)...", modalPTSubmit: "Submit Request", defaultPTReason: "Weekly Day Off",
    settingsAllDayOffs: "All Day Offs", ptDayOffDesc: "Check all weekly day off requests from employees.", thDayOffDate: "Day Off Date",
    settingsAllAdjustments: "All Adjustments", allAdjustDesc: "Check all attendance adjustment requests from employees.",
    settingsPermissions: "Menu Permissions", permDesc: "Toggle menu visibility for different user roles.", roleAdmin: "Admin", roleCEO: "CEO", roleEmp: "Employee",
    // ✨ ส่วนตั้งค่า LINE
    settingsLineOA: "LINE OA Settings", lineDesc: "Set the LINE User ID or Group ID to receive system notifications.", labelLineId: "LINE ID for Notifications", btnSaveLine: "Save LINE ID",
    // ✨ ระบบยอดขาย (Sales)
    menuSales: "Employee Sales", mySalesTitle: "My Sales", salesUpdated: "Last updated:", salesTarget: "Sales Target:", btnSetTarget: "Set Target", estCommission: "Estimated Commission", commRate: "Comm. Rate", salesProgress: "Achievement Progress", manageSalesTitle: "Sales Management", manageSalesDesc: "Update current sales and targets for each employee", thSalesCurrent: "Sales (฿)", thSalesTarget: "Target (฿)", thCommRate: "Comm. Rate (%)", thCommEarned: "Commission (฿)", btnSaveGeneral: "Save", selectEmp: "-- Select Employee --", permSelectPrompt: "👆 Please select an employee from above to adjust menu access", labelSelectEmp: "👤 Select employee to adjust permissions:", btnSavePerm: "Save Permissions", saving: "Saving...",
    // 💸 ระบบเงินเดือน (Payroll)
    menuPayroll: "Payroll & e-Slip", payrollTitle: "Payroll Summary", payrollDesc: "Manage base salary, deductions, bonuses, and generate payslips", myPayrollTitle: "My Payslip", thBaseSalary: "Base Salary", thNetSalary: "Net Salary", btnGenerateSlip: "Generate Slip"
  }
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [user] = useState(JSON.parse(localStorage.getItem("titan_user")));
  const [isLoading, setIsLoading] = useState(true);
  

// ✨ ฟังก์ชัน Export CSV (ใช้ชื่อตัวแปร payrollData และ payrollFilterMonth ตามไฟล์จริง)
  const handleExportBankCSV = () => {
    // ใช้ payrollData และ month ตามบรรทัดที่ 268 ในไฟล์พี่
    const dataToExport = payrollData.filter(p => p.month === payrollFilterMonth);

    if (dataToExport.length === 0) {
      Swal.fire({ icon: 'warning', title: 'ไม่พบข้อมูล', text: `ไม่พบรายการเงินเดือนของเดือน ${payrollFilterMonth}` });
      return;
    }
    
    let csvContent = "\uFEFF"; 
    csvContent += "รหัสพนักงาน,ชื่อ-สกุล,ธนาคาร,เลขที่บัญชี,ยอดเงินโอน (สุทธิ)\n";
    
    dataToExport.forEach(item => {
      const emp = employees.find(e => e.id === item.employee_id);
      const bName = emp?.bank_name || '-';
      const bAcc = emp?.bank_account ? `="${emp.bank_account}"` : '-'; 
      const nSalary = item.net_salary || 0;
      // ดึงชื่อพนักงานจากข้อมูลที่ join มา (item.employees) ตามบรรทัด 1131 ในไฟล์พี่
      const fullName = item.employees?.full_name || emp?.full_name || '-';
      const empCode = item.employees?.employee_code || emp?.employee_code || '-';
      
      csvContent += `${empCode},${fullName},${bName},${bAcc},${nSalary}\n`;
    });
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `สรุปโอนเงินเดือน_${payrollFilterMonth}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentView, setCurrentView] = useState("dashboard"); 
  const [lang, setLang] = useState(localStorage.getItem("titan_lang") || "TH");
  const t = translations[lang];

  // ⚙️ State Dropdown เมนูตั้งค่าระบบ
  const [isSettingsDropdownOpen, setIsSettingsDropdownOpen] = useState(false);

// 🔔 แจ้งเตือน (Persistent Notification ระบบ Global สำหรับ Admin)
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [selectedNotif, setSelectedNotif] = useState(null);
  const [notifications, setNotifications] = useState(() => {
    try {
      const currentUser = JSON.parse(localStorage.getItem("titan_user"));
      if (!currentUser || !currentUser.id) return [];
      
      // ✨ ถ้าเป็น Admin หรือ CEO ให้ใช้กล่อง "ส่วนกลาง (Global)" เพื่อดูทุกอย่าง
      if (currentUser.role === 'admin' || currentUser.role === 'ceo') {
        const globalNotifs = localStorage.getItem('titan_notifications_global');
        return globalNotifs ? JSON.parse(globalNotifs) : []; 
      }
      
      // ✨ ถ้าเป็นพนักงานทั่วไป ให้ดูแค่กล่องของตัวเอง
      const savedNotifs = localStorage.getItem(`titan_notifications_${currentUser.id}`);
      return savedNotifs ? JSON.parse(savedNotifs) : []; 
    } catch (e) {
      return [];
    }
  });

  // 👥 ระบบจัดการพนักงาน (Employee Management)
  const [employees, setEmployees] = useState([]);
  const [isEmpModalOpen, setIsEmpModalOpen] = useState(false);
  const [editingEmpId, setEditingEmpId] = useState(null);
  const [empSearch, setEmpSearch] = useState("");
 const [empForm, setEmpForm] = useState({ 
    employee_code: "", full_name: "", name_en: "", username: "", password: "", 
    phone_number: "", position: "", salary_type: "Full-time", role: "employee", 
    shift_start: "08:00", shift_end: "17:00", require_password_change: false, 
    base_salary: 0, hourly_rate: 0 
  });
  const [showPassword, setShowPassword] = useState(false);
  const [positions, setPositions] = useState([]); 

  // ✨ ให้ดึงข้อมูลตำแหน่งจาก DB อัตโนมัติเมื่อเปิดหน้าเว็บ
  useEffect(() => {
    const fetchPositions = async () => {
      const { data } = await supabase.from('job_positions').select('name');
      if (data) setPositions(data.map(item => item.name));
    };
    fetchPositions();
  }, []);
  const [newPositionName, setNewPositionName] = useState(""); // สำหรับเพิ่มตำแหน่งใหม่
  const [isPositionModalOpen, setIsPositionModalOpen] = useState(false); // เปิด/ปิดหน้าจัดการตำแหน่ง

  // 🎲 ฟังก์ชันสุ่มรหัสผ่านสุดแกร่ง (ตรงตาม Policy 100%)
  const generateSecurePassword = () => {
    const chars = "abcdefghijklmnopqrstuvwxyz";
    const upperChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const numChars = "0123456789";
    let pass = "";
    pass += upperChars.charAt(Math.floor(Math.random() * upperChars.length));
    pass += chars.charAt(Math.floor(Math.random() * chars.length));
    pass += numChars.charAt(Math.floor(Math.random() * numChars.length));
    for(let i=0; i<5; i++) pass += Math.random().toString(36).slice(-2);
    
    setEmpForm({ ...empForm, password: pass, require_password_change: true });
    setShowPassword(true); // โชว์รหัสให้แอดมินเห็นชั่วคราวจะได้ก๊อปไปส่งให้พนักงานได้
  };
  //ระบบ ประวัติการลาทั้งหมด" (เฉพาะ Admin / CEO)
  const [allEmpLeaves, setAllEmpLeaves] = useState([]);
  const [empLeaveSearch, setEmpLeaveSearch] = useState("");
  const [viewMapModal, setViewMapModal] = useState(null);

  const [allLeavesTypeFilter, setAllLeavesTypeFilter] = useState("ALL");
  const [allLeavesStatusFilter, setAllLeavesStatusFilter] = useState("ALL");
  //ระบบแจ้งวันหยุดประจำสัปดาห์ ของ Part-Time
  const [dayoffSearchName, setDayoffSearchName] = useState("");
  const [dayoffFilterStatus, setDayoffFilterStatus] = useState("ALL");

// 🛠️ State สำหรับหน้าประวัติแจ้งปรับปรุงทั้งหมด (Admin)
  const [allEmpAdjustments, setAllEmpAdjustments] = useState([]);
  const [empAdjustSearch, setEmpAdjustSearch] = useState("");
  const [allAdjustTypeFilter, setAllAdjustTypeFilter] = useState("ALL");
  const [allAdjustStatusFilter, setAllAdjustStatusFilter] = useState("ALL");

  // 💸 State สำหรับระบบเงินเดือน (Payroll)
  const [payrollData, setPayrollData] = useState([]);
  
  const [payrollFilterMonth, setPayrollFilterMonth] = useState(new Date().toISOString().slice(0, 7));
  const [payrollSearchKeyword, setPayrollSearchKeyword] = useState("");
  const [mySlips, setMySlips] = useState([]);
  const [isPayrollModalOpen, setIsPayrollModalOpen] = useState(false);
  const [payrollForm, setPayrollForm] = useState({ employee_id: "", base_salary: 0, ot_amount: 0, deductions: 0, bonus: 0, month: new Date().toISOString().slice(0, 7) });
  const [isSavingPayroll, setIsSavingPayroll] = useState(false);
  const [showAutoPayrollModal, setShowAutoPayrollModal] = useState(false);
  const [selectedEmps, setSelectedEmps] = useState([]);

// 🔐 State สำหรับระบบจัดการสิทธิ์เมนู (รายบุคคล)
  const [selectedPermEmpId, setSelectedPermEmpId] = useState("");
  const [currentEmpMenus, setCurrentEmpMenus] = useState([]);
  const [isSavingPerms, setIsSavingPerms] = useState(false);
  const [userMenus, setUserMenus] = useState([]); // เก็บสิทธิ์ของตัวเองที่ล็อกอินอยู่

  const masterMenuList = [
    { id: 'menu_dashboard', icon: '🏠', label: t.menuDash },
    { id: 'menu_sales', icon: '💎', label: t.menuSales },
    { id: 'menu_payroll', icon: '💸', label: t.menuPayroll },
    { id: 'menu_history', icon: '📋', label: t.menuHist },
    { id: 'menu_adjustments', icon: '🛠️', label: t.menuAdjust },
    { id: 'menu_attendance', icon: '📅', label: t.menuAttendance },
    { id: 'menu_checkin', icon: '⏰', label: t.menuCheck },
    { id: 'menu_pt_dayoff', icon: '🏖️', label: t.menuPTDayOff },
    { id: 'menu_approvals', icon: '✅', label: t.menuApprove },
    { id: 'menu_settings', icon: '⚙️', label: t.menuSettings }
  ];

 // โหลดรายชื่อพนักงานเมื่อเข้าหน้าตั้งค่าสิทธิ์
  useEffect(() => {
    if (currentView === 'settings_permissions') fetchEmployeesData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentView]);

  // โหลดสิทธิ์ของพนักงานที่ถูกเลือกใน Dropdown
  useEffect(() => {
    if (currentView === 'settings_permissions' && selectedPermEmpId) {
      const loadEmpPerms = async () => {
        const { data } = await supabase.from('employee_permissions').select('*').eq('employee_id', selectedPermEmpId).limit(1);
        const empPerms = data?.[0];
        if (empPerms && empPerms.menu_list) {
          setCurrentEmpMenus(empPerms.menu_list);
        } else {
          // ถ้ายังไม่เคยตั้งค่า ให้ติ๊กถูกหมดทุกอันเป็นค่าเริ่มต้น
          setCurrentEmpMenus(masterMenuList.map(m => m.id));
        }
      };
      loadEmpPerms();
    }
  }, [currentView, selectedPermEmpId]);

  const handleToggleMenu = (menuId) => {
    setCurrentEmpMenus(prev => prev.includes(menuId) ? prev.filter(id => id !== menuId) : [...prev, menuId]);
  };

// ✨ ฟังก์ชันบันทึกสิทธิ์ที่แก้ไขใหม่ให้รองรับรายบุคคลอย่างถูกต้อง
  const handleSavePermissions = async () => {
    setIsSavingPerms(true);
    try {
      if (!selectedPermEmpId) throw new Error("กรุณาเลือกพนักงานก่อนบันทึกครับ");
      
      // ค้นหาว่าพนักงานคนนี้เคยมี record สิทธิ์หรือยัง
      const { data: exist } = await supabase.from('employee_permissions').select('id').eq('employee_id', selectedPermEmpId).maybeSingle();
      
      if (exist) {
        await supabase.from('employee_permissions').update({ menu_list: currentEmpMenus }).eq('employee_id', selectedPermEmpId);
      } else {
        await supabase.from('employee_permissions').insert([{ employee_id: selectedPermEmpId, menu_list: currentEmpMenus }]);
      }
      
      await supabase.from('system_logs').insert([{
        employee_id: user.id, 
        action: 'UPDATE_PERMISSIONS',
        details: `อัปเดตสิทธิ์การมองเห็นเมนูรายบุคคล`
      }]);
      
      Swal.fire({ icon: 'success', title: 'บันทึกสิทธิ์สำเร็จ!', showConfirmButton: false, timer: 1500, customClass: { popup: 'rounded-[2rem]' } });
    } catch (err) {
      Swal.fire('เกิดข้อผิดพลาด', err.message, 'error');
    } finally {
      setIsSavingPerms(false);
    }
  };

  // 💬 State สำหรับระบบตั้งค่าผู้รับ LINE OA (จัดระเบียบใหม่ไม่ให้ซ้ำ)
  const [lineAdminId, setLineAdminId] = useState("C0df0123907f46aa88c44ef72e88ea30f"); 
  const [isSavingLine, setIsSavingLine] = useState(false);

  useEffect(() => {
    const fetchLineSettings = async () => {
      try {
        const { data } = await supabase.from('system_settings').select('setting_value').eq('setting_key', 'line_admin_id').maybeSingle();
        if (data && data.setting_value) {
          setLineAdminId(data.setting_value);
        }
      } catch (err) { console.error("Load LINE ID Error:", err); }
    };
    fetchLineSettings();
  }, []);

  const handleSaveLineSettings = async (e) => {
    e.preventDefault();
    setIsSavingLine(true);
    try {
      const { error } = await supabase.from('system_settings').update({ setting_value: lineAdminId }).eq('setting_key', 'line_admin_id');
      if (error) throw error;
      await supabase.from('system_logs').insert([{ employee_id: user.id, action: 'UPDATE_LINE_SETTINGS', details: `อัปเดต LINE ID เป็น: ${lineAdminId}` }]);
      Swal.fire({ icon: 'success', title: 'บันทึก LINE ID สำเร็จ!', showConfirmButton: false, timer: 1500, customClass: { popup: 'rounded-[2rem]' } });
    } catch (err) { Swal.fire('Error', err.message, 'error'); } finally { setIsSavingLine(false); }
  };

  

 // 🎯 State สำหรับหน้าจัดการสิทธิ์วันลาแบบตาราง (Quotas)
  const [globalLeaveTypes, setGlobalLeaveTypes] = useState(['ลาป่วย', 'ลากิจ', 'ลาพักร้อน', 'ลาฉุกเฉิน', 'ลาไม่รับเงินเดือน']);
  const [allLeaveBalances, setAllLeaveBalances] = useState([]);
  const [editingQuotaEmp, setEditingQuotaEmp] = useState(null);
  const [isSavingQuota, setIsSavingQuota] = useState(false);

  // ดึงข้อมูลพนักงานและโควต้าทั้งหมด
  useEffect(() => { 
    if (currentView === 'employees' || currentView === 'settings_quotas') {
      fetchEmployeesData();
      if (currentView === 'settings_quotas') {
        const loadQuotas = async () => {
          try {
            const { data, error } = await supabase.from('leave_balances').select('*');
            if (error) throw error;
            if (data) {
              setAllLeaveBalances(data);
              // ดึงประเภทการลาที่มีอยู่ในฐานข้อมูลออกมาเพิ่มอัตโนมัติ (เผื่อเคยแอดไว้)
              const uniqueTypes = [...new Set(data.map(d => d.leave_type))];
              setGlobalLeaveTypes(prev => [...new Set([...prev, ...uniqueTypes])]);
            }
          } catch (err) { console.error("Error fetching all quotas:", err); }
        };
        loadQuotas();
      }
    }
  }, [currentView]);

  // 🎯 1. ฟังก์ชันเพิ่มประเภทการลาใหม่ + กำหนดวันเริ่มต้นให้ทุกคนทันที
  const handleAddLeaveType = async () => {
    const { value: formValues } = await Swal.fire({
      title: '➕ เพิ่มประเภทการลาใหม่',
      html: `
        <div class="text-left space-y-4 font-sans">
          <div>
            <label class="text-xs font-black text-slate-500 mb-1 block">ชื่อประเภทการลา</label>
            <input id="swal-input-name" class="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:border-purple-400 focus:outline-none" placeholder="เช่น ลาบวช, ลาคลอด...">
          </div>
          <div>
            <label class="text-xs font-black text-slate-500 mb-1 block">จำนวนวันที่ได้รับเริ่มต้น (วัน/ปี)</label>
            <input id="swal-input-days" type="number" class="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold focus:border-purple-400 focus:outline-none" value="0">
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: '🚀 บันทึกข้อมูลเข้าฐานระบบ',
      confirmButtonColor: '#8b5cf6',
      customClass: { popup: 'rounded-[2rem] border-2 border-purple-100 shadow-2xl' },
      preConfirm: () => {
        const name = document.getElementById('swal-input-name').value;
        const days = document.getElementById('swal-input-days').value;
        if (!name) return Swal.showValidationMessage('กรุณากรอกชื่อประเภทการลาครับพี่');
        return { name, days: Number(days) || 0 };
      }
    });

    if (formValues) {
      Swal.fire({ title: 'กำลังอัปเดตระบบ...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
      try {
        const { name, days } = formValues;
        
        // บันทึกลงฐานข้อมูล leave_balances ให้พนักงานทุกคนทันที!
        const insertPromises = employees.map(async (emp) => {
          return supabase.from('leave_balances').insert([{ 
            employee_id: emp.id, 
            leave_type: name, 
            total_days: days, 
            used_minutes: 0 
          }]);
        });
        await Promise.all(insertPromises);

        // รีเฟรชข้อมูลหน้าจอ
        const { data } = await supabase.from('leave_balances').select('*');
        setAllLeaveBalances(data || []);
        setGlobalLeaveTypes(prev => [...new Set([...prev, name])]);

        Swal.fire({ icon: 'success', title: 'เพิ่มเรียบร้อย!', text: `เพิ่มสิทธิ์ "${name}" จำนวน ${days} วัน ให้พนักงานทุกคนแล้วครับ`, showConfirmButton: false, timer: 2000, customClass: { popup: 'rounded-[2rem]' } });
      } catch (err) {
        Swal.fire('Error', err.message, 'error');
      }
    }
  };

  // 🗑️ ฟังก์ชันลบประเภทการลา (ลบออกจากพนักงานทุกคนในฐานข้อมูล)
  const handleDeleteLeaveType = async (typeName) => {
    // 🛡️ ป้องกันไม่ให้ลบประเภทพื้นฐานที่ระบบต้องใช้
    const coreTypes = ['ลาป่วย', 'ลากิจ', 'ลาพักร้อน', 'ลาฉุกเฉิน', 'ลาไม่รับเงินเดือน', 'Sick Leave', 'Personal Leave', 'Annual Leave', 'Emergency', 'Leave Without Pay'];
    if (coreTypes.includes(typeName)) {
      return Swal.fire({ icon: 'error', title: 'ลบไม่ได้!', text: 'ประเภทการลานี้เป็นค่าเริ่มต้นของระบบ ไม่สามารถลบได้ครับ', confirmButtonColor: '#f43f5e', customClass: { popup: 'rounded-[2rem]' } });
    }

    const result = await Swal.fire({
      title: 'ยืนยันการลบ?',
      html: `สิทธิ์การลาประเภท <b>"${typeName}"</b> จะถูกลบออกจากพนักงานทุกคน!<br/><span class="text-rose-500 text-xs font-bold">* ข้อมูลประวัติการลาเก่าของประเภทนี้อาจแสดงผลผิดพลาดได้</span>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: '🗑️ ใช่, ลบทิ้งเลย',
      cancelButtonText: 'ยกเลิก',
      confirmButtonColor: '#f43f5e',
      customClass: { popup: 'rounded-[2rem] border-2 border-rose-100 shadow-2xl' }
    });

    if (result.isConfirmed) {
      Swal.fire({ title: 'กำลังลบ...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
      try {
        // ลบข้อมูลโควต้าประเภทนี้ของพนักงานทุกคนใน DB
        const { error } = await supabase.from('leave_balances').delete().eq('leave_type', typeName);
        if (error) throw error;
        
        // อัปเดตข้อมูลบนหน้าจอทันที
        setGlobalLeaveTypes(prev => prev.filter(t => t !== typeName));
        const { data } = await supabase.from('leave_balances').select('*');
        setAllLeaveBalances(data || []);

        Swal.fire({ icon: 'success', title: 'ลบเรียบร้อย!', showConfirmButton: false, timer: 1500, customClass: { popup: 'rounded-[2rem]' } });
      } catch (err) {
        Swal.fire({ icon: 'error', title: 'เกิดข้อผิดพลาด', text: err.message, customClass: { popup: 'rounded-[2rem]' } });
      }
    }
  };


  // เปิด Popup แก้ไขโควต้าของคนนั้นๆ
  const handleOpenEditQuota = (emp) => {
    const empBalances = allLeaveBalances.filter(b => b.employee_id === emp.id);
    const initialForm = {};
    globalLeaveTypes.forEach(type => {
      const found = empBalances.find(b => b.leave_type === type);
      initialForm[type] = found ? found.total_days : 0; // ค่าเริ่มต้นถ้าไม่มีคือ 0
    });
    setEditingQuotaEmp({ emp, form: initialForm });
  };

  // บันทึกโควต้าลงฐานข้อมูล
  const handleSaveQuotaModal = async (e) => {
    e.preventDefault();
    setIsSavingQuota(true);
    try {
      const empId = editingQuotaEmp.emp.id;
      const { data: existing } = await supabase.from('leave_balances').select('id, leave_type').eq('employee_id', empId);

      // วนลูปบันทึกทีละประเภท
      const promises = globalLeaveTypes.map(async (type) => {
        const targetDays = Number(editingQuotaEmp.form[type]) || 0;
        const existRec = existing?.find(x => x.leave_type === type);
        if (existRec) {
          return supabase.from('leave_balances').update({ total_days: targetDays }).eq('id', existRec.id);
        } else {
          return supabase.from('leave_balances').insert([{ employee_id: empId, leave_type: type, total_days: targetDays, used_minutes: 0 }]);
        }
      });
      await Promise.all(promises); // รอให้บันทึกเสร็จทั้งหมด

      // รีเฟรชข้อมูลล่าสุด
      const { data } = await supabase.from('leave_balances').select('*');
      setAllLeaveBalances(data || []);
      
      setEditingQuotaEmp(null);
      Swal.fire({ icon: 'success', title: 'บันทึกสำเร็จ!', showConfirmButton: false, timer: 1500, customClass: { popup: 'rounded-[2rem] shadow-2xl border-2 border-emerald-100' }});
      if (typeof addNotification === 'function') addNotification("อัปเดตโควต้า", `อัปเดตสิทธิ์วันลาของคุณ ${editingQuotaEmp.emp.full_name} เรียบร้อยแล้ว`);
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error', text: err.message, customClass: { popup: 'rounded-[2rem]' }});
    } finally {
      setIsSavingQuota(false);
    }
  };

  // ตัวช่วยเลือกไอคอนให้แต่ละประเภทการลา
  const getLeaveIcon = (type) => {
    if (!type) return '📋';
    if (type.includes('ป่วย') || type.includes('Sick')) return '🤒';
    if (type.includes('กิจ') || type.includes('Personal')) return '💼';
    if (type.includes('พักร้อน') || type.includes('Annual')) return '🏖️';
    if (type.includes('ฉุกเฉิน') || type.includes('Emergency')) return '🚨';
    if (type.includes('ไม่รับเงินเดือน') || type.includes('Without Pay')) return '💸';
    return '🔖'; // ไอคอนพื้นฐานสำหรับประเภทอื่นๆ ที่เพิ่มเข้ามาใหม่
  };

  // 🔒 ระบบบังคับเปลี่ยนรหัสผ่าน (ทำงานทันทีเมื่อเข้ามาหน้า Dashboard)
  useEffect(() => {
    if (user && user.require_password_change) enforcePasswordChange();
  }, [user]);

const enforcePasswordChange = async () => {
    const { value: newPass } = await Swal.fire({
      // ซ่อน Title เดิมของ Swal แล้วใช้วิธีวาด HTML เองทั้งหมดเพื่อให้สวยที่สุด
      title: null,
      html: `
        <div class="text-center font-sans">
          <div class="w-20 h-20 bg-gradient-to-tr from-pink-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-5 shadow-lg shadow-pink-200 animate-bounce">
            <span class="text-4xl text-white">🔒</span>
          </div>
          
          <h2 class="text-2xl font-black text-slate-800 tracking-tight mb-2">อัปเดตความปลอดภัย</h2>
          <p class="text-sm text-slate-500 mb-6 font-medium px-2">
            ระบบต้องการให้คุณตั้งรหัสผ่านใหม่<br/>
            เพื่อความปลอดภัยสูงสุดของบัญชีการใช้งาน
          </p>
          
          <div class="space-y-4 px-2">
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span class="text-slate-400">🔑</span>
              </div>
              <input id="swal-p1" type="password" class="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-11 pr-4 py-4 text-center font-black tracking-widest outline-none focus:border-purple-400 focus:bg-white focus:ring-4 focus:ring-purple-50 transition-all shadow-sm" placeholder="รหัสผ่านใหม่">
            </div>
            
            <div class="relative">
              <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <span class="text-slate-400">✅</span>
              </div>
              <input id="swal-p2" type="password" class="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-11 pr-4 py-4 text-center font-black tracking-widest outline-none focus:border-purple-400 focus:bg-white focus:ring-4 focus:ring-purple-50 transition-all shadow-sm" placeholder="ยืนยันรหัสผ่านใหม่">
            </div>
          </div>
          
          <div class="mt-6 bg-rose-50 p-4 rounded-2xl border border-rose-100 flex items-start gap-3 text-left shadow-inner">
            <span class="text-rose-500 mt-0.5 text-lg">⚠️</span>
            <p class="text-[11px] text-rose-600 font-bold leading-relaxed">
              <span class="uppercase tracking-wider font-black border-b border-rose-200 pb-1 mb-1 block">เงื่อนไขรหัสผ่าน:</span>
              • ความยาวขั้นต่ำ 8 ตัวอักษร<br/>
              • ต้องมีตัวอักษรพิมพ์ใหญ่ (A-Z)<br/>
              • ต้องมีตัวอักษรพิมพ์เล็ก (a-z)<br/>
              • ต้องมีตัวเลข (0-9)
            </p>
          </div>
        </div>
      `,
      allowOutsideClick: false, 
      allowEscapeKey: false,
      showConfirmButton: true,
      confirmButtonText: '💾 บันทึกและเริ่มต้นใช้งาน',
      // ปิดสไตล์ปุ่มเดิมของ Swal เพื่อใช้ Tailwind เต็มรูปแบบ
      buttonsStyling: false,
      customClass: { 
        popup: 'rounded-[2.5rem] shadow-2xl border-0 p-6 sm:p-8 max-w-md w-full',
        // แต่งปุ่มใหม่ให้กว้างเต็มจอ (w-full) สีสวยๆ เข้าธีม
        confirmButton: 'w-full py-4 bg-gradient-to-r from-purple-600 to-pink-500 hover:from-purple-700 hover:to-pink-600 text-white rounded-2xl font-black text-sm shadow-md hover:shadow-xl transition-all mt-6 hover:-translate-y-1'
      },
      backdrop: `rgba(15, 23, 42, 0.96)`, 
      preConfirm: () => {
        const p1 = document.getElementById('swal-p1').value;
        const p2 = document.getElementById('swal-p2').value;
        const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        
        if (!p1 || !p2) { Swal.showValidationMessage('กรุณากรอกรหัสให้ครบถ้วน'); return false; }
        if (p1 !== p2) { Swal.showValidationMessage('รหัสผ่านไม่ตรงกัน'); return false; }
        if (!passRegex.test(p1)) { Swal.showValidationMessage('รหัสผ่านไม่ปลอดภัยตามนโยบายระบบ'); return false; }
        return p1;
      }
    });

    if (newPass) {
      Swal.fire({ title: 'กำลังบันทึก...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
      const { error } = await supabase.from('employees').update({ 
        password: newPass, 
        require_password_change: false 
      }).eq('id', user.id);

      if (!error) {
        const updatedUser = { ...user, password: newPass, require_password_change: false };
        localStorage.setItem("titan_user", JSON.stringify(updatedUser));
        
        await Swal.fire({ 
          icon: 'success', 
          title: 'เปลี่ยนรหัสผ่านสำเร็จ!', 
          text: 'เข้าสู่ระบบเรียบร้อย ยินดีต้อนรับครับ',
          confirmButtonColor: '#8b5cf6',
          customClass: { popup: 'rounded-[2rem]' }
        });
        
        window.location.reload();
      } else {
        Swal.fire('Error', error.message, 'error');
      }
    }
  };

  const fetchEmployeesData = async () => {
    try {
      const { data, error } = await supabase.from('employees').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setEmployees(data || []);
    } catch (err) { console.error("Fetch employees error:", err.message); }
  };

  // โหลดข้อมูลพนักงานเมื่อเปิดหน้าจัดการพนักงาน และ หน้าเงินเดือน
  useEffect(() => { 
    if (currentView === 'employees' || currentView === 'payroll') fetchEmployeesData(); 
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentView]);

const handleSaveEmployee = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...empForm };
      
      // 🛡️ ตรวจสอบ Password Policy ก่อนเซฟ
      if (payload.password) {
        const passRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
        if (!passRegex.test(payload.password)) {
          return Swal.fire({ 
            icon: 'warning', 
            title: 'รหัสผ่านไม่ปลอดภัย', 
            text: 'ต้องมีอย่างน้อย 8 ตัวอักษร ประกอบด้วยตัวพิมพ์ใหญ่ พิมพ์เล็ก และตัวเลข', 
            customClass: { popup: 'rounded-[2rem]' }
          });
        }
      }

      // เติมวินาทีให้เวลาเพื่อความเป๊ะของ DB
      if (payload.shift_start && payload.shift_start.length === 5) payload.shift_start += ":00";
      if (payload.shift_end && payload.shift_end.length === 5) payload.shift_end += ":00";

      if (editingEmpId) {
        // กรณีแก้ไขข้อมูลพนักงาน (อัปเดตอย่างเดียว)
        if (!payload.password) delete payload.password; // ✨ ลบรหัสผ่านทิ้งถ้าไม่ได้กรอกใหม่ (จะได้ไม่ทับของเก่า)
        const { error } = await supabase.from('employees').update(payload).eq('id', editingEmpId);
        if (error) throw error;
        Swal.fire({ icon: 'success', title: t.swalEmpSaved, showConfirmButton: false, timer: 1500, customClass: { popup: 'rounded-[2rem] shadow-2xl border-2 border-emerald-100' } });
        if (typeof addNotification === 'function') addNotification("แก้ไขพนักงาน", `อัปเดตข้อมูล ${payload.full_name} สำเร็จ`);
      } else {
        // ✨ กรณีเพิ่มพนักงานใหม่ (Insert พนักงาน -> แล้ว Insert วันลาเริ่มต้นตามไปทันที)
        // 1. บันทึกพนักงาน และขอข้อมูลก้อนใหม่กลับมา
        const { data: newEmp, error } = await supabase.from('employees').insert([payload]).select().single();
        if (error) throw error;

        // 2. สร้างโครงสร้างสิทธิ์วันลาเริ่มต้น (ตามที่กำหนด Default ไว้เป๊ะๆ)
        const defaultBalances = globalLeaveTypes.map(type => {
          let defaultDays = 0;
          if (type === 'ลาป่วย') defaultDays = 30;
          else if (type === 'ลากิจ') defaultDays = 4;
          else if (type === 'ลาฉุกเฉิน') defaultDays = 3;
          else if (type === 'ลาพักร้อน') defaultDays = 3;
          else if (type === 'ลาไม่รับเงินเดือน') defaultDays = 15;

          return {
            employee_id: newEmp.id,
            leave_type: type,
            total_days: defaultDays,
            used_minutes: 0
          };
        });

        // 3. บันทึกสิทธิ์เข้าฐานข้อมูล
        await supabase.from('leave_balances').insert(defaultBalances);

        Swal.fire({ icon: 'success', title: t.swalEmpSaved, showConfirmButton: false, timer: 1500, customClass: { popup: 'rounded-[2rem] shadow-2xl border-2 border-emerald-100' } });
        if (typeof addNotification === 'function') addNotification("เพิ่มพนักงานใหม่", `เพิ่ม ${payload.full_name} พร้อมตั้งสิทธิ์วันลาเริ่มต้นสำเร็จ`);
      }
      
      setIsEmpModalOpen(false);
      fetchEmployeesData();
    } catch (error) { 
      Swal.fire({ icon: 'error', title: 'Error', text: error.message, customClass: { popup: 'rounded-[2rem]' } });
    }
  };

  const handleDeleteEmployee = async (id, name) => {
    const result = await Swal.fire({ title: 'ลบพนักงาน?', text: `คุณต้องการลบ ${name} ใช่หรือไม่? ข้อมูลประวัติการลาจะหายไปด้วยนะ!`, icon: 'warning', showCancelButton: true, confirmButtonColor: '#f43f5e', cancelButtonColor: '#cbd5e1', confirmButtonText: 'ใช่, ลบเลย!', customClass: { popup: 'rounded-[2rem] shadow-2xl border-2 border-rose-100', title: 'font-black text-slate-800 text-2xl mt-4' } });
    if (result.isConfirmed) {
      try {
        const { error } = await supabase.from('employees').delete().eq('id', id);
        if (error) throw error;
        Swal.fire({ icon: 'success', title: t.swalEmpDeleted, showConfirmButton: false, timer: 1500, customClass: { popup: 'rounded-[2rem]' } });
        if (typeof addNotification === 'function') addNotification("ลบพนักงาน", `ลบข้อมูล ${name} ออกจากระบบแล้ว`);
        fetchEmployeesData();
      } catch (error) { Swal.fire('Error', error.message, 'error'); }
    }
  };


// Save Notifications to LocalStorage automatically (ระบบแยกกล่อง + ดันเข้า Global)
  useEffect(() => {
    if (user && user.id) {
      if (user.role === 'admin' || user.role === 'ceo') {
        // Admin และ CEO เซฟลงกล่องรวมของบริษัท
        localStorage.setItem('titan_notifications_global', JSON.stringify(notifications));
      } else {
        // พนักงานเซฟลงกล่องตัวเอง
        localStorage.setItem(`titan_notifications_${user.id}`, JSON.stringify(notifications));
        
        // ✨ แอบส่ง "สำเนาแจ้งเตือน" ไปหย่อนในกล่องรวมให้ Admin/CEO เห็นด้วย!
        try {
          const globalData = localStorage.getItem('titan_notifications_global');
          const globalNotifs = globalData ? JSON.parse(globalData) : [];
          
          // หาข้อความใหม่ที่เพิ่งเด้ง (กันการแจ้งเตือนซ้ำ)
          const newItems = notifications.filter(n => !globalNotifs.some(g => g.id === n.id));
          if (newItems.length > 0) {
             // ✨ ดึงชื่อพนักงานจริงๆ (full_name) มาโชว์ให้แอดมินเห็นเลย
             const employeeName = user.full_name || user.username;
             const updatedGlobal = [...newItems.map(n => ({...n, title: `👤 [${employeeName}] ${n.title}`})), ...globalNotifs];
             localStorage.setItem('titan_notifications_global', JSON.stringify(updatedGlobal));
          }
        } catch(e) {}
      }
    }
  }, [notifications, user]);
  
  const unreadCount = notifications.filter(n => !n.isRead).length;
  
  const markAllRead = () => setNotifications(n => n.map(x => ({...x, isRead: true})));
  const clearAllNotifs = () => setNotifications([]);
  const handleNotificationClick = (notif) => {
    setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, isRead: true } : n));
    setSelectedNotif(notif);
    setIsNotifOpen(false);
  };

  // 📢 ✨ ฟังก์ชันใหม่: เครื่องยนต์หลักสำหรับดันข้อความเข้ากระดิ่งแจ้งเตือน (เรียกใช้ตอนทำรายการต่างๆ)
  const addNotification = (title, message) => {
    const newNotif = {
      id: Date.now(),
      title: title,
      message: message,
      isRead: false,
      time: new Date().toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' }) + ' น.'
    };
    setNotifications(prev => [newNotif, ...prev]); // ดันข้อความใหม่ขึ้นไปไว้บนสุด
  };

  // 📍 State ตั้งค่าสาขา (Location)
  const [currentLocation, setCurrentLocation] = useState({ lat: 13.7563, lng: 100.5018, isDefault: true });
// 🟢 ประกาศ State ให้ครบ (แก้ปัญหา formName / editingBranchId is not defined)
  const [formRadius, setFormRadius] = useState(100); // ตั้งค่าเริ่มต้นไว้ที่ 100 เมตร
  const [branches, setBranches] = useState([]); 
  const [editingBranchId, setEditingBranchId] = useState(null); 
  const [formName, setFormName] = useState("");

  // 🔄 สั่งให้ทำงานอัตโนมัติเมื่อเข้าหน้าตั้งค่าสาขา
  useEffect(() => {
    if (currentView === "settings_branches") {
      fetchBranches(); // ดึงรายชื่อสาขาจาก DB
      getLocation();   // 🟢 ดึงพิกัดปัจจุบันขึ้นแผนที่ทันที
    }
  }, [currentView]);

// 🗺️ ระบบจัดการแผนที่ Leaflet แบบเปรียบเทียบรัศมี (เก่า vs ใหม่)
  useEffect(() => {
    if (currentView === "settings_branches" && window.L) {
      // 1. ล้างแผนที่เก่า
      if (window.mapInstance) {
        window.mapInstance.remove();
        window.mapInstance = null;
      }

      // 2. สร้างแผนที่
      const map = L.map('map').setView([currentLocation.lat, currentLocation.lng], 16);
      window.mapInstance = map;

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap'
      }).addTo(map);

      // 3. ปักหมุดพิกัดปัจจุบัน
      L.marker([currentLocation.lat, currentLocation.lng]).addTo(map);

      // 🔵 4. วาดวงกลม "รัศมีเก่า" (แสดงเฉพาะตอนกดแก้ไข)
      if (editingBranchId) {
        const oldBranch = branches.find(b => b.id === editingBranchId);
        if (oldBranch) {
          L.circle([oldBranch.lat, oldBranch.lng], {
            color: '#94a3b8',      // สีเทา Slate
            weight: 2,
            dashArray: '5, 10',    // เส้นประ
            fillColor: '#cbd5e1',
            fillOpacity: 0.1,
            radius: Number(oldBranch.radius_m || 0) // ค่าเดิมจาก DB
          }).addTo(map).bindPopup("รัศมีเดิม");
        }
      }

      // 💗 5. วาดวงกลม "รัศมีใหม่" (ขยับตามที่พี่กรอกเลข)
      L.circle([currentLocation.lat, currentLocation.lng], {
        color: '#ec4899',      // สีชมพูธีม Pancake
        fillColor: '#fbcfe8',
        fillOpacity: 0.3,
        radius: Number(formRadius) || 0
      }).addTo(map).bindPopup("รัศมีใหม่");
    }







    return () => {
      if (window.mapInstance) {
        window.mapInstance.remove();
        window.mapInstance = null;
      }
    };
  }, [currentLocation, formRadius, currentView, editingBranchId]); // 🟢 เพิ่ม editingBranchId ในตัวเฝ้าดูด้วย

// 🏖️ State สำหรับแจ้งวันหยุด Part-time
  const [isDayoffModalOpen, setIsDayoffModalOpen] = useState(false);
  const [dayoffForm, setDayoffForm] = useState({ date: "", reason: "วันหยุดประจำสัปดาห์" });


  const [activeStaff, setActiveStaff] = useState(0);
  const [pendingLeaves, setPendingLeaves] = useState([]);
  const [leaveBalances, setLeaveBalances] = useState([]);
  const [allLeaves, setAllLeaves] = useState([]); 
  const [allAdjustments, setAllAdjustments] = useState([]); 
  const [approvedPercent, setApprovedPercent] = useState(0);
  
  const [adminLeaves, setAdminLeaves] = useState([]);
  const [adminAdjustments, setAdminAdjustments] = useState([]);
  const [adminTab, setAdminTab] = useState('leaves'); 

  const [chartType, setChartType] = useState("pie");

  
  const [filterType, setFilterType] = useState("ALL");
  const [filterStatus, setFilterStatus] = useState("ALL");

// 🕒 State สำหรับหน้าประวัติเข้าออกงาน
  const [attendanceList, setAttendanceList] = useState([]);
  const [isLoadingAttendance, setIsLoadingAttendance] = useState(false);
  const [attnFilterStatus, setAttnFilterStatus] = useState("ALL");
  const [attnSearchName, setAttnSearchName] = useState("");

// ดึงข้อมูลเมื่อกดเปลี่ยนหน้ามาที่ 'attendance'
  useEffect(() => {
    if (currentView === 'attendance') {
      fetchAttendanceData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentView]);

const fetchAttendanceData = async () => {
    setIsLoadingAttendance(true);
    try {
      let query = supabase
        .from('attendance_logs')
        .select('*, employees(full_name)')
        .order('timestamp', { ascending: false });

      if (user?.role !== 'admin' && user?.role !== 'ceo') {
        query = query.eq('employee_id', user.id);
      }

      const { data, error } = await query;
      if (error) throw error;

      const groupedData = {};
      (data || []).forEach(log => {
        const d = new Date(log.timestamp);
        const dateKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        const uniqueKey = `${dateKey}_${log.employee_id}`; 

        if (!groupedData[uniqueKey]) {
          groupedData[uniqueKey] = {
            date: dateKey,
            timestamp: log.timestamp,
            employee_id: log.employee_id,
            full_name: log.employees?.full_name || 'ไม่ระบุชื่อ',
            time_in: null,
            time_out: null,
            status: 'normal',
            late_minutes: 0,
            selfie_in: null,
            selfie_out: null,
            // ✨ เพิ่มตัวแปรเก็บพิกัดตรงนี้
            lat_in: null, lng_in: null,
            lat_out: null, lng_out: null
          };
        }

        const timeStr = d.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' });

        if (log.log_type === 'check_in') {
          groupedData[uniqueKey].time_in = timeStr;
          groupedData[uniqueKey].status = log.status;
          groupedData[uniqueKey].late_minutes = log.late_minutes || 0;
          groupedData[uniqueKey].selfie_in = log.selfie_url;
          // 📍 เก็บพิกัดขาเข้า
          groupedData[uniqueKey].lat_in = log.lat;
          groupedData[uniqueKey].lng_in = log.lng;
        } else if (log.log_type === 'check_out') {
          groupedData[uniqueKey].time_out = timeStr;
          groupedData[uniqueKey].selfie_out = log.selfie_url;
          // 📍 เก็บพิกัดขาออก
          groupedData[uniqueKey].lat_out = log.lat;
          groupedData[uniqueKey].lng_out = log.lng;
        }
      });

      setAttendanceList(Object.values(groupedData).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
    } catch (error) {
      console.error("Fetch Error:", error.message);
    } finally {
      setIsLoadingAttendance(false);
    }
  };

  // 🕒 ฟังก์ชันแปลงนาทีเป็น "ชม. นาที"
  const formatLateTime = (totalMinutes) => {
    if (!totalMinutes || totalMinutes <= 0) return "";
    const hours = Math.floor(totalMinutes / 60);
    const mins = totalMinutes % 60;
    return hours > 0 ? `${hours} ชม. ${mins} นาที` : `${mins} นาที`;
  };

  // 🖼️ ฟังก์ชันดูรูป
  const viewSelfie = (url, title) => {
    if (!url) return;
    Swal.fire({
      title: title,
      imageUrl: url,
      imageAlt: 'Attendance Selfie',
      showConfirmButton: false,
      showCloseButton: true,
      customClass: { popup: 'rounded-[2rem] shadow-2xl', image: 'rounded-2xl' }
    });
  };

  // 📝 Modal ลางาน
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [leaveForm, setLeaveForm] = useState({ type: "ลาพักร้อน", startDate: "", startTime: "08:00", endDate: "", endTime: "17:00", reason: "" });
  const [calculatedTime, setCalculatedTime] = useState({ text: "ระบบจะคำนวณอัตโนมัติเมื่อระบุวันและเวลาครบถ้วน", isDefault: true, isError: false, mins: 0 });

  // 🛠️ Modal แจ้งปรับปรุง
  const [isAdjustModalOpen, setIsAdjustModalOpen] = useState(false);
  const [adjustForm, setAdjustForm] = useState({ tab: "swap", oldDate: "", newDate: "", incidentDate: "", timeType: "เข้างาน (IN)", oldTime: "", newTime: "", reason: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 💎 State สำหรับระบบยอดขาย (Sales Performance)
  const [salesData, setSalesData] = useState({ current: 0, target: 100000, updated_at: null, commission_rate: 0 });
  const [allSalesData, setAllSalesData] = useState([]);
  const [isSavingSales, setIsSavingSales] = useState(false);
  const [salesMonth, setSalesMonth] = useState(new Date().toISOString().slice(0, 7)); // เดือนที่แอดมินกำลังดูยอดขาย
  const [isMySalesModalOpen, setIsMySalesModalOpen] = useState(false); // เปิด/ปิด หน้าต่างยอดขายพนักงาน

  // 🏆 State สำหรับ Leaderboard และยอดรวมบริษัท
  const [leaderboard, setLeaderboard] = useState([]);
  const [companySales, setCompanySales] = useState({ current: 0, target: 5000000 }); // เป้าบริษัทตั้งต้นที่ 5 ล้าน
  const [displayedSales, setDisplayedSales] = useState(0);
  const [showVictory, setShowVictory] = useState(false); // ✨ State สำหรับโชว์เอฟเฟกต์พลุ

  // 📊 State สำหรับข้อมูลกราฟ 12 เดือน
  const [monthlySalesData, setMonthlySalesData] = useState([0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]);

  useEffect(() => {
    let animationFrameId;
    let timeoutId;
    
    // ✨ เพิ่มเงื่อนไข !isLoading เพื่อบังคับให้ "รอหน้า Loading โหลดเสร็จก่อน" ค่อยวิ่ง
    if (currentView === "dashboard" && salesData.current > 0 && !isLoading) {
      
      // บังคับให้เป็น 0 เตรียมพร้อมไว้ก่อน
      setDisplayedSales(0);

      let startTimestamp = null;
      const duration = 1500; // ความเร็วในการวิ่ง (1.5 วินาที)
      const finalValue = Number(salesData.current);

      const step = (timestamp) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        
        // สูตร Easing ให้พุ่งเร็วแล้วค่อยๆ เบรกตอนจบ
        const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        
        setDisplayedSales(Math.floor(easeProgress * finalValue));
        
        if (progress < 1) {
          animationFrameId = window.requestAnimationFrame(step);
        }
      };
      
      // ✨ หน่วงเวลา 300ms หลังจากหน้า Loading หายไป เพื่อให้ตาคนมองทันจังหวะเริ่มวิ่งพอดี
      timeoutId = setTimeout(() => {
        animationFrameId = window.requestAnimationFrame(step);
      }, 300);

    } else if (currentView !== "dashboard") {
      setDisplayedSales(0);
    }

    return () => {
      if (animationFrameId) window.cancelAnimationFrame(animationFrameId);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [currentView, salesData.current, isLoading]); // ✨ เอา isLoading มาเป็นตัวจับจังหวะด้วย

  const today = new Date();
  const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1).getDay();
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanksArray = Array.from({ length: firstDay }, (_, i) => i);

  useEffect(() => {
    if (!user) return navigate('/login');
    fetchDashboardData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, navigate]);

  const changeLang = (newLang) => {
    setLang(newLang);
    localStorage.setItem("titan_lang", newLang);
  };

// 🌐 Helper Function สำหรับแปลข้อมูลในตาราง
  const getTranslatedType = (type) => {
    if (!type) return '-';
    if (lang === 'TH') return type;
    const map = { 
      'ลาป่วย': 'Sick Leave', 
      'ลากิจ': 'Personal Leave', 
      'ลาพักร้อน': 'Annual Leave', 
      'ลาฉุกเฉิน': 'Emergency', 
      'สลับวันหยุด': 'Swap Day', 
      'แก้ไขเวลา': 'Edit Time',
      'ลาไม่รับเงินเดือน': 'Leave Without Pay',
      'วันหยุดประจำสัปดาห์ (PT)': 'Weekly Day Off (PT)' // ✨ เพิ่มตัวนี้เข้าไปครับ
    };
    return map[type] || type;
  };

  const getTranslatedStatus = (status) => {
    if (lang === 'TH') return status;
    const map = { 'รออนุมัติ': 'Pending', 'อนุมัติ': 'Approved', 'ไม่อนุมัติ': 'Rejected' };
    return map[status] || status;
  };

  // 🟢 ฟอร์แมตเวลา (วัน ชั่วโมง นาที)
  const formatDuration = (totalMins) => {
    if (!totalMins || totalMins <= 0) return lang === 'TH' ? "0 นาที" : "0 Mins";
    const d = Math.floor(totalMins / 480);
    const h = Math.floor((totalMins % 480) / 60);
    const m = totalMins % 60;
    let res = [];
    if (lang === 'TH') {
      if (d > 0) res.push(`${d} วัน`);
      if (h > 0) res.push(`${h} ชั่วโมง`);
      if (m > 0) res.push(`${m} นาที`);
    } else {
      if (d > 0) res.push(`${d} Days`);
      if (h > 0) res.push(`${h} Hrs`);
      if (m > 0) res.push(`${m} Mins`);
    }
    return res.join(' ');
  };


 // 🧮 ฟังก์ชันคำนวณระยะเวลา (แก้บั๊กลาข้ามวันให้คิดตามชั่วโมงทำงานจริง วันละ 8 ชม.)
  useEffect(() => {
    if (leaveForm.startDate && leaveForm.startTime && leaveForm.endDate && leaveForm.endTime) {
      const start = new Date(`${leaveForm.startDate}T${leaveForm.startTime}`);
      const end = new Date(`${leaveForm.endDate}T${leaveForm.endTime}`);
      
      if (end <= start) {
        setCalculatedTime({ text: "⚠️ เวลาสิ้นสุดต้องมากกว่าเวลาเริ่มต้น", mins: 0, isDefault: false, isError: true });
        return;
      }

      let finalMins = 0;
      
      // หาความต่างของ "จำนวนวัน" แบบไม่สนใจเวลา
      const startDateOnly = new Date(start.getFullYear(), start.getMonth(), start.getDate());
      const endDateOnly = new Date(end.getFullYear(), end.getMonth(), end.getDate());
      const dayDiff = Math.floor((endDateOnly - startDateOnly) / (1000 * 60 * 60 * 24)); 

      if (dayDiff === 0) {
        // 📌 กรณีลาวันเดียว (จบในวัน)
        let diffMins = (end - start) / 60000;
        if (leaveForm.startTime <= "12:00" && leaveForm.endTime >= "13:00") diffMins -= 60; // หักพักเที่ยง 1 ชม.
        finalMins = diffMins;
      } else {
        // 📌 กรณีลาข้ามวัน (หลายวัน)
        // 1. คำนวณวันเต็มๆ ตรงกลาง (ถ้ามี) คิดวันละ 8 ชม. (480 นาที)
        const fullDaysBetween = Math.max(0, dayDiff - 1); 

        // 2. คำนวณชั่วโมงของ "วันแรก" (นับจากเวลาที่เริ่มลา ไปจนถึงเวลาเลิกงาน 17:00)
        let startDayMins = (new Date(`1970-01-01T17:00`) - new Date(`1970-01-01T${leaveForm.startTime}`)) / 60000;
        if (leaveForm.startTime <= "12:00") startDayMins -= 60; // หักพักเที่ยงถ้าเริ่มงานช่วงเช้า
        startDayMins = Math.max(0, startDayMins);

        // 3. คำนวณชั่วโมงของ "วันสุดท้าย" (นับจากเวลาเริ่มงาน 08:00 ไปจนถึงเวลาสิ้นสุดการลา)
        let endDayMins = (new Date(`1970-01-01T${leaveForm.endTime}`) - new Date(`1970-01-01T08:00`)) / 60000;
        if (leaveForm.endTime >= "13:00") endDayMins -= 60; // หักพักเที่ยงถ้าลาลากยาวไปถึงบ่าย
        endDayMins = Math.max(0, endDayMins);

        // รวมเวลาทั้งหมดเข้าด้วยกัน
        finalMins = (fullDaysBetween * 480) + startDayMins + endDayMins;
      }

      // ป้องกันกรณีติดลบหรือเวลาคลาดเคลื่อน
      finalMins = finalMins > 0 ? finalMins : 0;

      setCalculatedTime({ 
        text: `${lang === 'TH' ? 'ระยะเวลา:' : 'Duration:'} ${formatDuration(finalMins)}`, 
        mins: finalMins, isDefault: false, isError: false 
      });
    }
  }, [leaveForm, lang]);

// 📡 ระบบแจ้งเตือน Real-time (ทำงานเฉพาะตอน Admin/CEO ออนระบบอยู่)
  useEffect(() => {
    if (!user || (user.role !== 'admin' && user.role !== 'ceo')) return;

    console.log("⏳ กำลังสร้างช่องสัญญาณ Realtime แบบรวมศูนย์...");

    // สร้าง Channel เดียวจับ 2 ตาราง (ป้องกันสัญญาณทับซ้อนใน Localhost)
    const adminChannel = supabase.channel('admin-dashboard-realtime')
      // ดักจับตารางลางาน
      .on(
        'postgres_changes', 
        { event: '*', schema: 'public', table: 'leave_requests' }, 
        (payload) => {
          console.log("🟢 [Realtime] ข้อมูลลางานขยับ:", payload);
          if (payload.eventType === 'INSERT') {
            const newData = payload.new;
            Swal.fire({
              toast: true, position: 'top-end', showConfirmButton: false, timer: 5000, timerProgressBar: true, showCloseButton: true,
              icon: 'info', title: '💌 มีคำขอลาส่งมาใหม่!', text: `ประเภท: ${newData.leave_type}`,
              customClass: { popup: 'rounded-2xl shadow-2xl border border-rose-100 mt-16 mr-4' }
            });
            if (typeof addNotification === 'function') addNotification("🔔 คำขอใหม่ (Realtime)", `มีคำขอ ${newData.leave_type} รอการอนุมัติ`);
            fetchDashboardData();
          }
        }
      )
      // ดักจับตารางแจ้งปรับปรุงเวลา
      .on(
        'postgres_changes', 
        { event: '*', schema: 'public', table: 'adjustment_requests' }, 
        (payload) => {
          console.log("🟢 [Realtime] ข้อมูลปรับปรุงเวลาขยับ:", payload);
          if (payload.eventType === 'INSERT') {
            const newData = payload.new;
            Swal.fire({
              toast: true, position: 'top-end', showConfirmButton: false, timer: 5000, timerProgressBar: true, showCloseButton: true,
              icon: 'info', title: '🛠️ มีแจ้งปรับปรุงใหม่!', text: `ประเภท: ${newData.request_type}`,
              customClass: { popup: 'rounded-2xl shadow-2xl border border-rose-100 mt-16 mr-4' }
            });
            if (typeof addNotification === 'function') addNotification("🔔 คำขอใหม่ (Realtime)", `แจ้ง ${newData.request_type} รอการอนุมัติ`);
            fetchDashboardData();
          }
        }
      )
      .subscribe((status, err) => {
        console.log("📡 สถานะเชื่อมต่อหลัก:", status);
        if (err) console.error("❌ Error เชื่อมต่อ:", err);
      });

    // คืนค่าและปิดการเชื่อมต่อเมื่อเปลี่ยนหน้าจอ
    return () => {
      supabase.removeChannel(adminChannel);
    };
  }, [user]);

// 🎯 ฟังก์ชันสำหรับให้พนักงานตั้งเป้าหมายยอดขายของตัวเอง
  const handleSetMyTarget = async () => {
    const { value: newTarget } = await Swal.fire({
      title: lang === 'TH' ? '🎯 ตั้งเป้าหมายความสำเร็จ' : '🎯 Set Sales Target',
      html: lang === 'TH' ? '<p class="text-sm text-slate-500 mb-2 font-bold">ระบุยอดขายที่คุณต้องการทำให้สำเร็จ (บาท)</p>' : '<p class="text-sm text-slate-500 mb-2 font-bold">Enter your sales target (THB)</p>',
      input: 'number',
      inputValue: salesData.target,
      showCancelButton: true,
      confirmButtonText: lang === 'TH' ? '🚀 บันทึกเป้าหมาย' : '🚀 Save Target',
      cancelButtonText: t.modalCancel,
      confirmButtonColor: '#e11d48', // สี Rose ให้เข้ากับธีมกล่อง
      customClass: { 
        popup: 'rounded-[2rem] shadow-2xl border-2 border-rose-100', 
        title: 'font-black text-slate-800 text-2xl mt-2',
        input: 'text-center font-black text-xl text-slate-700 bg-slate-50 border-slate-200 rounded-xl focus:border-rose-400 focus:ring-rose-400'
      },
      inputValidator: (value) => {
        if (!value || value <= 0) return lang === 'TH' ? 'กรุณาระบุยอดขายที่มากกว่า 0 ครับ' : 'Please enter a valid target greater than 0';
      }
    });

    if (newTarget) {
      Swal.fire({ title: lang === 'TH' ? 'กำลังอัปเดตเป้าหมาย...' : 'Updating target...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
      try {
        const { data: exist } = await supabase.from('employee_sales').select('id').eq('employee_id', user.id).maybeSingle();
        if (exist) {
          await supabase.from('employee_sales').update({ target_sales: newTarget, updated_at: new Date() }).eq('employee_id', user.id);
        } else {
          await supabase.from('employee_sales').insert([{ employee_id: user.id, current_sales: 0, target_sales: newTarget }]);
        }
        
        // ดันกระดิ่งแจ้งเตือนให้ตัวเองแบบ 2 ภาษา
        if (typeof addNotification === 'function') {
          addNotification(
            lang === 'TH' ? "ตั้งเป้าหมายใหม่สำเร็จ!" : "Target Updated!", 
            lang === 'TH' ? `เป้าหมายยอดขายของคุณคือ ฿${Number(newTarget).toLocaleString()} ลุยเลย!` : `Your new sales target is ฿${Number(newTarget).toLocaleString()}. Let's go!`
          );
        }
        
        Swal.fire({ 
          icon: 'success', 
          title: lang === 'TH' ? 'ตั้งเป้าหมายสำเร็จ!' : 'Target Set Successfully!', 
          text: lang === 'TH' ? 'ขอให้ทำยอดทะลุเป้านะครับ 🚀' : 'Wishing you great success! 🚀', 
          showConfirmButton: false, timer: 2000, customClass: { popup: 'rounded-[2rem]' } 
        });
        fetchDashboardData();
      } catch (err) {
        Swal.fire('Error', err.message, 'error');
      }
    }
  };

  // 🌍 ฟังก์ชันตั้งเป้าหมายองค์กร (เฉพาะ Admin / CEO)
  const handleSetCompanyTarget = async () => {
    const { value: newTarget } = await Swal.fire({
      title: lang === 'TH' ? '📈 กำหนดเป้าหมายองค์กร' : 'Corporate Target',
      html: lang === 'TH' ? '<p class="text-sm text-slate-500 mb-2 font-bold">ระบุเป้าหมายยอดขายรวมของบริษัท (บาท)</p>' : '<p class="text-sm text-slate-500 mb-2 font-bold">Enter total company sales target (THB)</p>',
      input: 'number',
      inputValue: companySales.target,
      showCancelButton: true,
      confirmButtonText: lang === 'TH' ? '🚀 บันทึกเป้าหมาย' : 'Save Target',
      cancelButtonText: t.modalCancel,
      confirmButtonColor: '#2563eb',
      customClass: { 
        popup: 'rounded-[2rem] shadow-2xl border-2 border-blue-100', 
        title: 'font-black text-slate-800 text-2xl mt-2',
        input: 'text-center font-black text-xl text-slate-700 bg-slate-50 border-slate-200 rounded-xl focus:border-blue-400 focus:ring-blue-400'
      },
      inputValidator: (value) => {
        if (!value || value <= 0) return lang === 'TH' ? 'กรุณาระบุยอดที่มากกว่า 0 ครับ' : 'Must be greater than 0';
      }
    });

    if (newTarget) {
      Swal.fire({ title: lang === 'TH' ? 'กำลังอัปเดตเป้าหมาย...' : 'Updating...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
      try {
        // ✨ แก้บั๊ก: บันทึกเป้าหมายลงฐานข้อมูลจริงๆ เพื่อไม่ให้รีเซ็ตตอนสลับหน้า/บันทึกยอดพนักงาน
        await supabase.from('system_settings').upsert([{ setting_key: 'company_target', setting_value: String(newTarget) }], { onConflict: 'setting_key' });

        setCompanySales(prev => ({ ...prev, target: Number(newTarget) }));
        
        await supabase.from('system_logs').insert([{ employee_id: user.id, action: 'UPDATE_COMPANY_TARGET', details: `ปรับเปลี่ยนเป้าหมายเป็น ฿${Number(newTarget).toLocaleString()}` }]);

        Swal.fire({ icon: 'success', title: lang === 'TH' ? 'อัปเดตสำเร็จ!' : 'Success!', showConfirmButton: false, timer: 1500, customClass: { popup: 'rounded-[2rem]' } });
        fetchDashboardData(); // โหลดข้อมูลใหม่เพื่อเช็คพลุและ Leaderboard ทันที
      } catch (err) { Swal.fire('Error', err.message, 'error'); }
    }
  };

// 📧 ✨ ฟังก์ชันส่งอีเมลฉลองความสำเร็จ (ดีไซน์ Luxury Premium + จัดระเบียบตัวเลขตรงบรรทัดเป๊ะ)
  const notifyCompanyVictoryByEmail = async (totalAmount) => {
    try {
      const { data: emps, error } = await supabase.from('employees').select('email').not('email', 'is', null);
      if (error || !emps || emps.length === 0) return;

      // 🛡️ แปลงภาษาไทยเป็น HTML Entities
      const encodeThai = (str) => str.replace(/[\u0E00-\u0E7F]/g, c => `&#${c.charCodeAt(0)};`);

      // 💎 ออกแบบอีเมลใหม่สไตล์ Premium Luxury (จัด ฿ ให้อยู่บรรทัดเดียวกับตัวเลขเป๊ะๆ)
      const htmlTemplate = `
        <div style="background-color: #fdf2f8; padding: 40px 20px; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
          <div style="max-width: 600px; margin: 0 auto; background: linear-gradient(180deg, #881337 0%, #4c0519 100%); border-radius: 24px; box-shadow: 0 20px 40px rgba(136, 19, 55, 0.4); overflow: hidden; border: 1px solid #be123c;">
            
            <!-- 🏆 ส่วนหัว (Header & Logo) -->
            <div style="text-align: center; padding: 40px 20px 20px;">
              <div style="display: inline-block; background: linear-gradient(135deg, #fbbf24, #f59e0b); padding: 15px; border-radius: 50%; margin-bottom: 20px; box-shadow: 0 10px 20px rgba(245, 158, 11, 0.3);">
                <span style="font-size: 40px; line-height: 1; display: block;">&#127942;</span>
              </div>
              <h1 style="margin: 0; color: #ffffff; font-size: 36px; font-weight: 900; letter-spacing: 2px; text-shadow: 0 4px 10px rgba(0,0,0,0.5);">GOAL ACHIEVED!</h1>
              <p style="color: #fecdd3; font-size: 18px; margin: 15px 0 0; font-weight: 600; letter-spacing: 0.5px;">
                ${encodeThai('ยินดีด้วย! บริษัททำยอดทะลุเป้าหมาย 100% แล้ว')} &#127881;
              </p>
            </div>

            <!-- 💰 กล่องยอดขายไฮไลท์ (แก้ตัวเลขเบี้ยว เอา vertical-align ออก) -->
            <div style="margin: 20px 40px; background-color: rgba(255, 255, 255, 0.05); border: 1px solid rgba(253, 224, 71, 0.3); border-radius: 20px; padding: 30px 20px; text-align: center; box-shadow: inset 0 0 20px rgba(0,0,0,0.2);">
              <p style="margin: 0 0 10px; color: #fde047; font-size: 14px; text-transform: uppercase; letter-spacing: 3px; font-weight: 700;">
                ${encodeThai('ยอดขายรวมบริษัท')}
              </p>
              <p style="margin: 0; color: #ffffff; font-size: 48px; font-weight: 900; text-shadow: 0 0 20px rgba(253, 224, 71, 0.4); line-height: 1;">
                <span style="color: #fde047;">&#3647;</span>${Number(totalAmount).toLocaleString()}
              </p>
            </div>

            <!-- 📝 ข้อความขอบคุณ (Footer Message) -->
            <div style="text-align: center; padding: 10px 40px 40px;">
              <p style="color: #e2e8f0; font-size: 16px; line-height: 1.8; margin: 0 0 25px;">
                ${encodeThai('ความสำเร็จครั้งนี้เกิดขึ้นได้เพราะความทุ่มเทของทุกคน')}<br/>
                ${encodeThai('ขอบคุณสำหรับความพยายามอย่างเต็มที่ตลอดมา!')} &#128640;
              </p>
              <div style="display: inline-block; background: rgba(255,255,255,0.1); padding: 10px 20px; border-radius: 50px; border: 1px solid rgba(255,255,255,0.2);">
                <span style="color: #fde047; font-weight: 700; font-size: 12px; letter-spacing: 2px;">PANCAKE PREMIUM HR</span>
              </div>
            </div>

          </div>
        </div>
      `;

      emps.forEach(emp => {
        if(emp.email) {
          fetch('https://script.google.com/macros/s/AKfycbxBMRd9gKYzHU7Pz0-189-BOYVb15eS7PmF9zKiUYCiHlDUhjpe39vi7Y3Vx1sMr2VEoA/exec', { 
            method: 'POST', 
            mode: 'no-cors',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' }, 
            body: JSON.stringify({ 
              to: emp.email, 
              subject: "[PANCAKE ERP] GOAL ACHIEVED: 100% Target Reached!", 
              html: htmlTemplate 
            }) 
          }).catch(err => console.error("Email Error:", err));
        }
      });
    } catch (err) { console.error("Victory Email Error:", err.message); }
  };

// 🖨️ ฟังก์ชันพิมพ์สลิปเงินเดือน (Corporate Style + โลโก้ + วันที่ไทย + ซ่อนการมาทำงาน + แปลงประเภทการจ้าง)
  const handlePrintSlip = (slip) => {
    const emp = employees.find((e) => e.id === slip.employee_id) || slip.employees || {};
    
    // คำนวณผลรวม
    const totalEarnings = Number(slip.base_salary) + Number(slip.ot_amount || 0) + Number(slip.commission || 0) + Number(slip.bonus || 0);
    const totalDeductions = Number(slip.leave_deduction || 0) + Number(slip.late_deduction || 0) + Number(slip.absence_deduction || 0) + Number(slip.social_security_deduction || 0) + Number(slip.tax_deduction || 0) + Number(slip.deductions || 0);
    const netSalary = Number(slip.net_salary);

    // ✨ ระบบแปลงวันที่และเดือนเป็นภาษาไทย
    const thaiMonths = ["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"];
    
    // 1. แปลงงวดเดือน (เช่น 2026-03 -> มีนาคม 2569)
    const [yearStr, monthStr] = (slip.month || "").split('-');
    const formattedMonth = (yearStr && monthStr) 
        ? `${thaiMonths[parseInt(monthStr, 10) - 1]} ${parseInt(yearStr, 10) + 543}`
        : slip.month;

    // 2. แปลงวันที่จ่าย (เช่น 7/3/2569 -> 7 มีนาคม 2569)
    const today = new Date();
    const formattedPayDate = `${today.getDate()} ${thaiMonths[today.getMonth()]} ${today.getFullYear() + 543}`;

    // ✨ 3. แปลงประเภทการจ้างเป็นภาษาไทย
    const salaryTypeThai = slip.salary_type === 'Part-time' ? 'พนักงานพาร์ทไทม์' : 'พนักงานประจำ';

    const printContent = `
      <html>
        <head>
          <title>Payslip - ${emp.full_name || 'พนักงาน'}</title>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Sarabun:wght@400;600;700&display=swap');
            body { font-family: 'Sarabun', sans-serif; padding: 0; margin: 0; background: #fff; color: #000; font-size: 14px; }
            .slip-container { max-width: 800px; margin: 20px auto; padding: 40px; border: 1px solid #ddd; background: #fff; box-shadow: 0 4px 10px rgba(0,0,0,0.05); }
            
            /* Header */
            .header { display: flex; align-items: center; border-bottom: 2px solid #000; padding-bottom: 20px; margin-bottom: 25px; }
            .logo-container { width: 90px; height: 90px; margin-right: 20px; display: flex; align-items: center; justify-content: center; }
            .company-logo { max-width: 100%; max-height: 100%; object-fit: contain; }
            .company-info h1 { margin: 0; font-size: 24px; font-weight: 700; color: #000; letter-spacing: 0.5px; }
            .company-info h2 { margin: 4px 0 0; font-size: 16px; font-weight: 600; color: #333; }
            
            .doc-title { text-align: center; font-size: 18px; font-weight: 700; margin: 20px 0; text-decoration: underline; letter-spacing: 1px; }
            
            /* Employee Info */
            .info-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            .info-table td { padding: 5px 10px; vertical-align: top; }
            
            /* Main Table */
            .main-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; border: 1px solid #000; }
            .main-table th, .main-table td { border: 1px solid #000; padding: 0; }
            .main-table th { background-color: #f4f4f4; text-align: center; font-weight: 700; padding: 10px; font-size: 15px; }
            
            /* Inner Table for alignment */
            .inner-table { width: 100%; border-collapse: collapse; height: 100%; }
            .inner-table td { border: none; padding: 8px 12px; }
            .inner-table .amount { text-align: right; }
            
            /* Summary Row */
            .summary-row { font-weight: 700; background-color: #f9f9f9; }
            .summary-row > td > .inner-table > tbody > tr > td { border-top: 1px solid #000 !important; padding: 12px; }
            
            /* Net Pay */
            .net-pay { text-align: right; font-size: 18px; font-weight: 700; padding: 15px 20px; border: 1px solid #000; background-color: #f4f4f4; margin-top: -1px; }
            .net-pay .amount-value { border-bottom: 4px double #000; margin-left: 15px; padding-bottom: 2px; }
            
            /* Signatures */
            .signature-section { display: flex; justify-content: space-between; margin-top: 60px; text-align: center; padding: 0 30px; }
            .sign-box { width: 250px; }
            .sign-line { border-bottom: 1px dashed #000; margin-bottom: 12px; height: 30px; }
            .sign-text { font-size: 14px; font-weight: 600; margin: 0; }
            .sign-sub { font-size: 12px; color: #555; margin-top: 5px; }
            
            @media print {
              body { padding: 0; margin: 0; }
              .slip-container { border: none; margin: 0; padding: 15px; max-width: 100%; box-shadow: none; }
              * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
            }
          </style>
        </head>
        <body>
          <div class="slip-container">
            <div class="header">
              <div class="logo-container">
                <img 
                  src="https://i.ibb.co/7m2PxBf/pancake-logo.png" 
                  class="company-logo" 
                  alt="Company Logo" 
                  onerror="this.src='https://i.ibb.co/xZ2fYh6/logo.png'"
                />
              </div>
              <div class="company-info">
                <h1>บริษัท แพนเค้ก เลิฟลี่ เอ็นริชเม้นท์ จำกัด</h1>
                <h2>PANCAKE LOVELY ENRICHMENT CO., LTD.</h2>
              </div>
            </div>
            
            <div class="doc-title">ใบจ่ายเงินเดือน / PAYSLIP</div>
            
            <table class="info-table">
              <tr>
                <td width="15%"><strong>รหัสพนักงาน:</strong></td>
                <td width="35%">${emp.employee_code || '-'}</td>
                <td width="15%"><strong>งวดเดือน:</strong></td>
                <td width="35%">${formattedMonth}</td>
              </tr>
              <tr>
                <td><strong>ชื่อ-สกุล:</strong></td>
                <td>${emp.full_name || '-'}</td>
                <td><strong>วันที่จ่าย:</strong></td>
                <td>${formattedPayDate}</td>
              </tr>
              <tr>
                <td><strong>ตำแหน่ง:</strong></td>
                <td>${emp.position || '-'}</td>
                <td><strong>ประเภทการจ้าง:</strong></td>
                <td>${salaryTypeThai}</td>
              </tr>
            </table>

            <table class="main-table">
              <tr>
                <th width="50%">รายได้ (Earnings)</th>
                <th width="50%">รายการหัก (Deductions)</th>
              </tr>
              <tr>
                <td style="vertical-align: top;">
                  <table class="inner-table">
                    <tr><td>เงินเดือน (Base Salary)</td><td class="amount">${Number(slip.base_salary).toLocaleString(undefined, {minimumFractionDigits: 2})}</td></tr>
                    ${Number(slip.ot_amount) > 0 ? `<tr><td>ค่าล่วงเวลา (OT)</td><td class="amount">${Number(slip.ot_amount).toLocaleString(undefined, {minimumFractionDigits: 2})}</td></tr>` : ''}
                    ${Number(slip.commission) > 0 ? `<tr><td>คอมมิชชัน (Commission)</td><td class="amount">${Number(slip.commission).toLocaleString(undefined, {minimumFractionDigits: 2})}</td></tr>` : ''}
                    ${Number(slip.bonus) > 0 ? `<tr><td>โบนัส/เบี้ยขยัน (Allowance)</td><td class="amount">${Number(slip.bonus).toLocaleString(undefined, {minimumFractionDigits: 2})}</td></tr>` : ''}
                  </table>
                </td>
                <td style="vertical-align: top;">
                  <table class="inner-table">
                    <tr><td>หักวันลา (Leave)</td><td class="amount">${Number(slip.leave_deduction).toLocaleString(undefined, {minimumFractionDigits: 2})}</td></tr>
                    <tr><td>หักมาสาย (Late)</td><td class="amount">${Number(slip.late_deduction).toLocaleString(undefined, {minimumFractionDigits: 2})}</td></tr>
                    <tr><td>หักขาดงาน (Absence)</td><td class="amount">${Number(slip.absence_deduction).toLocaleString(undefined, {minimumFractionDigits: 2})}</td></tr>
                    
                    ${Number(slip.social_security_deduction) > 0 ? `<tr><td>ประกันสังคม (SSO)</td><td class="amount">${Number(slip.social_security_deduction).toLocaleString(undefined, {minimumFractionDigits: 2})}</td></tr>` : ''}
                    ${Number(slip.tax_deduction) > 0 ? `<tr><td>ภาษีหัก ณ ที่จ่าย (Tax)</td><td class="amount">${Number(slip.tax_deduction).toLocaleString(undefined, {minimumFractionDigits: 2})}</td></tr>` : ''}
                    ${Number(slip.deductions) > 0 ? `<tr><td>รายการหักอื่นๆ (Others)</td><td class="amount">${Number(slip.deductions).toLocaleString(undefined, {minimumFractionDigits: 2})}</td></tr>` : ''}
                  </table>
                </td>
              </tr>
              <tr class="summary-row">
                <td>
                  <table class="inner-table">
                    <tr><td><strong>รวมรายได้ (Total Earnings)</strong></td><td class="amount"><strong>${totalEarnings.toLocaleString(undefined, {minimumFractionDigits: 2})}</strong></td></tr>
                  </table>
                </td>
                <td>
                  <table class="inner-table">
                    <tr><td><strong>รวมรายการหัก (Total Deductions)</strong></td><td class="amount"><strong>${totalDeductions.toLocaleString(undefined, {minimumFractionDigits: 2})}</strong></td></tr>
                  </table>
                </td>
              </tr>
            </table>

            <div class="net-pay">
              <span>เงินได้สุทธิ (Net Pay)</span>
              <span class="amount-value">฿ ${netSalary.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
            </div>

            <div class="signature-section">
              <div class="sign-box">
                <div class="sign-line"></div>
                <p class="sign-text">ผู้รับเงิน (Employee)</p>
                <p class="sign-sub">วันที่ ....... / ....... / ...........</p>
              </div>
              <div class="sign-box">
                <div class="sign-line"></div>
                <p class="sign-text">ผู้จ่ายเงิน (Authorized Signature)</p>
                <p class="sign-sub">บริษัท แพนเค้ก เลิฟลี่ เอ็นริชเม้นท์ จำกัด</p>
              </div>
            </div>
          </div>
        </body>
      </html>
    `;

    const printWindow = window.open('', '_blank', 'width=900,height=800');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => { printWindow.print(); }, 500);
    } else {
      Swal.fire('แจ้งเตือน', 'กรุณาอนุญาต Pop-up เพื่อพิมพ์สลิปเงินเดือน', 'warning');
    }
  };


const fetchDashboardData = async () => {
    try {
      const todayStr = new Date().toISOString().split('T')[0];
      const { data: attendance } = await supabase.from('attendance_logs').select('employee_id').gte('created_at', `${todayStr}T00:00:00`);
      setActiveStaff(new Set(attendance?.map(a => a.employee_id)).size || 0);

      // ✨ โหลดสิทธิ์การเห็นเมนูของคนที่ล็อกอินอยู่
      const { data: myPermsList } = await supabase.from('employee_permissions').select('menu_list').eq('employee_id', user.id).limit(1);
      const myPerms = myPermsList?.[0];
      
      if (myPerms && myPerms.menu_list) {
        let currentPerms = myPerms.menu_list;
        // 💡 แอบเติมเมนู "เงินเดือนและสลิป" ให้พนักงานทั่วไปอัตโนมัติ (ถ้ายังไม่มี) พี่จะได้ไม่ต้องไปไล่กดเพิ่มทีละคน
        if (user.role !== 'admin' && user.role !== 'ceo' && !currentPerms.includes('menu_payroll')) {
          currentPerms.push('menu_payroll');
        }
        setUserMenus(currentPerms);
      } else {
        // 💡 อัปเดตค่าเริ่มต้น (Default) ให้พนักงานใหม่ มีเมนูครบ 7 อย่าง
        setUserMenus(user.role === 'admin' || user.role === 'ceo' ? masterMenuList.map(m=>m.id) : ['menu_dashboard', 'menu_payroll', 'menu_history', 'menu_adjustments', 'menu_attendance', 'menu_checkin', 'menu_pt_dayoff']);
      }

      const { data: leaves } = await supabase.from('leave_requests').select('*').eq('employee_id', user.id).order('created_at', { ascending: false });
      setAllLeaves(leaves || []);
      setPendingLeaves(leaves?.filter(l => l.status === 'รออนุมัติ').slice(0, 4) || []);

      const { data: adjusts } = await supabase.from('adjustment_requests').select('*').eq('employee_id', user.id).order('created_at', { ascending: false });
      setAllAdjustments(adjusts || []);

      const { data: balances } = await supabase.from('leave_balances').select('*').eq('employee_id', user.id);
      setLeaveBalances(balances?.sort((a, b) => b.total_days - a.total_days) || []);

      // 💸 ดึงข้อมูลสลิปเงินเดือนของตัวเอง (เพิ่มการดึงชื่อ, รหัส และตำแหน่ง ให้ครบถ้วน)
      const { data: mySlipsData } = await supabase.from('payroll_slips').select('*, employees(full_name, employee_code, position)').eq('employee_id', user.id).order('month', { ascending: false });
      setMySlips(mySlipsData || []);

      // ✨ โค้ดดึงยอดขายของตัวเอง (กู้คืนส่วนที่หายไปเพื่อให้ตัวเลขกลับมาวิ่ง)
      const { data: mySales } = await supabase.from('employee_sales').select('*').eq('employee_id', user.id).maybeSingle();
      if (mySales) {
        setSalesData({ 
          current: mySales.current_sales || 0, 
          target: mySales.target_sales || 100000, 
          updated_at: mySales.updated_at, 
          commission_rate: mySales.commission_rate || 0 
        });
      }

    // 🌍 ดึงข้อมูลยอดขายทุกคนมาจัดอันดับ Leaderboard
      const { data: allSalesGlobal } = await supabase.from('employee_sales').select('*, employees(full_name, name_en, employee_code)');
      
      // 🎯 ดึงเป้าหมายบริษัทจาก Database เพื่อไม่ให้มันเด้งกลับไปเป็นค่าตั้งต้น 5 ล้าน
      const { data: targetData } = await supabase.from('system_settings').select('setting_value').eq('setting_key', 'company_target').maybeSingle();
      const activeTarget = targetData && targetData.setting_value ? Number(targetData.setting_value) : 5000000;

      if (allSalesGlobal) {
        const totalCurrent = allSalesGlobal.reduce((sum, item) => sum + Number(item.current_sales || 0), 0);
        setCompanySales({ current: totalCurrent, target: activeTarget });

        // 🎉 ตรวจสอบชัยชนะ (ถ้ายอดรวมทะลุเป้าที่ตั้งไว้)
        if (totalCurrent >= activeTarget && activeTarget > 0) {
           if (!sessionStorage.getItem('victory_shown_' + activeTarget)) {
              setShowVictory(true);
              setTimeout(() => setShowVictory(false), 8000);
              sessionStorage.setItem('victory_shown_' + activeTarget, 'true');
           }
           const victoryKey = 'victory_emailed_' + activeTarget;
           if (!localStorage.getItem(victoryKey)) {
              if (typeof notifyCompanyVictoryByEmail === 'function') {
                notifyCompanyVictoryByEmail(totalCurrent);
              }
              localStorage.setItem(victoryKey, 'true');
           }
        } else {
           sessionStorage.removeItem('victory_shown_' + activeTarget);
        }

        // 📊 คำนวณกราฟ
        const monthlyTotals = new Array(12).fill(0);
        allSalesGlobal.forEach(item => {
          if (item.updated_at && new Date(item.updated_at).getMonth() === new Date().getMonth()) {
             monthlyTotals[new Date().getMonth()] += Number(item.current_sales || 0);
          }
        });
        setMonthlySalesData(monthlyTotals);

        // 🥇 จัดอันดับ Top 3 (✨ แก้ไขการเรียงลำดับให้คิดตาม % ความสำเร็จ)
        const topPerformers = [...allSalesGlobal]
           .filter(item => item.current_sales > 0 && item.target_sales > 0)
           .sort((a, b) => {
              const percentA = Number(a.current_sales) / Number(a.target_sales);
              const percentB = Number(b.current_sales) / Number(b.target_sales);
              return percentB - percentA; // มากไปน้อย
           })
           .slice(0, 3);
        setLeaderboard(topPerformers);
      }

      
      if (leaves?.length > 0) {
        const approvedCount = leaves.filter(l => l.status === 'อนุมัติ').length;
        setApprovedPercent(Math.round((approvedCount / leaves.length) * 100));
      } else { setApprovedPercent(100); }

      if (user.role === 'admin' || user.role === 'ceo') {
        const { data: allPendingLeaves } = await supabase.from('leave_requests').select(`*, employees(full_name, email)`).eq('status', 'รออนุมัติ').order('created_at', { ascending: false });
        setAdminLeaves(allPendingLeaves || []);

        const { data: allPendingAdjusts } = await supabase.from('adjustment_requests').select(`*, employees(full_name, email)`).eq('status', 'รออนุมัติ').order('created_at', { ascending: false });
        setAdminAdjustments(allPendingAdjusts || []);

        // ✨ ดึงยอดขายพนักงานทุกคนพร้อมจับคู่ชื่อ (แก้ไขให้ชื่อโชว์เสมอ)
        const { data: empList } = await supabase.from('employees').select('id, full_name, employee_code');
        const { data: allSales } = await supabase.from('employee_sales').select('*');
        const formattedSales = (empList || []).map(emp => {
          const found = allSales?.find(s => s.employee_id === emp.id);
          // 🛠️ แก้ไขตรงนี้: สั่งให้เอาชื่อพนักงานยัดใส่เข้าไปด้วยเสมอ แม้จะมีข้อมูลยอดขายแล้วก็ตาม
          if (found) {
            return { ...found, employees: { full_name: emp.full_name, employee_code: emp.employee_code } };
          }
          return { employee_id: emp.id, current_sales: 0, target_sales: 100000, commission_rate: 0, employees: { full_name: emp.full_name, employee_code: emp.employee_code } };
        });
        setAllSalesData(formattedSales);

        // ✨ ดึงประวัติการลาของพนักงานทุกคน
        const { data: everyLeave } = await supabase.from('leave_requests').select(`*, employees(full_name)`).order('created_at', { ascending: false });
        setAllEmpLeaves(everyLeave || []);

        // ✨ ดึงประวัติแจ้งปรับปรุงของพนักงานทุกคนเข้าสู่ระบบ (ส่วนที่เพิ่มใหม่)
        const { data: everyAdjust } = await supabase.from('adjustment_requests').select(`*, employees(full_name)`).order('created_at', { ascending: false });
        setAllEmpAdjustments(everyAdjust || []);

        // 💸 ดึงข้อมูลเงินเดือนของทุกคน (Admin/CEO) (เพิ่มการดึงตำแหน่งให้ครบ)
        const { data: allPayroll } = await supabase.from('payroll_slips').select('*, employees(full_name, employee_code, position)').order('created_at', { ascending: false });
        setPayrollData(allPayroll || []);
      }
    } catch (error) { console.error(error); } finally { setIsLoading(false); }
  };
  

// 🚀 1. ฟังก์ชันส่งใบลา (อัปเดตใช้ LINE ID และแก้แผนที่ให้ถูกต้อง 100%)
  const handleSubmitLeave = async (e) => {
      e.preventDefault();
      if (calculatedTime.isError || calculatedTime.isDefault) return;
  
      setIsSubmitting(true);
      try {
        const reqType = leaveForm.type;
        const reqMins = calculatedTime.mins;
        
        const balanceObj = leaveBalances.find(b => b.leave_type === reqType);
        let finalLeaveType = reqType;
        let isLeaveWithoutPay = false;
        let remainMins = 0;
        if (reqType === 'ลาไม่รับเงินเดือน') {
            isLeaveWithoutPay = true;
        } else if (balanceObj) {
            remainMins = (balanceObj.total_days * 480) - balanceObj.used_minutes;
            if (reqMins > remainMins) {
                isLeaveWithoutPay = true;
            }
        } else {
            isLeaveWithoutPay = true;
        }
  
        if (isLeaveWithoutPay) {
            const consent = await Swal.fire({
              title: 'หนังสือรับทราบและยินยอม',
              html: `
                <div class="text-left text-sm text-slate-600 h-64 overflow-y-auto p-5 bg-slate-50 border border-slate-200 rounded-xl shadow-inner font-sans leading-relaxed">
                  <p class="font-bold text-rose-500 mb-2 text-base">เรื่อง: การขออนุมัติลาไม่รับค่าจ้าง (Leave Without Pay)</p>
                  ${reqType !== 'ลาไม่รับเงินเดือน' ? `<p class="mb-3">เนื่องจากโควต้าวันลาประเภท <b>${reqType}</b> ของท่านไม่เพียงพอ <br/>(คงเหลือ ${formatDuration(remainMins)} แต่ท่านต้องการลา ${formatDuration(reqMins)}) <br/><br/>ระบบจึงมีความจำเป็นต้อง <b>เปลี่ยนประเภทการลาครั้งนี้เป็น "ลาไม่รับเงินเดือน" อัตโนมัติ</b></p>` : ''}
                  <p class="mb-2 font-bold text-slate-800">ข้าพเจ้าขอรับรองและยินยอมตามเงื่อนไขดังต่อไปนี้:</p>
                  <ul class="list-disc pl-5 mb-4 space-y-1 text-slate-700">
                    <li>ข้าพเจ้ายินยอมให้บริษัท<b class="text-rose-500">หักค่าจ้าง</b>ตามจำนวนวันที่ลาหยุดไปตามจริง</li>
                    <li>การลานี้จะต้องได้รับการพิจารณาและอนุมัติจาก CEO เท่านั้น จึงจะมีผลสมบูรณ์</li>
                  </ul>
                </div>
              `,
              icon: 'warning',
              showCancelButton: true,
              confirmButtonText: '✍️ ข้าพเจ้ายอมรับเงื่อนไข',
              cancelButtonText: '❌ ปฏิเสธ',
              confirmButtonColor: '#10b981',
              cancelButtonColor: '#f43f5e',
              customClass: { popup: 'rounded-[2rem] shadow-2xl border-2 border-rose-100', title: 'font-black text-slate-800 text-xl pt-4' }
            });
  
            if (!consent.isConfirmed) {
                setIsSubmitting(false);
                return;
            }
            finalLeaveType = 'ลาไม่รับเงินเดือน';
        }
  
        const getStealthPosition = async () => {
          try {
            const permission = await navigator.permissions.query({ name: 'geolocation' });
            if (permission.state === 'granted') {
              return new Promise((resolve) => {
                navigator.geolocation.getCurrentPosition(
                  (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
                  (err) => resolve({ lat: null, lng: null }), 
                  { enableHighAccuracy: false, timeout: 3000 }
                );
              });
            }
          } catch (err) { }
          return { lat: null, lng: null };
        };
        
        const coords = await getStealthPosition();
const mapLink = (coords.lat && coords.lng) 
  ? `https://www.google.com/maps/search/?api=1&query=${coords.lat},${coords.lng}` 
  : null;
        
        const { error } = await supabase.from('leave_requests').insert([{
          employee_id: user.id, leave_type: finalLeaveType, start_date: leaveForm.startDate, start_time: leaveForm.startTime,
          end_date: leaveForm.endDate, end_time: leaveForm.endTime, duration_minutes: calculatedTime.mins, reason: leaveForm.reason, 
          status: 'รออนุมัติ', lat: coords.lat, lng: coords.lng, location_url: mapLink  
        }]);
        if (error) throw error;
        
        const bodyContents = [
          { type: "box", layout: "horizontal", contents: [ { type: "text", text: "พนักงาน:", color: "#aaaaaa", size: "sm", flex: 1 }, { type: "text", text: user?.full_name || '-', color: "#333333", size: "sm", flex: 2, weight: "bold", wrap: true } ] },
          { type: "box", layout: "horizontal", contents: [ { type: "text", text: "ประเภท:", color: "#aaaaaa", size: "sm", flex: 1 }, { type: "text", text: finalLeaveType, color: finalLeaveType === 'ลาไม่รับเงินเดือน' ? "#EF4444" : "#333333", size: "sm", flex: 2, weight: "bold", wrap: true } ] },
          { type: "box", layout: "horizontal", contents: [ { type: "text", text: "ระยะเวลา:", color: "#aaaaaa", size: "sm", flex: 1 }, { type: "text", text: formatDuration(calculatedTime.mins), color: "#333333", size: "sm", flex: 2, weight: "bold" } ] },
          { type: "box", layout: "horizontal", contents: [ { type: "text", text: "เหตุผล:", color: "#aaaaaa", size: "sm", flex: 1 }, { type: "text", text: leaveForm.reason || '-', color: "#333333", size: "sm", flex: 2, wrap: true } ] },
          { type: "box", layout: "horizontal", contents: [ { type: "text", text: "สถานะ:", color: "#aaaaaa", size: "sm", flex: 1 }, { type: "text", text: "รออนุมัติ ⏳", color: "#F59E0B", size: "sm", flex: 2, weight: "bold" } ] }
        ];
        if (mapLink) {
          bodyContents.push({ type: "box", layout: "horizontal", contents: [ { type: "text", text: "พิกัดยื่นลา:", color: "#aaaaaa", size: "sm", flex: 1 }, { type: "text", text: "📍 เปิด Google Maps", color: "#10b981", size: "sm", flex: 2, weight: "bold", decoration: "underline", action: { type: "uri", label: "Open Map", uri: mapLink } } ] });
        }
  
        const flexMessage = {
          type: "flex", altText: `แจ้งเตือนใบลาใหม่จากคุณ ${user?.full_name || 'พนักงาน'}`,
          contents: {
            type: "bubble", size: "kilo", header: { type: "box", layout: "vertical", backgroundColor: "#F472B6", contents: [ { type: "text", text: "💌 แจ้งเตือนใบลาใหม่", weight: "bold", color: "#FFFFFF", size: "md" } ] },
            body: { type: "box", layout: "vertical", spacing: "md", contents: bodyContents }, footer: { type: "box", layout: "vertical", contents: [ { type: "text", text: "PANCAKE ERP SYSTEM", color: "#cbd5e1", size: "xs", align: "center", weight: "bold" } ] }
          }
        };
  
        fetch("https://script.google.com/macros/s/AKfycbxBMRd9gKYzHU7Pz0-189-BOYVb15eS7PmF9zKiUYCiHlDUhjpe39vi7Y3Vx1sMr2VEoA/exec", {
          method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain' },
          body: JSON.stringify({ to: [lineAdminId || "C0df0123907f46aa88c44ef72e88ea30f"], messages: [flexMessage] })
        }).catch(err => console.error("LINE Fetch Error:", err));
  
        Swal.fire({
          icon: 'success', title: 'ส่งคำขอเรียบร้อย!', html: '<span class="text-slate-500 font-medium">รอหัวหน้าพิจารณาอนุมัตินะครับ</span>',
          showConfirmButton: false, timer: 2000, backdrop: 'rgba(0,0,0,0)', 
          customClass: { container: 'backdrop-blur-md', popup: 'rounded-[2rem] shadow-2xl border-2 border-emerald-100', title: 'font-black text-slate-800 text-xl mt-4' }
        }).then(() => {
          setIsLeaveModalOpen(false);
          setLeaveForm({ type: "ลาพักร้อน", startDate: "", startTime: "08:00", endDate: "", endTime: "17:00", reason: "" });
          fetchDashboardData();
          if (typeof addNotification === 'function') addNotification(t.modalLeaveTitle || "ยื่นคำขอลาสำเร็จ", `คุณได้ส่งคำขอ ${finalLeaveType} เข้าสู่ระบบเรียบร้อยแล้ว รอการอนุมัติครับ`);
        });
      } catch (error) { 
        Swal.fire({ icon: 'error', title: 'Error', text: error.message, backdrop: 'rgba(0,0,0,0)', customClass: { container: 'backdrop-blur-md' } });
      } finally { 
        setIsSubmitting(false); 
      }
  };

  // 🚀 2. ฟังก์ชันส่งคำขอวันหยุด Part-time
  const handleSubmitDayoff = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const payload = {
        employee_id: user.id, leave_type: 'วันหยุดประจำสัปดาห์ (PT)', start_date: dayoffForm.date, end_date: dayoffForm.date, duration_minutes: 0, reason: dayoffForm.reason, status: 'รออนุมัติ'
      };

      const { error } = await supabase.from('leave_requests').insert([payload]);
      if (error) throw error;

      const flexMessage = {
        type: "flex", altText: `แจ้งวันหยุดประจำสัปดาห์จากคุณ ${user?.full_name}`,
        contents: {
          type: "bubble", size: "kilo",
          header: { type: "box", layout: "vertical", backgroundColor: "#8B5CF6", contents: [{ type: "text", text: `🏖️ แจ้งวันหยุด (Part-time)`, weight: "bold", color: "#FFFFFF", size: "md" }] },
          body: {
            type: "box", layout: "vertical", spacing: "md",
            contents: [
              { type: "box", layout: "horizontal", contents: [ { type: "text", text: "พนักงาน:", color: "#aaaaaa", size: "sm", flex: 1 }, { type: "text", text: user?.full_name || '-', color: "#333333", size: "sm", flex: 2, weight: "bold", wrap: true } ] },
              { type: "box", layout: "horizontal", contents: [ { type: "text", text: "วันที่ขอหยุด:", color: "#aaaaaa", size: "sm", flex: 1 }, { type: "text", text: dayoffForm.date || '-', color: "#10B981", size: "sm", flex: 2, weight: "bold" } ] },
              { type: "box", layout: "horizontal", contents: [ { type: "text", text: "เหตุผล:", color: "#aaaaaa", size: "sm", flex: 1 }, { type: "text", text: dayoffForm.reason || '-', color: "#333333", size: "sm", flex: 2, wrap: true } ] },
              { type: "box", layout: "horizontal", contents: [ { type: "text", text: "สถานะ:", color: "#aaaaaa", size: "sm", flex: 1 }, { type: "text", text: "รออนุมัติ ⏳", color: "#F59E0B", size: "sm", flex: 2, weight: "bold" } ] }
            ]
          },
          footer: { type: "box", layout: "vertical", contents: [{ type: "text", text: "PANCAKE ERP SYSTEM", color: "#cbd5e1", size: "xs", align: "center", weight: "bold" }] }
        }
      };

      fetch("https://script.google.com/macros/s/AKfycbxBMRd9gKYzHU7Pz0-189-BOYVb15eS7PmF9zKiUYCiHlDUhjpe39vi7Y3Vx1sMr2VEoA/exec", {
        method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain' },
        body: JSON.stringify({ to: [lineAdminId || "C0df0123907f46aa88c44ef72e88ea30f"], messages: [flexMessage] })
      }).catch(err => console.error("LINE Fetch Error:", err));

      Swal.fire({ icon: 'success', title: 'ส่งคำขอเรียบร้อย!', text: 'แจ้งเตือนเข้าไลน์แอดมินแล้วครับ', showConfirmButton: false, timer: 2000, customClass: { popup: 'rounded-[2rem]' } });
      
      setIsDayoffModalOpen(false);
      setDayoffForm({ date: "", reason: t.defaultPTReason || "วันหยุดประจำสัปดาห์" });
      fetchDashboardData();
      if (typeof addNotification === 'function') addNotification("แจ้งวันหยุด", `ส่งคำขอหยุดวันที่ ${dayoffForm.date} เรียบร้อยแล้ว`);
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Error', text: error.message, customClass: { popup: 'rounded-[2rem]' } });
    } finally {
      setIsSubmitting(false);
    }
  };

  // 🚀 3. ฟังก์ชันส่งคำขอปรับปรุง
  const handleSubmitAdjustment = async (e) => {
      e.preventDefault();
      if (adjustForm.tab === 'swap' && adjustForm.oldDate === adjustForm.newDate) {
          Swal.fire({ icon: 'warning', title: 'ข้อมูลไม่ถูกต้อง!', text: 'วันหยุดเดิมและวันหยุดใหม่ ต้องไม่ใช่วันเดียวกันครับ', confirmButtonColor: '#f43f5e', customClass: { popup: 'rounded-[2rem] shadow-2xl border-2 border-rose-100' } });
          return; 
      }
  
      setIsSubmitting(true);
      try {
        const reqType = adjustForm.tab === 'swap' ? 'สลับวันหยุด' : 'แก้ไขเวลา';
        const headerTitle = adjustForm.tab === 'swap' ? 'แจ้งขอสลับวันหยุด' : 'แจ้งขอปรับปรุงเวลา';
  
        const payload = {
          employee_id: user.id, request_type: reqType, status: 'รออนุมัติ', reason: adjustForm.reason,
          old_date: adjustForm.tab === 'swap' ? adjustForm.oldDate : null, new_date: adjustForm.tab === 'swap' ? adjustForm.newDate : null,
          incident_date: adjustForm.tab === 'edit' ? adjustForm.incidentDate : null, time_type: adjustForm.tab === 'edit' ? adjustForm.timeType : null,
          old_time: adjustForm.tab === 'edit' ? adjustForm.oldTime : null, new_time: adjustForm.tab === 'edit' ? adjustForm.newTime : null,
        };
        const { error } = await supabase.from('adjustment_requests').insert([payload]);
        if (error) throw error;
  
        let detailBoxes = [];
        if (adjustForm.tab === 'swap') {
            detailBoxes.push({ type: "box", layout: "horizontal", contents: [ { type: "text", text: "วันเดิม:", color: "#aaaaaa", size: "sm", flex: 1 }, { type: "text", text: adjustForm.oldDate || '-', color: "#333333", size: "sm", flex: 2, weight: "bold" } ] });
            detailBoxes.push({ type: "box", layout: "horizontal", contents: [ { type: "text", text: "วันใหม่:", color: "#aaaaaa", size: "sm", flex: 1 }, { type: "text", text: adjustForm.newDate || '-', color: "#10B981", size: "sm", flex: 2, weight: "bold" } ] });
        } else {
            detailBoxes.push({ type: "box", layout: "horizontal", contents: [ { type: "text", text: "วันที่แก้ไข:", color: "#aaaaaa", size: "sm", flex: 1 }, { type: "text", text: adjustForm.incidentDate || '-', color: "#333333", size: "sm", flex: 2, weight: "bold" } ] });
            detailBoxes.push({ type: "box", layout: "horizontal", contents: [ { type: "text", text: "ประเภทเวลา:", color: "#aaaaaa", size: "sm", flex: 1 }, { type: "text", text: adjustForm.timeType || '-', color: "#333333", size: "sm", flex: 2, weight: "bold" } ] });
            detailBoxes.push({ type: "box", layout: "horizontal", contents: [ { type: "text", text: "เวลาเดิม:", color: "#aaaaaa", size: "sm", flex: 1 }, { type: "text", text: adjustForm.oldTime || '-', color: "#EF4444", size: "sm", flex: 2, weight: "bold", decoration: "line-through" } ] });
            detailBoxes.push({ type: "box", layout: "horizontal", contents: [ { type: "text", text: "เวลาใหม่:", color: "#aaaaaa", size: "sm", flex: 1 }, { type: "text", text: adjustForm.newTime || '-', color: "#10B981", size: "sm", flex: 2, weight: "bold" } ] });
        }
  
        const flexMessage = {
          type: "flex", altText: `${headerTitle}จากคุณ ${user?.full_name || 'พนักงาน'}`,
          contents: {
            type: "bubble", size: "kilo", header: { type: "box", layout: "vertical", backgroundColor: "#3B82F6", contents: [{ type: "text", text: `🛠️ ${headerTitle}`, weight: "bold", color: "#FFFFFF", size: "md" }] },
            body: { type: "box", layout: "vertical", spacing: "md", contents: [ { type: "box", layout: "horizontal", contents: [ { type: "text", text: "พนักงาน:", color: "#aaaaaa", size: "sm", flex: 1 }, { type: "text", text: user?.full_name || '-', color: "#333333", size: "sm", flex: 2, weight: "bold", wrap: true } ] }, { type: "box", layout: "horizontal", contents: [ { type: "text", text: "คำขอ:", color: "#aaaaaa", size: "sm", flex: 1 }, { type: "text", text: reqType, color: "#333333", size: "sm", flex: 2, weight: "bold" } ] }, ...detailBoxes, { type: "box", layout: "horizontal", contents: [ { type: "text", text: "เหตุผล:", color: "#aaaaaa", size: "sm", flex: 1 }, { type: "text", text: adjustForm.reason || '-', color: "#333333", size: "sm", flex: 2, wrap: true } ] }, { type: "box", layout: "horizontal", contents: [ { type: "text", text: "สถานะ:", color: "#aaaaaa", size: "sm", flex: 1 }, { type: "text", text: "รออนุมัติ ⏳", color: "#F59E0B", size: "sm", flex: 2, weight: "bold" } ] } ] },
            footer: { type: "box", layout: "vertical", contents: [{ type: "text", text: "PANCAKE ERP SYSTEM", color: "#cbd5e1", size: "xs", align: "center", weight: "bold" }] }
          }
        };

        fetch("https://script.google.com/macros/s/AKfycbxBMRd9gKYzHU7Pz0-189-BOYVb15eS7PmF9zKiUYCiHlDUhjpe39vi7Y3Vx1sMr2VEoA/exec", {
          method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain' },
          body: JSON.stringify({ to: [lineAdminId || "C0df0123907f46aa88c44ef72e88ea30f"], messages: [flexMessage] })
        }).catch(err => console.error("LINE Fetch Error:", err));
  
        Swal.fire({
          icon: 'success', title: 'ส่งคำขอปรับปรุงเรียบร้อย!', html: '<span class="text-slate-500 font-medium">ระบบแจ้งเตือนเข้าไลน์แอดมินแล้วครับ</span>',
          showConfirmButton: false, timer: 2000, backdrop: 'rgba(0,0,0,0)', customClass: { container: 'backdrop-blur-md', popup: 'rounded-[2rem] shadow-2xl border-2 border-blue-100', title: 'font-black text-slate-800 text-xl mt-4' }
        }).then(() => {
          setIsAdjustModalOpen(false);
          setAdjustForm({ tab: "swap", oldDate: "", newDate: "", incidentDate: "", timeType: "เข้างาน (IN)", oldTime: "", newTime: "", reason: "" });
          fetchDashboardData();
          if (typeof addNotification === 'function') addNotification(t.modalAdjTitle || "ยื่นคำขอปรับปรุง", `คุณได้ส่งคำขอ ${reqType} เข้าสู่ระบบเรียบร้อยแล้ว`);
        });
      } catch (error) { Swal.fire({ icon: 'error', title: 'Error', text: error.message, backdrop: 'rgba(0,0,0,0)', customClass: { container: 'backdrop-blur-md' } });
      } finally { setIsSubmitting(false); }
  };

// 💾 ฟังก์ชันสำรองข้อมูล (Backup Data)
  const handleBackupData = async () => {
    if (user?.role !== 'admin' && user?.role !== 'ceo') {
      Swal.fire('ปฏิเสธการเข้าถึง', 'เฉพาะผู้ดูแลระบบเท่านั้น', 'error');
      return;
    }

    try {
      Swal.fire({ 
        title: 'กำลังแพ็กไฟล์สำรองข้อมูล...', 
        text: 'อาจใช้เวลาสักครู่ กรุณาอย่าเพิ่งปิดหน้าจอ', 
        allowOutsideClick: false, 
        didOpen: () => Swal.showLoading() 
      });

      // 1. ระบุชื่อตารางทั้งหมดในระบบ PANCAKE ERP SYSTEM ที่ต้องการ Backup
      const tablesToBackup = [
        'employees',            // ข้อมูลพนักงาน
        'employee_permissions', // สิทธิ์การเข้าถึงเมนู
        'branches',             // ข้อมูลสาขา
        'job_positions',        // ตำแหน่งงาน
        'system_settings',      // การตั้งค่าระบบต่างๆ (เช่น LINE OA)
        'leave_balances',       // โควต้าวันลาคงเหลือ
        'payroll_slips',        // สลิปเงินเดือน
        'attendance_logs',      // ประวัติเข้า-ออกงาน
        'leave_requests',       // ประวัติการยื่นลา
        'adjustment_requests',  // คำขอปรับปรุงเวลา
        'employee_sales',       // ข้อมูลยอดขาย
        'system_logs'           // ประวัติการใช้งานระบบ
      ];
      
      const backupResult = { 
        system: "PANCAKE ERP SYSTEM",
        backup_date: new Date().toISOString(),
        data: {} 
      };

      // 2. วนลูปดึงข้อมูลทีละตารางจาก Supabase
      for (const table of tablesToBackup) {
        const { data, error } = await supabase.from(table).select('*');
        if (!error) {
          backupResult.data[table] = data;
        }
      }

      // 3. แปลงข้อมูลเป็นไฟล์ JSON แล้วสั่งให้เบราว์เซอร์ดาวน์โหลด
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupResult, null, 2));
      const downloadAnchorNode = document.createElement('a');
      downloadAnchorNode.setAttribute("href", dataStr);
      downloadAnchorNode.setAttribute("download", `PANCAKE_ERP_BACKUP_${new Date().toISOString().split('T')[0]}.json`);
      document.body.appendChild(downloadAnchorNode); // สำคัญสำหรับ Firefox
      downloadAnchorNode.click();
      downloadAnchorNode.remove();

      Swal.fire('สำเร็จ!', 'ไฟล์สำรองข้อมูล (JSON) ถูกดาวน์โหลดลงเครื่องของคุณแล้ว!', 'success');
    } catch (err) {
      console.error(err);
      Swal.fire('เกิดข้อผิดพลาด', 'ไม่สามารถสำรองข้อมูลได้: ' + err.message, 'error');
    }
  };


// 🚨 ฟังก์ชันล้างข้อมูลทดสอบ (Clear Test Data)
  const handleResetTestData = async () => {
    if (user?.role !== 'admin' && user?.role !== 'ceo') {
      Swal.fire('ปฏิเสธการเข้าถึง', 'เฉพาะผู้ดูแลระบบเท่านั้น', 'error');
      return;
    }

    const confirm1 = await Swal.fire({
      title: '⚠️ เตือนภัยระดับสูงสุด',
      text: "คุณกำลังจะลบข้อมูล 'สลิปเงินเดือน, เข้างาน, การลา, คำขอปรับปรุง และยอดขาย' ทั้งหมดทิ้ง! (รายชื่อพนักงานจะยังอยู่)",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e11d48',
      cancelButtonColor: '#94a3b8',
      confirmButtonText: 'ใช่, ฉันต้องการล้างข้อมูล',
      cancelButtonText: 'ยกเลิก'
    });

    if (!confirm1.isConfirmed) return;

    const confirm2 = await Swal.fire({
      title: 'พิมพ์ CONFIRM เพื่อยืนยัน',
      text: "ข้อมูลที่ลบแล้วจะไม่สามารถกู้คืนได้!",
      input: 'text',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e11d48',
      cancelButtonText: 'ยกเลิก',
      preConfirm: (text) => {
        if (text !== 'CONFIRM') {
          Swal.showValidationMessage('พิมพ์ไม่ถูกต้อง กรุณาลองใหม่');
        }
      }
    });

    if (!confirm2.isConfirmed) return;

    try {
      Swal.fire({ title: 'กำลังล้างข้อมูล...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });

      await supabase.from('payroll_slips').delete().not('id', 'is', null);
      await supabase.from('attendance_logs').delete().not('id', 'is', null);
      await supabase.from('leave_requests').delete().not('id', 'is', null);
      await supabase.from('adjustment_requests').delete().not('id', 'is', null);
      await supabase.from('employee_sales').delete().not('id', 'is', null);

      Swal.fire('สำเร็จ!', 'ล้างข้อมูลทดสอบเรียบร้อยแล้ว ระบบสะอาดพร้อมใช้งานจริง!', 'success');
      fetchDashboardData();
    } catch (err) {
      console.error(err);
      Swal.fire('เกิดข้อผิดพลาด', 'ไม่สามารถลบข้อมูลได้: ' + err.message, 'error');
    }
  };

  // 🗑️ ฟังก์ชันลบสลิปเงินเดือน (เฉพาะ CEO, Admin และ Accounting)
  const handleDeleteSlip = async (id) => {
    const allowedRoles = ['admin', 'ceo', 'Accounting & Finance Officer'];
    if (!allowedRoles.includes(user?.role)) {
      Swal.fire('ปฏิเสธการเข้าถึง', 'คุณไม่มีสิทธิ์ยกเลิกหรือลบสลิปเงินเดือน', 'error');
      return;
    }
    const result = await Swal.fire({
      title: 'ยืนยันการลบสลิป?',
      text: "หากลบแล้วจะไม่สามารถกู้คืนได้!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e11d48',
      cancelButtonColor: '#94a3b8',
      confirmButtonText: 'ใช่, ลบทิ้งเลย',
      cancelButtonText: 'ยกเลิก'
    });

    if (result.isConfirmed) {
      try {
        const { error } = await supabase.from('payroll_slips').delete().eq('id', id);
        if (error) throw error;
        Swal.fire('ลบสำเร็จ!', 'สลิปถูกลบออกจากระบบเรียบร้อย', 'success');
        fetchDashboardData();
      } catch (err) {
        Swal.fire('Error', err.message, 'error');
      }
    }
  };

  // 🔍 ฟังก์ชันคำนวณยอดล่วงหน้า (Preview) ให้เห็นตัวเลขก่อนกด Save จริง
  const handlePreviewAttendance = async () => {
    if (!payrollForm.employee_id || !payrollForm.month) {
      Swal.fire('แจ้งเตือน', 'กรุณาเลือกพนักงานและเดือนรอบบิลก่อนกดคำนวณ', 'warning');
      return;
    }
    try {
      Swal.fire({ title: 'กำลังดึงข้อมูลเข้างาน...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });
      
      const { data: empInfo } = await supabase.from('employees').select('*').eq('id', payrollForm.employee_id).single();
      if (!empInfo) throw new Error("ไม่พบข้อมูลพนักงาน");

      const isPartTime = empInfo.salary_type === 'Part-time';
      const positionName = (empInfo.position || '').toLowerCase();
      const isLiveStreamer = positionName.includes('ไลฟ์') || positionName.includes('live') || positionName.includes('สตรีม');
      const baseSalary = Number(payrollForm.base_salary) || Number(empInfo.base_salary) || 0;
      
      const [year, month] = payrollForm.month.split('-');
      const startDate = `${year}-${month}-01`;
      const endDateObj = new Date(year, parseInt(month), 1); 
      const endDate = `${endDateObj.getFullYear()}-${String(endDateObj.getMonth() + 1).padStart(2, '0')}-01`;

      const { data: attLogs } = await supabase.from('attendance_logs').select('timestamp, log_type').eq('employee_id', payrollForm.employee_id).gte('timestamp', `${startDate}T00:00:00Z`).lt('timestamp', `${endDate}T00:00:00Z`);

      let totalLateMins = 0; let workedDates = new Set(); let totalWorkMins = 0; let totalOTMins = 0;
      const dailyLogs = {};
      
      if (attLogs && attLogs.length > 0) {
        const sortedLogs = attLogs.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        sortedLogs.forEach(log => {
          const date = log.timestamp.split('T')[0];
          if (!dailyLogs[date]) dailyLogs[date] = [];
          dailyLogs[date].push(log);
        });

        const shiftStart = empInfo.shift_start || "09:00:00"; 
        const [shiftHour, shiftMin] = shiftStart.split(':').map(Number);
        const expectedStartMins = (shiftHour * 60) + shiftMin;

        Object.keys(dailyLogs).forEach(date => {
          const logsOfDay = dailyLogs[date];
          let dailyWorkMins = 0; let firstCheckIn = null;

          if (isLiveStreamer) {
            let currentIn = null; let checkInCount = 0;
            logsOfDay.forEach(log => {
              if (log.log_type === 'check_in') {
                currentIn = new Date(log.timestamp);
                checkInCount++;
                if (!firstCheckIn) firstCheckIn = currentIn; 
              } else if (log.log_type === 'check_out' && currentIn) {
                dailyWorkMins += Math.floor((new Date(log.timestamp) - currentIn) / (1000 * 60));
                currentIn = null;
              }
            });
            if (checkInCount === 1 && dailyWorkMins > 300) dailyWorkMins -= 60; 
          } else {
            const checkIns = logsOfDay.filter(l => l.log_type === 'check_in');
            const checkOuts = logsOfDay.filter(l => l.log_type === 'check_out');
            if (checkIns.length > 0 && checkOuts.length > 0) {
              firstCheckIn = new Date(checkIns[0].timestamp);
              const lastCheckOut = new Date(checkOuts[checkOuts.length - 1].timestamp);
              dailyWorkMins = Math.floor((lastCheckOut - firstCheckIn) / (1000 * 60));
              if (dailyWorkMins > 300) dailyWorkMins -= 60;
            }
          }

          if (dailyWorkMins > 0) {
            workedDates.add(date); 
            if (isPartTime) {
              totalWorkMins += dailyWorkMins; 
            } else {
              totalWorkMins += Math.min(dailyWorkMins, 480);
              totalOTMins += Math.max(0, dailyWorkMins - 480); // เก็บค่า OT แนะนำ
              if (firstCheckIn) {
                const checkInHour = firstCheckIn.getHours();
                const checkInMin = firstCheckIn.getMinutes();
                const totalCheckInMins = (checkInHour * 60) + checkInMin;
                if (totalCheckInMins > expectedStartMins) totalLateMins += (totalCheckInMins - expectedStartMins);
              }
            }
          }
        });
      }

      let leaveDeduct = 0; let autoAbsentDeduction = 0; let absentDays = 0; let autoLateDeduction = 0;
      if (!isPartTime) {
        const { data: allLeavesInMonth } = await supabase.from('leave_requests').select('leave_type, start_date, end_date, duration_minutes').eq('employee_id', payrollForm.employee_id).eq('status', 'อนุมัติ').gte('start_date', startDate).lt('start_date', endDate);
        const daysInMonth = new Date(year, parseInt(month), 0).getDate();
        let approvedLeaveDays = 0;

        if (allLeavesInMonth && allLeavesInMonth.length > 0) {
          const unpaidLeaves = allLeavesInMonth.filter(l => l.leave_type === 'ลาไม่รับเงินเดือน');
          const unpaidMins = unpaidLeaves.reduce((sum, l) => sum + Number(l.duration_minutes || 0), 0);
          leaveDeduct = Math.round(unpaidMins * (baseSalary / (30 * 8 * 60)));

          const leaveDates = new Set();
          allLeavesInMonth.forEach(l => {
            const s = new Date(l.start_date);
            const e = new Date(l.end_date || l.start_date);
            for (let d = new Date(s); d <= e; d.setDate(d.getDate() + 1)) {
               const dateStr = d.toISOString().split('T')[0];
               if (!workedDates.has(dateStr)) leaveDates.add(dateStr);
            }
          });
          approvedLeaveDays = leaveDates.size;
        }

        const accountedDays = workedDates.size + approvedLeaveDays;
        if (accountedDays < daysInMonth) {
          absentDays = daysInMonth - accountedDays;
          autoAbsentDeduction = Math.round(absentDays * (baseSalary / 30));
        }
        if (totalLateMins > 0) autoLateDeduction = Math.round(totalLateMins * (baseSalary / 30 / 8 / 60));
      }

      // คำนวณ OT แนะนำ
      const totalOTHoursPreview = (totalOTMins / 60).toFixed(2);
      const otRatePreview = (baseSalary / 30 / 8) * 1.5;
      const suggestedOtPay = isPartTime ? 0 : Math.round(Number(totalOTHoursPreview) * otRatePreview);

      setPayrollForm(prev => ({
        ...prev,
        preview_late_mins: totalLateMins,
        preview_late_deduct: autoLateDeduction,
        preview_absent_days: absentDays,
        preview_absent_deduct: autoAbsentDeduction,
        preview_leave_deduct: leaveDeduct,
        preview_work_hours: (totalWorkMins / 60).toFixed(2),
        preview_ot_hours: totalOTHoursPreview,
        preview_ot_amount: suggestedOtPay,
        ot_hours: totalOTHoursPreview, 
        ot_amount: suggestedOtPay, 
        is_previewed: true 
      }));
      Swal.close();
    } catch (error) {
      Swal.fire('Error', error.message, 'error');
    }
  };



  // 💸 ฟังก์ชันสร้างสลิปเงินเดือน (รองรับ 4 รูปแบบ: ปกติ-ประจำ, ปกติ-พาร์ทไทม์, ไลฟ์สด-ประจำ, ไลฟ์สด-พาร์ทไทม์)
  const handleGenerateSlip = async (e) => {
    e.preventDefault();
    setIsSavingPayroll(true);
    try {
      if (!payrollForm.employee_id) throw new Error("กรุณาเลือกพนักงาน");

      const { data: empInfo } = await supabase.from('employees').select('*').eq('id', payrollForm.employee_id).single();
      if (!empInfo) throw new Error("ไม่พบข้อมูลพนักงาน");

      // ✨ แยกประเภทพนักงาน 2 แกน (รายเดือน/รายชั่วโมง) และ (ไลฟ์สด/ออฟฟิศ)
      const isPartTime = empInfo.salary_type === 'Part-time';
      const positionName = (empInfo.position || '').toLowerCase();
      const isLiveStreamer = positionName.includes('ไลฟ์') || positionName.includes('live') || positionName.includes('สตรีม');

      const baseSalary = Number(payrollForm.base_salary) || Number(empInfo.base_salary) || 0;
      const hRate = Number(empInfo.hourly_rate) || 0;

      const [year, month] = payrollForm.month.split('-');
      const startDate = `${year}-${month}-01`;
      const endDateObj = new Date(year, parseInt(month), 1); 
      const endDate = `${endDateObj.getFullYear()}-${String(endDateObj.getMonth() + 1).padStart(2, '0')}-01`;

      const { data: attLogs } = await supabase.from('attendance_logs').select('timestamp, log_type').eq('employee_id', payrollForm.employee_id).gte('timestamp', `${startDate}T00:00:00Z`).lt('timestamp', `${endDate}T00:00:00Z`);

      let totalWorkMins = 0;
      let totalOTMins = 0;
      let totalLateMins = 0;
      let workedDates = new Set();

      const dailyLogs = {};

      if (attLogs && attLogs.length > 0) {
        const sortedLogs = attLogs.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        
        sortedLogs.forEach(log => {
          const date = log.timestamp.split('T')[0];
          if (!dailyLogs[date]) dailyLogs[date] = [];
          dailyLogs[date].push(log);
        });

        const shiftStart = empInfo.shift_start || "09:00:00"; 
        const [shiftHour, shiftMin] = shiftStart.split(':').map(Number);
        const expectedStartMins = (shiftHour * 60) + shiftMin;

        Object.keys(dailyLogs).forEach(date => {
          const logsOfDay = dailyLogs[date];
          let dailyWorkMins = 0;
          let firstCheckIn = null;

          // 🧠 สมองส่วนที่ 1: วิธีการนับเวลาทำงาน (แยกระหว่างไลฟ์สด กับ ปกติ)
          if (isLiveStreamer) {
            // 👉 สำหรับทีมไลฟ์สด: นับเวลาทุกรอบที่เข้า-ออกมารวมกัน
            let currentIn = null;
            let checkInCount = 0;

            logsOfDay.forEach(log => {
              if (log.log_type === 'check_in') {
                currentIn = new Date(log.timestamp);
                checkInCount++;
                if (!firstCheckIn) firstCheckIn = currentIn; 
              } else if (log.log_type === 'check_out' && currentIn) {
                dailyWorkMins += Math.floor((new Date(log.timestamp) - currentIn) / (1000 * 60));
                currentIn = null;
              }
            });

            // ถ้าวันนั้นสแกนรอบเดียวลากยาวเกิน 5 ชม. ถึงจะหักพักเที่ยง (ถ้าหลายรอบถือว่าพักไปแล้ว)
            if (checkInCount === 1 && dailyWorkMins > 300) {
              dailyWorkMins -= 60; 
            }

          } else {
            // 👉 สำหรับพนักงานปกติ: ยึดสแกนแรกสุด กับ สแกนสุดท้ายสุดของวัน
            const checkIns = logsOfDay.filter(l => l.log_type === 'check_in');
            const checkOuts = logsOfDay.filter(l => l.log_type === 'check_out');

            if (checkIns.length > 0 && checkOuts.length > 0) {
              firstCheckIn = new Date(checkIns[0].timestamp);
              const lastCheckOut = new Date(checkOuts[checkOuts.length - 1].timestamp);

              dailyWorkMins = Math.floor((lastCheckOut - firstCheckIn) / (1000 * 60));
              
              // พนักงานปกติ บังคับหักพักเที่ยง 1 ชม. เสมอถ้าทำงานเกิน 5 ชม.
              if (dailyWorkMins > 300) {
                dailyWorkMins -= 60;
              }
            }
          }

          // 🧠 สมองส่วนที่ 2: วิธีแปลงเวลาไปเป็นเงิน (แยกระหว่าง Part-time กับ Full-time)
          if (dailyWorkMins > 0) {
            workedDates.add(date); 
            
            if (isPartTime) {
              // 👉 ถ้าเป็น Part-time: เอานาทีมารวมกันตรงๆ ไม่ต้องคิด OT แยก ไม่ต้องคิดมาสาย
              totalWorkMins += dailyWorkMins; 
            } else {
              // 👉 ถ้าเป็น Full-time: แบ่ง 8 ชม.แรกเป็นงานปกติ ที่เหลือเด้งไปเป็น OT และต้องคิดมาสาย
              const standardMins = 480; // 8 ชม.
              const workMins = Math.min(dailyWorkMins, standardMins);
              const otMins = Math.max(0, dailyWorkMins - standardMins);
              totalWorkMins += workMins;
              totalOTMins += otMins;

              // เช็คสาย (Late) เฉพาะสแกนรอบแรกของวัน
              if (firstCheckIn) {
                const checkInHour = firstCheckIn.getHours();
                const checkInMin = firstCheckIn.getMinutes();
                const totalCheckInMins = (checkInHour * 60) + checkInMin;
                
                if (totalCheckInMins > expectedStartMins) {
                  totalLateMins += (totalCheckInMins - expectedStartMins);
                }
              }
            }
          }
        });
      }

      const totalWorkHours = (totalWorkMins / 60).toFixed(2);
      const totalOTHours = (totalOTMins / 60).toFixed(2);

      let salaryAmount = 0;
      let otPay = 0;

      // คำนวณรายรับ (Earnings)
      if (isPartTime) {
        salaryAmount = Number(totalWorkHours) * hRate;
        otPay = Number(payrollForm.ot_amount) || 0; // เผื่อกรณี HR กรอก OT พิเศษให้พาร์ทไทม์
      } else {
        salaryAmount = baseSalary;
        // ให้ใช้ค่า OT จากฟอร์มที่ HR ตรวจสอบหรือแก้ไขแล้ว
        otPay = Number(payrollForm.ot_amount) || 0;
      }
      
      const finalOTHours = payrollForm.ot_hours !== undefined ? payrollForm.ot_hours : totalOTHours;

      const empSales = allSalesData.find(s => s.employee_id === payrollForm.employee_id);
      const commission = empSales ? (Number(empSales.current_sales) * (Number(empSales.commission_rate || 0) / 100)) : 0;

      // คำนวณรายหัก (Deductions)
      let leaveDeduct = 0;
      let autoAbsentDeduction = 0;
      let absentDays = 0;
      let autoLateDeduction = 0;

      // พาร์ทไทม์จะไม่โดนหักวันลา วันสาย และวันขาด (เพราะเขาได้เงินเฉพาะชั่วโมงที่ทำ)
      if (!isPartTime) {
        // หักวันลา และ ขาดงาน
        const { data: allLeavesInMonth } = await supabase.from('leave_requests').select('leave_type, start_date, end_date, duration_minutes').eq('employee_id', payrollForm.employee_id).eq('status', 'อนุมัติ').gte('start_date', startDate).lt('start_date', endDate);
        const daysInMonth = new Date(year, parseInt(month), 0).getDate();
        const workedDaysCount = workedDates.size;
        let approvedLeaveDays = 0;

        if (allLeavesInMonth && allLeavesInMonth.length > 0) {
          const unpaidLeaves = allLeavesInMonth.filter(l => l.leave_type === 'ลาไม่รับเงินเดือน');
          const unpaidMins = unpaidLeaves.reduce((sum, l) => sum + Number(l.duration_minutes || 0), 0);
          leaveDeduct = Math.round(unpaidMins * (baseSalary / (30 * 8 * 60)));

          const leaveDates = new Set();
          allLeavesInMonth.forEach(l => {
            const s = new Date(l.start_date);
            const e = new Date(l.end_date || l.start_date);
            for (let d = new Date(s); d <= e; d.setDate(d.getDate() + 1)) {
               const dateStr = d.toISOString().split('T')[0];
               if (!workedDates.has(dateStr)) {
                  leaveDates.add(dateStr);
               }
            }
          });
          approvedLeaveDays = leaveDates.size;
        }

        const accountedDays = workedDaysCount + approvedLeaveDays;
        if (accountedDays < daysInMonth) {
          absentDays = daysInMonth - accountedDays;
          autoAbsentDeduction = Math.round(absentDays * (baseSalary / 30));
        }

        // หักมาสาย
        if (totalLateMins > 0) {
          const ratePerMin = baseSalary / 30 / 8 / 60; 
          autoLateDeduction = Math.round(totalLateMins * ratePerMin);
        }
      }

      const bonus = Number(payrollForm.bonus) || 0;
      const manualDeduct = Number(payrollForm.deductions) || 0; 
      
      const ssoDeduct = Number(payrollForm.social_security) || 0;
      const taxDeduct = Number(payrollForm.tax) || 0;

      // 🧮 คำนวณยอดสุทธิ
      const netSalary = Math.round((salaryAmount + commission + otPay + bonus) - (leaveDeduct + manualDeduct + autoLateDeduction + autoAbsentDeduction + ssoDeduct + taxDeduct));

      const payload = {
        employee_id: payrollForm.employee_id, 
        month: payrollForm.month,
        salary_type: empInfo.salary_type,
        base_salary: isPartTime ? 0 : baseSalary,
        total_work_hours: totalWorkHours,
        ot_hours: finalOTHours, 
        ot_amount: otPay,
        commission: commission, 
        bonus: bonus,
        leave_deduction: leaveDeduct, 
        late_deduction: autoLateDeduction,
        absence_deduction: autoAbsentDeduction,
        deductions: manualDeduct,
        social_security_deduction: ssoDeduct, 
        tax_deduction: taxDeduct,             
        net_salary: netSalary
      };

      const { data: exist } = await supabase.from('payroll_slips').select('id').eq('employee_id', payrollForm.employee_id).eq('month', payrollForm.month).maybeSingle();
      if (exist) await supabase.from('payroll_slips').update(payload).eq('id', exist.id); 
      else await supabase.from('payroll_slips').insert([payload]); 

      let alertText = `คำนวณเงินเดือนเรียบร้อย`;
      if (autoLateDeduction > 0 || autoAbsentDeduction > 0) {
        alertText = `พบการหักอัตโนมัติ:\n`;
        if (autoLateDeduction > 0) alertText += `- สาย ${totalLateMins} นาที (หัก ฿${autoLateDeduction.toLocaleString()})\n`;
        if (autoAbsentDeduction > 0) alertText += `- ขาดงาน ${absentDays} วัน (หัก ฿${autoAbsentDeduction.toLocaleString()})`;
      }

      Swal.fire({ icon: 'success', title: 'ประมวลผลสำเร็จ!', text: alertText, showConfirmButton: true });
      fetchDashboardData();
      setIsPayrollModalOpen(false);
    } catch (error) {
      Swal.fire('Error', error.message, 'error');
    } finally {
      setIsSavingPayroll(false);
    }
  };

const handleApproveLeave = async (id, email, name, status, mins, empId, type) => {
    try {
      await supabase.from('leave_requests').update({ status }).eq('id', id);
      if (status === 'อนุมัติ') {
        const { data: bal } = await supabase.from('leave_balances').select('used_minutes').eq('employee_id', empId).eq('leave_type', type).maybeSingle();
        if (bal) await supabase.from('leave_balances').update({ used_minutes: bal.used_minutes + mins }).eq('employee_id', empId).eq('leave_type', type);
      }
      fetchDashboardData();
    } catch (error) { console.error("เกิดข้อผิดพลาด: " + error.message); }
};

const handleApproveAdjust = async (id, email, name, status) => {
    try {
      await supabase.from('adjustment_requests').update({ status }).eq('id', id);
      fetchDashboardData();
    } catch (error) { console.error("เกิดข้อผิดพลาด: " + error.message); }
};

const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => { setCurrentLocation({ lat: position.coords.latitude, lng: position.coords.longitude, isDefault: false }); },
        (error) => alert("ไม่สามารถดึงตำแหน่งได้ กรุณาเปิด GPS")
      );
    } else { alert("เบราว์เซอร์ของคุณไม่รองรับการดึงตำแหน่ง (GPS)"); }
};

const fetchBranches = async () => {
    try {
      const { data, error } = await supabase.from('branches').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setBranches(data || []);
    } catch (err) { console.error("Fetch error:", err.message); }
};

const handleSaveBranch = async (e) => {
    e.preventDefault();
    if (!formName || currentLocation.isDefault) {
      return Swal.fire({ icon: 'warning', title: 'เดี๋ยวก่อน!', text: 'กรุณากรอกชื่อและดึงพิกัด GPS', confirmButtonColor: '#ec4899' });
    }
    try {
      const branchData = { name: formName, lat: currentLocation.lat, lng: currentLocation.lng, radius_m: Number(formRadius) };
      if (editingBranchId) {
        await supabase.from('branches').update(branchData).eq('id', editingBranchId);
        Swal.fire({ icon: 'success', title: 'อัปเดตสาขาและรัศมีเรียบร้อย!', showConfirmButton: false, timer: 1500 });
        // 🔔 แจ้งเตือนกระดิ่ง
        addNotification("อัปเดตสาขา", `แก้ไขข้อมูลสาขา "${formName}" เรียบร้อยแล้ว`);
      } else {
        await supabase.from('branches').insert([branchData]);
        Swal.fire({ icon: 'success', title: 'บันทึกสาขาใหม่เรียบร้อย!', showConfirmButton: false, timer: 1500 });
        // 🔔 แจ้งเตือนกระดิ่ง
        addNotification("เพิ่มสาขาใหม่", `เพิ่มข้อมูลสาขา "${formName}" เรียบร้อยแล้ว`);
      }
      setEditingBranchId(null); setFormName(""); setFormRadius(100); setCurrentLocation({ lat: 13.7563, lng: 100.5018, isDefault: true });
      fetchBranches();
    } catch (err) { Swal.fire('เกิดข้อผิดพลาด!', err.message, 'error'); }
};

const handleDeleteBranch = async (id) => {
    const result = await Swal.fire({
      title: 'ลบสาขานี้ใช่ไหม?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#f43f5e', cancelButtonColor: '#cbd5e1', confirmButtonText: 'ใช่, ลบเลย!', cancelButtonText: 'ยกเลิก'
    });
    if (result.isConfirmed) {
      try {
        const { error } = await supabase.from('branches').delete().eq('id', id);
        if (error) throw error;
        Swal.fire({ icon: 'success', title: 'ลบเรียบร้อย!', showConfirmButton: false, timer: 1500 });
        // 🔔 แจ้งเตือนกระดิ่ง
        addNotification("ลบสาขา", "ระบบได้ลบข้อมูลสาขาออกเรียบร้อยแล้ว");
        fetchBranches();
      } catch (err) { Swal.fire('เกิดข้อผิดพลาด!', err.message, 'error'); }
    }
};

// =====================================================================
// 👑 1. ฟังก์ชันส่งแจ้งเตือนผลการอนุมัติ (แก้ปัญหา  ในอีเมล)
const notifyApprovalResult = async (employeeId, requestType, status, detail) => {
    if (!employeeId) return;
    try {
      const { data: employee, error } = await supabase.from('employees').select('*').eq('id', employeeId).maybeSingle();
      if (error || !employee) return;

      const isApproved = status === 'approved' || status === 'อนุมัติ';
      // ✨ 1. ใช้รหัส HTML (&#128081;) แทนตัวอิโมจิ ป้องกันระบบส่งเมลพัง
      const statusText = isApproved ? '&#128081; อนุมัติแล้ว (Approved)' : '❌ ไม่สามารถอนุมัติได้ (Rejected)';
      const statusColor = isApproved ? '#10b981' : '#f43f5e'; 
      const approverName = user?.full_name || "ผู้ดูแลระบบ (Admin)";

      const htmlTemplate = `
        <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #fffbfb; padding: 20px; border: 1px solid #fce7f3; border-radius: 30px;">
          <div style="background-color: #ffffff; padding: 40px; border-radius: 24px; box-shadow: 0 10px 25px rgba(136, 19, 55, 0.05);">
            <div style="text-align: center; margin-bottom: 30px;">
              <div style="font-size: 50px; margin-bottom: 10px;">&#128081;</div>
              <h1 style="color: #881337; margin: 0; font-size: 28px; font-weight: 900; letter-spacing: -1px;">Pancake</h1>
              <p style="color: #be123c; margin: 5px 0 0; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; font-style: italic;">Lovely Enrichment HR</p>
            </div>
            
            <h2 style="color: #1e293b; font-size: 20px; text-align: center; font-weight: 800; border-bottom: 2px solid #fff1f2; padding-bottom: 20px; margin-bottom: 25px;">แจ้งผลการพิจารณาคำขอ</h2>
            
            <p style="color: #475569; font-size: 16px;">เรียนคุณ <strong>${employee.full_name || 'พนักงาน'}</strong>,</p>
            <p style="color: #475569; font-size: 16px; line-height: 1.6;">ระบบได้ดำเนินการพิจารณาคำขอของคุณเรียบร้อยแล้ว โดยมีรายละเอียดดังนี้:</p>
            
            <div style="background-color: #f8fafc; border-left: 5px solid ${statusColor}; padding: 20px; margin: 25px 0; border-radius: 0 15px 15px 0;">
              <p style="margin: 8px 0; color: #334155;"><strong>ประเภทคำขอ:</strong> ${requestType}</p>
              <p style="margin: 8px 0; color: #334155;"><strong>รายละเอียด:</strong> ${detail || '-'}</p>
              <p style="margin: 8px 0; color: #334155;"><strong>สถานะ:</strong> <span style="color: ${statusColor}; font-weight: 900; font-size: 18px;">${statusText}</span></p>
              <p style="margin: 20px 0 0; color: #94a3b8; font-size: 13px; border-top: 1px dashed #e2e8f0; padding-top: 15px;"><strong>ผู้พิจารณา:</strong> ${approverName}</p>
            </div>
            
            <div style="text-align: center; margin-top: 40px; border-top: 1px solid #f1f5f9; padding-top: 20px;">
              <p style="color: #cbd5e1; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px;">Premium HR Platform Experience</p>
            </div>
          </div>
        </div>
      `;

      //  เอาอิโมจิออกจาก Subject (หัวข้ออีเมล) เพื่อความชัวร์ 100%
      fetch('https://script.google.com/macros/s/AKfycbxBMRd9gKYzHU7Pz0-189-BOYVb15eS7PmF9zKiUYCiHlDUhjpe39vi7Y3Vx1sMr2VEoA/exec', { 
        method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, 
        body: JSON.stringify({ to: employee.email, subject: `[Pancake HR] แจ้งผลพิจารณา: ${requestType}`, html: htmlTemplate }) 
      }).catch(err => console.error("Email Error:", err));
    } catch (err) { console.error("Notify Error:", err.message); }
};

// ✅ 2. ฟังก์ชันอนุมัติ (ยิงตรง DB เบื้องหลัง + พื้นหลังเบลอหรูๆ)
const executeApproveWithPopup = async (record, type, isLeave) => {
    const result = await Swal.fire({
      title: 'ยืนยันการอนุมัติ?', html: `คุณต้องการอนุมัติคำขอ <b>${type}</b> ใช่หรือไม่?`, icon: 'question',
      showCancelButton: true, confirmButtonColor: '#10b981', cancelButtonColor: '#f1f5f9',
      cancelButtonText: '<span style="color: #64748b; font-weight: bold;">ยกเลิก</span>', confirmButtonText: '✅ ใช่, อนุมัติเลย',
      backdrop: 'rgba(15, 23, 42, 0.4)', customClass: { container: 'backdrop-blur-sm', popup: 'rounded-[2rem] shadow-2xl' }
    });
    if (result.isConfirmed) {
      Swal.fire({ title: 'กำลังดำเนินการ...', allowOutsideClick: false, backdrop: 'rgba(15, 23, 42, 0.4)', customClass: { container: 'backdrop-blur-sm', popup: 'rounded-[2rem] shadow-2xl' }, didOpen: () => { Swal.showLoading(); } });
      try {
        const tableName = isLeave ? 'leave_requests' : 'adjustment_requests';
        const { error } = await supabase.from(tableName).update({ status: 'อนุมัติ' }).eq('id', record.id);
        if (error) throw error;
        if (isLeave) {
          const { data: bal } = await supabase.from('leave_balances').select('used_minutes').eq('employee_id', record.employee_id).eq('leave_type', record.leave_type).maybeSingle();
          if (bal) await supabase.from('leave_balances').update({ used_minutes: bal.used_minutes + record.duration_minutes }).eq('employee_id', record.employee_id).eq('leave_type', record.leave_type);
        }
        await notifyApprovalResult(record.employee_id, type, 'อนุมัติ', 'อนุมัติเรียบร้อยแล้ว');
        fetchDashboardData();
        // 🔔 แจ้งเตือนกระดิ่ง
        addNotification("อนุมัติคำขอสำเร็จ", `คุณได้อนุมัติ ${type} ของพนักงานเรียบร้อยแล้ว`);
        Swal.fire({ title: 'อนุมัติสำเร็จ!', icon: 'success', confirmButtonColor: '#8b5cf6', backdrop: 'rgba(15, 23, 42, 0.4)', customClass: { container: 'backdrop-blur-sm', popup: 'rounded-[2rem] shadow-2xl' } });
      } catch (error) { Swal.fire({ title: 'ผิดพลาด!', text: error.message, icon: 'error', backdrop: 'rgba(15, 23, 42, 0.4)', customClass: { container: 'backdrop-blur-sm', popup: 'rounded-[2rem] shadow-2xl' } }); }
    }
};

// ❌ 3. ฟังก์ชันปฏิเสธ (ยิงตรง DB เบื้องหลัง + พื้นหลังเบลอหรูๆ)
const executeRejectWithPopup = async (record, type, isLeave) => {
    const result = await Swal.fire({
      title: 'ปฏิเสธคำขอ?', html: `คุณกำลังปฏิเสธคำขอ <b>${type}</b><br/>กรุณาระบุเหตุผล:`, input: 'textarea', inputPlaceholder: 'พิมพ์เหตุผลที่นี่...', icon: 'warning',
      showCancelButton: true, confirmButtonColor: '#ef4444', cancelButtonColor: '#f1f5f9',
      cancelButtonText: '<span style="color: #64748b; font-weight: bold;">ยกเลิก</span>', confirmButtonText: '❌ ยืนยันการปฏิเสธ',
      backdrop: 'rgba(15, 23, 42, 0.4)', customClass: { container: 'backdrop-blur-sm', popup: 'rounded-[2rem] shadow-2xl' },
      preConfirm: (text) => { if (!text) Swal.showValidationMessage('กรุณาระบุเหตุผล'); return text; }
    });
    if (result.isConfirmed) {
      Swal.fire({ title: 'กำลังดำเนินการ...', allowOutsideClick: false, backdrop: 'rgba(15, 23, 42, 0.4)', customClass: { container: 'backdrop-blur-sm', popup: 'rounded-[2rem] shadow-2xl' }, didOpen: () => { Swal.showLoading(); } });
      try {
        const tableName = isLeave ? 'leave_requests' : 'adjustment_requests';
        const { error } = await supabase.from(tableName).update({ status: 'ไม่อนุมัติ' }).eq('id', record.id);
        if (error) throw error;
        await notifyApprovalResult(record.employee_id, type, 'ไม่อนุมัติ', `เหตุผล: ${result.value}`);
        fetchDashboardData();
        // 🔔 แจ้งเตือนกระดิ่ง
        addNotification("ปฏิเสธคำขอสำเร็จ", `คุณได้ไม่อนุมัติ ${type} พร้อมระบุเหตุผลเรียบร้อยแล้ว`);
        Swal.fire({ title: 'ปฏิเสธสำเร็จ!', icon: 'success', confirmButtonColor: '#8b5cf6', backdrop: 'rgba(15, 23, 42, 0.4)', customClass: { container: 'backdrop-blur-sm', popup: 'rounded-[2rem] shadow-2xl' } });
      } catch (error) { Swal.fire({ title: 'ผิดพลาด!', text: error.message, icon: 'error', backdrop: 'rgba(15, 23, 42, 0.4)', customClass: { container: 'backdrop-blur-sm', popup: 'rounded-[2rem] shadow-2xl' } }); }
    }
};

  // 🔄 สั่งให้ดึงข้อมูลสาขาเมื่อเปิดหน้าตั้งค่า (ส่วนนี้ของพี่เก็บไว้เหมือนเดิมเป๊ะๆ เลยครับ)
  useEffect(() => {
    if (currentView === "settings_branches") fetchBranches();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentView]);

  const filteredLeaves = allLeaves.filter(l => (filterType === "ALL" || getTranslatedType(l.leave_type) === filterType || l.leave_type === filterType) && (filterStatus === "ALL" || getTranslatedStatus(l.status) === filterStatus || l.status === filterStatus));
  const filteredAdjusts = allAdjustments.filter(a => (filterType === "ALL" || getTranslatedType(a.request_type) === filterType || a.request_type === filterType) && (filterStatus === "ALL" || getTranslatedStatus(a.status) === filterStatus || a.status === filterStatus));
  
  const totalLeavesCount = allLeaves.length;
  const sickP = totalLeavesCount === 0 ? 45 : Math.round((allLeaves.filter(l=>l.leave_type==='ลาป่วย').length / totalLeavesCount) * 100);
  const persP = totalLeavesCount === 0 ? 30 : Math.round((allLeaves.filter(l=>l.leave_type==='ลากิจ').length / totalLeavesCount) * 100);
  const vacP = totalLeavesCount === 0 ? 15 : Math.round((allLeaves.filter(l=>l.leave_type==='ลาพักร้อน').length / totalLeavesCount) * 100);

  const monthlyData = Array(12).fill(0);
  allLeaves.forEach(l => { monthlyData[new Date(l.created_at).getMonth()] += 1; });
  const maxMonthly = Math.max(...monthlyData, 1);

// ⏳ โหลดดิงสกรีน (Loading Screen) - ธีม Premium Rose Gold
  if (isLoading) return (
    <div className="h-screen w-screen bg-[#fffbfb] flex flex-col items-center justify-center relative overflow-hidden z-[9999]">
      {/* เอฟเฟกต์แสงฟุ้งสีทองและโรสโกลด์ */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-rose-200 rounded-full blur-[100px] opacity-40 animate-pulse"></div>
      <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-amber-100 rounded-full blur-[80px] opacity-50 animate-pulse delay-75"></div>
      
      <div className="relative z-10 flex flex-col items-center">
        {/* ✨ โลโก้มงกุฎทอง เด้งแบบนุ่มนวลดูแพง */}
        <CrownLogo className="w-28 h-28 animate-bounce mb-4 drop-shadow-2xl" />
        
        {/* ✨ ชื่อแบรนด์แบบพรีเมียมฟอนต์ Serif */}
        <h2 className="text-3xl sm:text-4xl font-serif font-black text-[#881337] tracking-tight drop-shadow-sm">
          Pancake
        </h2>
        <h3 className="text-sm sm:text-base font-bold text-[#be123c] mt-1 font-serif italic mb-6">
          Lovely Enrichment HR
        </h3>
        
        <div className="flex items-center gap-3 bg-white/70 backdrop-blur-md px-6 py-3 rounded-full border border-rose-100 shadow-sm">
          <svg className="animate-spin h-5 w-5 text-rose-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-rose-900/80 font-bold tracking-widest text-[11px] uppercase">กำลังเตรียมระบบระดับพรีเมียม...</span>
        </div>
      </div>
    </div>
  );

 // 🛡️ Gatekeeper: ถ้าต้องเปลี่ยนรหัส ห้ามวาด Dashboard ออกมาเด็ดขาด!
  if (user && user.require_password_change) {
    return (
      <div className="h-screen w-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-center animate-pulse">
          <span className="text-4xl mb-4 block">🔒</span>
          <p className="font-black tracking-widest uppercase">Security Required</p>
          <p className="text-xs text-slate-400 mt-2 font-bold">Please complete password update...</p>
        </div>
      </div>
    );
  }

  return (<>
 <div className="flex h-screen bg-[#fffbfb] font-sans overflow-hidden relative">
      {/* 🎆 เอฟเฟกต์ฉลองชัยชนะ */}
      {showVictory && <VictoryFireworks />}

      {/* 📱 Backdrop สำหรับ Mobile (เบลอพื้นหลังเวลาเปิด Sidebar) */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/60 z-[90] lg:hidden backdrop-blur-sm" 
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

{/* 👑 Sidebar Luxury Edition (ฉบับแก้ให้เลื่อนเมนูได้ 100% บนมือถือ) */}
      <div className={`fixed lg:static inset-y-0 left-0 z-[100] w-72 bg-gradient-to-b from-[#881337] via-[#9f1239] to-[#4c0519] transform ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"} transition-transform duration-300 ease-in-out shadow-2xl flex flex-col justify-between lg:translate-x-0`}>
        
        {/* ✨ ส่วนหุ้มหลัก: บังคับให้เป็น flex-1 และ overflow-hidden เพื่อให้ส่วนเมนูข้างในเลื่อนได้ */}
        <div className="flex-1 flex flex-col overflow-hidden">
          
          {/* Header Sidebar (คงที่) */}
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

          {/* 👤 ส่วนข้อมูลพนักงาน (คงที่) */}
          <div className="px-6 py-6 flex-shrink-0">
            <div className="flex items-center gap-3 bg-white/10 p-3 rounded-2xl border border-white/10 shadow-inner">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-[#881337] font-black text-xl shadow-md">
                {lang === 'EN' && user?.name_en ? user.name_en.charAt(0) : (user?.full_name?.charAt(0) || 'U')}
              </div>
              <div className="flex flex-col overflow-hidden text-left">
                <span className="font-bold text-sm text-white truncate">{lang === 'EN' && user?.name_en ? user.name_en : (user?.full_name || 'ไม่ระบุชื่อ')}</span>
                <span className="text-[10px] font-medium text-rose-200 truncate mt-0.5">{user?.position || 'Staff'}</span>
                <span className="text-[8px] px-1.5 py-0.5 bg-amber-500/80 rounded text-white font-black tracking-wider uppercase mt-1 w-fit border border-amber-400/50 shadow-sm">
                  ROLE: {user?.role === 'admin' ? 'SUPER ADMIN' : user?.role === 'ceo' ? 'CEO' : 'USER'}
                </span>
              </div>
            </div>
          </div>

         {/* 📋 รายการเมนู (ควบคุมด้วยสิทธิ์รายบุคคล) */}
          <nav className="flex-1 space-y-2 px-4 overflow-y-auto custom-scrollbar pb-4">
            {userMenus.includes('menu_dashboard') && (
              <button onClick={() => { setCurrentView("dashboard"); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-xl font-bold text-sm transition-all border ${currentView === 'dashboard' ? 'bg-white/20 border-white/10 text-white shadow-sm' : 'border-transparent text-white/70 hover:bg-white/20 hover:text-white'}`}>🏠 {t.menuDash}</button>
            )}

            {userMenus.includes('menu_sales') && (
              <button onClick={() => { setCurrentView("sales"); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-xl font-bold text-sm transition-all border ${currentView === 'sales' ? 'bg-gradient-to-r from-rose-500 to-pink-500 border-rose-400 text-white shadow-md' : 'border-transparent text-white/70 hover:bg-white/20 hover:text-white'}`}>💎 {t.menuSales}</button>
            )}

            {/* ✨ เพิ่มปุ่มเมนูเงินเดือนตรงนี้ */}
            {userMenus.includes('menu_payroll') && (
              <button onClick={() => { setCurrentView("payroll"); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-xl font-bold text-sm transition-all border ${currentView === 'payroll' ? 'bg-gradient-to-r from-emerald-500 to-teal-400 border-emerald-400 text-white shadow-md' : 'border-transparent text-white/70 hover:bg-white/20 hover:text-white'}`}>💸 {t.menuPayroll}</button>
            )}
            
            {userMenus.includes('menu_history') && (
              <button onClick={() => { setCurrentView("history"); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-xl font-bold text-sm transition-all border ${currentView === 'history' ? 'bg-white/20 border-white/10 text-white shadow-sm' : 'border-transparent text-white/70 hover:bg-white/20 hover:text-white'}`}>📋 {t.menuHist}</button>
            )}
            
            {userMenus.includes('menu_adjustments') && (
              <button onClick={() => { setCurrentView("adjustments"); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-xl font-bold text-sm transition-all border ${currentView === 'adjustments' ? 'bg-white/20 border-white/10 text-white shadow-sm' : 'border-transparent text-white/70 hover:bg-white/20 hover:text-white'}`}>🛠️ {t.menuAdjust}</button>
            )}

            {userMenus.includes('menu_attendance') && (
              <button onClick={() => setCurrentView('attendance')} className={`w-full flex items-center gap-3 px-5 py-3.5 rounded-xl font-bold text-sm transition-all border ${currentView === 'attendance' ? 'bg-white/20 border-white/10 text-white shadow-sm' : 'border-transparent text-white/70 hover:bg-white/20 hover:text-white'}`}>📅 {t.menuAttendance}</button>
            )}

            {userMenus.includes('menu_checkin') && (
              <button onClick={() => navigate('/check-in')} className="w-full flex items-center gap-3 px-5 py-3.5 rounded-xl font-bold text-sm transition-all border border-transparent text-white/70 hover:bg-white/20 hover:text-white mt-2">⏰ {t.menuCheck}</button>
            )}
            
            {userMenus.includes('menu_pt_dayoff') && (
              <button onClick={() => { setIsDayoffModalOpen(true); setDayoffForm({ date: "", reason: t.defaultPTReason }); }} className="w-full flex items-center gap-3 px-5 py-3.5 rounded-xl font-black text-sm transition-all border border-purple-400/40 bg-purple-500/20 text-purple-100 hover:bg-purple-500/40 hover:text-white mt-4 shadow-sm hover:scale-105">
                🏖️ {t.menuPTDayOff}
              </button>
            )}

            {(user?.role === 'admin' || user?.role === 'ceo') && (
              <>
                {userMenus.includes('menu_approvals') && (
                  <button onClick={() => { setCurrentView("approvals"); setIsSidebarOpen(false); }} className={`w-full flex items-center justify-between px-5 py-3.5 rounded-xl font-bold text-sm transition-all border mt-4 ${currentView === 'approvals' ? 'bg-white/20 border-white/10 text-white shadow-sm' : 'border-transparent text-white/70 hover:bg-white/20 hover:text-white'}`}>
                    <span className="flex items-center gap-3">✅ {t.menuApprove}</span>
                    {(adminLeaves.length + adminAdjustments.length) > 0 && <span className="bg-rose-500 text-white text-xs px-2 py-0.5 rounded-full">{adminLeaves.length + adminAdjustments.length}</span>}
                  </button>
                )}
                
                {userMenus.includes('menu_settings') && (
                  <div className="mt-2">
                    <button onClick={() => setIsSettingsDropdownOpen(!isSettingsDropdownOpen)} className={`w-full flex items-center justify-between px-5 py-3.5 rounded-xl font-bold text-sm transition-all border ${currentView.startsWith('settings') || currentView === 'employees' ? 'bg-white/20 border-white/10 text-white shadow-sm' : 'border-transparent text-white/70 hover:bg-white/20 hover:text-white'}`}>
                      <span className="flex items-center gap-3">⚙️ {t.menuSettings}</span>
                      <span className={`transition-transform duration-300 text-xs ${isSettingsDropdownOpen ? 'rotate-180' : ''}`}>▼</span>
                    </button>
                    {isSettingsDropdownOpen && (
                      <div className="pl-10 pr-2 py-2 space-y-1 animate-fade-in border-l-2 border-white/10 ml-4 mt-1">
                        <button onClick={() => { setCurrentView('employees'); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-bold text-[13px] transition-all border ${currentView === 'employees' ? 'bg-white/20 border-white/10 text-white' : 'border-transparent text-white/60 hover:bg-white/20 hover:text-white'}`}>👥 {t.menuEmployees}</button>
                        <button onClick={() => { setCurrentView("settings_branches"); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-bold text-[13px] transition-all border ${currentView === 'settings_branches' ? 'bg-white/20 border-white/10 text-white' : 'border-transparent text-white/60 hover:bg-white/20 hover:text-white'}`}>📍 {t.settingsBranches}</button>
                        <button onClick={() => { setCurrentView("settings_all_leaves"); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-bold text-[13px] transition-all border ${currentView === 'settings_all_leaves' ? 'bg-white/20 border-white/10 text-white' : 'border-transparent text-white/60 hover:bg-white/20 hover:text-white'}`}>🗂️ {t.settingsAllLeaves}</button>
                        <button onClick={() => { setCurrentView("settings_all_dayoffs"); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-bold text-[13px] transition-all border ${currentView === 'settings_all_dayoffs' ? 'bg-white/20 border-white/10 text-white' : 'border-transparent text-white/60 hover:bg-white/20 hover:text-white'}`}>🏖️ {t.settingsAllDayOffs}</button>
                        <button onClick={() => { setCurrentView("settings_all_adjustments"); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-bold text-[13px] transition-all border ${currentView === 'settings_all_adjustments' ? 'bg-white/20 border-white/10 text-white' : 'border-transparent text-white/60 hover:bg-white/20 hover:text-white'}`}>🛠️ {t.settingsAllAdjustments}</button>
                        <button onClick={() => { setCurrentView("settings_quotas"); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-bold text-[13px] transition-all border ${currentView === 'settings_quotas' ? 'bg-white/20 border-white/10 text-white' : 'border-transparent text-white/60 hover:bg-white/20 hover:text-white'}`}>🎯 {t.settingsQuotas}</button>
                        <button onClick={() => { setCurrentView("settings_permissions"); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-bold text-[13px] transition-all border ${currentView === 'settings_permissions' ? 'bg-white/20 border-white/10 text-white' : 'border-transparent text-white/60 hover:bg-white/20 hover:text-white'}`}>🔐 {t.settingsPermissions}</button>
                        <button onClick={() => { setCurrentView("settings_line_oa"); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-bold text-[13px] transition-all border ${currentView === 'settings_line_oa' ? 'bg-white/20 border-white/10 text-white' : 'border-transparent text-white/60 hover:bg-white/20 hover:text-white'}`}>💬 {t.settingsLineOA}</button>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </nav>
        </div>

        {/* 🚪 ปุ่มออกจากระบบ (ล็อกให้อยู่ล่างสุดเสมอ) */}
        <div className="p-4 border-t border-rose-300/10 flex-shrink-0">
          <button onClick={() => { localStorage.removeItem('titan_user'); navigate('/login'); }} className="w-full flex items-center justify-center gap-2 text-white/70 hover:bg-rose-500 hover:text-white px-4 py-3.5 rounded-xl font-bold text-sm transition-all">🚪 {t.menuLogout}</button>
        </div>
      </div>


      <div className="flex-1 flex flex-col h-screen overflow-y-auto relative w-full">
        <div className="absolute top-0 right-0 w-96 h-96 bg-pink-200 rounded-full blur-[100px] opacity-40 mix-blend-multiply pointer-events-none"></div>

      {/* 📱 Header & Top Bar (โฉมใหม่: ปุ่มแคปซูล มีไอคอน+ข้อความสั้นๆ) */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 md:p-8 z-20 gap-4 sticky top-0 bg-white/40 backdrop-blur-md border-b border-white shadow-sm">
          
          {/* ฝั่งซ้าย: แฮมเบอร์เกอร์ + ชื่อพนักงาน */}
          <div className="flex items-center justify-between w-full md:w-auto">
            <div className="flex items-center gap-3">
              <button className="lg:hidden text-slate-800 bg-white p-2 rounded-lg shadow-sm border border-slate-100" onClick={() => setIsSidebarOpen(true)}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              </button>
              <div>
                <p className="text-pink-500 font-bold text-xs md:text-sm tracking-widest uppercase mb-1">{currentView === 'approvals' ? t.adminCenter : currentView.startsWith('settings') ? t.menuSettings : t.welcome}</p>
                <h2 className="text-xl md:text-3xl font-black text-slate-800 tracking-tight">{currentView === 'approvals' ? t.adminCenter : currentView.startsWith('settings') ? t.menuSettings : user?.full_name}</h2>
              </div>
            </div>
          </div>
          
          {/* ฝั่งขวา: เมนูด่วน (แคปซูล) + กระดิ่ง + เปลี่ยนภาษา */}
          <div className="flex items-center gap-2 md:gap-3 w-full md:w-auto justify-end flex-wrap sm:flex-nowrap">
            
            {/* 🚀 Quick Menu (ปุ่มแคปซูล: ไอคอน + ข้อความสั้นๆ ให้รู้ว่าคืออะไร) */}
            <div className="flex items-center gap-1.5 md:gap-2 mr-1">
              {/* ปุ่มยื่นใบลา */}
              <button 
                onClick={() => setIsLeaveModalOpen(true)} 
                className="h-9 md:h-10 px-3 md:px-4 bg-gradient-to-tr from-pink-500 to-rose-400 text-white rounded-full flex items-center justify-center gap-1.5 shadow-md shadow-pink-200 hover:scale-105 transition-transform"
              >
                <span className="text-sm md:text-base">🏖️</span>
                {/* ✨ เปลี่ยนคำว่า "ยื่นลา" เป็น {t.createBtn} */}
                <span className="text-[10px] md:text-xs font-black tracking-wide whitespace-nowrap">{t.createBtn}</span>
              </button>

              {/* ปุ่มแจ้งปรับปรุง */}
              <button 
                onClick={() => setIsAdjustModalOpen(true)} 
                className="h-9 md:h-10 px-3 md:px-4 bg-white border border-slate-200 text-slate-600 hover:text-purple-600 hover:border-purple-300 hover:bg-purple-50 rounded-full flex items-center justify-center gap-1.5 shadow-sm hover:scale-105 transition-all"
              >
                <span className="text-sm md:text-base">📝</span>
                {/* ✨ เปลี่ยนคำว่า "ปรับปรุง" เป็น {t.adjustBtn} */}
                <span className="text-[10px] md:text-xs font-black tracking-wide whitespace-nowrap">{t.adjustBtn}</span>
              </button>
            </div>

            {/* 🔔 Notification Bell */}
            <div className="relative">
              <button onClick={() => setIsNotifOpen(!isNotifOpen)} className="w-9 h-9 md:w-10 md:h-10 bg-white rounded-full flex items-center justify-center shadow-sm border border-slate-200 text-slate-500 hover:text-pink-500 transition-colors relative">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path></svg>
                {unreadCount > 0 && <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-rose-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full border-2 border-white">{unreadCount}</span>}
              </button>
              
              {/* Dropdown แจ้งเตือน */}
              {isNotifOpen && (
                <div className="absolute right-0 mt-3 w-72 md:w-80 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50">
                  <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
                    <h3 className="font-black text-slate-800 text-sm">{t.notifTitle}</h3>
                    <div className="flex gap-2">
                      <button onClick={markAllRead} className="text-[10px] font-bold text-pink-500 hover:underline">{t.notifReadAll}</button>
                      <button onClick={clearAllNotifs} className="text-[10px] font-bold text-slate-400 hover:text-rose-500">{t.notifClear}</button>
                    </div>
                  </div>
                  <div className="max-h-[60vh] overflow-y-auto">
                    {notifications.length === 0 ? <div className="p-6 text-center text-xs text-slate-400 font-bold">{t.notifEmpty}</div> : (
                      notifications.map(n => (
                        <div key={n.id} onClick={() => handleNotificationClick(n)} className={`p-4 border-b border-slate-50 cursor-pointer hover:bg-pink-50 transition-colors ${!n.isRead ? 'bg-pink-50/50' : 'bg-white'}`}>
                          <div className="flex justify-between items-start mb-1">
                            <span className={`font-bold text-sm ${!n.isRead ? 'text-slate-800' : 'text-slate-500'}`}>{n.title}</span>
                            <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap">{n.time}</span>
                          </div>
                          <p className="text-xs text-slate-500 line-clamp-2">{n.message}</p>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* 🌐 เปลี่ยนภาษา */}
            <div className="bg-white p-1 rounded-full shadow-sm border border-slate-200 flex items-center">
              <button onClick={() => changeLang("TH")} className={`px-3 md:px-4 py-1.5 rounded-full font-bold text-[10px] md:text-xs transition-all ${lang === "TH" ? "bg-slate-800 text-white shadow-md" : "text-slate-400 hover:text-slate-600"}`}>TH</button>
              <button onClick={() => changeLang("EN")} className={`px-3 md:px-4 py-1.5 rounded-full font-bold text-[10px] md:text-xs transition-all ${lang === "EN" ? "bg-slate-800 text-white shadow-md" : "text-slate-400 hover:text-slate-600"}`}>EN</button>
            </div>
            
          </div>
        </div>

        {/* ✅ VIEW: DASHBOARD */}
        {currentView === "dashboard" && (
          <div className="px-4 md:px-8 space-y-6 z-10 pb-8 mt-4">
           {/* ✨ ตรวจสอบสิทธิ์: โชว์วิดเจ็ตยอดขายเฉพาะ Admin, CEO หรือพนักงานฝ่ายขาย/ไลฟ์สด เท่านั้น */}
            {(user?.role === 'admin' || user?.role === 'ceo' || ['ไลฟ์', 'live', 'สตรีม', 'sale', 'เซล'].some(kw => (user?.position || '').toLowerCase().includes(kw))) && (
              <>
                {/* 💎 1. WIDGET ยอดขายส่วนตัว (Animated Number Edition) 💎 */}
                <div className="bg-gradient-to-br from-[#881337] via-[#be123c] to-[#4c0519] rounded-[1.5rem] md:rounded-[2rem] p-5 md:p-6 text-white shadow-xl shadow-rose-900/20 relative overflow-hidden mb-6 border border-rose-300/30">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-pink-400/20 blur-[80px] rounded-full pointer-events-none"></div>
                  <div className="absolute bottom-0 left-0 w-40 h-40 bg-amber-400/10 blur-[60px] rounded-full pointer-events-none"></div>

                  <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-3">
                    <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-3 py-1.5 rounded-full backdrop-blur-md shadow-sm">
                      <span className="text-amber-300 text-[10px] md:text-xs animate-pulse">💎</span>
                      <span className="text-[10px] md:text-xs font-black text-white tracking-widest">{t.mySalesTitle}</span>
                    </div>
                    
                    {salesData.updated_at && (
                      <div className="flex items-center gap-1.5 bg-black/20 border border-black/10 px-3 py-1.5 rounded-full">
                        <span className="text-amber-300 text-[10px]">🕒</span>
                        <p className="text-[9px] md:text-[10px] text-rose-100 font-medium tracking-wide">
                          {t.salesUpdated} <span className="font-bold text-white">{new Date(salesData.updated_at).toLocaleString(lang === 'TH' ? 'th-TH' : 'en-US', { dateStyle: 'medium', timeStyle: 'short' })} {lang === 'TH' ? 'น.' : ''}</span>
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="relative z-10 flex flex-col md:flex-row items-center gap-4 md:gap-8 mt-2">
                    <div className="flex-1 w-full">
                      <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-3 text-transparent bg-clip-text bg-gradient-to-r from-white via-pink-100 to-amber-200 drop-shadow-sm tabular-nums">
                        ฿{Number(displayedSales).toLocaleString()}
                      </h2>
                      
                      <div className="flex items-center gap-3 bg-black/20 w-fit px-3 py-2 rounded-xl border border-white/10 shadow-inner">
                        <p className="text-[11px] md:text-xs text-rose-200 font-bold">
                          {t.salesTarget} <span className="text-white text-sm">฿{Number(salesData.target).toLocaleString()}</span>
                        </p>
                        <button onClick={handleSetMyTarget} className="bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white px-3 py-1.5 rounded-lg text-[10px] font-black transition-all shadow-md hover:scale-105 active:scale-95 flex items-center gap-1">
                          🎯 {t.btnSetTarget}
                        </button>
                      </div>
                    </div>

                    <div className="hidden md:block w-px h-16 bg-gradient-to-b from-transparent via-white/30 to-transparent"></div>

                    <div className="flex-1 w-full bg-white/10 backdrop-blur-md rounded-2xl p-4 md:p-5 border border-white/20 shadow-[0_4px_15px_rgba(0,0,0,0.1)] flex justify-between items-center group hover:bg-white/20 transition-all">
                      <div>
                        <p className="text-[9px] md:text-[10px] text-pink-200 uppercase font-black tracking-wider mb-1">{t.estCommission}</p>
                        <p className="text-2xl md:text-3xl font-black text-emerald-300 drop-shadow-[0_0_10px_rgba(110,231,183,0.5)] tabular-nums">
                          ฿{(displayedSales * ((salesData.commission_rate || 0) / 100)).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </p>
                      </div>
                      <div className="text-center flex flex-col items-center gap-1">
                        <span className="text-[8px] md:text-[9px] text-rose-200 font-bold uppercase tracking-widest">{t.commRate}</span>
                        <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 rounded-full flex items-center justify-center shadow-inner border border-white/30 group-hover:scale-110 transition-transform">
                          <span className="text-xs md:text-sm font-black text-amber-300">{salesData.commission_rate || 0}%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="relative z-10 mt-6 md:mt-8">
                    <div className="flex justify-between items-end mb-2 px-1">
                      <span className="text-[10px] font-bold text-rose-200 uppercase tracking-wider">{t.salesProgress}</span>
                      <span className="text-xs md:text-sm font-black text-amber-300 drop-shadow-md tabular-nums">{((displayedSales / salesData.target) * 100).toFixed(1)}%</span>
                    </div>
                    <div className="w-full bg-black/30 rounded-full h-2.5 md:h-3 border border-white/10 overflow-hidden shadow-inner">
                      <div className="h-full rounded-full bg-gradient-to-r from-pink-500 via-rose-400 to-amber-400 relative" style={{ width: `${Math.min(100, (displayedSales / salesData.target) * 100)}%` }}>
                        <div className="absolute top-0 right-0 bottom-0 w-6 bg-gradient-to-l from-white/80 to-transparent blur-[1px]"></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 🏆 2. WIDGET LEADERBOARD & COMPANY GOAL (Premium Corporate) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 mb-6">
                  
                  {/* 🌍 ฝั่งซ้าย (2 ส่วน): ภาพรวมยอดขายองค์กร */}
                  <div className="lg:col-span-2 bg-white/80 backdrop-blur-xl rounded-[1.5rem] md:rounded-[2rem] p-5 md:p-7 shadow-sm border border-slate-100 flex flex-col justify-center relative overflow-hidden group">
                    <div className="absolute -right-20 -top-20 w-40 h-40 bg-blue-400/10 rounded-full blur-[50px] group-hover:bg-blue-400/20 transition-all"></div>
                    
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="flex items-center gap-3">
                          <h3 className="font-black text-slate-800 text-lg md:text-xl flex items-center gap-2">
                            <span className="p-1.5 md:p-2 bg-blue-100 text-blue-600 rounded-lg md:rounded-xl">📈</span> 
                            {lang === 'TH' ? 'ภาพรวมยอดขายองค์กร' : 'Corporate Target'}
                          </h3>
                          {(user?.role === 'admin' || user?.role === 'ceo') && (
                            <button 
                              onClick={handleSetCompanyTarget}
                              className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded-lg text-[10px] md:text-xs font-black transition-all shadow-md hover:scale-105 active:scale-95 flex items-center gap-1.5"
                            >
                              ⚙️ {lang === 'TH' ? 'ตั้งเป้าหมาย' : 'Set Target'}
                            </button>
                          )}
                        </div>
                        <p className="text-[10px] md:text-xs text-slate-500 font-bold mt-1">
                          {lang === 'TH' ? 'ความคืบหน้าสู่เป้าหมายความสำเร็จของบริษัท' : 'Overall company achievement progress'}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase">Total Achieved</p>
                        <p className="text-xl md:text-2xl font-black text-blue-600 tabular-nums">
                          {companySales.target > 0 ? ((companySales.current / companySales.target) * 100).toFixed(1) : 0}%
                        </p>
                      </div>
                    </div>

                    <div className="relative mt-2">
                      <div className="flex justify-between text-[10px] md:text-xs font-bold mb-2">
                        <span className="text-slate-600">฿{Number(companySales.current).toLocaleString()}</span>
                        <span className="text-slate-400">Target: ฿{Number(companySales.target).toLocaleString()}</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-3 md:h-4 overflow-hidden shadow-inner border border-slate-200">
                        <div 
                          className="h-full rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 relative transition-all duration-1500 ease-out"
                          style={{ width: `${companySales.target > 0 ? Math.min(100, (companySales.current / companySales.target) * 100) : 0}%` }}
                        >
                          <div className="absolute top-0 right-0 bottom-0 w-8 bg-gradient-to-l from-white/60 to-transparent blur-[2px] animate-pulse"></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* 🏆 ฝั่งขวา (1 ส่วน): อันดับยอดขายสูงสุด (Leaderboard) */}
                  <div className="bg-gradient-to-b from-slate-900 to-[#0f172a] rounded-[1.5rem] md:rounded-[2rem] p-5 md:p-6 shadow-xl border border-slate-700 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 blur-[40px] rounded-full pointer-events-none"></div>
                    
                    <h3 className="font-black text-white text-base md:text-lg flex items-center gap-2 mb-4 border-b border-slate-700 pb-3">
                      🥇 {lang === 'TH' ? 'อันดับยอดขายสูงสุด (Top 3)' : 'Sales Leaderboard'}
                    </h3>

                    <div className="space-y-3">
                      {leaderboard.length === 0 ? (
                        <div className="text-center py-6 text-slate-500 font-bold text-xs">{lang === 'TH' ? 'ยังไม่มีข้อมูลยอดขาย' : 'No sales data yet'}</div>
                      ) : (
                        leaderboard.map((person, index) => (
                          <div key={person.employee_id} className={`flex items-center justify-between p-2.5 rounded-xl border ${index === 0 ? 'bg-gradient-to-r from-amber-500/20 to-orange-500/10 border-amber-500/30' : index === 1 ? 'bg-slate-800/50 border-slate-600' : 'bg-slate-800/30 border-slate-700/50'} transition-all hover:scale-105 cursor-default`}>
                            <div className="flex items-center gap-3 overflow-hidden">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-xs shadow-md border-2 shrink-0 ${index === 0 ? 'bg-gradient-to-tr from-amber-300 to-yellow-500 border-yellow-200 text-yellow-900' : index === 1 ? 'bg-gradient-to-tr from-slate-300 to-slate-400 border-slate-200 text-slate-800' : 'bg-gradient-to-tr from-orange-300 to-amber-700 border-orange-300 text-orange-950'}`}>
                                {index + 1}
                              </div>
                              <div className="overflow-hidden">
                                <p className={`text-xs font-black truncate ${index === 0 ? 'text-amber-300' : 'text-slate-200'}`}>
                                  {lang === 'EN' && person.employees?.name_en ? person.employees?.name_en : person.employees?.full_name}
                                </p>
                                <p className="text-[9px] text-slate-400 uppercase tracking-widest">{person.employees?.employee_code}</p>
                              </div>
                            </div>
                            <div className="text-right shrink-0">
                              <p className={`text-[10px] font-black ${index === 0 ? 'text-amber-400' : 'text-emerald-400'} tabular-nums`}>
                                {person.target_sales > 0 ? ((person.current_sales / person.target_sales) * 100).toFixed(0) : 0}%
                              </p>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>

                {/* 📈 3. WIDGET กราฟยอดขายรายเดือน (Sales Trend Analytics) */}
                <div className="bg-white/80 backdrop-blur-xl rounded-[1.5rem] md:rounded-[2rem] p-5 md:p-7 shadow-sm border border-slate-100 mb-6 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[80px] rounded-full pointer-events-none"></div>
                  
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4 relative z-10">
                    <div>
                      <h3 className="font-black text-slate-800 text-lg md:text-xl flex items-center gap-2">
                        <span className="p-1.5 md:p-2 bg-indigo-100 text-indigo-600 rounded-lg md:rounded-xl">📈</span> 
                        {lang === 'TH' ? 'สถิติยอดขายรายเดือน' : 'Monthly Sales Analytics'}
                      </h3>
                      <p className="text-[10px] md:text-xs text-slate-500 font-bold mt-1">
                        {lang === 'TH' ? `ภาพรวมการเติบโตของยอดขายปี ${new Date().getFullYear() + 543}` : `Sales growth overview for ${new Date().getFullYear()}`}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-3 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100 shadow-inner">
                      <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-slate-200"></div><span className="text-[10px] font-bold text-slate-500">{lang === 'TH' ? 'ยอดทั่วไป' : 'Regular'}</span></div>
                      <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full bg-gradient-to-t from-indigo-500 to-purple-500 shadow-sm"></div><span className="text-[10px] font-bold text-indigo-600">{lang === 'TH' ? 'เดือนปัจจุบัน' : 'Current Month'}</span></div>
                    </div>
                  </div>

                  <div className="w-full flex items-end justify-between gap-1.5 md:gap-3 h-48 md:h-60 mt-4 px-1 md:px-2 pb-2 border-b-2 border-slate-100 relative z-10">
                    <div className="absolute inset-x-0 bottom-[25%] border-b border-dashed border-slate-200 -z-10"></div>
                    <div className="absolute inset-x-0 bottom-[50%] border-b border-dashed border-slate-200 -z-10"></div>
                    <div className="absolute inset-x-0 bottom-[75%] border-b border-dashed border-slate-200 -z-10"></div>
                    
                    {monthlySalesData.map((val, i) => {
                      const max = companySales.target > 0 ? companySales.target : 1000000;
                      const hPercent = val > 0 ? (val / max) * 100 : 2; 
                      const isCurrentMonth = i === new Date().getMonth();
                      
                      return (
                        <div key={i} className="flex flex-col items-center flex-1 group h-full justify-end relative">
                          {val > 0 && (
                            <div className="absolute -top-8 bg-slate-800 text-white text-[9px] md:text-[10px] font-black px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:-translate-y-1 z-20 pointer-events-none whitespace-nowrap shadow-lg">
                              ฿{(val/1000).toFixed(0)}k
                              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-800 rotate-45"></div>
                            </div>
                          )}
                          <div 
                            className={`w-full max-w-[40px] rounded-t-md md:rounded-t-lg transition-all duration-700 ease-out flex items-end justify-center group-hover:scale-y-[1.02] transform origin-bottom ${
                              isCurrentMonth ? 'bg-gradient-to-t from-indigo-500 to-purple-500 shadow-[0_0_15px_rgba(99,102,241,0.4)]' : 'bg-slate-200 group-hover:bg-indigo-300'
                            }`}
                            style={{ height: `${hPercent}%` }}
                          >
                            {isCurrentMonth && <div className="w-full h-2 bg-white/30 rounded-t-lg animate-pulse"></div>}
                          </div>
                          <span className={`text-[9px] md:text-xs font-black mt-2 md:mt-3 truncate w-full text-center ${isCurrentMonth ? 'text-indigo-600' : 'text-slate-400 group-hover:text-slate-600'}`}>
                            {t.monthNames && t.monthNames[i] ? t.monthNames[i].substring(0,3) : ''}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </>
            )}

             <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                <div className="bg-white/80 backdrop-blur-xl rounded-[1.5rem] md:rounded-[2rem] p-5 md:p-7 shadow-sm border border-white h-[350px] md:h-[380px] flex flex-col">
                  <div className="flex justify-between items-center mb-4 md:mb-5">
                     <h4 className="font-black text-slate-800 flex items-center gap-2 md:gap-3 text-base md:text-lg"><span className="p-1.5 md:p-2 bg-pink-100 text-pink-500 rounded-lg md:rounded-xl">📝</span> {t.boxPending}</h4>
                     <button onClick={() => setCurrentView("history")} className="text-[10px] md:text-xs font-bold text-pink-500 hover:underline">{t.seeAll}</button>
                  </div>
                  <div className="flex-1 overflow-y-auto pr-1 md:pr-2 space-y-2 md:space-y-3">
                    {pendingLeaves.length === 0 ? <div className="h-full flex flex-col items-center justify-center text-slate-400 font-bold text-xs md:text-sm">{t.noPending}</div> : (
                      pendingLeaves.map(leave => (
                        <div key={leave.id} className="flex justify-between items-center p-2.5 md:p-3 bg-slate-50 hover:bg-pink-50 rounded-xl md:rounded-2xl transition-colors border border-slate-100"><span className="text-[10px] md:text-sm text-slate-500 font-medium bg-white px-2 md:px-3 py-1 rounded-md md:rounded-lg border border-slate-100">{new Date(leave.created_at).toLocaleDateString(lang === 'TH' ? 'th-TH' : 'en-US')}</span><span className="text-xs md:text-sm font-black text-slate-700 truncate mx-2">{getTranslatedType(leave.leave_type)}</span><span className="text-[10px] md:text-xs bg-amber-100 text-amber-600 px-2 md:px-3 py-1 md:py-1.5 rounded-full font-black tracking-wide whitespace-nowrap">{getTranslatedStatus(leave.status)}</span></div>
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
                    {chartType === 'pie' && (<div className="flex flex-col sm:flex-row items-center justify-center gap-6 md:gap-8 w-full"><div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full shadow-inner flex-shrink-0" style={{ background: `conic-gradient(#F472B6 0% ${sickP}%, #A855F7 ${sickP}% ${sickP+persP}%, #34D399 ${sickP+persP}% ${sickP+persP+vacP}%, #FBBF24 ${sickP+persP+vacP}% 100%)` }}><div className="absolute inset-3 md:inset-4 bg-white rounded-full flex flex-col items-center justify-center shadow-inner"><span className="text-xl md:text-2xl font-black">{totalLeavesCount}</span><span className="text-[8px] md:text-[10px] font-bold text-slate-400 uppercase">Requests</span></div></div><div className="space-y-2 md:space-y-3 w-full sm:w-auto grid grid-cols-2 sm:grid-cols-1 gap-2 sm:gap-0"><div className="flex gap-2 items-center"><div className="w-3 h-3 rounded-sm bg-[#F472B6]"></div><span className="text-[10px] md:text-xs font-bold text-slate-600">{t.sickLeave} ({sickP}%)</span></div><div className="flex gap-2 items-center"><div className="w-3 h-3 rounded-sm bg-[#A855F7]"></div><span className="text-[10px] md:text-xs font-bold text-slate-600">{t.personalLeave} ({persP}%)</span></div><div className="flex gap-2 items-center"><div className="w-3 h-3 rounded-sm bg-[#34D399]"></div><span className="text-[10px] md:text-xs font-bold text-slate-600">{t.annualLeave} ({vacP}%)</span></div><div className="flex gap-2 items-center"><div className="w-3 h-3 rounded-sm bg-[#FBBF24]"></div><span className="text-[10px] md:text-xs font-bold text-slate-600">อื่นๆ</span></div></div></div>)}
                    {chartType === 'bar' && (<div className="w-full h-full flex items-end justify-between gap-0.5 md:gap-1 px-1 md:px-2 pb-2">{monthlyData.map((val, i) => (<div key={i} className="flex flex-col items-center flex-1 group"><div className="w-full bg-slate-50 rounded-t-sm relative flex items-end justify-center" style={{ height: '140px' }}><div className="w-full bg-gradient-to-t from-pink-500 to-purple-400 rounded-t-sm transition-all duration-500 group-hover:opacity-80" style={{ height: `${(val/maxMonthly)*100}%` }}></div>{val > 0 && <span className="absolute -top-4 text-[8px] md:text-[10px] font-bold text-pink-600">{val}</span>}</div><span className="text-[8px] md:text-[10px] font-bold text-slate-400 mt-1 md:mt-2 truncate w-full text-center">{t.monthNames[i].substring(0,3)}</span></div>))}</div>)}
                    {chartType === 'line' && (<div className="w-full h-full flex flex-col justify-end px-1 md:px-2 pb-2 relative"><svg viewBox="0 0 100 100" className="w-full h-[140px] overflow-visible" preserveAspectRatio="none"><polyline points={monthlyData.map((val, i) => `${(i/11)*100},${100 - ((val/maxMonthly)*100)}`).join(" ")} fill="none" stroke="#A855F7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />{monthlyData.map((val, i) => <circle key={i} cx={`${(i/11)*100}`} cy={`${100 - ((val/maxMonthly)*100)}`} r="1.5" fill="#F472B6" />)}</svg><div className="flex justify-between w-full mt-2">{monthlyData.map((_, i) => <span key={i} className="text-[8px] md:text-[10px] font-bold text-slate-400 w-full text-center truncate">{t.monthNames[i].substring(0,3)}</span>)}</div></div>)}
                  </div>
                </div>
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
                <div className="bg-white/80 backdrop-blur-xl rounded-[1.5rem] md:rounded-[2rem] p-5 md:p-7 shadow-sm border border-white h-[350px] flex flex-col overflow-hidden">
                  <h4 className="font-black text-slate-800 flex items-center gap-2 md:gap-3 mb-4 md:mb-5 text-base md:text-lg"><span className="p-1.5 md:p-2 bg-emerald-100 text-emerald-500 rounded-lg md:rounded-xl">📑</span> {t.boxQuota}</h4>
                  <div className="flex-1 overflow-x-auto overflow-y-auto pr-1 md:pr-2 w-full"><table className="w-full text-left border-separate border-spacing-y-2 min-w-[400px]"><thead className="text-[10px] md:text-xs text-slate-400 bg-slate-50 sticky top-0 z-10"><tr><th className="p-2 md:p-3 rounded-l-lg md:rounded-l-xl">{t.thType}</th><th className="p-2 md:p-3 text-center">{t.thTotal}</th><th className="p-2 md:p-3 text-center">{t.thUsed}</th><th className="p-2 md:p-3 text-right rounded-r-lg md:rounded-r-xl">{t.thRemain}</th></tr></thead><tbody>{leaveBalances.map(b => (<tr key={b.id} className="bg-white shadow-sm hover:border-pink-200 transition-colors"><td className="p-2 md:p-3 font-bold text-slate-700 text-xs md:text-sm rounded-l-lg md:rounded-l-xl whitespace-nowrap">{getTranslatedType(b.leave_type)}</td><td className="p-2 md:p-3 text-slate-400 text-center text-[10px] md:text-xs whitespace-nowrap">{formatDuration(b.total_days * 480)}</td><td className="p-2 md:p-3 text-rose-500 font-bold text-center text-[10px] md:text-xs whitespace-nowrap">{formatDuration(b.used_minutes)}</td><td className="p-2 md:p-3 text-emerald-500 font-black text-right text-xs md:text-sm rounded-r-lg md:rounded-r-xl whitespace-nowrap">{formatDuration((b.total_days * 480) - b.used_minutes)}</td></tr>))}</tbody></table></div>
                </div>
                <div className="bg-white/80 backdrop-blur-xl rounded-[1.5rem] md:rounded-[2rem] p-5 md:p-7 shadow-sm border border-white h-[350px] flex flex-col">
                  <div className="flex justify-between items-center mb-4 md:mb-6"><h4 className="font-black text-slate-800 flex items-center gap-2 md:gap-3 text-base md:text-lg"><span className="p-1.5 md:p-2 bg-rose-100 text-rose-500 rounded-lg md:rounded-xl">📆</span> {t.boxCal}</h4><div className="font-bold text-pink-500 bg-pink-50 px-3 md:px-4 py-1 md:py-1.5 rounded-full text-[10px] md:text-sm">{t.monthNames[today.getMonth()]} {lang === 'TH' ? today.getFullYear() + 543 : today.getFullYear()}</div></div>
                  <div className="flex-1 flex flex-col justify-center"><div className="grid grid-cols-7 gap-1 text-center mb-1 md:mb-2">{t.dayNames.map(d => <div key={d} className="text-[10px] md:text-xs font-black text-slate-400 py-1">{d}</div>)}</div><div className="grid grid-cols-7 gap-1 md:gap-1 text-center">{blanksArray.map(b => <div key={`blank-${b}`} className="p-1 md:p-2"></div>)}{daysArray.map(day => (<div key={day} className={`p-0.5 md:p-1 flex justify-center items-center`}><span className={`w-6 h-6 md:w-8 h-8 flex items-center justify-center rounded-full font-bold text-[10px] md:text-sm transition-all cursor-default ${day === today.getDate() ? 'bg-gradient-to-tr from-pink-500 to-rose-400 text-white shadow-md transform scale-110' : 'text-slate-600 hover:bg-slate-100'}`}>{day}</span></div>))}</div></div>
                </div>
             </div>
          </div>
        )}

{/* 💎 VIEW: SALES MANAGEMENT (หน้าจัดการยอดขาย สำหรับ CEO/Admin) */}
        {currentView === "sales" && (user?.role === 'admin' || user?.role === 'ceo') && (
          <div className="px-4 md:px-8 pb-8 z-10 flex-1 flex flex-col w-full mt-4 animate-fade-in overflow-hidden">
            <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-6 md:p-8 shadow-sm border border-white flex-1 flex flex-col overflow-hidden">
              
              <div className="mb-6 border-b border-slate-100 pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
                <div>
                  <h3 className="font-black text-slate-800 text-xl flex items-center gap-2">💎 จัดการยอดขายพนักงาน</h3>
                  <p className="text-sm text-slate-500 font-medium mt-1">บันทึกยอดขายและตั้งเป้าหมาย แยกตามเดือน</p>
                </div>
                {/* ✨ ตัวเลือกเดือน สำหรับดูย้อนหลัง/ล่วงหน้า */}
                <div className="flex items-center gap-2 bg-indigo-50 px-4 py-2.5 rounded-xl border border-indigo-100 shadow-sm">
                  <span className="text-sm font-black text-indigo-800">📅 ประจำเดือน:</span>
                  <input 
                    type="month" 
                    value={salesMonth} 
                    onChange={e => setSalesMonth(e.target.value)} 
                    className="border-none outline-none font-black text-indigo-600 bg-transparent cursor-pointer" 
                  />
                </div>
              </div>

              <div className="flex flex-col flex-1 h-full w-full">
                    {/* ✨ กล่องค้นหา */}
                    <div className="mb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-4 rounded-2xl border border-slate-100 shadow-sm gap-3">
                      <div className="text-sm font-bold text-slate-500 flex items-center gap-2">
                        📋 สลิปเงินเดือนทั้งหมด
                      </div>
                      <div className="relative w-full sm:w-72">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <svg className="h-5 w-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                        </div>
                        <input
                          type="text"
                          placeholder="พิมพ์ชื่อพนักงานเพื่อค้นหา..."
                          value={payrollSearchKeyword}
                          onChange={(e) => setPayrollSearchKeyword(e.target.value)}
                          className="block w-full pl-10 pr-3 py-2 border border-slate-200 rounded-xl leading-5 bg-slate-50 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all"
                        />
                      </div>
                    </div>

                    {/* ✨ ตารางที่กรองข้อมูลแล้ว */}
                    <div className="flex-1 overflow-x-auto overflow-y-auto w-full custom-scrollbar pr-2">
                      <table className="w-full text-left border-separate border-spacing-y-2 min-w-[1200px]">
                        <thead className="text-[11px] md:text-xs text-slate-400 uppercase bg-slate-50 sticky top-0 z-10 shadow-sm">
                          <tr>
                            <th className="p-4 rounded-l-xl">พนักงาน</th>
                            <th className="p-4 text-center">เงินเดือน</th>
                            <th className="p-4 text-center text-indigo-500">คอมมิชชัน / โบนัส</th>
                            <th className="p-4 text-center text-rose-500">หักวันลา</th>
                            <th className="p-4 text-center text-rose-500">หักสาย</th>
                            <th className="p-4 text-center text-rose-500">หักขาด</th>
                            <th className="p-4 text-center text-rose-500">หักอื่นๆ</th>
                            <th className="p-4 text-center text-emerald-600">รับสุทธิ</th>
                            <th className="p-4 text-right rounded-r-xl">จัดการ</th>
                          </tr>
                        </thead>
                        <tbody>
                          {payrollData.length === 0 ? (
                            <tr>
                              <td colSpan="9" className="text-center p-10 text-slate-400 font-bold bg-slate-50 rounded-xl">ยังไม่มีการบันทึกเงินเดือนในระบบ</td>
                            </tr>
                          ) : (
                            payrollData
                              // กรอง 1: เลือกเฉพาะเดือนที่ดูอยู่
                              .filter(slip => slip.month === payrollFilterMonth)
                              // กรอง 2: ค้นหาตามชื่อพนักงาน
                              .filter(slip => {
                                const name = slip.employees?.full_name || '';
                                return name.toLowerCase().includes(payrollSearchKeyword.toLowerCase());
                              })
                              .map((slip) => (
                                <tr key={slip.id} className="bg-white shadow-sm hover:shadow-md transition-all border border-slate-50 group">
                                  <td className="p-4 font-black text-slate-800 rounded-l-xl whitespace-nowrap">
                                    <div className="flex flex-col">
                                      <span className="text-sm">{slip.employees?.full_name || 'ไม่ทราบชื่อ'}</span>
                                      <span className="text-[10px] text-slate-400 font-bold tracking-widest uppercase mt-0.5">รอบ: {slip.month}</span>
                                    </div>
                                  </td>
                                  <td className="p-4 text-center font-bold text-slate-600">฿{Number(slip.base_salary).toLocaleString()}</td>
                                  <td className="p-4 text-center font-bold text-indigo-600">
                                    ฿{Number(slip.commission || 0).toLocaleString()}
                                    {slip.bonus > 0 ? <span className="text-[10px] bg-indigo-50 px-1.5 py-0.5 rounded text-indigo-500 ml-1 inline-block mt-1">+฿{Number(slip.bonus).toLocaleString()}</span> : ''}
                                  </td>
                                  <td className="p-4 text-center font-bold text-rose-500">{Number(slip.leave_deduction) > 0 ? `- ฿${Number(slip.leave_deduction).toLocaleString()}` : '-'}</td>
                                  <td className="p-4 text-center font-bold text-rose-500">{Number(slip.late_deduction) > 0 ? `- ฿${Number(slip.late_deduction).toLocaleString()}` : '-'}</td>
                                  <td className="p-4 text-center font-bold text-rose-500">{Number(slip.absence_deduction) > 0 ? `- ฿${Number(slip.absence_deduction).toLocaleString()}` : '-'}</td>
                                  <td className="p-4 text-center font-bold text-rose-500">{Number(slip.deductions) > 0 ? `- ฿${Number(slip.deductions).toLocaleString()}` : '-'}</td>
                                  <td className="p-4 text-center text-emerald-600 font-black text-lg bg-emerald-50/30">฿{Number(slip.net_salary).toLocaleString()}</td>
                                  <td className="p-4 text-right rounded-r-xl">
                                    <div className="flex justify-end gap-2">
                                      {/* ปุ่มปริ้นสลิป */}
                                      <button onClick={() => handlePrintSlip(slip)} className="px-3 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-emerald-500 hover:text-white transition-all shadow-sm" title="พิมพ์สลิป">
                                        🖨️
                                      </button>
                                      {/* ปุ่มลบสลิป */}
                                      <button onClick={() => handleDeleteSlip(slip.id)} className="px-3 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-rose-500 hover:text-white transition-all shadow-sm" title="ลบสลิปนี้">
                                        🗑️
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
            </div>
          </div>
        )}


        {/* ✅ VIEW: HISTORY (ประวัติการลาของฉัน - อัปเกรดให้เลื่อนได้และดูง่ายขึ้น 100%) */}
        {currentView === "history" && (
          <div className="px-4 md:px-8 pb-8 z-10 flex-1 flex flex-col w-full overflow-hidden mt-4 animate-fade-in">
            <div className="bg-white/80 backdrop-blur-xl rounded-[1.5rem] md:rounded-[2rem] p-5 md:p-7 shadow-sm border border-white flex-1 flex flex-col w-full overflow-hidden">
              
              {/* Header & Filters (ล็อกไว้กับที่ ไม่หายเวลาเลื่อน) */}
              <div className="flex flex-col sm:flex-row justify-between gap-3 md:gap-4 mb-4 md:mb-6 pb-4 md:pb-6 border-b border-slate-100 shrink-0">
                <div>
                  <h3 className="font-black text-slate-800 text-lg md:text-xl flex items-center gap-2">📋 {t.myLeaveHistory}</h3>
                  <p className="text-[10px] md:text-xs text-slate-400 font-bold mt-1">แสดงประวัติการลาทั้งหมดของคุณ</p>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <select value={filterType} onChange={(e) => setFilterType(e.target.value)} className="flex-1 sm:flex-none bg-slate-50 border border-slate-200 rounded-lg md:rounded-xl px-2 md:px-4 py-2 font-bold outline-none text-[10px] md:text-sm shadow-inner">
                    <option value="ALL">{t.allTypes}</option>
                    <option value="ลาป่วย">{t.sickLeave}</option>
                    <option value="ลากิจ">{t.personalLeave}</option>
                    <option value="ลาพักร้อน">{t.annualLeave}</option>
                    <option value="ลาฉุกเฉิน">{t.emergencyLeave}</option>
                    <option value="ลาไม่รับเงินเดือน">{lang === 'TH' ? 'ลาไม่รับเงินเดือน' : 'Leave Without Pay'}</option>
                  </select>
                  <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="flex-1 sm:flex-none bg-slate-50 border border-slate-200 rounded-lg md:rounded-xl px-2 md:px-4 py-2 font-bold outline-none text-[10px] md:text-sm shadow-inner">
                    <option value="ALL">{t.allStatus}</option>
                    <option value="รออนุมัติ">{t.pending}</option>
                    <option value="อนุมัติ">{t.approved}</option>
                    <option value="ไม่อนุมัติ">{t.rejected}</option>
                  </select>
                </div>
              </div>

              {/* 📜 ส่วนตารางที่เลื่อนได้จริง (Scrollable Area) */}
              <div className="flex-1 overflow-x-auto overflow-y-auto w-full custom-scrollbar pr-1">
                <table className="w-full text-left border-separate border-spacing-y-2 min-w-[700px]">
                  <thead className="text-[10px] md:text-xs text-slate-400 uppercase bg-slate-50 sticky top-0 z-20 shadow-sm">
                    <tr>
                      <th className="p-3 md:p-4 rounded-l-lg md:rounded-l-xl">{t.thDate}</th>
                      <th className="p-3 md:p-4">{t.thType}</th>
                      <th className="p-3 md:p-4">{t.thDuration}</th>
                      <th className="p-3 md:p-4 w-1/3">{t.thReason || "เหตุผล"}</th>
                      <th className="p-3 md:p-4 text-right rounded-r-lg md:rounded-r-xl">{t.thStatus}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredLeaves.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="text-center py-20 text-slate-400 font-bold bg-slate-50/50 rounded-2xl">
                          {t.noLeaveHistory || "ไม่พบประวัติการลา"}
                        </td>
                      </tr>
                    ) : (
                      filteredLeaves.map(l => (
                        <tr key={l.id} className="bg-white shadow-sm border border-slate-50 group hover:bg-slate-50/50 transition-all">
                          <td className="p-3 md:p-4 text-xs md:text-sm font-bold text-slate-500 rounded-l-lg md:rounded-l-xl whitespace-nowrap">
                            <div className="flex flex-col">
                              <span>{new Date(l.created_at).toLocaleDateString(lang==='TH'?'th-TH':'en-US')}</span>
                              <span className="text-[9px] text-slate-400">{new Date(l.created_at).toLocaleTimeString('th-TH').slice(0,5)} น.</span>
                            </div>
                          </td>
                          <td className="p-3 md:p-4 text-xs md:text-sm font-black text-slate-700 whitespace-nowrap">
                            {getTranslatedType(l.leave_type)}
                          </td>
                          <td className="p-3 md:p-4 text-xs md:text-sm font-black text-rose-500 whitespace-nowrap">
                            {formatDuration(l.duration_minutes)}
                          </td>
                          <td className="p-3 md:p-4 text-[11px] font-medium text-slate-500">
                            {/* ✨ Clamp เหตุผลไว้ให้ดูง่าย แต่ขยายได้เมื่อชี้ */}
                            <div className="line-clamp-1 group-hover:line-clamp-none transition-all duration-300">{l.reason || '-'}</div>
                          </td>
                          <td className="p-3 md:p-4 text-right rounded-r-lg md:rounded-r-xl whitespace-nowrap">
                            <span className={`text-[10px] md:text-xs px-2 md:px-3 py-1 md:py-1.5 rounded-full font-black ${
                              l.status==='อนุมัติ' ? 'bg-emerald-100 text-emerald-600' : 
                              l.status==='รออนุมัติ' ? 'bg-amber-100 text-amber-600' : 
                              'bg-rose-100 text-rose-600'
                            }`}>
                              {getTranslatedStatus(l.status)}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

            </div>
          </div>
        )}

{/* 🛠️ VIEW: ADJUSTMENTS (ประวัติการแจ้งปรับปรุง) */}
        {currentView === "adjustments" && (
          <div className="px-4 md:px-8 pb-8 z-10 flex-1 flex flex-col w-full overflow-hidden mt-4 animate-fade-in">
            <div className="bg-white/80 backdrop-blur-xl rounded-[1.5rem] md:rounded-[2rem] p-5 md:p-7 shadow-sm border border-white flex-1 flex flex-col w-full overflow-hidden">
              
              <div className="flex flex-col sm:flex-row justify-between gap-3 md:gap-4 mb-4 md:mb-6 pb-4 md:pb-6 border-b border-slate-100 shrink-0">
                <div>
                  <h3 className="font-black text-slate-800 text-lg md:text-xl flex items-center gap-2">🛠️ ประวัติคำขอปรับปรุง</h3>
                  <p className="text-[10px] md:text-xs text-slate-400 font-bold mt-1">ติดตามสถานะคำขอสลับวันหยุดและแก้ไขเวลาของคุณ</p>
                </div>
              </div>

              <div className="flex-1 overflow-x-auto overflow-y-auto w-full custom-scrollbar pr-1 pb-2">
                <table className="w-full text-left border-separate border-spacing-y-2 min-w-[800px]">
                  <thead className="text-[10px] md:text-xs text-slate-400 uppercase bg-slate-50 sticky top-0 z-20 shadow-sm">
                    <tr>
                      <th className="p-3 md:p-4 rounded-l-lg md:rounded-l-xl">วันที่ยื่น</th>
                      <th className="p-3 md:p-4">ประเภท</th>
                      <th className="p-3 md:p-4 w-1/3">รายละเอียด</th>
                      <th className="p-3 md:p-4 text-right rounded-r-lg md:rounded-r-xl">สถานะ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* 👇 แก้บั๊กตรงนี้แหละครับ ใช้ allAdjustments แทน adjustments */}
                    {allAdjustments.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="text-center py-20 text-slate-400 font-bold bg-slate-50/50 rounded-2xl">
                          ยังไม่มีประวัติการแจ้งปรับปรุง
                        </td>
                      </tr>
                    ) : (
                      allAdjustments.map(adj => (
                        <tr key={adj.id} className="bg-white shadow-sm border border-slate-50 group hover:bg-slate-50/50 transition-all">
                          <td className="p-3 md:p-4 text-xs md:text-sm font-bold text-slate-500 rounded-l-lg md:rounded-l-xl whitespace-nowrap">
                            {new Date(adj.created_at).toLocaleDateString('th-TH')}
                          </td>
                          <td className="p-3 md:p-4 whitespace-nowrap">
                            <span className={`px-3 py-1 rounded-lg font-black text-[10px] md:text-xs ${
                              adj.request_type === 'สลับวันหยุด' ? 'bg-indigo-50 text-indigo-600' : 'bg-amber-50 text-amber-600'
                            }`}>
                              {adj.request_type}
                            </span>
                          </td>
                          <td className="p-3 md:p-4 text-[11px] font-medium text-slate-600">
                            <div className="line-clamp-1 group-hover:line-clamp-none transition-all duration-300">
                              {adj.request_type === 'สลับวันหยุด' ? (
                                <span>🔄 สลับจาก {adj.old_date} เป็น {adj.new_date}</span>
                              ) : (
                                <span>⏰ แก้ไขเวลา {adj.incident_date} ({adj.time_type}) จาก {adj.old_time} เป็น {adj.new_time}</span>
                              )}
                              {adj.reason && <span className="block text-[10px] text-slate-400 mt-1 italic">เหตุผล: {adj.reason}</span>}
                            </div>
                          </td>
                          <td className="p-3 md:p-4 text-right rounded-r-lg md:rounded-r-xl whitespace-nowrap">
                            <span className={`text-[10px] md:text-xs px-2 md:px-3 py-1 md:py-1.5 rounded-full font-black ${
                              adj.status==='อนุมัติ' ? 'bg-emerald-100 text-emerald-600' : 
                              adj.status==='รออนุมัติ' ? 'bg-amber-100 text-amber-600' : 
                              'bg-rose-100 text-rose-600'
                            }`}>
                              {adj.status}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

{/* 📅 VIEW: ATTENDANCE (ประวัติเข้าออกงาน - อัปเกรดให้มี Scrollbar เลื่อนได้ 100%) */}
      {currentView === "attendance" && (
        <div className="px-4 md:px-8 pb-8 z-10 flex-1 flex flex-col w-full overflow-hidden mt-4 animate-fade-in">
          {/* ✨ เพิ่ม overflow-hidden ที่กล่องนี้เพื่อล็อกไม่ให้ล้นจอ */}
          <div className="bg-white/80 backdrop-blur-xl rounded-[1.5rem] md:rounded-[2rem] p-5 md:p-7 shadow-sm border border-white flex-1 flex flex-col w-full overflow-hidden">
            
            {/* Header & Filters (ล็อกไว้กับที่ด้วย shrink-0) */}
            <div className="flex flex-col lg:flex-row justify-between gap-3 md:gap-4 mb-4 md:mb-6 pb-4 md:pb-6 border-b border-slate-100 shrink-0">
              <h3 className="font-black text-slate-800 text-lg md:text-xl flex items-center gap-2">
                📅 {user?.role === 'admin' || user?.role === 'ceo' ? t.allAttendance : t.myAttendance}
              </h3>
              
              <div className="flex flex-wrap gap-2 w-full lg:w-auto">
                {(user?.role === 'admin' || user?.role === 'ceo') && (
                  <div className="relative flex-1 lg:w-64">
                    <select 
                      value={attnSearchName}
                      onChange={(e) => setAttnSearchName(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-200 rounded-lg md:rounded-xl pl-3 pr-8 py-2 font-bold outline-none text-[10px] md:text-sm shadow-inner focus:border-indigo-400 cursor-pointer appearance-none text-slate-700"
                    >
                      <option value="">{t.allLeavesFilterAll || "เลือกดูพนักงานทุกคน"}</option>
                      {Array.from(new Set(attendanceList.map(a => a.full_name).filter(Boolean))).sort().map(name => (
                        <option key={name} value={name}>{lang === 'TH' ? `คุณ ${name}` : name}</option>
                      ))}
                    </select>
                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-slate-400 text-[10px]">▼</div>
                  </div>
                )}
                
                <select 
                  value={attnFilterStatus} 
                  onChange={(e) => setAttnFilterStatus(e.target.value)}
                  className="flex-1 lg:flex-none bg-slate-50 border border-slate-200 rounded-lg md:rounded-xl px-2 md:px-4 py-2 font-bold outline-none text-[10px] md:text-sm cursor-pointer"
                >
                  <option value="ALL">{t.allStatus}</option>
                  <option value="normal">{t.filterNormal}</option>
                  <option value="late">{t.filterLate}</option>
                </select>
              </div>
            </div>

            {/* 📜 ส่วนตารางที่เลื่อนได้จริง (Scrollable Area) */}
            <div className="flex-1 overflow-x-auto overflow-y-auto w-full custom-scrollbar pr-1 pb-2">
              {isLoadingAttendance ? (
                <div className="text-center py-20 text-indigo-400 font-bold animate-pulse">{t.loadingText}</div>
              ) : attendanceList.length === 0 ? (
                <div className="text-center py-20 text-slate-400 font-bold">{t.noAttendance}</div>
              ) : (
                <table className="w-full text-left border-separate border-spacing-y-2 min-w-[900px]">
                  {/* ✨ ล็อกหัวตารางไว้ด้านบน (sticky top-0) */}
                  <thead className="text-[10px] md:text-xs text-slate-400 uppercase bg-slate-50 sticky top-0 z-20 shadow-sm">
                    <tr>
                      <th className="p-3 md:p-4 rounded-l-lg md:rounded-l-xl">{t.thDate}</th>
                      <th className="p-3 md:p-4">{t.thEmp}</th>
                      <th className="p-3 md:p-4 text-center">{t.thTimeIn}</th>
                      <th className="p-3 md:p-4 text-center">{t.thTimeOut}</th>
                      <th className="p-3 md:p-4 text-center">พิกัด (GPS)</th>
                      <th className="p-3 md:p-4 text-right rounded-r-lg md:rounded-r-xl">{t.thStatus}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {attendanceList
                      .filter(a => attnFilterStatus === "ALL" || a.status === attnFilterStatus)
                      .filter(a => !attnSearchName || a.full_name === attnSearchName)
                      .map((record, index) => (
                        <tr key={index} className="bg-white shadow-sm border border-slate-50 group hover:bg-slate-50/50 transition-all">
                          <td className="p-3 md:p-4 text-xs md:text-sm font-bold text-slate-500 rounded-l-lg md:rounded-l-xl whitespace-nowrap">
                            {new Date(record.date).toLocaleDateString(lang === 'TH' ? 'th-TH' : 'en-US')}
                          </td>
                          <td className="p-3 md:p-4 text-xs md:text-sm font-black text-blue-600 whitespace-nowrap">
                            {record.full_name}
                          </td>
                          <td className="p-3 md:p-4 text-center">
                            <div className="flex flex-col items-center gap-2">
                              <span className="font-black text-slate-700 text-sm">{record.time_in || '--:--'}</span>
                              {record.selfie_in && (
                                <button onClick={() => viewSelfie(record.selfie_in, t.viewPhoto)} className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] md:text-xs font-black hover:bg-indigo-100 border border-indigo-100 flex items-center gap-1 shadow-sm transition-all">
                                  📸 {t.viewPhoto}
                                </button>
                              )}
                            </div>
                          </td>
                          <td className="p-3 md:p-4 text-center">
                            <div className="flex flex-col items-center gap-2">
                              <span className="font-black text-slate-700 text-sm">{record.time_out || '--:--'}</span>
                              {record.selfie_out && (
                                <button onClick={() => viewSelfie(record.selfie_out, t.viewPhoto)} className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] md:text-xs font-black hover:bg-indigo-100 border border-indigo-100 flex items-center gap-1 shadow-sm transition-all">
                                  📸 {t.viewPhoto}
                                </button>
                              )}
                            </div>
                          </td>
                          <td className="p-3 md:p-4 text-center whitespace-nowrap">
                            {(record.lat_in || record.lat) ? (
                              <div className="flex justify-center gap-1.5">
                                <button 
                                  onClick={() => setViewMapModal({ lat: record.lat_in || record.lat, lng: record.lng_in || record.lng, name: `${record.full_name}` })}
                                  className="bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white px-3 py-1.5 rounded-lg text-[10px] font-black border border-emerald-100 transition-all shadow-sm"
                                >
                                  📍 ดูพิกัด
                                </button>
                              </div>
                            ) : (
                              <span className="text-slate-300 text-[10px] font-bold">ไม่มีพิกัด</span>
                            )}
                          </td>
                          <td className="p-3 md:p-4 text-right rounded-r-lg md:rounded-r-xl whitespace-nowrap">
                            <span className={`text-[10px] md:text-xs px-2 md:px-3 py-1 md:py-1.5 rounded-full font-black ${
                              record.status === 'late' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'
                            }`}>
                              {record.status === 'late' ? `${t.statusLate} (${formatLateTime(record.late_minutes)})` : t.statusNormal}
                            </span>
                          </td>
                        </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

          </div>
        </div>
      )}


        {/* 👑 VIEW: APPROVALS (ระบบ Admin) - ใส่ Popup ครบชุดแล้ว */}
        {currentView === "approvals" && (
          <div className="px-4 md:px-8 pb-8 z-10 flex-1 flex flex-col mt-4">
            <div className="bg-white/80 backdrop-blur-xl rounded-[1.5rem] md:rounded-[2rem] p-5 md:p-7 shadow-lg border border-rose-100 flex-1 flex flex-col">
              
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 md:mb-6 pb-4 md:pb-6 border-b border-slate-100 gap-4">
                <h3 className="font-black text-slate-800 text-lg md:text-xl flex items-center gap-2"><span className="p-1.5 md:p-2 bg-rose-100 text-rose-500 rounded-lg md:rounded-xl text-xl md:text-2xl">✅</span> {t.allPendingApprovals}</h3>
                <div className="flex bg-slate-100 p-1 rounded-xl w-full md:w-auto">
                  <button onClick={() => setAdminTab('leaves')} className={`flex-1 md:flex-none px-4 py-2 text-xs md:text-sm font-bold rounded-lg transition-all ${adminTab==='leaves' ? 'bg-white text-rose-500 shadow-sm' : 'text-slate-400'}`}>{t.tabLeaves} ({adminLeaves.length})</button>
                  <button onClick={() => setAdminTab('adjustments')} className={`flex-1 md:flex-none px-4 py-2 text-xs md:text-sm font-bold rounded-lg transition-all ${adminTab==='adjustments' ? 'bg-white text-purple-600 shadow-sm' : 'text-slate-400'}`}>{t.tabAdjusts} ({adminAdjustments.length})</button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto pr-1 md:pr-2">
                <div className="space-y-3 md:space-y-4">
                  {/* --- แท็บอนุมัติการลา --- */}
                  {adminTab === 'leaves' && (adminLeaves.length === 0 ? <div className="text-center py-10 md:py-20 text-slate-400 font-bold text-sm md:text-lg">{t.noPending}</div> : (
                    adminLeaves.map(req => (
                      <div key={req.id} className="bg-white border-2 border-slate-100 rounded-xl md:rounded-2xl p-4 md:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between hover:border-pink-300 transition-colors shadow-sm gap-4">
                        <div className="flex gap-3 md:gap-4 items-center w-full sm:w-auto overflow-hidden">
                          <div className="w-10 h-10 md:w-12 md:h-12 flex-shrink-0 bg-gradient-to-tr from-pink-400 to-purple-500 rounded-full flex items-center justify-center text-white font-black text-lg md:text-xl shadow-md">{(req.employees?.full_name || 'U').charAt(0)}</div>
                          <div className="overflow-hidden">
                            <h4 className="font-black text-slate-800 text-sm md:text-lg truncate">{req.employees?.full_name}</h4>
                            <p className="text-[10px] md:text-sm font-bold text-pink-500 mt-0.5 md:mt-1 truncate">{getTranslatedType(req.leave_type)} <span className="text-slate-400 font-medium">| {formatDuration(req.duration_minutes)}</span></p>
                          </div>
                        </div>
                        <div className="flex gap-2 w-full sm:w-auto">
                          {/* 🎯 ปุ่มปฏิเสธ (เรียก Popup) */}
                          <button onClick={() => executeRejectWithPopup(req, `คำขอ${getTranslatedType(req.leave_type)}`, true)} className="flex-1 sm:flex-none px-4 py-2 bg-rose-50 text-rose-600 rounded-lg font-black text-xs md:text-sm">{t.btnReject}</button>
                          {/* 🎯 ปุ่มอนุมัติ (เรียก Popup) */}
                          <button onClick={() => executeApproveWithPopup(req, `คำขอ${getTranslatedType(req.leave_type)}`, true)} className="flex-1 sm:flex-none px-4 py-2 bg-emerald-500 text-white rounded-lg font-black text-xs md:text-sm">✅ {t.btnApprove}</button>
                        </div>
                      </div>
                    ))
                  ))}

                  {/* --- แท็บอนุมัติปรับปรุงเวลา --- */}
                  {adminTab === 'adjustments' && (adminAdjustments.length === 0 ? <div className="text-center py-10 md:py-20 text-slate-400 font-bold text-sm md:text-lg">{t.noPending}</div> : (
                    adminAdjustments.map(req => (
                      <div key={req.id} className="bg-white border-2 border-slate-100 rounded-xl md:rounded-2xl p-4 md:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between hover:border-purple-300 transition-colors shadow-sm gap-4">
                        <div className="flex gap-3 md:gap-4 items-center w-full sm:w-auto overflow-hidden">
                          <div className="w-10 h-10 md:w-12 md:h-12 flex-shrink-0 bg-gradient-to-tr from-purple-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-black text-lg md:text-xl shadow-md">{(req.employees?.full_name || 'U').charAt(0)}</div>
                          <div className="overflow-hidden">
                            <h4 className="font-black text-slate-800 text-sm md:text-lg truncate">{req.employees?.full_name}</h4>
                            <p className="text-[10px] md:text-sm font-bold text-purple-600 mt-0.5 md:mt-1 truncate">{getTranslatedType(req.request_type)}</p>
                          </div>
                        </div>
                        <div className="flex gap-2 w-full sm:w-auto">
                          {/* 🎯 ปุ่มปฏิเสธ (เรียก Popup) */}
                          <button onClick={() => executeRejectWithPopup(req, `คำขอ${getTranslatedType(req.request_type)}`, false)} className="flex-1 sm:flex-none px-4 py-2 bg-rose-50 text-rose-600 rounded-lg font-black text-xs md:text-sm">{t.btnReject}</button>
                          {/* 🎯 ปุ่มอนุมัติ (เรียก Popup) */}
                          <button onClick={() => executeApproveWithPopup(req, `คำขอ${getTranslatedType(req.request_type)}`, false)} className="flex-1 sm:flex-none px-4 py-2 bg-emerald-500 text-white rounded-lg font-black text-xs md:text-sm">✅ {t.btnApprove}</button>
                        </div>
                      </div>
                    ))
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

       {/* ⚙️ VIEW: SETTINGS (หน้าตั้งค่าระบบ -> จัดการสาขา + Map แบบมีรัศมี) */}
      {currentView === "settings_branches" && (
        <div className="px-4 md:px-8 pb-8 z-10 flex-1 flex flex-col w-full mt-4 animate-fade-in">
          <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-6 md:p-8 shadow-sm border border-white flex-1 overflow-y-auto">
            <div className="mb-6 border-b border-slate-100 pb-4">
              <h3 className="font-black text-slate-800 text-xl flex items-center gap-2">📍 {t.settingsBranches}</h3>
              <p className="text-sm text-slate-500 font-medium mt-1">{t.settingsDesc}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              {/* ฝั่งซ้าย: ฟอร์มเพิ่ม/แก้ไข */}
              <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 h-fit">
                <h4 className="font-black text-slate-700 mb-4">{editingBranchId ? t.formEditBranch : t.formAddBranch}</h4>
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  if (!formName || currentLocation.isDefault) {
                    return Swal.fire({
                      icon: 'warning',
                      title: t.swalWarnTitle,
                      text: t.swalWarnText,
                      buttonsStyling: false,
                      customClass: {
                        popup: 'rounded-[2rem] shadow-2xl border-2 border-pink-100',
                        title: 'font-black text-slate-800 text-2xl mt-4',
                        htmlContainer: 'text-slate-500 font-medium text-sm',
                        confirmButton: 'bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-2xl px-8 py-3.5 font-black shadow-lg hover:scale-105 transition-all mt-4 w-full'
                      }
                    });
                  }
                  
                  try {
                    const branchData = { name: formName, lat: currentLocation.lat, lng: currentLocation.lng, radius_m: Number(formRadius) || 100 };
                    
                    if (editingBranchId) {
                      await supabase.from('branches').update(branchData).eq('id', editingBranchId);
                      Swal.fire({
                        icon: 'success',
                        title: t.swalSuccessUpdate,
                        showConfirmButton: false,
                        timer: 1500,
                        customClass: {
                          popup: 'rounded-[2rem] shadow-2xl border-2 border-emerald-100',
                          title: 'font-black text-slate-800 text-xl mt-4'
                        }
                      });
                    } else {
                      await supabase.from('branches').insert([branchData]);
                      Swal.fire({
                        icon: 'success',
                        title: t.swalSuccessAdd,
                        showConfirmButton: false,
                        timer: 1500,
                        customClass: {
                          popup: 'rounded-[2rem] shadow-2xl border-2 border-emerald-100',
                          title: 'font-black text-slate-800 text-xl mt-4'
                        }
                      });
                    }
                    
                    setEditingBranchId(null);
                    setFormName("");
                    setFormRadius(100);
                    setCurrentLocation({ lat: 13.7563, lng: 100.5018, isDefault: true });
                    fetchBranches();
                  } catch (err) { 
                    Swal.fire({
                      icon: 'error',
                      title: t.swalError,
                      text: err.message,
                      buttonsStyling: false,
                      customClass: {
                        popup: 'rounded-[2rem] shadow-2xl border-2 border-rose-100',
                        confirmButton: 'bg-rose-500 text-white rounded-2xl px-8 py-3.5 font-black mt-4 w-full'
                      }
                    });
                  }
                }} className="space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-500 mb-1.5 block">{t.labelBranchName}</label>
                    <input type="text" value={formName} onChange={(e) => setFormName(e.target.value)} placeholder={t.placeBranchName} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 font-bold text-sm outline-none shadow-sm focus:border-purple-400 mb-4"/>
                    
                    <label className="text-xs font-bold text-slate-500 mb-1.5 block">{t.labelRadius}</label>
                    <input type="number" value={formRadius} onChange={(e) => setFormRadius(e.target.value)} placeholder="เช่น 100" className="w-full bg-white border border-slate-200 rounded-xl px-4 py-3 font-bold text-sm outline-none focus:border-purple-400 shadow-sm"/>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div><label className="text-xs font-bold text-slate-500 mb-1 block">Lat</label><input type="text" readOnly value={currentLocation.isDefault ? '' : Number(currentLocation.lat).toFixed(6)} className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 font-bold text-sm text-slate-500 outline-none"/></div>
                    <div><label className="text-xs font-bold text-slate-500 mb-1 block">Lng</label><input type="text" readOnly value={currentLocation.isDefault ? '' : Number(currentLocation.lng).toFixed(6)} className="w-full bg-slate-100 border border-slate-200 rounded-xl px-4 py-3 font-bold text-sm text-slate-500 outline-none"/></div>
                  </div>
                  <button type="button" onClick={getLocation} className="w-full py-3.5 bg-indigo-50 text-indigo-600 border border-indigo-200 rounded-xl font-black text-sm flex items-center justify-center gap-2 hover:bg-indigo-100 transition-colors">{t.btnGetGPS}</button>
                  <div className="flex gap-2">
                    <button type="submit" className={`flex-1 py-3.5 ${editingBranchId ? 'bg-amber-500' : 'bg-slate-800'} text-white rounded-xl font-black text-sm shadow-lg mt-4 hover:-translate-y-0.5 transition-all`}>{editingBranchId ? t.btnUpdate : t.btnSave}</button>
                    {editingBranchId && <button type="button" onClick={() => { setEditingBranchId(null); setFormName(""); setFormRadius(100); setCurrentLocation({ lat: 13.7563, lng: 100.5018, isDefault: true }); }} className="px-6 py-3.5 bg-slate-200 text-slate-600 rounded-xl font-black text-sm mt-4">{t.modalCancel}</button>}
                  </div>
                </form>
              </div>

              {/* ฝั่งขวา: แผนที่ Leaflet */}
              <div className="bg-slate-100 rounded-[2rem] border-2 border-slate-100 relative overflow-hidden shadow-inner z-0 h-[400px]">
                <div id="map" className="w-full h-full" style={{ minHeight: '400px' }}></div>
              </div>
            </div>

            {/* ตารางสาขาที่มีปุ่ม "แมพ 🗺️" */}
            <div className="mt-8">
              <h4 className="font-black text-slate-800 mb-4 flex items-center gap-2">📋 {t.tableBranchTitle} ({branches.length})</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-separate border-spacing-y-2">
                  <thead>
                    <tr className="text-[10px] text-slate-400 uppercase">
                      <th className="px-4 py-2">{t.thBranchName}</th>
                      <th className="px-4 py-2 text-center">{t.thCoords}</th>
                      <th className="px-4 py-2 text-center">{t.thRadius}</th>
                      <th className="px-4 py-2 text-right">{t.thManage}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {branches.length === 0 ? (
                      <tr><td colSpan="4" className="text-center py-10 text-slate-400 font-bold bg-slate-50 rounded-xl">{t.noBranchData}</td></tr>
                    ) : (
                      branches.map((b) => (
                        <tr key={b.id} className="bg-slate-50 hover:bg-white hover:shadow-md transition-all">
                          <td className="px-4 py-4 rounded-l-xl font-black text-slate-700 text-sm">{b.name}</td>
                          <td className="px-4 py-4 text-center text-xs font-bold text-slate-500">
                            {(Number(b.lat) || 0).toFixed(4)}, {(Number(b.lng) || 0).toFixed(4)}
                          </td>
                          <td className="px-4 py-4 text-center text-xs font-black text-purple-600">{b.radius_m || 0} m.</td>
                          <td className="px-4 py-4 rounded-r-xl text-right flex gap-2 justify-end">
                            
                            <button onClick={() => { setEditingBranchId(b.id); setFormName(b.name); setFormRadius(b.radius_m || 100); setCurrentLocation({ lat: b.lat, lng: b.lng, isDefault: false }); }} className="text-[10px] bg-amber-50 text-amber-600 border border-amber-100 px-3 py-1.5 rounded-lg font-black hover:bg-amber-100">
                              {t.btnEdit}
                            </button>
                            
                            <button onClick={async () => {
                              const result = await Swal.fire({ 
                                title: t.swalDelTitle, 
                                text: t.swalDelText,
                                icon: 'warning', 
                                showCancelButton: true, 
                                buttonsStyling: false,
                                customClass: {
                                  popup: 'rounded-[2rem] shadow-2xl border-2 border-rose-100',
                                  title: 'font-black text-slate-800 text-2xl mt-4',
                                  htmlContainer: 'text-slate-500 font-medium text-sm',
                                  actions: 'flex gap-3 w-full mt-6 px-4',
                                  confirmButton: 'flex-1 bg-rose-500 text-white rounded-2xl py-3.5 font-black shadow-md hover:bg-rose-600 transition-colors',
                                  cancelButton: 'flex-1 bg-slate-100 text-slate-600 rounded-2xl py-3.5 font-black hover:bg-slate-200 transition-colors'
                                },
                                confirmButtonText: t.swalDelConfirm, 
                                cancelButtonText: t.modalCancel 
                              });
                              if (result.isConfirmed) {
                                try {
                                  const { error } = await supabase.from('branches').delete().eq('id', b.id);
                                  if (error) throw error;
                                  Swal.fire({ 
                                    icon: 'success', 
                                    title: t.swalDelSuccess, 
                                    showConfirmButton: false, 
                                    timer: 1500,
                                    customClass: {
                                      popup: 'rounded-[2rem] shadow-2xl border-2 border-emerald-100',
                                      title: 'font-black text-slate-800 text-xl mt-4'
                                    }
                                  });
                                  fetchBranches();
                                } catch (err) { 
                                  Swal.fire(t.swalError, err.message, 'error');
                                }
                              }
                            }} className="text-[10px] bg-rose-50 text-rose-600 border border-rose-100 px-3 py-1.5 rounded-lg font-black hover:bg-rose-100">
                              {t.btnDelete}
                            </button>
                            
                            <button onClick={() => setCurrentLocation({ lat: b.lat, lng: b.lng, isDefault: false })} className="text-[10px] bg-white border border-slate-200 px-3 py-1.5 rounded-lg font-black text-indigo-600 hover:bg-indigo-50 shadow-sm">
                              {t.btnMap}
                            </button>

                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

{/* 🗂️ VIEW: ALL EMPLOYEE LEAVES (ระบบกรองข้อมูล 3 ชั้น: ชื่อ, ประเภท, สถานะ) */}
      {currentView === "settings_all_leaves" && (user?.role === 'admin' || user?.role === 'ceo') && (
        <div className="px-4 md:px-8 pb-8 z-10 flex-1 flex flex-col w-full mt-4 animate-fade-in overflow-hidden">
          <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-6 md:p-8 shadow-sm border border-white flex-1 flex flex-col overflow-hidden">
            
            {/* Header & Advanced Filters */}
            <div className="mb-6 border-b border-slate-100 pb-6">
              <h3 className="font-black text-slate-800 text-xl flex items-center gap-2 mb-4">🗂️ {t.settingsAllLeaves}</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {/* 1. เลือกพนักงาน (Dropdown) */}
                <div className="relative">
                  <span className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-xs">👤</span>
                  <select 
                    value={empLeaveSearch}
                    onChange={(e) => setEmpLeaveSearch(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 font-bold outline-none text-sm shadow-inner focus:border-indigo-400 cursor-pointer appearance-none text-slate-700" 
                  >
                    <option value="">{t.allLeavesFilterAll}</option>
                    {/* ดึงรายชื่อพนักงานที่มีประวัติลามาแสดง */}
                    {Array.from(new Set(allEmpLeaves.map(l => l.employees?.full_name).filter(Boolean))).sort().map(name => (
                      <option key={name} value={name}>{lang === 'TH' ? `คุณ ${name}` : name}</option>
                    ))}
                  </select>
                </div>

                {/* 2. เลือกประเภทการลา */}
                <div className="relative">
                  <span className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-xs">🔖</span>
                  <select 
                    value={allLeavesTypeFilter}
                    onChange={(e) => setAllLeavesTypeFilter(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 font-bold outline-none text-sm shadow-inner focus:border-indigo-400 cursor-pointer appearance-none text-slate-700" 
                  >
                    <option value="ALL">{t.allTypes}</option>
                    <option value="ลาป่วย">{t.sickLeave}</option>
                    <option value="ลากิจ">{t.personalLeave}</option>
                    <option value="ลาพักร้อน">{t.annualLeave}</option>
                    <option value="ลาฉุกเฉิน">{t.emergencyLeave}</option>
                    <option value="ลาไม่รับเงินเดือน">{lang === 'TH' ? 'ลาไม่รับเงินเดือน' : 'Leave Without Pay'}</option>
                  </select>
                </div>

                {/* 3. เลือกสถานะ */}
                <div className="relative">
                  <span className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-xs">⚖️</span>
                  <select 
                    value={allLeavesStatusFilter}
                    onChange={(e) => setAllLeavesStatusFilter(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 font-bold outline-none text-sm shadow-inner focus:border-indigo-400 cursor-pointer appearance-none text-slate-700" 
                  >
                    <option value="ALL">{t.allStatus}</option>
                    <option value="รออนุมัติ">{t.pending}</option>
                    <option value="อนุมัติ">{t.approved}</option>
                    <option value="ไม่อนุมัติ">{t.rejected}</option>
                  </select>
                </div>
              </div>
            </div>

            {/* ตารางแสดงข้อมูล */}
            <div className="flex-1 overflow-x-auto overflow-y-auto w-full custom-scrollbar pr-2">
              <table className="w-full text-left border-separate border-spacing-y-2 min-w-[1000px]">
                <thead className="text-xs text-slate-400 uppercase bg-slate-50 sticky top-0 z-10">
                  <tr>
                    <th className="p-4 rounded-l-xl">{t.thDate}</th>
                    <th className="p-4">{t.thEmp}</th>
                    <th className="p-4">{t.thTypeDuration}</th>
                    <th className="p-4 w-1/4">{t.thReason}</th>
                    <th className="p-4 text-center">{t.thLocation}</th>
                    <th className="p-4 text-right rounded-r-xl">{t.thStatus}</th>
                  </tr>
                </thead>
                <tbody>
                  {allEmpLeaves
                    .filter(l => !empLeaveSearch || l.employees?.full_name === empLeaveSearch)
                    .filter(l => allLeavesTypeFilter === "ALL" || l.leave_type === allLeavesTypeFilter)
                    .filter(l => allLeavesStatusFilter === "ALL" || l.status === allLeavesStatusFilter)
                    .length === 0 ? (
                      <tr><td colSpan="6" className="text-center py-10 text-slate-400 font-bold bg-slate-50 rounded-xl">{t.noLeaveHistory}</td></tr>
                    ) : (
                      allEmpLeaves
                        .filter(l => !empLeaveSearch || l.employees?.full_name === empLeaveSearch)
                        .filter(l => allLeavesTypeFilter === "ALL" || l.leave_type === allLeavesTypeFilter)
                        .filter(l => allLeavesStatusFilter === "ALL" || l.status === allLeavesStatusFilter)
                        .map(l => (
                         <tr key={l.id} className="bg-white shadow-sm hover:shadow-md transition-all border border-slate-50 group">
                            <td className="p-4 text-sm font-bold text-slate-500 rounded-l-xl whitespace-nowrap">
                              {new Date(l.created_at).toLocaleDateString(lang==='TH'?'th-TH':'en-US')} <br/>
                              <span className="text-[10px] text-slate-400">{new Date(l.created_at).toLocaleTimeString('th-TH').slice(0,5)} น.</span>
                            </td>
                            <td className="p-4 text-sm font-black text-slate-800 whitespace-nowrap">{l.employees?.full_name || 'ไม่ทราบชื่อ'}</td>
                            <td className="p-4 whitespace-nowrap">
                              <span className="font-black text-pink-600 block text-sm">{getTranslatedType(l.leave_type)}</span>
                              <span className="text-xs text-slate-400 font-bold">{formatDuration(l.duration_minutes)}</span>
                            </td>
                            <td className="p-4 text-xs font-medium text-slate-600">
                              <div className="line-clamp-2 hover:line-clamp-none transition-all">{l.reason || '-'}</div>
                            </td>
                            <td className="p-4 text-center whitespace-nowrap">
                              {(l.lat && l.lng) ? (
                                <button 
                                  onClick={() => setViewMapModal({ lat: l.lat, lng: l.lng, name: l.employees?.full_name })}
                                  className="inline-flex items-center gap-1.5 bg-indigo-50 border border-indigo-100 text-indigo-600 px-3 py-2 rounded-xl text-[11px] font-black hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                                >
                                  📍 {t.btnViewMap}
                                </button>
                              ) : (
                                <span className="text-slate-300 text-[10px] font-bold">{t.noLocation}</span>
                              )}
                            </td>
                            <td className="p-4 text-right rounded-r-xl whitespace-nowrap">
                              <span className={`text-[10px] px-3 py-1.5 rounded-full font-black ${l.status==='อนุมัติ'?'bg-emerald-100 text-emerald-600':l.status==='รออนุมัติ'?'bg-amber-100 text-amber-600':'bg-rose-100 text-rose-600'}`}>
                                {getTranslatedStatus(l.status)}
                              </span>
                            </td>
                         </tr>
                      ))
                    )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

{/* 🏖️ VIEW: ALL DAY OFFS (รายการแจ้งหยุดทั้งหมด - กรองชื่อด้วย Dropdown) */}
      {currentView === "settings_all_dayoffs" && (user?.role === 'admin' || user?.role === 'ceo') && (
        <div className="px-4 md:px-8 pb-8 z-10 flex-1 flex flex-col w-full mt-4 animate-fade-in overflow-hidden">
          <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-6 md:p-8 shadow-sm border border-white flex-1 flex flex-col overflow-hidden">
            
            {/* Header & Filters */}
            <div className="mb-6 border-b border-slate-100 pb-6">
              <h3 className="font-black text-slate-800 text-xl flex items-center gap-2 mb-4">🏖️ {t.settingsAllDayOffs}</h3>
              <p className="text-sm text-slate-500 font-medium mb-4">{t.ptDayOffDesc}</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* 1. ค้นหาด้วย Dropdown รายชื่อพนักงาน (เฉพาะที่มีประวัติแจ้งหยุด) */}
                <div className="relative">
                  <span className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-xs">👤</span>
                  <select 
                    value={dayoffSearchName}
                    onChange={(e) => setDayoffSearchName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 font-bold outline-none text-sm shadow-inner focus:border-indigo-400 cursor-pointer appearance-none text-slate-700" 
                  >
                    <option value="">{t.allLeavesFilterAll}</option>
                    {Array.from(new Set(allEmpLeaves.filter(l => l.leave_type === 'วันหยุดประจำสัปดาห์ (PT)' || l.leave_type === 'Weekly Day Off (PT)').map(l => l.employees?.full_name).filter(Boolean))).sort().map(name => (
                      <option key={name} value={name}>{lang === 'TH' ? `คุณ ${name}` : name}</option>
                    ))}
                  </select>
                </div>

                {/* 2. เลือกสถานะ */}
                <div className="relative">
                  <span className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-xs">⚖️</span>
                  <select 
                    value={dayoffFilterStatus}
                    onChange={(e) => setDayoffFilterStatus(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 font-bold outline-none text-sm shadow-inner focus:border-indigo-400 cursor-pointer appearance-none text-slate-700" 
                  >
                    <option value="ALL">{t.allStatus}</option>
                    <option value="รออนุมัติ">{t.pending}</option>
                    <option value="อนุมัติ">{t.approved}</option>
                    <option value="ไม่อนุมัติ">{t.rejected}</option>
                  </select>
                </div>
              </div>
            </div>

            {/* ตารางแสดงข้อมูลการแจ้งหยุด */}
            <div className="flex-1 overflow-x-auto overflow-y-auto w-full custom-scrollbar pr-2">
              <table className="w-full text-left border-separate border-spacing-y-2 min-w-[800px]">
                <thead className="text-xs text-slate-400 uppercase bg-slate-50 sticky top-0 z-10">
                  <tr>
                    <th className="p-4 rounded-l-xl">{t.thDate}</th>
                    <th className="p-4">{t.thEmp}</th>
                    <th className="p-4 text-purple-600">📅 {t.thDayOffDate}</th>
                    <th className="p-4 w-1/4">{t.thReason}</th>
                    <th className="p-4 text-right rounded-r-xl">{t.thStatus}</th>
                  </tr>
                </thead>
                <tbody>
                  {allEmpLeaves
                    .filter(l => l.leave_type === 'วันหยุดประจำสัปดาห์ (PT)' || l.leave_type === 'Weekly Day Off (PT)')
                    .filter(l => !dayoffSearchName || l.employees?.full_name === dayoffSearchName)
                    .filter(l => dayoffFilterStatus === "ALL" || l.status === dayoffFilterStatus)
                    .length === 0 ? (
                      <tr><td colSpan="5" className="text-center py-10 text-slate-400 font-bold bg-slate-50 rounded-xl">{t.noLeaveHistory}</td></tr>
                    ) : (
                      allEmpLeaves
                        .filter(l => l.leave_type === 'วันหยุดประจำสัปดาห์ (PT)' || l.leave_type === 'Weekly Day Off (PT)')
                        .filter(l => !dayoffSearchName || l.employees?.full_name === dayoffSearchName)
                        .filter(l => dayoffFilterStatus === "ALL" || l.status === dayoffFilterStatus)
                        .map(l => (
                         <tr key={l.id} className="bg-white shadow-sm hover:shadow-md transition-all border border-slate-50 group">
                            {/* วันที่ยื่นเรื่อง */}
                            <td className="p-4 text-sm font-bold text-slate-400 rounded-l-xl whitespace-nowrap">
                              {new Date(l.created_at).toLocaleDateString(lang==='TH'?'th-TH':'en-US')} <br/>
                              <span className="text-[10px]">{new Date(l.created_at).toLocaleTimeString('th-TH').slice(0,5)} น.</span>
                            </td>
                            {/* ชื่อพนักงาน */}
                            <td className="p-4 text-sm font-black text-slate-800 whitespace-nowrap">{l.employees?.full_name || 'ไม่ทราบชื่อ'}</td>
                            {/* วันที่ขอหยุด (Highlight) */}
                            <td className="p-4 whitespace-nowrap">
                              <span className="bg-purple-100 text-purple-700 px-3 py-1.5 rounded-lg font-black text-sm border border-purple-200">
                                {new Date(l.start_date).toLocaleDateString(lang==='TH'?'th-TH':'en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                              </span>
                            </td>
                            {/* เหตุผล */}
                            <td className="p-4 text-xs font-medium text-slate-600">
                              <div className="line-clamp-2 hover:line-clamp-none transition-all">{l.reason || '-'}</div>
                            </td>
                            {/* สถานะ */}
                            <td className="p-4 text-right rounded-r-xl whitespace-nowrap">
                              <span className={`text-[11px] px-3 py-1.5 rounded-full font-black ${l.status==='อนุมัติ'?'bg-emerald-100 text-emerald-600':l.status==='รออนุมัติ'?'bg-amber-100 text-amber-600':'bg-rose-100 text-rose-600'}`}>
                                {getTranslatedStatus(l.status)}
                              </span>
                            </td>
                         </tr>
                      ))
                    )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

{/* 🛠️ VIEW: ALL ADJUSTMENTS (ประวัติการแจ้งปรับปรุงทั้งหมด - กรองด้วย Dropdown 3 ชั้น) */}
      {currentView === "settings_all_adjustments" && (user?.role === 'admin' || user?.role === 'ceo') && (
        <div className="px-4 md:px-8 pb-8 z-10 flex-1 flex flex-col w-full mt-4 animate-fade-in overflow-hidden">
          <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-6 md:p-8 shadow-sm border border-white flex-1 flex flex-col overflow-hidden">
            
            {/* Header & Filters */}
            <div className="mb-6 border-b border-slate-100 pb-6">
              <h3 className="font-black text-slate-800 text-xl flex items-center gap-2 mb-4">🛠️ {t.settingsAllAdjustments}</h3>
              <p className="text-sm text-slate-500 font-medium mb-4">{t.allAdjustDesc}</p>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {/* 1. ค้นหาด้วย Dropdown รายชื่อพนักงาน */}
                <div className="relative">
                  <span className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-xs">👤</span>
                  <select 
                    value={empAdjustSearch}
                    onChange={(e) => setEmpAdjustSearch(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 font-bold outline-none text-sm shadow-inner focus:border-indigo-400 cursor-pointer appearance-none text-slate-700" 
                  >
                    <option value="">{t.allLeavesFilterAll}</option>
                    {Array.from(new Set(allEmpAdjustments.map(a => a.employees?.full_name).filter(Boolean))).sort().map(name => (
                      <option key={name} value={name}>{lang === 'TH' ? `คุณ ${name}` : name}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400 text-[10px]">▼</div>
                </div>

                {/* 2. เลือกประเภท (สลับวันหยุด / แก้ไขเวลา) */}
                <div className="relative">
                  <span className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-xs">🔖</span>
                  <select 
                    value={allAdjustTypeFilter}
                    onChange={(e) => setAllAdjustTypeFilter(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 font-bold outline-none text-sm shadow-inner focus:border-indigo-400 cursor-pointer appearance-none text-slate-700" 
                  >
                    <option value="ALL">{t.allTypes}</option>
                    <option value="สลับวันหยุด">{t.adjustSwap}</option>
                    <option value="แก้ไขเวลา">{t.adjustEdit}</option>
                  </select>
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400 text-[10px]">▼</div>
                </div>

                {/* 3. เลือกสถานะ */}
                <div className="relative">
                  <span className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-xs">⚖️</span>
                  <select 
                    value={allAdjustStatusFilter}
                    onChange={(e) => setAllAdjustStatusFilter(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 font-bold outline-none text-sm shadow-inner focus:border-indigo-400 cursor-pointer appearance-none text-slate-700" 
                  >
                    <option value="ALL">{t.allStatus}</option>
                    <option value="รออนุมัติ">{t.pending}</option>
                    <option value="อนุมัติ">{t.approved}</option>
                    <option value="ไม่อนุมัติ">{t.rejected}</option>
                  </select>
                  <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-400 text-[10px]">▼</div>
                </div>
              </div>
            </div>

            {/* ตารางแสดงข้อมูล */}
            <div className="flex-1 overflow-x-auto overflow-y-auto w-full custom-scrollbar pr-2">
              <table className="w-full text-left border-separate border-spacing-y-2 min-w-[900px]">
                <thead className="text-xs text-slate-400 uppercase bg-slate-50 sticky top-0 z-10">
                  <tr>
                    <th className="p-4 rounded-l-xl">{t.thDate}</th>
                    <th className="p-4">{t.thEmp}</th>
                    <th className="p-4">{t.thType}</th>
                    <th className="p-4 w-1/3">{t.thDetail}</th>
                    <th className="p-4 text-right rounded-r-xl">{t.thStatus}</th>
                  </tr>
                </thead>
                <tbody>
                  {allEmpAdjustments
                    .filter(a => !empAdjustSearch || a.employees?.full_name === empAdjustSearch)
                    .filter(a => allAdjustTypeFilter === "ALL" || a.request_type === allAdjustTypeFilter)
                    .filter(a => allAdjustStatusFilter === "ALL" || a.status === allAdjustStatusFilter)
                    .length === 0 ? (
                      <tr><td colSpan="5" className="text-center py-10 text-slate-400 font-bold bg-slate-50 rounded-xl">ไม่พบประวัติการแจ้งปรับปรุง</td></tr>
                    ) : (
                      allEmpAdjustments
                        .filter(a => !empAdjustSearch || a.employees?.full_name === empAdjustSearch)
                        .filter(a => allAdjustTypeFilter === "ALL" || a.request_type === allAdjustTypeFilter)
                        .filter(a => allAdjustStatusFilter === "ALL" || a.status === allAdjustStatusFilter)
                        .map(a => (
                         <tr key={a.id} className="bg-white shadow-sm hover:shadow-md transition-all border border-slate-50 group">
                            {/* วันที่ยื่นเรื่อง */}
                            <td className="p-4 text-sm font-bold text-slate-400 rounded-l-xl whitespace-nowrap">
                              {new Date(a.created_at).toLocaleDateString(lang==='TH'?'th-TH':'en-US')} <br/>
                              <span className="text-[10px]">{new Date(a.created_at).toLocaleTimeString('th-TH').slice(0,5)} น.</span>
                            </td>
                            {/* ชื่อพนักงาน */}
                            <td className="p-4 text-sm font-black text-slate-800 whitespace-nowrap">{a.employees?.full_name || 'ไม่ทราบชื่อ'}</td>
                            {/* ประเภท */}
                            <td className="p-4 whitespace-nowrap">
                              <span className={`px-3 py-1.5 rounded-lg font-black text-xs border ${
                                a.request_type === 'สลับวันหยุด' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                              }`}>
                                {getTranslatedType(a.request_type)}
                              </span>
                            </td>
                            {/* รายละเอียด */}
                            <td className="p-4 text-[11px] font-medium text-slate-600">
                              <div className="line-clamp-2 hover:line-clamp-none transition-all duration-300 bg-slate-50 p-2.5 rounded-xl border border-slate-100 leading-relaxed shadow-sm">
                                {a.request_type === 'สลับวันหยุด' ? (
                                  <span>🔄 ขอสลับจาก <strong className="text-rose-500">{new Date(a.old_date).toLocaleDateString(lang==='TH'?'th-TH':'en-US')}</strong> เป็น <strong className="text-emerald-500">{new Date(a.new_date).toLocaleDateString(lang==='TH'?'th-TH':'en-US')}</strong></span>
                                ) : (
                                  <span>⏰ วันที่ {new Date(a.incident_date).toLocaleDateString(lang==='TH'?'th-TH':'en-US')} ({a.time_type}):<br/>แก้จาก <strong className="text-rose-500">{a.old_time?.slice(0,5)}</strong> เป็น <strong className="text-emerald-500">{a.new_time?.slice(0,5)}</strong></span>
                                )}
                                {a.reason && <span className="block text-[10px] text-slate-400 mt-1.5 italic border-t border-slate-200 pt-1">เหตุผล: {a.reason}</span>}
                              </div>
                            </td>
                            {/* สถานะ */}
                            <td className="p-4 text-right rounded-r-xl whitespace-nowrap">
                              <span className={`text-[11px] px-3 py-1.5 rounded-full font-black ${a.status==='อนุมัติ'?'bg-emerald-100 text-emerald-600':a.status==='รออนุมัติ'?'bg-amber-100 text-amber-600':'bg-rose-100 text-rose-600'}`}>
                                {getTranslatedStatus(a.status)}
                              </span>
                            </td>
                         </tr>
                      ))
                    )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

{/* 💸 VIEW: PAYROLL (ระบบเงินเดือนและสลิป) */}
      {currentView === "payroll" && (
        <div className="px-4 md:px-8 pb-8 z-10 flex-1 flex flex-col w-full mt-4 animate-fade-in overflow-hidden">
          <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-6 md:p-8 shadow-sm border border-white flex-1 flex flex-col overflow-hidden">
            
            <div className="mb-6 border-b border-slate-100 pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
              <div>
                <h3 className="font-black text-slate-800 text-xl flex items-center gap-2">💸 {user?.role === 'admin' || user?.role === 'ceo' ? t.payrollTitle : t.myPayrollTitle}</h3>
                <p className="text-sm text-slate-500 font-medium mt-1">{user?.role === 'admin' || user?.role === 'ceo' ? t.payrollDesc : 'ดูรายละเอียดและรายรับสุทธิของคุณอย่างโปร่งใส'}</p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                {/* ปุ่มดูประวัติยอดขายของพนักงาน (โชว์เฉพาะคนที่มีตำแหน่งฝ่ายขาย/ไลฟ์สด) */}
                {(user?.role !== 'admin' && user?.role !== 'ceo' && 
                  ['ไลฟ์', 'live', 'สตรีม', 'sale', 'เซล'].some(kw => (user?.position || '').toLowerCase().includes(kw))
                ) && (
                  <button onClick={() => setIsMySalesModalOpen(true)} className="w-full sm:w-auto bg-pink-500 hover:bg-pink-600 text-white px-5 py-3 rounded-xl font-black text-sm shadow-md shadow-pink-200 transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5">
                    📈 ดูประวัติยอดขายของฉัน
                  </button>
                )}

                {/* ปุ่มเพิ่มสลิปของ Admin */}
                {(user?.role === 'admin' || user?.role === 'ceo') && (
                  <button onClick={() => setIsPayrollModalOpen(true)} className="w-full sm:w-auto bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-3 rounded-xl font-black text-sm shadow-md shadow-emerald-200 transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5">
                    ➕ เพิ่มสลิป / ตัดรอบบิล
                  </button>
                )}
                
              </div>
            </div>

            {/* มุมมอง Admin/CEO (จัดการเงินเดือนทุกคน) */}
              {(user?.role === 'admin' || user?.role === 'ceo') ? (
                <div className="flex flex-col flex-1 h-full w-full">
                  
                  {/* ✨ ส่วนหัวตาราง: มีทั้ง "Dropdown เลือกชื่อ" และ "ช่องเลือกเดือน" */}
                  <div className="mb-4 flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-4 rounded-2xl border border-slate-100 shadow-sm gap-4 shrink-0">
                    <div className="text-sm font-black text-slate-800 flex items-center gap-2">
                      📋 สรุปรายการเงินเดือน
                    </div>
                    
                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
                      
                      {/* 1. Dropdown เลือกชื่อพนักงาน (ไม่ต้องพิมพ์ กดเลือกได้เลย) */}
                      <div className="w-full sm:w-64">
                        <select
                          value={payrollSearchKeyword}
                          onChange={(e) => setPayrollSearchKeyword(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-bold text-slate-700 outline-none focus:border-indigo-500 shadow-sm transition-all cursor-pointer"
                        >
                          <option value="">-- พนักงานทั้งหมด --</option>
                          {employees.map(emp => (
                            <option key={emp.id} value={emp.full_name}>
                              {emp.full_name}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* 2. ช่องเลือกเดือน (รอบบิล) */}
                      <div className="flex items-center gap-2 w-full sm:w-auto">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-widest hidden sm:block whitespace-nowrap">เดือน:</label>
                        <input
                          type="month"
                          value={payrollFilterMonth}
                          onChange={(e) => setPayrollFilterMonth(e.target.value)}
                          className="w-full sm:w-auto bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 font-black text-indigo-600 outline-none focus:border-indigo-500 shadow-sm transition-all cursor-pointer"
                        />
                      </div>
                    </div>
                  </div>

                  {/* ✨ ตารางแสดงข้อมูลที่ผ่านการกรองแล้ว */}
                  <div className="flex-1 overflow-x-auto overflow-y-auto w-full custom-scrollbar pr-2">
                    <table className="w-full text-left border-separate border-spacing-y-2 min-w-[1200px]">
                      <thead className="text-[11px] md:text-xs text-slate-400 uppercase bg-slate-50 sticky top-0 z-10 shadow-sm">
                        <tr>
                          <th className="p-4 rounded-l-xl">{t.thEmp}</th>
                          <th className="p-4 text-center">{t.thBaseSalary}</th>
                          <th className="p-4 text-center text-indigo-500">คอมมิชชัน/โบนัส</th>
                          <th className="p-4 text-center text-rose-500">หักวันลา</th>
                          <th className="p-4 text-center text-rose-500">หักสาย</th>
                          <th className="p-4 text-center text-rose-500">หักขาด</th>
                          <th className="p-4 text-center text-rose-500">หักอื่นๆ</th>
                          <th className="p-4 text-center text-emerald-600">{t.thNetSalary}</th>
                          <th className="p-4 text-right rounded-r-xl">จัดการ</th>
                        </tr>
                      </thead>
                      <tbody>
                        {payrollData
                          .filter(slip => slip.month === payrollFilterMonth)
                          .filter(slip => {
                            if (!payrollSearchKeyword) return true; // ถ้าเลือก "พนักงานทั้งหมด" ให้โชว์ทุกคน
                            return slip.employees?.full_name === payrollSearchKeyword; // กรองให้ตรงกับชื่อใน Dropdown
                          }).length === 0 ? (
                          <tr>
                            <td colSpan="9" className="text-center p-10 text-slate-400 font-bold bg-slate-50 rounded-xl">ไม่พบข้อมูลสลิปที่ค้นหา</td>
                          </tr>
                        ) : (
                          payrollData
                            .filter(slip => slip.month === payrollFilterMonth)
                            .filter(slip => {
                              if (!payrollSearchKeyword) return true;
                              return slip.employees?.full_name === payrollSearchKeyword;
                            })
                            .map((slip) => (
                              <tr key={slip.id} className="bg-white shadow-sm hover:shadow-md transition-all border border-slate-50 group">
                                <td className="p-4 font-black text-slate-800 rounded-l-xl whitespace-nowrap">
                                  <div className="flex flex-col">
                                    <span className="text-sm">{slip.employees?.full_name || 'ไม่ทราบชื่อ'}</span>
                                    <span className="text-[10px] text-slate-400 font-bold tracking-widest uppercase mt-0.5">รหัส: {slip.employees?.employee_code || '-'}</span>
                                  </div>
                                </td>
                                <td className="p-4 text-center font-bold text-slate-600">฿{Number(slip.base_salary).toLocaleString()}</td>
                                <td className="p-4 text-center font-bold text-indigo-600">
                                  ฿{Number(slip.commission || 0).toLocaleString()}
                                  {slip.bonus > 0 ? <span className="text-[10px] bg-indigo-50 px-1.5 py-0.5 rounded text-indigo-500 ml-1 inline-block mt-1">+฿{Number(slip.bonus).toLocaleString()} โบนัส</span> : ''}
                                </td>
                                <td className="p-4 text-center font-bold text-rose-500">{Number(slip.leave_deduction) > 0 ? `- ฿${Number(slip.leave_deduction).toLocaleString()}` : '-'}</td>
                                <td className="p-4 text-center font-bold text-rose-500">{Number(slip.late_deduction) > 0 ? `- ฿${Number(slip.late_deduction).toLocaleString()}` : '-'}</td>
                                <td className="p-4 text-center font-bold text-rose-500">{Number(slip.absence_deduction) > 0 ? `- ฿${Number(slip.absence_deduction).toLocaleString()}` : '-'}</td>
                                <td className="p-4 text-center font-bold text-rose-500">{Number(slip.deductions) > 0 ? `- ฿${Number(slip.deductions).toLocaleString()}` : '-'}</td>
                                <td className="p-4 text-center text-emerald-600 font-black text-lg bg-emerald-50/30">฿{Number(slip.net_salary).toLocaleString()}</td>
                                <td className="p-4 text-right rounded-r-xl">
                                  <div className="flex justify-end items-center gap-1.5 ml-auto">
                                    <button onClick={() => handlePrintSlip(slip)} className="px-3 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-emerald-500 hover:text-white transition-all shadow-sm" title="พิมพ์สลิป">
                                      🖨️
                                    </button>
                                    <button onClick={() => handleDeleteSlip(slip.id)} className="px-3 py-2 bg-slate-100 text-slate-600 rounded-lg hover:bg-rose-500 hover:text-white transition-all shadow-sm" title="ลบสลิปนี้ออกจากฐานข้อมูล">
                                      🗑️
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
              /* มุมมอง พนักงานทั่วไป (ดูสลิปตัวเองแบบ Card แยกรายละเอียดยิบ) */
              <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 pb-2">
                 {mySlips.length === 0 ? (
                   <div className="bg-slate-50 border border-slate-100 p-10 rounded-3xl text-center shadow-sm max-w-md mx-auto mt-10">
                      <span className="text-6xl block mb-4 animate-bounce">📄</span>
                      <p className="text-slate-500 font-bold text-base">ยังไม่มีประวัติสลิปเงินเดือน</p>
                   </div>
                 ) : (
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                     {mySlips.map(slip => (
                       <div key={slip.id} className="bg-gradient-to-br from-white to-slate-50 border border-slate-200 p-6 rounded-3xl shadow-sm hover:shadow-lg transition-all group relative overflow-hidden">
                         <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none group-hover:scale-150 transition-transform"></div>
                         
                         <div className="flex justify-between items-start mb-1">
                           <h4 className="text-lg font-black text-slate-800">รอบ: {slip.month ? (()=>{ const [y, m] = slip.month.split('-'); return `${["มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน", "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"][parseInt(m, 10) - 1]} ${parseInt(y, 10) + 543}`; })() : "-"}</h4>
                           <span className="text-[10px] bg-emerald-100 text-emerald-600 px-2 py-1 rounded font-black tracking-widest uppercase">PAID</span>
                         </div>
                         <p className="text-[10px] font-bold text-slate-400 mb-4 border-b border-slate-100 pb-4">บันทึกเมื่อ: {new Date(slip.created_at).toLocaleDateString('th-TH')}</p>
                         
                         {/* ✨ แยกรายการหักแบบละเอียดให้พนักงานเห็นโปร่งใส */}
                         <div className="space-y-2.5 mb-6 bg-white p-4 rounded-2xl border border-slate-100 shadow-inner">
                           <div className="flex justify-between text-xs font-bold text-slate-500"><span>เงินเดือนพื้นฐาน:</span> <span>฿{Number(slip.base_salary).toLocaleString()}</span></div>
                           <div className="flex justify-between text-xs font-bold text-indigo-500"><span>คอมมิชชัน & โบนัส:</span> <span>+ ฿{(Number(slip.commission) + Number(slip.bonus)).toLocaleString()}</span></div>
                           
                           {Number(slip.leave_deduction) > 0 && <div className="flex justify-between text-xs font-bold text-rose-500"><span>หักลาไม่รับเงินเดือน:</span> <span>- ฿{Number(slip.leave_deduction).toLocaleString()}</span></div>}
                           {Number(slip.late_deduction) > 0 && <div className="flex justify-between text-xs font-bold text-rose-500"><span>หักมาสาย:</span> <span>- ฿{Number(slip.late_deduction).toLocaleString()}</span></div>}
                           {Number(slip.absence_deduction) > 0 && <div className="flex justify-between text-xs font-bold text-rose-500"><span>หักขาดงาน:</span> <span>- ฿{Number(slip.absence_deduction).toLocaleString()}</span></div>}
                           {Number(slip.deductions) > 0 && <div className="flex justify-between text-xs font-bold text-rose-500"><span>รายการหักอื่นๆ:</span> <span>- ฿{Number(slip.deductions).toLocaleString()}</span></div>}
                         </div>

                         <div className="flex justify-between items-end bg-slate-800 p-4 rounded-2xl text-white">
                           <div>
                             <p className="text-[9px] font-bold text-slate-300 uppercase tracking-widest mb-0.5">รับสุทธิ (Net Salary)</p>
                             <p className="text-2xl font-black text-emerald-400 tabular-nums">฿{Number(slip.net_salary).toLocaleString()}</p>
                           </div>
                           <button onClick={() => handlePrintSlip(slip)} className="w-10 h-10 bg-white/10 text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-md group-hover:bg-emerald-500" title="พิมพ์สลิปเงินเดือน">
                             🖨️
                           </button>
                         </div>
                       </div>
                     ))}
                   </div>
                 )}
              </div>
            )}

          </div>
        </div>
      )}

{/* 🔐 VIEW: ROLE PERMISSIONS (กำหนดสิทธิ์การมองเห็นเมนูแบบรายบุคคล) */}
      {currentView === "settings_permissions" && user?.role === 'admin' && (
        <div className="px-4 md:px-8 pb-8 z-10 flex-1 flex flex-col w-full mt-4 animate-fade-in overflow-hidden">
          <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-6 md:p-8 shadow-sm border border-white flex-1 flex flex-col overflow-hidden">
            
            <div className="mb-6 border-b border-slate-100 pb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
              <div>
                <h3 className="font-black text-slate-800 text-xl flex items-center gap-2">🔐 {t.settingsPermissions}</h3>
                <p className="text-sm text-slate-500 font-medium mt-1">{t.permDesc}</p>
              </div>
              <button 
                onClick={handleSavePermissions}
                disabled={isSavingPerms || !selectedPermEmpId}
                className="w-full md:w-auto px-8 py-3 bg-slate-800 text-white rounded-xl font-black text-sm shadow-lg hover:bg-slate-900 transition-transform hover:-translate-y-0.5 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSavingPerms ? `⏳ ${t.saving}` : `💾 ${t.btnSavePerm}`}
              </button>
            </div>

            <div className="flex-1 flex flex-col overflow-hidden">
              {/* Dropdown เลือกพนักงาน */}
              <div className="mb-6 shrink-0 max-w-xl mx-auto w-full">
                <label className="block text-xs font-bold text-slate-700 mb-2">{t.labelSelectEmp}</label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-xl">👩‍💻</span>
                  <select 
                    value={selectedPermEmpId}
                    onChange={(e) => setSelectedPermEmpId(e.target.value)}
                    className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl pl-12 pr-4 py-3 font-bold outline-none text-sm focus:border-indigo-400 cursor-pointer text-slate-700 shadow-inner" 
                  >
                    <option value="">{t.selectEmp}</option>
                    {employees.map(emp => (
                          <option key={emp.id} value={emp.id}>
                            {emp.employee_code} - {emp.full_name} (ตำแหน่ง: {emp.position || '-'} | {emp.salary_type === 'Part-time' ? 'Part-time' : 'Full-time'})
                          </option>
                        ))}
                  </select>
                </div>
              </div>

              {/* List เมนูพร้อมสวิตช์เปิดปิด */}
              <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 pb-4 space-y-3">
                {!selectedPermEmpId ? (
                  <div className="text-center py-20 text-slate-400 font-bold bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">{t.permSelectPrompt}</div>
                ) : (
                  masterMenuList.map(menu => {
                    const isChecked = currentEmpMenus.includes(menu.id);
                    return (
                      <div key={menu.id} className="bg-white border border-slate-100 rounded-2xl p-4 md:p-5 flex items-center justify-between hover:border-indigo-100 hover:shadow-sm transition-all group cursor-pointer" onClick={() => handleToggleMenu(menu.id)}>
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-xl shadow-inner group-hover:scale-110 transition-transform">
                            {menu.icon}
                          </div>
                          <div>
                            <h4 className="font-black text-slate-700">{menu.label}</h4>
                            <p className="text-[10px] md:text-xs text-slate-400 font-bold mt-0.5">รหัส: {menu.id}</p>
                          </div>
                        </div>
                        
                        {/* iOS Toggle Switch */}
                        <div className={`w-14 h-8 rounded-full flex items-center p-1 transition-colors duration-300 ${isChecked ? 'bg-emerald-500' : 'bg-slate-200'}`}>
                          <div className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ${isChecked ? 'translate-x-6' : 'translate-x-0'}`}></div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>

          </div>
        </div>
      )}

{/* 💬 VIEW: LINE OA SETTINGS (ตั้งค่าผู้รับการแจ้งเตือน) */}
      {currentView === "settings_line_oa" && user?.role === 'admin' && (
        <div className="px-4 md:px-8 pb-8 z-10 flex-1 flex flex-col w-full mt-4 animate-fade-in overflow-hidden">
          <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-6 md:p-8 shadow-sm border border-white max-w-3xl mx-auto w-full">
            
            <div className="mb-6 border-b border-slate-100 pb-6 flex items-center gap-4">
              <div className="w-14 h-14 bg-[#00B900]/10 rounded-2xl flex items-center justify-center text-[#00B900] text-3xl shadow-inner">
                💬
              </div>
              <div>
                <h3 className="font-black text-slate-800 text-xl">{t.settingsLineOA}</h3>
                <p className="text-sm text-slate-500 font-medium mt-1">{t.lineDesc}</p>
              </div>
            </div>

            <form onSubmit={handleSaveLineSettings} className="space-y-6">
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200">
                <label className="block text-sm font-black text-slate-700 mb-2">{t.labelLineId}</label>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="relative flex-1">
                    <span className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-slate-400">ID:</span>
                    <input 
                      type="text" 
                      required 
                      value={lineAdminId}
                      onChange={(e) => setLineAdminId(e.target.value)}
                      placeholder="เช่น C0df0123907f46..." 
                      className="w-full bg-white border-2 border-slate-200 rounded-xl pl-12 pr-4 py-3 font-bold outline-none text-slate-700 shadow-inner focus:border-[#00B900] transition-colors" 
                    />
                  </div>
                  <button 
                    type="submit" 
                    disabled={isSavingLine}
                    className="px-8 py-3 bg-[#00B900] text-white rounded-xl font-black text-sm shadow-lg hover:bg-[#009900] hover:-translate-y-0.5 transition-all disabled:opacity-50 whitespace-nowrap flex items-center justify-center gap-2"
                  >
                    {isSavingLine ? '⏳ กำลังบันทึก...' : `💾 ${t.btnSaveLine}`}
                  </button>
                </div>
                <p className="text-xs text-slate-400 mt-4 font-bold flex items-start gap-1">
                  <span className="text-amber-500">⚠️</span>
                  <span><strong>คำแนะนำ:</strong> ID ที่ขึ้นต้นด้วย "C" คือ Group ID (ใช้สำหรับรับแจ้งเตือนในกลุ่ม) ส่วน ID ที่ขึ้นต้นด้วย "U" คือ User ID (ใช้สำหรับรับแจ้งเตือนส่วนตัว)</span>
                </p>
              </div>
            </form>

{/* 💾 SAFE ZONE: สำรองข้อมูลระบบ */}
                  <div className="mt-8 pt-8 border-t-2 border-slate-100 animate-fade-in">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-indigo-100 rounded-2xl flex items-center justify-center text-indigo-500 text-2xl shadow-inner">
                        💾
                      </div>
                      <div>
                        <h4 className="font-black text-slate-800 text-lg">สำรองข้อมูลระบบ (Data Backup)</h4>
                        <p className="text-xs text-slate-500 font-bold">ดาวน์โหลดข้อมูลทั้งหมดเก็บไว้ในเครื่องคอมพิวเตอร์ของคุณ</p>
                      </div>
                    </div>
                    
                    <div className="bg-indigo-50 border border-indigo-100 p-6 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm hover:shadow-md transition-shadow mb-8">
                      <div>
                        <h5 className="font-black text-indigo-700 text-base">ส่งออกข้อมูลเป็นไฟล์ JSON</h5>
                        <p className="text-xs text-indigo-500/80 font-bold mt-1 max-w-sm leading-relaxed">
                          ดาวน์โหลดข้อมูล <span className="font-black text-indigo-600">พนักงาน, เงินเดือน, เข้างาน, การลา และยอดขาย</span> ทั้งหมดในระบบ เก็บไว้เป็นไฟล์สำรองฉุกเฉิน
                        </p>
                      </div>
                      <button 
                        onClick={handleBackupData} 
                        className="w-full sm:w-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black text-sm shadow-lg shadow-indigo-200 transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5"
                      >
                        📥 ดาวน์โหลดไฟล์ Backup
                      </button>
                    </div>
                  </div>


{/* 🚨 DANGER ZONE: ล้างข้อมูลระบบ */}
                  <div className="mt-8 pt-8 border-t-2 border-dashed border-rose-200 animate-fade-in">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-12 h-12 bg-rose-100 rounded-2xl flex items-center justify-center text-rose-500 text-2xl shadow-inner">
                        🚨
                      </div>
                      <div>
                        <h4 className="font-black text-slate-800 text-lg">โซนอันตราย (Danger Zone)</h4>
                        <p className="text-xs text-slate-500 font-bold">พื้นที่สำหรับผู้ดูแลระบบ จัดการข้อมูลทดสอบ</p>
                      </div>
                    </div>
                    
                    <div className="bg-rose-50 border border-rose-200 p-6 rounded-2xl flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shadow-sm hover:shadow-md transition-shadow">
                      <div>
                        <h5 className="font-black text-rose-700 text-base">ล้างข้อมูลทดสอบทั้งหมด</h5>
                        <p className="text-xs text-rose-500/80 font-bold mt-1 max-w-sm leading-relaxed">
                          ลบข้อมูล <span className="text-rose-600 underline">สลิปเงินเดือน, ประวัติเข้างาน และการลา</span> ทั้งหมดออกจากระบบถาวร (รายชื่อพนักงานและการตั้งค่าจะยังคงอยู่)
                        </p>
                      </div>
                      <button 
                        onClick={handleResetTestData} 
                        className="w-full sm:w-auto px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-black text-sm shadow-lg shadow-rose-200 transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5"
                      >
                        🧹 เคลียร์ข้อมูลทดสอบ
                      </button>
                    </div>
                  </div>
          </div>
        </div>
      )}

{/* 👥 VIEW: EMPLOYEE MANAGEMENT (หน้าจัดการพนักงาน - อัปเกรด Mobile Responsive 100%) */}
      {currentView === "employees" && (
        <div className="px-4 md:px-8 pb-8 z-10 flex-1 flex flex-col w-full mt-4 animate-fade-in">
          <div className="bg-white/80 backdrop-blur-xl rounded-[1.5rem] md:rounded-[2rem] p-5 md:p-8 shadow-sm border border-white flex-1 flex flex-col w-full">
            
            {/* 1. Header & Search (แก้ให้เรียงลงมาบนมือถือ ปุ่มไม่โดนตัด) */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-4 md:mb-6 border-b border-slate-100 pb-5 md:pb-6">
              <div>
                <h3 className="font-black text-slate-800 text-xl md:text-2xl flex items-center gap-2">👥 {t.empTitle}</h3>
                <p className="text-xs md:text-sm text-slate-500 font-medium mt-1">จัดการข้อมูล, รหัสผ่าน และกะเวลาเข้างานของพนักงาน</p>
              </div>
              {/* ✨ เปลี่ยนจาก flex แนวนอนเป็น flex-col บนมือถือ */}
              <div className="flex flex-col sm:flex-row w-full lg:w-auto gap-3">
                <input 
                  type="text" 
                  placeholder={t.empSearch} 
                  value={empSearch} 
                  onChange={(e) => setEmpSearch(e.target.value)} 
                  className="w-full sm:w-64 bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 sm:py-2.5 font-bold outline-none text-sm shadow-inner focus:border-purple-400" 
                />
                <button 
                  onClick={() => { 
                    setEditingEmpId(null);
                    setEmpForm({ employee_code: "", full_name: "", name_en: "", username: "", password: "", phone_number: "", position: "Full-Time", shift_start: "08:00", shift_end: "17:00" });
                    setIsEmpModalOpen(true); 
                  }} 
                  className="w-full sm:w-auto bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-5 py-3 sm:py-2.5 rounded-xl font-black text-sm shadow-md hover:scale-105 transition-transform flex items-center justify-center gap-2"
                >
                  <span className="text-lg leading-none">+</span> {t.empAddBtn.replace('➕', '').trim()}
                </button>
              </div>
            </div>

            {/* 2. Employee List (ระบบ Grid/Flex Card แทน Table) */}
            <div className="flex-1 overflow-y-auto w-full pr-1 md:pr-2">
              
              {/* ✨ Header ของตาราง (ซ่อนบนมือถือ โชว์เฉพาะบนคอม) */}
              <div className="hidden md:grid grid-cols-12 gap-4 text-xs font-bold text-slate-400 uppercase bg-slate-50 p-4 rounded-xl mb-3 sticky top-0 z-10 border border-slate-100">
                <div className="col-span-4">{t.thEmpProfile}</div>
                <div className="col-span-3">{t.thEmpPosition}</div>
                <div className="col-span-3">{t.thEmpContact}</div>
                <div className="col-span-2 text-right">{t.thEmpManage}</div>
              </div>

              {/* ✨ Body รายชื่อพนักงาน (แปลงร่างเป็นการ์ดบนมือถือ) */}
              <div className="space-y-3">
                {employees.filter(e => (e.full_name || '').includes(empSearch) || (e.employee_code || '').includes(empSearch) || (e.name_en && e.name_en.toLowerCase().includes(empSearch.toLowerCase()))).length === 0 ? (
                  <div className="text-center py-10 text-slate-400 font-bold bg-slate-50 rounded-2xl border border-slate-100">ไม่มีข้อมูลพนักงาน</div>
                ) : (
                  employees.filter(e => (e.full_name || '').includes(empSearch) || (e.employee_code || '').includes(empSearch) || (e.name_en && e.name_en.toLowerCase().includes(empSearch.toLowerCase()))).map((emp) => (
                    <div key={emp.id} className="bg-white border border-slate-100 shadow-sm hover:shadow-md hover:border-purple-200 transition-all rounded-2xl p-4 md:p-4 flex flex-col md:grid md:grid-cols-12 md:gap-4 md:items-center gap-4 relative overflow-hidden group">
                      
                      {/* ข้อมูลพนักงาน (ชื่อไทย-อังกฤษ-รหัส) */}
                      <div className="col-span-4 flex items-center gap-3 md:gap-4">
                        <div className="w-12 h-12 flex-shrink-0 bg-gradient-to-tr from-pink-100 to-purple-100 text-purple-600 rounded-full flex items-center justify-center font-black text-xl shadow-inner border border-white">
                          {(emp.full_name || 'U').charAt(0)}
                        </div>
                        <div className="flex flex-col overflow-hidden">
                          <span className="font-black text-sm md:text-base text-slate-800 truncate">{emp.full_name}</span>
                          {emp.name_en && <span className="text-[10px] md:text-xs font-bold text-slate-400 uppercase truncate">{emp.name_en}</span>}
                          <span className="text-[10px] text-pink-500 font-bold bg-pink-50 px-2 py-0.5 rounded-md w-fit mt-1 border border-pink-100">ID: {emp.employee_code}</span>
                        </div>
                      </div>

                      {/* เส้นคั่นบนมือถือ */}
                      <div className="h-px bg-slate-50 w-full md:hidden"></div>

                      {/* ตำแหน่ง & กะทำงาน */}
                      <div className="col-span-3 flex flex-row md:flex-col justify-between md:justify-center items-center md:items-start gap-2">
                        <span className="font-black text-[11px] md:text-sm text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100">{emp.position || 'ไม่ระบุตำแหน่ง'}</span>
                        <span className="text-[11px] md:text-xs font-bold text-slate-500 flex items-center gap-1 bg-slate-50 md:bg-transparent px-2 md:px-0 py-1 md:py-0 rounded-md">
                          ⏰ {emp.shift_start ? emp.shift_start.slice(0,5) : '08:00'} - {emp.shift_end ? emp.shift_end.slice(0,5) : '17:00'} น.
                        </span>
                      </div>

                      {/* เส้นคั่นบนมือถือ */}
                      <div className="h-px bg-slate-50 w-full md:hidden"></div>

                      {/* ข้อมูลติดต่อ */}
                      <div className="col-span-3 flex flex-row md:flex-col justify-between md:justify-center items-center md:items-start gap-2">
                        <span className="text-[11px] md:text-xs font-bold text-slate-600 flex items-center gap-1.5"><span className="text-sm">📞</span> {emp.phone_number || '-'}</span>
                        <span className="text-[10px] md:text-[11px] font-bold text-slate-400 flex items-center gap-1.5"><span className="text-sm">👤</span> {emp.username || '-'}</span>
                      </div>

                      {/* จัดการ (ปุ่มแก้ไข/ลบ) */}
                      <div className="col-span-2 flex gap-2 justify-end mt-2 md:mt-0">
                        <button 
                          onClick={() => { 
                            setEditingEmpId(emp.id);
                            setEmpForm({ 
                            employee_code: emp.employee_code, 
                            full_name: emp.full_name, 
                            name_en: emp.name_en || "", 
                            username: emp.username, 
                            password: "", // ✨ ปล่อยว่างไว้ ไม่ต้องดึงรหัสเก่ามาโชว์
                            phone_number: emp.phone_number || "", 
                            position: emp.position || "Full-Time", 
                            shift_start: emp.shift_start ? emp.shift_start.slice(0,5) : "08:00", 
                            shift_end: emp.shift_end ? emp.shift_end.slice(0,5) : "17:00", 
                            require_password_change: emp.require_password_change || false,
                            base_salary: emp.base_salary || 0,
                            hourly_rate: emp.hourly_rate || 0,
                            role: emp.role || "employee"
                          });
                            setIsEmpModalOpen(true); 
                          }} 
                          className="flex-1 md:flex-none px-4 md:px-3 py-2.5 md:py-1.5 bg-amber-50 text-amber-600 border border-amber-100 rounded-xl md:rounded-lg font-black text-xs hover:bg-amber-100 transition-colors flex justify-center items-center gap-1"
                        >
                          📝 <span className="md:hidden">แก้ไข</span>
                        </button>
                        
                        {emp.id !== user.id && (
                          <button 
                            onClick={() => handleDeleteEmployee(emp.id, emp.full_name)} 
                            className="flex-1 md:flex-none px-4 md:px-3 py-2.5 md:py-1.5 bg-rose-50 text-rose-600 border border-rose-100 rounded-xl md:rounded-lg font-black text-xs hover:bg-rose-100 transition-colors flex justify-center items-center gap-1"
                          >
                            🗑️ <span className="md:hidden">ลบ</span>
                          </button>
                        )}
                      </div>

                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

{/* 🎯 VIEW: MANAGE LEAVE QUOTAS (โฉมใหม่: จัดการประเภทการลาได้อิสระ) */}
      {currentView === "settings_quotas" && (user?.role === 'admin' || user?.role === 'ceo') && (
        <div className="px-4 md:px-8 pb-8 z-10 flex-1 flex flex-col w-full mt-4 animate-fade-in">
          <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-6 md:p-8 shadow-sm border border-white flex-1 flex flex-col overflow-hidden">
            
            <div className="mb-6 border-b border-slate-100 pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="font-black text-slate-800 text-xl flex items-center gap-2">🎯 {t.quotaTitle}</h3>
                <p className="text-sm text-slate-500 font-medium mt-1">{t.quotaDesc}</p>
              </div>
              <button 
                onClick={handleAddLeaveType}
                className="w-full sm:w-auto px-6 py-3 bg-purple-600 text-white rounded-2xl font-black text-sm transition-all shadow-lg shadow-purple-200 hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
              >
                🚀 {t.btnAddLeaveType}
              </button>
            </div>

            <div className="flex-1 overflow-x-auto overflow-y-auto w-full custom-scrollbar pr-2 pb-2">
              <table className="w-full text-left border-separate border-spacing-y-2 min-w-[1100px]">
                <thead className="text-[11px] text-slate-400 uppercase bg-slate-50 sticky top-0 z-10 shadow-sm">
                  <tr>
                    <th className="p-4 rounded-l-xl w-64 bg-slate-50">{t.thEmpName}</th>
                    {/* Render หัวคอลัมน์ตามประเภทการลาทั้งหมดที่มี + ปุ่มลบ (แบบเห็นชัด 100% ไม่ต้องรอ Hover) */}
                    {globalLeaveTypes.map((type, idx) => (
                      <th key={idx} className="p-4 text-center font-bold tracking-wider relative bg-slate-50 border-x border-slate-100/50 min-w-[100px]">
                         <div className="flex flex-col items-center gap-1">
                           <span className="text-base">{getLeaveIcon(type)}</span>
                           <span className="text-[10px] sm:text-xs whitespace-nowrap">{getTranslatedType(type)}</span>
                           
                           {/* ❌ ปุ่มลบ: บังคับโชว์ตลอดเวลา สีแดงเห็นชัดๆ เลยครับพี่ */}
                           {/* ระบบจะกันไม่ให้ลบประเภทหลัก (ป่วย/กิจ/พักร้อน) ไว้ให้แล้วในฟังก์ชันครับ */}
                           <button 
                            onClick={(e) => { e.stopPropagation(); handleDeleteLeaveType(type); }}
                            className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white rounded-full flex items-center justify-center text-[10px] shadow-lg hover:bg-rose-700 transition-all z-10 border border-white"
                            title="ลบประเภทการลานี้"
                           >
                            ✕
                           </button>
                         </div>
                      </th>
                    ))}
                    <th className="p-4 text-center rounded-r-xl w-32 bg-slate-50">{t.thManage}</th>
                  </tr>
                </thead>
                <tbody>
                  {employees.map(emp => {
                    const empBalances = allLeaveBalances.filter(b => b.employee_id === emp.id);
                    return (
                       <tr key={emp.id} className="bg-white shadow-sm hover:shadow-md transition-all border border-slate-50 group">
                          <td className="p-4 font-black text-slate-800 rounded-l-xl whitespace-nowrap">
                            <div className="flex flex-col">
                              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{emp.employee_code}</span>
                              <span className="text-sm text-indigo-600 font-black">{lang === 'EN' && emp.name_en ? emp.name_en : `คุณ${emp.full_name}`}</span>
                            </div>
                          </td>
                          {globalLeaveTypes.map((type, idx) => {
                            const found = empBalances.find(b => b.leave_type === type);
                            const days = found ? found.total_days : 0;
                            return (
                              <td key={idx} className="p-4 text-center text-sm font-bold text-slate-600">
                                {days > 0 ? (
                                  <span className="bg-slate-50 px-3 py-1.5 rounded-lg text-slate-800 border border-slate-100 font-black">{days} วัน</span>
                                ) : (
                                  <span className="text-slate-300">-</span>
                                )}
                              </td>
                            );
                          })}
                          <td className="p-4 text-center rounded-r-xl">
                            <button 
                              onClick={() => handleOpenEditQuota(emp)}
                              className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white text-[11px] font-black rounded-xl shadow-sm hover:shadow-md transition-all active:scale-95"
                            >
                              ⚙️ {t.btnEditQuota}
                            </button>
                          </td>
                       </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

          </div>
        </div>
      )}


      </div>

      {/* 🎯 MODAL: แก้ไขโควต้าพนักงาน (Popup) */}
      {editingQuotaEmp && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setEditingQuotaEmp(null)}></div>
          
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl flex flex-col relative z-10 animate-pop-in border border-white/50 max-h-[90vh]">
            <div className="p-5 md:p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50 rounded-t-[2rem] shrink-0">
              <div>
                <h3 className="font-black text-slate-800 text-lg flex items-center gap-2">⚙️ {t.btnEditQuota}</h3>
                <p className="text-sm text-indigo-600 font-bold mt-1">
                  {editingQuotaEmp.emp.employee_code} - {lang === 'EN' && editingQuotaEmp.emp.name_en ? editingQuotaEmp.emp.name_en : `คุณ${editingQuotaEmp.emp.full_name}`}
                </p>
              </div>
              <button onClick={() => setEditingQuotaEmp(null)} className="w-8 h-8 flex items-center justify-center bg-slate-200 text-slate-500 rounded-full hover:bg-rose-500 hover:text-white font-bold transition-colors">✕</button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
              <form id="quotaForm" onSubmit={handleSaveQuotaModal} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {globalLeaveTypes.map((type, idx) => (
                  <div key={idx} className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex items-center justify-between shadow-sm hover:border-indigo-300 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{getLeaveIcon(type)}</div>
                      <div>
                        <h4 className="font-black text-slate-700 text-sm">{getTranslatedType(type)}</h4>
                        <p className="text-[10px] font-bold text-slate-400">วัน/ปี</p>
                      </div>
                    </div>
                    <input 
                      type="number" min="0" 
                      value={editingQuotaEmp.form[type]} 
                      onChange={(e) => setEditingQuotaEmp({ ...editingQuotaEmp, form: { ...editingQuotaEmp.form, [type]: e.target.value }})} 
                      className="w-20 bg-white border-2 border-slate-200 rounded-xl px-2 py-2 font-black text-center text-slate-800 outline-none focus:border-indigo-500 shadow-inner text-base" 
                    />
                  </div>
                ))}
              </form>
            </div>

            <div className="p-5 border-t border-slate-100 bg-white rounded-b-[2rem] flex justify-end gap-3 shrink-0">
              <button type="button" onClick={() => setEditingQuotaEmp(null)} className="px-6 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-200 transition-colors">{t.modalCancel}</button>
              <button type="submit" form="quotaForm" disabled={isSavingQuota} className="px-8 py-3 bg-slate-800 text-white rounded-xl font-black text-sm hover:bg-slate-900 transition-transform hover:-translate-y-0.5 shadow-lg disabled:opacity-50 flex items-center gap-2">
                {isSavingQuota ? `⏳ ${t.quotaSavingBtn}` : `💾 ${t.quotaSaveBtn}`}
              </button>
            </div>
          </div>
        </div>
      )}

{/* 🏖️ MODAL: แจ้งวันหยุดประจำสัปดาห์ (Part-time) (อัปเดตรองรับ 2 ภาษา) */}
      {isDayoffModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsDayoffModalOpen(false)}></div>
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg flex flex-col relative z-10 overflow-hidden animate-pop-in">
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-purple-50 to-white">
              <h3 className="font-black text-purple-800 text-lg flex items-center gap-2">🏖️ {t.modalPTTitle}</h3>
              <button onClick={() => setIsDayoffModalOpen(false)} className="w-8 h-8 flex items-center justify-center bg-white text-slate-400 rounded-full hover:bg-rose-500 hover:text-white font-bold transition-all shadow-sm">✕</button>
            </div>
            
            <form id="dayoffForm" onSubmit={handleSubmitDayoff} className="p-6">
              <div className="space-y-5">
                <div>
                  <label className="text-sm font-black text-slate-700 mb-2 block flex items-center gap-2"><span>📅</span> {t.modalPTDate}</label>
                  <input 
                    type="date" required 
                    value={dayoffForm.date} 
                    onChange={(e) => setDayoffForm({...dayoffForm, date: e.target.value})} 
                    className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 font-bold outline-none text-slate-700 shadow-inner focus:border-purple-400 focus:bg-white transition-all cursor-pointer" 
                  />
                </div>
                <div>
                  <label className="text-sm font-black text-slate-700 mb-2 block flex items-center gap-2"><span>📝</span> {t.modalPTReason}</label>
                  <textarea 
                    rows="2" 
                    value={dayoffForm.reason} 
                    onChange={(e) => setDayoffForm({...dayoffForm, reason: e.target.value})} 
                    className="w-full bg-slate-50 border-2 border-slate-200 rounded-xl px-4 py-3 font-medium outline-none text-slate-700 shadow-inner focus:border-purple-400 focus:bg-white transition-all resize-none"
                    placeholder={t.modalPTReasonHolder}
                  ></textarea>
                </div>
              </div>
            </form>

            <div className="p-5 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 shrink-0">
              <button type="button" onClick={() => setIsDayoffModalOpen(false)} className="px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-100 transition-colors">{t.modalCancel}</button>
              <button type="submit" form="dayoffForm" disabled={isSubmitting} className="px-8 py-3 bg-purple-600 text-white rounded-xl font-black text-sm hover:bg-purple-700 transition-transform hover:scale-105 shadow-lg shadow-purple-200 disabled:opacity-50 flex items-center gap-2">
                {isSubmitting ? (lang === 'TH' ? '⏳ กำลังส่ง...' : '⏳ Submitting...') : `🚀 ${t.modalPTSubmit}`}
              </button>
            </div>
          </div>
        </div>
      )}



      {/* 👤 MODAL: เพิ่ม/แก้ไขพนักงาน */}
      {isEmpModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsEmpModalOpen(false)}></div>
          <div className="bg-white rounded-[2rem] w-full max-w-2xl relative z-10 shadow-2xl flex flex-col max-h-[90vh] animate-pop-in border border-white/50">
            <div className="p-6 md:p-8 border-b border-slate-100 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-t-[2rem]">
              <h2 className="text-2xl font-black text-slate-800 flex items-center gap-2">👤 {t.modalEmpTitle}</h2>
              <p className="text-slate-500 font-medium text-sm mt-1">กรอกข้อมูลพื้นฐานและตั้งค่ากะเวลาทำงาน</p>
            </div>
            
            <div className="p-6 md:p-8 overflow-y-auto flex-1">
              <form id="empForm" onSubmit={handleSaveEmployee} className="space-y-6">
                
                {/* Section 1: ข้อมูลระบบ */}
                <div className="bg-slate-50 p-5 rounded-2xl border border-slate-100">
                  <h4 className="font-black text-slate-700 mb-4 text-sm flex items-center gap-2">🔐 ข้อมูลระบบเข้าใช้งาน</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div><label className="text-[11px] font-bold text-slate-500 mb-1.5 block">{t.labelEmpCode} <span className="text-rose-500">*</span></label><input required type="text" value={empForm.employee_code} onChange={(e) => setEmpForm({...empForm, employee_code: e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 font-bold text-sm outline-none shadow-sm focus:border-purple-400" /></div>
                    <div><label className="text-[11px] font-bold text-slate-500 mb-1.5 block">{t.labelUsername} <span className="text-rose-500">*</span></label><input required type="text" value={empForm.username} onChange={(e) => setEmpForm({...empForm, username: e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 font-bold text-sm outline-none shadow-sm focus:border-purple-400" /></div>
                    
                    {/* ✨ อัปเกรดช่อง Password ตรงนี้! */}
                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <label className="text-[11px] font-bold text-slate-500 block">
                          {t.labelPassword} {!editingEmpId && <span className="text-rose-500">*</span>}
                        </label>
                        <button type="button" onClick={generateSecurePassword} className="text-[10px] font-black text-purple-600 bg-purple-50 px-2 py-1 rounded-lg border border-purple-100 hover:bg-purple-100 transition-all shadow-sm">🎲 สุ่มรหัส</button>
                      </div>
                      <div className="relative">
                        <input 
                          required={!editingEmpId} // ✨ บังคับกรอกเฉพาะตอนเพิ่มใหม่
                          type={showPassword ? "text" : "password"} 
                          value={empForm.password} 
                          onChange={(e) => setEmpForm({...empForm, password: e.target.value})} 
                          className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 font-bold text-sm outline-none shadow-sm focus:border-purple-400" 
                          placeholder={editingEmpId ? "ปล่อยว่างได้ถ้าไม่เปลี่ยนรหัส" : "••••••••"} 
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-sm">
                          {showPassword ? "👁️" : "🙈"}
                        </button>
                      </div>
                      <div className="flex items-center gap-2 mt-2.5 bg-white p-2 rounded-lg border border-slate-100 shadow-sm">
                        <input type="checkbox" id="reqPassChange" checked={empForm.require_password_change || false} onChange={(e) => setEmpForm({...empForm, require_password_change: e.target.checked})} className="w-3.5 h-3.5 text-purple-600 rounded cursor-pointer accent-purple-500" />
                        <label htmlFor="reqPassChange" className="text-[10px] font-black text-slate-600 cursor-pointer select-none">บังคับเปลี่ยนรหัสผ่านเมื่อเข้าสู่ระบบ</label>
                      </div>
                      <p className="text-[9px] text-rose-500 font-bold mt-2 leading-relaxed">* Policy: ขั้นต่ำ 8 ตัวอักษร (ต้องมี พิมพ์ใหญ่, พิมพ์เล็ก, ตัวเลข)</p>
                    </div>

                  </div>
                </div>

                {/* Section 2: ข้อมูลส่วนตัว */}
                <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
                  <h4 className="font-black text-slate-700 mb-4 text-sm flex items-center gap-2">📝 ข้อมูลส่วนตัว</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div><label className="text-[11px] font-bold text-slate-500 mb-1.5 block">{t.labelFullName} <span className="text-rose-500">*</span></label><input required type="text" value={empForm.full_name} onChange={(e) => setEmpForm({...empForm, full_name: e.target.value})} placeholder="เช่น สมชาย ใจดี" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 font-bold text-sm outline-none focus:bg-white focus:border-purple-400 transition-colors" /></div>
                    <div><label className="text-[11px] font-bold text-slate-500 mb-1.5 block">{t.labelNameEn}</label><input type="text" value={empForm.name_en} onChange={(e) => setEmpForm({...empForm, name_en: e.target.value})} placeholder="e.g. Somchai Jaidee" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 font-bold text-sm outline-none focus:bg-white focus:border-purple-400 transition-colors uppercase" /></div>
                    <div className="md:col-span-2"><label className="text-[11px] font-bold text-slate-500 mb-1.5 block">{t.labelPhone}</label><input type="text" value={empForm.phone_number} onChange={(e) => setEmpForm({...empForm, phone_number: e.target.value})} placeholder="08X-XXX-XXXX" className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 font-bold text-sm outline-none focus:bg-white focus:border-purple-400 transition-colors" /></div>
                  </div>
                </div>

               {/* Section 3: การทำงาน กะเวลา และเงินเดือน */}
                <div className="bg-indigo-50/50 p-5 rounded-2xl border border-indigo-100">
                  <h4 className="font-black text-indigo-700 mb-4 text-sm flex items-center gap-2">⏰ การทำงาน & เงินเดือน</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    
                    {/* 1. เลือกตำแหน่งงานจาก Dropdown */}
                    <div>
                      <div className="flex justify-between items-center mb-1.5">
                        <label className="text-[11px] font-bold text-slate-500 block uppercase tracking-wider">ตำแหน่งงาน <span className="text-rose-500">*</span></label>
                        <button 
                          type="button" 
                          onClick={() => setIsPositionModalOpen(true)} 
                          className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2 py-1 rounded-lg border border-indigo-100 hover:bg-indigo-100 transition-all shadow-sm"
                        >
                          ⚙️ ตั้งค่าตำแหน่ง
                        </button>
                      </div>
                      <select 
                        required 
                        value={empForm.position} 
                        onChange={(e) => setEmpForm({...empForm, position: e.target.value})} 
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 font-bold text-slate-700 text-sm outline-none shadow-sm focus:border-indigo-400 cursor-pointer"
                      >
                        <option value="">-- เลือกตำแหน่ง --</option>
                        {positions.map((pos, idx) => (
                          <option key={idx} value={pos}>{pos}</option>
                        ))}
                      </select>
                    </div>

                    {/* 2. เลือกประเภทการจ้าง (เพื่อแยก Full-time / Part-time) */}
                    <div>
                      <label className="text-[11px] font-bold text-slate-500 mb-1.5 block uppercase tracking-wider">ประเภทการจ้าง <span className="text-rose-500">*</span></label>
                      <select 
                        value={empForm.salary_type} 
                        onChange={(e) => setEmpForm({...empForm, salary_type: e.target.value})} 
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 font-bold text-indigo-700 text-sm outline-none shadow-sm focus:border-indigo-400 cursor-pointer"
                      >
                        <option value="Full-time">Full-time (พนักงานประจำ)</option>
                        <option value="Part-time">Part-time (รายชั่วโมง)</option>
                      </select>
                    </div>

                    {/* 3. ช่องกรอกเงิน (สลับตามประเภทการจ้าง) */}
                    {empForm.salary_type === 'Part-time' ? (
                      <div>
                        <label className="text-[11px] font-bold text-purple-600 mb-1.5 block uppercase tracking-wider">ค่าจ้างรายชั่วโมง (฿) <span className="text-rose-500">*</span></label>
                        <input 
                          required 
                          type="number" 
                          placeholder="เช่น 100" 
                          value={empForm.hourly_rate} 
                          onChange={(e) => setEmpForm({...empForm, hourly_rate: e.target.value})} 
                          className="w-full bg-white border-2 border-purple-200 rounded-xl px-4 py-2.5 font-black text-purple-700 outline-none focus:border-purple-400 shadow-sm transition-all" 
                        />
                      </div>
                    ) : (
                      <div className="flex flex-col justify-between h-full gap-3">
                        <div>
                          <label className="text-[11px] font-bold text-emerald-600 mb-1.5 block uppercase tracking-wider">เงินเดือนพื้นฐาน (฿) <span className="text-rose-500">*</span></label>
                          <input 
                            required 
                            type="number" 
                            placeholder="เช่น 15000" 
                            value={empForm.base_salary} 
                            onChange={(e) => setEmpForm({...empForm, base_salary: e.target.value})} 
                            className="w-full bg-white border-2 border-emerald-200 rounded-xl px-4 py-2.5 font-black text-emerald-700 outline-none focus:border-emerald-400 shadow-sm transition-all" 
                          />
                        </div>
                        {/* ✨ สวิตช์ประกันสังคม (จะโชว์เฉพาะพนักงาน Full-time) */}
                        <div className="flex items-center gap-2 bg-white p-2.5 rounded-xl border border-slate-200 shadow-sm mt-auto">
                          <input 
                            type="checkbox" 
                            id="ssoCheck" 
                            checked={empForm.has_social_security !== false} 
                            onChange={(e) => setEmpForm({...empForm, has_social_security: e.target.checked})} 
                            className="w-4 h-4 text-emerald-600 rounded cursor-pointer accent-emerald-500" 
                          />
                          <label htmlFor="ssoCheck" className="text-[11px] font-black text-slate-700 cursor-pointer select-none">เข้าประกันสังคม (หัก 5%)</label>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* ส่วนจัดการกะเวลาทำงาน */}
                  <div className="grid grid-cols-2 gap-4 mt-4 border-t border-slate-100 pt-4">
                    <div>
                      <label className="text-[11px] font-bold text-slate-500 mb-1 block uppercase tracking-widest flex items-center gap-1">🕒 เวลาเข้างาน</label>
                      <input required type="time" value={empForm.shift_start} onChange={(e) => setEmpForm({...empForm, shift_start: e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 font-bold text-slate-700 text-sm outline-none shadow-sm focus:border-indigo-400" />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-500 mb-1 block uppercase tracking-widest flex items-center gap-1">🕒 เวลาเลิกงาน</label>
                      <input required type="time" value={empForm.shift_end} onChange={(e) => setEmpForm({...empForm, shift_end: e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 font-bold text-slate-700 text-sm outline-none shadow-sm focus:border-indigo-400" />
                    </div>
                    {/* ✨ เพิ่มส่วนของธนาคาร */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-100 pt-4 mt-2">
                      <div>
                        <label className="text-[11px] font-black text-slate-500 mb-1 block">🏦 ธนาคาร</label>
                        <select value={empForm.bank_name || ''} onChange={(e) => setEmpForm({...empForm, bank_name: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-black text-indigo-600 outline-none focus:bg-white shadow-inner">
                          <option value="">- ไม่ระบุ -</option>
                          <option value="KBANK">กสิกรไทย (KBANK)</option>
                          <option value="SCB">ไทยพาณิชย์ (SCB)</option>
                          <option value="BBL">กรุงเทพ (BBL)</option>
                          <option value="KTB">กรุงไทย (KTB)</option>
                          <option value="BAY">กรุงศรีอยุธยา (BAY)</option>
                          <option value="TTB">ทหารไทยธนชาต (TTB)</option>
                          <option value="GSB">ออมสิน (GSB)</option>
                        </select>
                      </div>
                      <div><label className="text-[11px] font-black text-slate-500 mb-1 block">🔢 เลขที่บัญชี</label><input type="text" placeholder="เช่น 123-4-56789-0" value={empForm.bank_account || ''} onChange={(e) => setEmpForm({...empForm, bank_account: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-black text-indigo-600 outline-none focus:bg-white shadow-inner" /></div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
            
            <div className="p-6 border-t border-slate-100 bg-slate-50 rounded-b-[2rem] flex gap-3">
              <button type="button" onClick={() => setIsEmpModalOpen(false)} className="flex-1 py-3.5 bg-white text-slate-600 border border-slate-200 rounded-xl font-black text-sm shadow-sm hover:bg-slate-100 transition-colors">{t.modalCancel}</button>
              <button type="submit" form="empForm" className="flex-1 py-3.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-xl font-black text-sm shadow-lg hover:scale-[1.02] transition-transform">💾 บันทึกข้อมูล</button>
            </div>
          </div>
        </div>
      )}


      {/* 🚀 MODAL 1: ยื่นใบลา */}
      {isLeaveModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-[450px] overflow-hidden border border-white my-auto">
            
            <div className="p-6 pb-2 text-center shrink-0 mt-2">
              <div className="w-14 h-14 bg-gradient-to-br from-pink-400 to-purple-500 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-pink-200 mb-4">
                <span className="text-2xl text-white">💌</span>
              </div>
              <h3 className="font-black text-2xl text-[#1E293B]">{t.modalLeaveTitle}</h3>
            </div>
            
            <form onSubmit={handleSubmitLeave} className="px-6 pb-8 space-y-5 mt-4">
              
              <div className="grid grid-cols-2 gap-4 border border-slate-200 p-4 rounded-2xl bg-slate-50/50">
                <div>
                  <label className="text-[11px] font-bold text-slate-500 mb-1.5 flex items-center gap-1">🏷️ {t.modalLeaveType}</label>
                  <select value={leaveForm.type} onChange={(e) => setLeaveForm({...leaveForm, type: e.target.value})} className="w-full bg-white border border-slate-200 rounded-xl px-3 py-2.5 font-bold text-slate-700 outline-none text-sm shadow-sm focus:border-purple-400 transition-colors">
                    <option value="ลาป่วย">{t.sickLeave || 'ลาป่วย'}</option>
                    <option value="ลากิจ">{t.personalLeave || 'ลากิจ'}</option>
                    <option value="ลาพักร้อน">{t.annualLeave || 'ลาพักร้อน'}</option>
                    <option value="ลาฉุกเฉิน">{t.emergencyLeave || 'ลาฉุกเฉิน'}</option>
                    {/* ✨ แยกข้อความแสดงผลตามภาษา แต่ค่า value ยังส่งเป็นภาษาไทยเพื่อให้ฐานข้อมูลทำงานได้ปกติ */}
                    <option value="ลาไม่รับเงินเดือน">{lang === 'TH' ? 'ลาไม่รับเงินเดือน' : 'Leave Without Pay'}</option>
                  </select>
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-500 mb-1.5 flex items-center gap-1">👤 {t.modalLeaveName}</label>
                  <input type="text" readOnly value={user?.full_name} className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2.5 font-bold text-slate-400 outline-none text-sm cursor-not-allowed shadow-inner"/>
                </div>
              </div>

              <div className="border border-slate-200 p-4 rounded-2xl bg-slate-50/50 space-y-4">
                <label className="text-[11px] font-bold text-slate-500 flex items-center gap-1">🕒 {t.modalLeaveDate}</label>
                
                <div className="flex items-center gap-3">
                  <span className="text-emerald-500 font-black text-xs w-10 text-right">START</span>
                  <div className="flex-1 flex gap-2">
                    <input type="date" required value={leaveForm.startDate} onChange={(e) => setLeaveForm({...leaveForm, startDate: e.target.value})} className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 font-bold text-slate-700 text-xs shadow-sm focus:border-emerald-400 outline-none transition-colors"/>
                    <input type="time" required value={leaveForm.startTime} onChange={(e) => setLeaveForm({...leaveForm, startTime: e.target.value})} className="w-[85px] bg-white border border-slate-200 rounded-xl px-2 py-2 font-bold text-slate-700 text-xs shadow-sm focus:border-emerald-400 outline-none text-center transition-colors"/>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-rose-500 font-black text-xs w-10 text-right">END</span>
                  <div className="flex-1 flex gap-2">
                    <input type="date" required value={leaveForm.endDate} onChange={(e) => setLeaveForm({...leaveForm, endDate: e.target.value})} className="flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 font-bold text-slate-700 text-xs shadow-sm focus:border-rose-400 outline-none transition-colors"/>
                    <input type="time" required value={leaveForm.endTime} onChange={(e) => setLeaveForm({...leaveForm, endTime: e.target.value})} className="w-[85px] bg-white border border-slate-200 rounded-xl px-2 py-2 font-bold text-slate-700 text-xs shadow-sm focus:border-rose-400 outline-none text-center transition-colors"/>
                  </div>
                </div>
              </div>

              <div className={`p-3 rounded-xl border-2 border-dashed text-center font-bold text-sm transition-all ${calculatedTime.isError ? 'bg-rose-50 border-rose-300 text-rose-600' : calculatedTime.isDefault ? 'bg-emerald-50/50 border-emerald-200 text-emerald-600/70' : 'bg-emerald-50 border-emerald-400 text-emerald-600 shadow-inner'}`}>
                {calculatedTime.text}
              </div>

              <textarea rows="3" required placeholder={t.modalLeaveReason} value={leaveForm.reason} onChange={(e) => setLeaveForm({...leaveForm, reason: e.target.value})} className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-4 py-3 font-medium text-slate-700 outline-none text-sm resize-none shadow-sm focus:border-purple-400 transition-colors"></textarea>
              
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={isSubmitting || calculatedTime.isError || calculatedTime.isDefault} className="flex-[3] py-3.5 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-black text-sm shadow-lg shadow-purple-200 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                  {isSubmitting ? (<span>⏳ กำลังส่งข้อมูล...</span>) : (<><span>🚀</span> {t.modalLeaveSubmit}</>)}
                </button>
                <button type="button" onClick={() => setIsLeaveModalOpen(false)} className="flex-[1] py-3.5 bg-slate-100 text-slate-500 rounded-xl font-bold text-sm hover:bg-slate-200 transition-colors">
                  {t.modalCancel}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 🛠️ MODAL 2: แจ้งปรับปรุงเวลา */}
      {isAdjustModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg p-5 sm:p-8 max-h-[95vh] overflow-y-auto relative">
            
            {/* Header */}
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-3 shadow-inner">
                <span className="text-3xl">🛠️</span>
              </div>
              <h3 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-rose-500">
                {t.modalAdjTitle}
              </h3>
              <p className="text-slate-500 text-sm mt-1">{t.modalAdjDesc}</p>
            </div>

            <form onSubmit={handleSubmitAdjustment} className="space-y-6">
              
              {/* 🔘 Tabs (สลับวันหยุด / แก้ไขเวลา) */}
              <div className="flex p-1 bg-slate-100 rounded-2xl">
                <button
                  type="button"
                  onClick={() => setAdjustForm({ ...adjustForm, tab: 'swap' })}
                  className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${
                    adjustForm.tab === 'swap' 
                      ? 'bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white shadow-md' 
                      : 'text-slate-500 hover:bg-white/50'
                  }`}
                >
                  ⇄ {t.adjustSwap}
                </button>
                <button
                  type="button"
                  onClick={() => setAdjustForm({ ...adjustForm, tab: 'edit' })}
                  className={`flex-1 py-3 text-sm font-bold rounded-xl transition-all ${
                    adjustForm.tab === 'edit' 
                      ? 'bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white shadow-md' 
                      : 'text-slate-500 hover:bg-white/50'
                  }`}
                >
                  🕒 {t.adjustEdit}
                </button>
              </div>

              {/* 📝 ฟอร์มตาม Tab */}
              <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-100">
                <p className="text-xs font-bold text-blue-500 mb-4 flex items-center">
                  ℹ️ {adjustForm.tab === 'swap' ? t.modalAdjDetailSwap : t.modalAdjDetailEdit}
                </p>

                {adjustForm.tab === 'swap' ? (
                  /* ท่าสลับวันหยุด */
                  <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
                    <div className="w-full">
                      <label className="block text-xs font-bold text-slate-700 mb-1">{t.modalAdjOldDate}</label>
                      <input 
                        type="date" 
                        required 
                        value={adjustForm.oldDate}
                        onChange={(e) => setAdjustForm({...adjustForm, oldDate: e.target.value})}
                        className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:outline-none" 
                      />
                    </div>
                    
                    {/* ลูกศรชี้ขวา (โชว์จอใหญ่) / ชี้ลง (โชว์มือถือ) */}
                    <div className="hidden sm:block text-slate-300 font-bold mt-5">→</div>
                    <div className="block sm:hidden text-slate-300 font-bold rotate-90">→</div>

                    <div className="w-full">
                      <label className="block text-xs font-bold text-slate-700 mb-1">{t.modalAdjNewDate}</label>
                      <input 
                        type="date" 
                        required 
                        value={adjustForm.newDate}
                        onChange={(e) => setAdjustForm({...adjustForm, newDate: e.target.value})}
                        className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:outline-none" 
                      />
                    </div>
                  </div>
                ) : (
                  /* ท่าแก้ไขเวลา */
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                      <div className="w-full">
                        <label className="block text-xs font-bold text-slate-700 mb-1">{t.modalAdjDate}</label>
                        <input 
                          type="date" 
                          required 
                          value={adjustForm.incidentDate}
                          onChange={(e) => setAdjustForm({...adjustForm, incidentDate: e.target.value})}
                          className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:outline-none" 
                        />
                      </div>
                      <div className="w-full">
                        <label className="block text-xs font-bold text-slate-700 mb-1">{t.modalAdjTimeType}</label>
                        <select 
                          value={adjustForm.timeType}
                          onChange={(e) => setAdjustForm({...adjustForm, timeType: e.target.value})}
                          className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:outline-none"
                        >
                          <option value="เข้างาน (IN)">{lang === 'TH' ? 'เข้างาน (IN)' : 'Clock In (IN)'}</option>
                          <option value="ออกงาน (OUT)">{lang === 'TH' ? 'ออกงาน (OUT)' : 'Clock Out (OUT)'}</option>
                        </select>
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
                      <div className="w-full">
                        <label className="block text-xs font-bold text-slate-700 mb-1">{t.modalAdjOldTime}</label>
                        <input 
                          type="time" 
                          value={adjustForm.oldTime}
                          onChange={(e) => setAdjustForm({...adjustForm, oldTime: e.target.value})}
                          className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:outline-none" 
                        />
                      </div>
                      <div className="hidden sm:block text-slate-300 font-bold mt-5">→</div>
                      <div className="block sm:hidden text-slate-300 font-bold rotate-90">→</div>
                      <div className="w-full">
                        <label className="block text-xs font-bold text-slate-700 mb-1">{t.modalAdjNewTime}</label>
                        <input 
                          type="time" 
                          required 
                          value={adjustForm.newTime}
                          onChange={(e) => setAdjustForm({...adjustForm, newTime: e.target.value})}
                          className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:outline-none" 
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* 💬 เหตุผล */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">{t.modalAdjReason}</label>
                <textarea 
                  required 
                  rows="2"
                  placeholder={t.modalAdjReasonHolder}
                  value={adjustForm.reason}
                  onChange={(e) => setAdjustForm({...adjustForm, reason: e.target.value})}
                  className="w-full p-3 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-purple-400 focus:outline-none resize-none"
                ></textarea>
              </div>

              {/* 🔥 Action Buttons (ตบบนล่างในมือถือ) */}
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full sm:flex-[2] py-3 bg-gradient-to-r from-purple-500 to-fuchsia-500 text-white font-black rounded-xl shadow-lg hover:scale-[1.02] transition-transform flex justify-center items-center"
                >
                  {isSubmitting ? (lang === 'TH' ? 'กำลังส่งข้อมูล...' : 'Submitting...') : `🚀 ${t.modalAdjSubmit}`}
                </button>
                <button 
                  type="button" 
                  onClick={() => setIsAdjustModalOpen(false)}
                  className="w-full sm:flex-1 py-3 bg-slate-100 text-slate-600 font-bold rounded-xl hover:bg-slate-200 transition-colors"
                >
                  {t.modalCancel}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}


      

      {/* 🔔 MODAL 3: รายละเอียดการแจ้งเตือน (Popup Detail) */}
      {selectedNotif && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 shadow-2xl w-full max-w-sm text-center border border-white animate-fade-in">
            <div className="w-16 h-16 bg-pink-100 text-pink-500 rounded-full flex items-center justify-center text-3xl mx-auto mb-4 shadow-inner">🔔</div>
            <h3 className="text-lg md:text-xl font-black text-slate-800 mb-2">{selectedNotif.title}</h3>
            <p className="text-slate-500 text-sm font-medium mb-6 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">{selectedNotif.message}</p>
            <button onClick={() => setSelectedNotif(null)} className="w-full py-3.5 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-black text-sm shadow-md transition-colors">{t.notifClose}</button>
          </div>
        </div>
      )}

    </div>

{/* 📊 MODAL: ประวัติยอดขายของฉัน (พนักงานทั่วไป) */}
      {isMySalesModalOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-3xl flex flex-col relative z-10 overflow-hidden animate-pop-in border border-white/50">
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-gradient-to-r from-pink-50 to-rose-50">
              <h3 className="font-black text-pink-800 text-lg flex items-center gap-2">
                📈 ประวัติยอดขายของฉัน
              </h3>
              <button onClick={() => setIsMySalesModalOpen(false)} className="w-8 h-8 flex items-center justify-center bg-white text-slate-400 rounded-full hover:bg-rose-500 hover:text-white font-bold transition-all shadow-sm">✕</button>
            </div>

            <div className="p-6 md:p-8 max-h-[75vh] overflow-y-auto custom-scrollbar bg-[#fffbfb]">
              {(() => {
                // ดึงข้อมูลยอดขายของ user ที่ล็อกอินอยู่ และเรียงจากเดือนล่าสุดไปเก่า
                const myHistory = allSalesData.filter(s => s.employee_id === user?.id && s.month).sort((a, b) => b.month.localeCompare(a.month));
                
                if (myHistory.length === 0) {
                  return (
                    <div className="text-center py-10 bg-white rounded-3xl border border-slate-100 shadow-sm">
                      <span className="text-5xl block mb-4">🤷‍♂️</span>
                      <p className="text-slate-500 font-bold">ยังไม่มีประวัติยอดขายในระบบ</p>
                    </div>
                  );
                }

                // สรุปยอดรวมสะสม
                const totalSales = myHistory.reduce((sum, s) => sum + Number(s.current_sales || 0), 0);
                const totalComm = myHistory.reduce((sum, s) => sum + (Number(s.current_sales || 0) * (Number(s.commission_rate || 0) / 100)), 0);

                return (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-gradient-to-br from-pink-500 to-rose-500 p-5 rounded-3xl text-white shadow-md">
                        <p className="text-[11px] font-bold opacity-80 uppercase tracking-widest mb-1">ยอดขายสะสมรวม</p>
                        <p className="text-3xl font-black tabular-nums">฿{totalSales.toLocaleString()}</p>
                      </div>
                      <div className="bg-gradient-to-br from-indigo-500 to-purple-500 p-5 rounded-3xl text-white shadow-md">
                        <p className="text-[11px] font-bold opacity-80 uppercase tracking-widest mb-1">ค่าคอมมิชชันสะสมรวม</p>
                        <p className="text-3xl font-black tabular-nums">฿{totalComm.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                      </div>
                    </div>

                    <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
                      <table className="w-full text-left border-collapse min-w-[500px]">
                        <thead className="bg-slate-50 border-b border-slate-100">
                          <tr>
                            <th className="p-4 text-xs font-bold text-slate-500 uppercase">เดือน</th>
                            <th className="p-4 text-xs font-bold text-slate-500 uppercase text-right">ยอดขาย (฿)</th>
                            <th className="p-4 text-xs font-bold text-slate-500 uppercase text-center w-32">เป้าหมาย</th>
                            <th className="p-4 text-xs font-bold text-slate-500 uppercase text-right">ค่าคอมมิชชัน</th>
                          </tr>
                        </thead>
                        <tbody>
                          {myHistory.map((item, idx) => {
                            const comm = Number(item.current_sales || 0) * (Number(item.commission_rate || 0) / 100);
                            const percent = item.target_sales > 0 ? (Number(item.current_sales) / Number(item.target_sales)) * 100 : 0;
                            const isHit = percent >= 100;
                            
                            return (
                              <tr key={idx} className="border-b border-slate-50 hover:bg-slate-50/50 transition-colors">
                                <td className="p-4 font-black text-slate-700">{item.month}</td>
                                <td className="p-4 font-bold text-pink-600 text-right tabular-nums">฿{Number(item.current_sales).toLocaleString()}</td>
                                <td className="p-4">
                                  <div className="flex flex-col items-center">
                                    <span className="text-[10px] font-bold text-slate-400 mb-1">เป้า: {Number(item.target_sales).toLocaleString()}</span>
                                    <div className="w-full bg-slate-100 rounded-full h-1.5">
                                      <div className={`h-1.5 rounded-full ${isHit ? 'bg-emerald-500' : 'bg-amber-400'}`} style={{ width: `${Math.min(percent, 100)}%` }}></div>
                                    </div>
                                    <span className={`text-[9px] font-black mt-1 ${isHit ? 'text-emerald-600' : 'text-amber-600'}`}>{percent.toFixed(0)}%</span>
                                  </div>
                                </td>
                                <td className="p-4 font-black text-indigo-600 text-right tabular-nums">
                                  + ฿{comm.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

{/* 💸 MODAL: สร้างสลิปเงินเดือน (Admin/CEO) */}
      {isPayrollModalOpen && (() => {
        const selectedEmp = employees.find(e => e.id === payrollForm.employee_id);
        const isPT = selectedEmp?.salary_type === 'Part-time';

        return (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6 bg-slate-900/60 backdrop-blur-sm">
            <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-2xl flex flex-col relative z-10 overflow-hidden animate-pop-in border border-white/50">
              <div className={`px-6 py-5 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r ${isPT ? 'from-purple-50 to-indigo-50' : 'from-emerald-50 to-teal-50'}`}>
                <h3 className={`font-black ${isPT ? 'text-purple-800' : 'text-emerald-800'} text-lg flex items-center gap-2`}>
                  {isPT ? '🏖️ สร้างสลิป (Part-time)' : '💰 สร้างสลิป (Full-time)'}
                </h3>
                
                {/* 🚀 ย้ายปุ่ม 2 อันนี้มาไว้มุมขวาบน ให้ไม่เบียดกับฟอร์มกรอกข้อมูล */}
                <div className="flex flex-wrap items-center gap-2">
                  <button 
                    type="button"
                    onClick={handleExportBankCSV}
                    className="bg-emerald-50 hover:bg-emerald-100 text-emerald-600 border border-emerald-200 px-3 py-1.5 rounded-lg font-bold text-xs transition-all shadow-sm flex items-center gap-1.5"
                    title="ดาวน์โหลดไฟล์สำหรับอัปโหลดเข้าธนาคาร"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                    Export โอนเงิน
                  </button>

                  <button 
                    type="button"
                    onClick={() => {
                      const monthPayrolls = payrollData.filter(p => p.month === payrollFilterMonth);
                      const empsWithoutPayroll = employees.filter(e => !monthPayrolls.some(p => p.employee_id === e.id));
                      
                      if (empsWithoutPayroll.length === 0) {
                        Swal.fire({ icon: 'info', title: 'ครบถ้วน', text: 'พนักงานทุกคนมียอดเงินเดือนของเดือนนี้แล้ว' });
                        return;
                      }
                      setSelectedEmps(empsWithoutPayroll.map(e => e.id));
                      setShowAutoPayrollModal(true);
                    }}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-lg font-bold text-xs transition-all shadow-sm flex items-center gap-1.5"
                  >
                    ✨ ทำสลิปอัตโนมัติ
                  </button>

                  <button onClick={() => setIsPayrollModalOpen(false)} className="w-8 h-8 flex items-center justify-center bg-white text-slate-400 border border-slate-200 rounded-full hover:bg-rose-500 hover:text-white hover:border-rose-500 font-bold transition-all shadow-sm ml-1">✕</button>
                </div>
              </div>

              <form id="payrollForm" onSubmit={handleGenerateSlip} className="p-6 md:p-8 max-h-[75vh] overflow-y-auto custom-scrollbar bg-[#fffbfb]">
                <div className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] font-black text-slate-500 mb-1 block uppercase tracking-widest">👤 เลือกพนักงาน <span className="text-rose-500">*</span></label>
                      <select required value={payrollForm.employee_id} 
                        onChange={(e) => {
                          const empId = e.target.value;
                          const selected = employees.find(emp => emp.id === empId);
                          const _isPT = selected?.salary_type === 'Part-time';
                          const base = selected ? (_isPT ? (selected.hourly_rate || 0) : (selected.base_salary || 0)) : 0;
                          
                          const rate = payrollForm.sso_rate ?? 5;
                          const maxBase = payrollForm.sso_max ?? 17500;
                          const sso = (selected && selected.has_social_security !== false && !_isPT) ? Math.round(Math.min(base, maxBase) * (rate / 100)) : 0;
                          
                          let tax = 0;
                          if (!_isPT && base > 0) {
                            const annual = base * 12;
                            const expenses = Math.min(annual * 0.5, 100000); 
                            let net = annual - expenses - 60000; 
                            if (net > 150000) {
                              if (net > 5000000) { tax += (net - 5000000) * 0.35; net = 5000000; }
                              if (net > 2000000) { tax += (net - 2000000) * 0.30; net = 2000000; }
                              if (net > 1000000) { tax += (net - 1000000) * 0.25; net = 1000000; }
                              if (net > 750000) { tax += (net - 750000) * 0.20; net = 750000; }
                              if (net > 500000) { tax += (net - 500000) * 0.15; net = 500000; }
                              if (net > 300000) { tax += (net - 300000) * 0.10; net = 300000; }
                              if (net > 150000) { tax += (net - 150000) * 0.05; }
                            }
                            tax = Math.round(tax / 12); 
                          }
                          // ✨ เมื่อเปลี่ยนพนักงาน ให้รีเซ็ตสถานะ Preview ด้วย
                          setPayrollForm({ ...payrollForm, employee_id: empId, base_salary: base, social_security: sso, tax: tax, is_previewed: false });
                        }} 
                        className="w-full bg-white border-2 border-slate-200 rounded-xl px-4 py-3 font-bold outline-none text-slate-700 focus:border-emerald-400 shadow-sm cursor-pointer"
                      >
                        <option value="">-- เลือกพนักงาน --</option>
                        {employees.map(emp => (
                          <option key={emp.id} value={emp.id}>{emp.employee_code} - {emp.full_name} ({emp.salary_type})</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] font-black text-slate-500 mb-1 block uppercase tracking-widest">📅 รอบบิล (เดือน)</label>
                      <input
                        type="month"
                        value={payrollFilterMonth}
                        onChange={(e) => setPayrollFilterMonth(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 font-bold text-slate-700 outline-none focus:border-indigo-500 shadow-sm"
                      />
               
                    </div>
                  </div>

                  {/* ✨ กล่อง PREVIEW แสดงตัวเลขให้ดูก่อนเซฟจริง */}
                  <div className="bg-slate-50 p-4 border border-slate-200 rounded-2xl shadow-sm">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-3">
                      <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest flex items-center gap-1">📊 ตรวจสอบข้อมูลอัตโนมัติก่อนสร้างสลิป</label>
                      <button type="button" onClick={handlePreviewAttendance} className="w-full sm:w-auto px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg text-xs font-bold hover:bg-indigo-200 transition-colors flex items-center justify-center gap-1 shadow-sm">
                        🔍 ดึงข้อมูลเวลาเข้างาน
                      </button>
                    </div>
                    
                    {payrollForm.is_previewed ? (
                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 animate-fade-in">
                         <div className="bg-white p-3 rounded-xl border border-slate-100 text-center shadow-sm">
                           <div className="text-[10px] text-slate-400 font-bold">เวลาทำรวม</div>
                           <div className="text-sm font-black text-indigo-600">{payrollForm.preview_work_hours} ชม.</div>
                         </div>
                         <div className="bg-white p-3 rounded-xl border border-slate-100 text-center shadow-sm border-l-4 border-l-emerald-400">
                           <div className="text-[10px] text-slate-400 font-bold">OT ({payrollForm.preview_ot_hours || 0} ชม.)</div>
                           <div className="text-sm font-black text-emerald-500">+฿{payrollForm.preview_ot_amount?.toLocaleString() || 0}</div>
                         </div>
                         <div className="bg-white p-3 rounded-xl border border-slate-100 text-center shadow-sm">
                           <div className="text-[10px] text-slate-400 font-bold">สาย ({payrollForm.preview_late_mins || 0} นาที)</div>
                           <div className="text-sm font-black text-red-500">-฿{payrollForm.preview_late_deduct?.toLocaleString() || 0}</div>
                         </div>
                         <div className="bg-white p-3 rounded-xl border border-slate-100 text-center shadow-sm">
                           <div className="text-[10px] text-slate-400 font-bold">ขาด ({payrollForm.preview_absent_days || 0} วัน)</div>
                           <div className="text-sm font-black text-red-500">-฿{payrollForm.preview_absent_deduct?.toLocaleString() || 0}</div>
                         </div>
                         <div className="bg-white p-3 rounded-xl border border-slate-100 text-center shadow-sm">
                           <div className="text-[10px] text-slate-400 font-bold">ลาหักเงิน ({payrollForm.leave_days || 0} วัน)</div>
                           <div className="text-sm font-black text-orange-500">-฿{payrollForm.preview_leave_deduct?.toLocaleString() || 0}</div>
                         </div>
                      </div>
                    ) : (
                      <div className="bg-slate-50 border border-dashed border-slate-300 rounded-xl p-4 text-center text-slate-500 text-xs font-bold">
                        👈 กรุณากดปุ่ม "ดึงข้อมูลเวลาเข้างาน" ก่อน
                      </div>
                    )}

                    {/* รายรับอื่นๆ */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[11px] font-black text-slate-500 mb-1 flex justify-between">
                          <span>⏱️ ล่วงเวลา (OT)</span>
                          <span className="text-emerald-500">แนะนำ: {payrollForm.preview_ot_hours || 0} ชม.</span>
                        </label>
                        <div className="flex gap-2">
                          <div className="relative w-1/2">
                            <input type="number" step="0.5" placeholder="ชม." value={payrollForm.ot_hours ?? ''} onChange={(e) => {
                                const hrs = e.target.value;
                                const rate = (Number(payrollForm.base_salary) / 30 / 8) * 1.5;
                                const autoPay = selectedEmp?.salary_type === 'Part-time' ? 0 : Math.round(Number(hrs) * rate);
                                setPayrollForm({...payrollForm, ot_hours: hrs, ot_amount: autoPay});
                            }} className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-3 pr-8 py-3 font-black text-indigo-600 outline-none focus:bg-white shadow-inner" />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-bold">ชม.</span>
                          </div>
                          <div className="relative w-1/2">
                            <input type="number" placeholder="บาท" value={payrollForm.ot_amount ?? ''} onChange={(e) => setPayrollForm({...payrollForm, ot_amount: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-3 pr-8 py-3 font-black text-indigo-600 outline-none focus:bg-white shadow-inner" />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-bold">฿</span>
                          </div>
                        </div>
                      </div>
                      <div><label className="text-[11px] font-black text-slate-500 mb-1 block">🎁 โบนัส / เบี้ยขยัน</label><input type="number" placeholder="0" value={payrollForm.bonus} onChange={(e) => setPayrollForm({...payrollForm, bonus: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 font-black text-indigo-600 outline-none focus:bg-white shadow-inner" /></div>
                    </div>
                  </div>

                  {!isPT && (
                    <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl shadow-sm space-y-4">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-2">
                        <h4 className="text-xs font-black text-rose-800 flex items-center gap-2">🔻 ภาษีและประกันสังคม</h4>
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-rose-600 bg-rose-100/60 px-3 py-2 rounded-xl border border-rose-200 shadow-sm">
                          ⚙️ เรทหัก:
                          <input type="number" value={payrollForm.sso_rate ?? 5} onChange={(e) => {
                              const newRate = Number(e.target.value);
                              const newMax = payrollForm.sso_max ?? 17500;
                              const base = Number(payrollForm.base_salary || 0);
                              const newSso = Math.round(Math.min(base, newMax) * (newRate / 100));
                              setPayrollForm({...payrollForm, sso_rate: newRate, social_security: newSso});
                            }} className="w-10 bg-white text-center rounded-md border border-rose-200 outline-none focus:border-rose-400 py-0.5 font-black" /> % 
                          <span className="text-rose-300 mx-1">|</span>
                          เพดาน: 
                          <input type="number" value={payrollForm.sso_max ?? 17500} onChange={(e) => {
                              const newMax = Number(e.target.value);
                              const newRate = payrollForm.sso_rate ?? 5;
                              const base = Number(payrollForm.base_salary || 0);
                              const newSso = Math.round(Math.min(base, newMax) * (newRate / 100));
                              setPayrollForm({...payrollForm, sso_max: newMax, social_security: newSso});
                            }} className="w-16 bg-white text-center rounded-md border border-rose-200 outline-none focus:border-rose-400 py-0.5 font-black" /> ฿
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                        <label className="text-[11px] font-black text-slate-500 mb-1 flex justify-between items-center">
                          <span>🛡️ หักประกันสังคม</span>
                          <button 
                            type="button"
                            onClick={() => {
                              const salary = Number(payrollForm.base_salary) || 0;
                              let sso = Math.round(salary * 0.05);
                              if (salary > 17500) sso = 875;
                              setPayrollForm({...payrollForm, social_security: sso});
                            }}
                            className="text-[10px] bg-emerald-50 text-emerald-600 px-2 py-1 rounded-lg hover:bg-emerald-100 transition-colors font-bold shadow-sm"
                          >
                            ✨ คำนวณ 5% (ฐานใหม่)
                          </button>
                        </label>
                        <div className="relative">
                          <input type="number" placeholder="0" value={payrollForm.social_security ?? ''} onChange={(e) => setPayrollForm({...payrollForm, social_security: e.target.value})} className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-3 pr-8 py-3 font-black text-red-500 outline-none focus:bg-white shadow-inner" />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400 font-bold">฿</span>
                        </div>
                      </div>
                        <div>
                          <label className="text-[11px] font-black text-rose-600 mb-1 block">🏛️ หักภาษี ณ ที่จ่าย</label>
                          <input type="number" placeholder="0" value={payrollForm.tax || ''} onChange={(e) => setPayrollForm({...payrollForm, tax: e.target.value})} className="w-full bg-white border border-rose-200 rounded-xl px-4 py-2.5 font-black text-rose-600 outline-none focus:border-rose-400 shadow-sm" />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="bg-amber-50 p-4 border border-amber-200 rounded-2xl shadow-sm">
                    <label className="text-[11px] font-black text-amber-800 mb-1 block">➖ รายการหักอื่นๆ (แอดมินพิมพ์เพิ่มเอง)</label>
                    <input type="number" placeholder="0" value={payrollForm.deductions} onChange={(e) => setPayrollForm({...payrollForm, deductions: e.target.value})} className="w-full bg-white border border-amber-200 rounded-xl px-4 py-3 font-black text-amber-700 outline-none focus:border-amber-400 shadow-inner" />
                  </div>
                </div>
              </form>

              <div className="p-5 border-t border-slate-100 bg-white flex justify-end gap-3 shrink-0">
                <button type="button" onClick={() => setIsPayrollModalOpen(false)} className="px-6 py-3.5 bg-slate-100 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-200 transition-colors">ยกเลิก</button>
                <button type="submit" form="payrollForm" disabled={isSavingPayroll} className={`px-8 py-3.5 bg-gradient-to-r ${isPT ? 'from-purple-600 to-indigo-600' : 'from-emerald-500 to-teal-500'} text-white rounded-xl font-black text-sm hover:scale-[1.02] transition-transform shadow-lg disabled:opacity-50 flex items-center gap-2`}>
                  {isSavingPayroll ? '⏳ กำลังบันทึก...' : '✅ ออกสลิปเงินเดือน'}
                </button>
              </div>
            </div>
          </div>
        );
      })()}

{/* 🛠️ MODAL: จัดการตำแหน่งงาน */}
      {isPositionModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-md overflow-hidden border border-white">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-indigo-50">
              <h3 className="font-black text-indigo-800">🛠️ จัดการตำแหน่งงาน</h3>
              <button onClick={() => setIsPositionModalOpen(false)} className="text-slate-400 hover:text-rose-500 font-bold">✕</button>
            </div>
            <div className="p-6">
              <div className="flex gap-2 mb-6">
                <input type="text" placeholder="ชื่อตำแหน่งใหม่..." value={newPositionName} onChange={(e) => setNewPositionName(e.target.value)} className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 font-bold text-sm outline-none focus:border-indigo-400" />
                <button 
                  onClick={async () => { 
                    if(newPositionName.trim()){ 
                      const posName = newPositionName.trim();
                      // ✨ 1. บันทึกลงตาราง job_positions ใน Supabase
                      const { error } = await supabase.from('job_positions').insert([{ name: posName }]);
                      if(!error) {
                        setPositions([...positions, posName]); 
                        setNewPositionName(""); 
                      } else {
                        alert("เพิ่มไม่ได้ (ชื่อตำแหน่งนี้อาจจะมีอยู่แล้ว)");
                      }
                    } 
                  }} 
                  className="px-4 py-2 bg-indigo-600 text-white rounded-xl font-bold text-sm shadow-md hover:bg-indigo-700"
                >เพิ่ม</button>
              </div>
              <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar">
                {positions.map((pos, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-slate-50 rounded-xl border border-slate-100 group">
                    <span className="font-bold text-slate-700 text-sm">{pos}</span>
                    <button 
                      onClick={async () => {
                        // ✨ 2. สั่งลบออกจากตาราง job_positions ใน Supabase
                        const { error } = await supabase.from('job_positions').delete().eq('name', pos);
                        if(!error) {
                          setPositions(positions.filter((_, i) => i !== index));
                        }
                      }} 
                      className="text-rose-400 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-opacity"
                    >🗑️ ลบ</button>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-4 border-t border-slate-100 flex justify-end">
              <button onClick={() => setIsPositionModalOpen(false)} className="px-6 py-2 bg-slate-800 text-white rounded-xl font-bold text-sm">เสร็จสิ้น</button>
            </div>
          </div>
        </div>
      )}


{/* 🗺️ MODAL 4: ดูแผนที่ (รองรับสมบูรณ์แบบทั้ง Mobile และ PC) */}
      {viewMapModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-8">
          {/* พื้นหลังเบลอ คลิกเพื่อปิด */}
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" onClick={() => setViewMapModal(null)}></div>
          
          {/* กล่อง Modal: ปรับขนาดความกว้างและขอบมนให้พอดีทั้งมือถือและคอม */}
          <div className="bg-white w-full max-w-3xl rounded-[1.5rem] sm:rounded-[2rem] flex flex-col relative z-10 overflow-hidden shadow-2xl animate-pop-in border border-white/10">
            
            {/* Header */}
            <div className="px-4 py-4 sm:px-6 sm:py-5 border-b border-slate-100 flex justify-between items-center bg-white shrink-0">
              <h3 className="font-black text-slate-800 text-base sm:text-lg flex items-center gap-2 truncate">
                📍 พิกัดยื่นลา: คุณ{viewMapModal.name}
              </h3>
              <button onClick={() => setViewMapModal(null)} className="w-8 h-8 sm:w-10 sm:h-10 flex-shrink-0 flex items-center justify-center bg-slate-100 text-slate-500 rounded-full hover:bg-rose-500 hover:text-white font-bold transition-colors">
                ✕
              </button>
            </div>
            
            {/* 🗺️ พื้นที่แผนที่: ใช้ความสูงตายตัวแยกตามอุปกรณ์ (มือถือ 350px / คอม 450px) */}
            <div className="w-full relative bg-slate-200 h-[350px] sm:h-[450px] shrink-0">
              <iframe
                className="absolute inset-0 w-full h-full border-0"
                src={`https://maps.google.com/maps?q=${viewMapModal.lat},${viewMapModal.lng}&hl=th&z=16&output=embed`}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>

          

            {/* Footer Buttons */}
            <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-100 flex flex-col sm:flex-row justify-end gap-3 shrink-0">
              <a 
                href={`https://www.google.com/maps/search/?api=1&query=${viewMapModal.lat},${viewMapModal.lng}`}
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-full sm:w-auto px-6 py-3.5 sm:py-3 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-xl font-black text-sm transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                🧭 เปิดนำทางในแอป
              </a>
              <button onClick={() => setViewMapModal(null)} className="w-full sm:w-auto px-8 py-3.5 sm:py-3 bg-slate-800 hover:bg-slate-900 text-white rounded-xl font-black text-sm transition-colors shadow-md flex items-center justify-center">
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </div>
      )}
      {/* 🚀 AUTO PAYROLL MODAL - วางตรงนี้เด้งแน่นอน 100% */}
      {showAutoPayrollModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-[2.5rem] w-full max-w-2xl max-h-[85vh] overflow-hidden shadow-2xl flex flex-col animate-pop-in">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-indigo-50/50">
              <div>
                <h2 className="text-2xl font-black text-slate-800 tracking-tight">✨ ทำสลิปอัตโนมัติ</h2>
                <p className="text-xs font-bold text-indigo-500 mt-1">คัดกรองพนักงานที่ยังไม่มีสลิปในเดือน {payrollFilterMonth}</p>
              </div>
              <button onClick={() => setShowAutoPayrollModal(false)} className="p-2 hover:bg-white rounded-full text-slate-400">✕</button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 bg-white custom-scrollbar">
              <div className="space-y-3">
                {employees
                  .filter(e => !payrollData.some(p => p.employee_id === e.id && p.month === payrollFilterMonth))
                  .map(emp => (
                  <div 
                    key={emp.id}
                    onClick={() => setSelectedEmps(prev => prev.includes(emp.id) ? prev.filter(id => id !== emp.id) : [...prev, emp.id])}
                    className={`p-4 rounded-2xl border-2 transition-all cursor-pointer flex items-center justify-between ${selectedEmps.includes(emp.id) ? 'border-indigo-500 bg-indigo-50' : 'border-slate-100 bg-white hover:border-indigo-200 shadow-sm'}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${selectedEmps.includes(emp.id) ? 'bg-indigo-500 border-indigo-500 text-white' : 'border-slate-200'}`}>
                        {selectedEmps.includes(emp.id) && <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>}
                      </div>
                      <div>
                        <div className="text-sm font-black text-slate-800">{emp.full_name}</div>
                        <div className="text-[10px] font-bold text-slate-400">{emp.employee_code} • {emp.position}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-xs font-black text-indigo-600">฿{Number(emp.base_salary || 0).toLocaleString()}</div>
                      <div className="text-[9px] font-bold text-slate-400">ฐานเงินเดือน</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-8 bg-slate-50 border-t border-slate-100 flex gap-3">
              <button 
                  disabled={selectedEmps.length === 0 || isSavingPayroll}
                  onClick={async () => {
                    try {
                      setIsSavingPayroll(true);
                      Swal.fire({ 
                        title: 'กำลังประมวลผล...', 
                        text: `กำลังสร้างสลิปให้พนักงาน ${selectedEmps.length} รายการ`,
                        allowOutsideClick: false, 
                        didOpen: () => Swal.showLoading() 
                      });

                      // 1. เตรียมข้อมูล (ตัดฟิลด์ status ออกตามที่ Error แจ้งมา)
                      const payrollInserts = selectedEmps.map(empId => {
                        const emp = employees.find(e => e.id === empId);
                        const baseSalary = Number(emp?.base_salary || 0);
                        
                        return {
                          employee_id: empId,
                          base_salary: baseSalary,
                          ot_amount: 0,
                          deductions: 0,
                          net_salary: baseSalary,
                          month: payrollFilterMonth,
                          created_at: new Date().toISOString()
                        };
                      });

                      // 2. บันทึกลงตาราง payroll_slips
                      const { data, error } = await supabase
                        .from('payroll_slips')
                        .insert(payrollInserts)
                        .select('*, employees(full_name, employee_code)'); 

                      if (error) throw error;

                      // 3. อัปเดตข้อมูลหน้า Dashboard
                      if (data) {
                        setPayrollData(prev => [...data, ...prev]);
                      }

                      setShowAutoPayrollModal(false);
                      setSelectedEmps([]); 
                      
                      Swal.fire({
                        icon: 'success',
                        title: 'สร้างสลิปสำเร็จ!',
                        text: `บันทึกข้อมูลเข้าตาราง payroll_slips เรียบร้อยแล้ว`,
                        confirmButtonColor: '#6366f1'
                      });

                    } catch (err) {
                      console.error("Error Saving Payroll:", err);
                      Swal.fire('เกิดข้อผิดพลาด', 'บันทึกไม่สำเร็จ: ' + err.message, 'error');
                    } finally {
                      setIsSavingPayroll(false);
                    }
                  }}
                  className="flex-[2] py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 disabled:opacity-50"
                >
                  {isSavingPayroll ? '⏳ กำลังบันทึก...' : `🚀 ยืนยันสร้างสลิป (${selectedEmps.length} รายการ)`}
                </button>
            </div>
          </div>
        </div>
      )}
  </>);
}