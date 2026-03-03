import { useState, useEffect } from 'react';
import { supabase } from './supabase';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchLogs();
  }, []);

  // 🔍 ฟังก์ชันดึงข้อมูลประวัติการลงเวลาทั้งหมด
  const fetchLogs = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('attendance_logs')
        .select(`
          *,
          employees (full_name, employee_code),
          branches (name)
        `)
        .order('created_at', { ascending: false }); // เรียงจากใหม่ไปเก่า

      if (error) throw error;
      setLogs(data || []);
    } catch (error) {
      console.error("Error fetching logs:", error.message);
      alert("ไม่สามารถดึงข้อมูลได้: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // 🗑️ ฟังก์ชันลบข้อมูลรายบุคคล (ลบทั้งฐานข้อมูลและรูปถ่าย)
  const handleDelete = async (log) => {
    if (!window.confirm('ยืนยันการลบข้อมูลการลงเวลานี้ใช่หรือไม่? รูปภาพในระบบจะถูกลบทันที')) return;

    try {
      // 1. ลบไฟล์รูปภาพออกจาก Storage (ถ้ามี)
      if (log.selfie_url) {
        const urlParts = log.selfie_url.split('/');
        const fileName = urlParts[urlParts.length - 1].split('?')[0]; // ตัด Query string ออก
        await supabase.storage.from('selfies').remove([fileName]);
      }

      // 2. ลบแถวข้อมูลในตาราง Database
      const { error } = await supabase.from('attendance_logs').delete().eq('id', log.id);
      if (error) throw error;

      alert('ลบข้อมูลสำเร็จ');
      fetchLogs(); // รีเฟรชตาราง
    } catch (error) {
      alert("ลบไม่สำเร็จ: " + error.message);
    }
  };

  // 🔥 ฟังก์ชันไฮไลท์: ล้างข้อมูลเก่ากว่า 1 เดือนเพื่อคืนพื้นที่ (Bulk Cleanup)
  const handleCleanup = async () => {
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
    
    const confirmMsg = `คุณต้องการลบข้อมูลทั้งหมดที่เก่ากว่าวันที่ ${oneMonthAgo.toLocaleDateString('th-TH')} ใช่หรือไม่?\n(รูปภาพทั้งหมดจะถูกลบเพื่อคืนพื้นที่จัดเก็บ)`;
    
    if (!window.confirm(confirmMsg)) return;

    setLoading(true);
    try {
      // 1. ค้นหารายการเก่าเพื่อเอาชื่อไฟล์รูปมาลบ
      const { data: oldLogs } = await supabase
        .from('attendance_logs')
        .select('id, selfie_url')
        .lt('created_at', oneMonthAgo.toISOString());

      if (oldLogs && oldLogs.length > 0) {
        // ดึงรายชื่อไฟล์รูปภาพทั้งหมด
        const filesToDelete = oldLogs
          .filter(l => l.selfie_url)
          .map(l => l.selfie_url.split('/').pop().split('?')[0]);
        
        // 2. ลบรูปใน Storage ทั้งหมด
        if (filesToDelete.length > 0) {
          await supabase.storage.from('selfies').remove(filesToDelete);
        }

        // 3. ลบข้อมูลใน Database ทั้งหมดที่เก่ากว่า 1 เดือน
        const { error: deleteError } = await supabase
          .from('attendance_logs')
          .delete()
          .lt('created_at', oneMonthAgo.toISOString());

        if (deleteError) throw deleteError;

        alert(`ล้างข้อมูลเก่าเรียบร้อยแล้ว จำนวน ${oldLogs.length} รายการ`);
        fetchLogs();
      } else {
        alert('ไม่มีข้อมูลที่เก่ากว่า 1 เดือนในระบบ');
      }
    } catch (error) {
      alert("เกิดข้อผิดพลาดในการล้างข้อมูล: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '15px' }}>
        <h2 style={{ color: '#1E293B', margin: 0 }}>📋 ประวัติการลงเวลา (TITAN ERP SYSTEM)</h2>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button onClick={handleCleanup} style={btnStyle('#EF4444')}>🧹 ล้างข้อมูลขยะรายเดือน</button>
          <button onClick={() => navigate('/admin-map')} style={btnStyle('#2563EB')}>📍 จัดการแผนที่สาขา</button>
          <button onClick={() => navigate('/check-in')} style={btnStyle('#64748B')}>🏠 หน้าลงเวลา</button>
        </div>
      </header>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>กำลังโหลดข้อมูล...</div>
      ) : (
        <div style={{ backgroundColor: '#fff', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ backgroundColor: '#F8FAFC', borderBottom: '2px solid #E2E8F0' }}>
                  <th style={thStyle}>พนักงาน</th>
                  <th style={thStyle}>เวลา (วันที่/เวลา)</th>
                  <th style={thStyle}>สถานที่/สาขา</th>
                  <th style={thStyle}>IP Address</th>
                  <th style={thStyle}>ระยะห่าง</th>
                  <th style={thStyle}>หลักฐานรูปถ่าย</th>
                  <th style={thStyle}>จัดการ</th>
                </tr>
              </thead>
              <tbody>
                {logs.length > 0 ? logs.map(log => (
                  <tr key={log.id} style={{ borderBottom: '1px solid #F1F5F9', hover: { backgroundColor: '#F1F5F9' } }}>
                    <td style={tdStyle}>
                      <div style={{ fontWeight: 'bold', color: '#1E293B' }}>{log.employees?.full_name || 'ไม่ระบุชื่อ'}</div>
                      <small style={{ color: '#64748B' }}>Code: {log.employees?.employee_code || 'N/A'}</small>
                    </td>
                    <td style={tdStyle}>{new Date(log.created_at).toLocaleString('th-TH')}</td>
                    <td style={tdStyle}>{log.branches?.name || 'นอกสถานที่'}</td>
                    <td style={tdStyle}><code style={{ background: '#F1F5F9', padding: '2px 5px', borderRadius: '4px' }}>{log.ip_address || 'N/A'}</code></td>
                    <td style={tdStyle}>
                      <span style={{ 
                        color: log.is_within_radius ? '#10B981' : '#EF4444', 
                        fontWeight: 'bold',
                        padding: '4px 8px',
                        borderRadius: '20px',
                        backgroundColor: log.is_within_radius ? '#ECFDF5' : '#FEF2F2'
                      }}>
                        {log.distance_m?.toFixed(0)} เมตร
                      </span>
                    </td>
                    <td style={tdStyle}>
                      {log.selfie_url ? (
                        <a href={log.selfie_url} target="_blank" rel="noreferrer">
                          <img src={log.selfie_url} alt="selfie" style={{ width: '50px', height: '50px', borderRadius: '8px', objectFit: 'cover', border: '1px solid #E2E8F0' }} />
                        </a>
                      ) : <span style={{ color: '#94A3B8' }}>ไม่มีรูป</span>}
                    </td>
                    <td style={tdStyle}>
                      <button onClick={() => handleDelete(log)} style={{ color: '#EF4444', border: 'none', background: 'none', cursor: 'pointer', fontWeight: 'bold' }}>ลบ</button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '30px', color: '#64748B' }}>ยังไม่มีประวัติการลงเวลาในระบบ</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

const thStyle = { padding: '15px', color: '#475569', fontSize: '14px', fontWeight: '600' };
const tdStyle = { padding: '15px', fontSize: '14px', verticalAlign: 'middle' };
const btnStyle = (bg) => ({
  padding: '10px 15px',
  backgroundColor: bg,
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  fontWeight: '600',
  fontSize: '14px',
  boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
});