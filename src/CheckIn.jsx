import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './supabase';

export default function CheckIn() {
  const [user] = useState(JSON.parse(localStorage.getItem('titan_user')));
  const [location, setLocation] = useState(null);
  const [statusMsg, setStatusMsg] = useState('กำลังตรวจสอบพื้นที่...');
  const [isInside, setIsInside] = useState(false);
  const [distance, setDistance] = useState(null);
  const [nearestBranch, setNearestBranch] = useState(null);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();

  const sendLineNotification = async (logData) => {
    const targetIds = [import.meta.env.VITE_LINE_ADMIN_ID, import.meta.env.VITE_LINE_GROUP_ID].filter(id => id);
    for (const targetId of targetIds) {
      try {
        await fetch('/api/send-line', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            targetId: targetId,
            messageText: `📢 Pancake ERP: ลงเวลาใหม่!\n👤 ชื่อ: ${user.full_name}\n🏢 สถานที่: ${nearestBranch.name}\n📍 ระยะ: ${logData.distance_m} ม.\n⏰ เวลา: ${new Date().toLocaleString('th-TH')}\n🔗 รูป: ${logData.selfie_url}`
          })
        });
      } catch (err) { console.error("LINE Error:", err); }
    }
  };

  useEffect(() => {
    if (!user) return navigate('/login');
    const fetchBranches = async () => {
      const { data } = await supabase.from('branches').select('*');
      if (data) {
        navigator.geolocation.getCurrentPosition((pos) => {
          const { latitude: uLat, longitude: uLng } = pos.coords;
          setLocation({ lat: uLat, lng: uLng });
          const active = data.find(b => {
            const R = 6371e3;
            const dLat = (b.lat - uLat) * Math.PI / 180;
            const dLon = (b.lng - uLng) * Math.PI / 180;
            const a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(uLat * Math.PI/180) * Math.cos(b.lat * Math.PI/180) * Math.sin(dLon/2) * Math.sin(dLon/2);
            return (R * (2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)))) <= b.radius_m;
          });
          if (active) {
            setNearestBranch(active); setIsInside(true); setStatusMsg(`✅ อยู่ในพื้นที่: ${active.name}`);
          } else {
            setIsInside(false); setStatusMsg(`❌ นอกพื้นที่การทำงาน`);
          }
        }, null, { enableHighAccuracy: true });
      }
    };
    fetchBranches();
  }, [user, navigate]);

  const handleCheckIn = async () => {
    if (!imageSrc || isUploading) return;
    setIsUploading(true);
    try {
      const ipRes = await fetch('https://api.ipify.org?format=json');
      const ipData = await ipRes.json();
      const res = await fetch(imageSrc);
      const blob = await res.blob();
      const fileName = `${user.employee_code}_${Date.now()}.jpg`;
      await supabase.storage.from('selfies').upload(fileName, blob);
      const { data: urlData } = supabase.storage.from('selfies').getPublicUrl(fileName);
      
      const logEntry = {
        employee_id: user.id, branch_id: nearestBranch.id, lat: location.lat, lng: location.lng,
        distance_m: 2, is_within_radius: isInside, selfie_url: urlData.publicUrl, ip_address: ipData.ip
      };
      await supabase.from('attendance_logs').insert([logEntry]);
      await sendLineNotification(logEntry);
      alert('🎉 บันทึกสำเร็จ!');
      setImageSrc(null);
    } catch (err) { alert(err.message); } finally { setIsUploading(false); }
  };

  return (
    <div style={{ padding: '20px', textAlign: 'center', fontFamily: 'sans-serif', maxWidth: '400px', margin: '0 auto' }}>
      {user?.role === 'admin' && (
        <div style={{ background: '#FDF2F8', padding: '10px', borderRadius: '10px', marginBottom: '20px', border: '1px dashed #F472B6', display: 'flex', gap: '5px' }}>
          <button onClick={() => navigate('/admin-dashboard')} style={adminBtn}>📊 ดูประวัติ</button>
          <button onClick={() => navigate('/admin-map')} style={adminBtn}>📍 ตั้งค่าแผนที่</button>
        </div>
      )}
      <h2 style={{ color: '#F472B6' }}>🥞 Pancake Lovely ERP</h2>
      <p>สวัสดีคุณ <b>{user?.full_name}</b></p>
      <div style={{ background: isInside ? '#ECFDF5' : '#FEF2F2', padding: '20px', borderRadius: '15px', marginBottom: '20px', border: `2px solid ${isInside ? '#10B981' : '#EF4444'}` }}>
        <b style={{ color: isInside ? '#065F46' : '#991B1B' }}>{statusMsg}</b>
      </div>
      <canvas ref={canvasRef} width="300" height="225" style={{ display: 'none' }}></canvas>
      {isInside && (
        <div>
          {!imageSrc ? (
            <button onClick={async () => {
              setIsCameraOpen(true);
              const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" } });
              videoRef.current.srcObject = stream;
            }} style={btnStyle('#3B82F6')}>📸 เริ่มขั้นตอนถ่ายรูป Selfie</button>
          ) : (
            <div>
              <img src={imageSrc} style={{ width: '100%', borderRadius: '15px' }} alt="selfie" />
              <button onClick={handleCheckIn} style={btnStyle('#10B981')} disabled={isUploading}>{isUploading ? 'กำลังบันทึก...' : '✅ ถ่ายรูป Selfie ยืนยัน'}</button>
            </div>
          )}
          {isCameraOpen && !imageSrc && (
            <div>
              <video ref={videoRef} autoPlay playsInline style={{ width: '100%', borderRadius: '15px' }}></video>
              <button onClick={() => {
                const ctx = canvasRef.current.getContext('2d');
                ctx.drawImage(videoRef.current, 0, 0, 300, 225);
                setImageSrc(canvasRef.current.toDataURL('image/jpeg', 0.8));
                videoRef.current.srcObject.getTracks().forEach(t => t.stop());
                setIsCameraOpen(false);
              }} style={btnStyle('#10B981')}>แชะ!</button>
            </div>
          )}
        </div>
      )}
      <button onClick={() => { localStorage.removeItem('titan_user'); navigate('/login'); }} style={{ marginTop: '20px', color: '#EF4444', border: 'none', background: 'none', cursor: 'pointer', textDecoration: 'underline' }}>ออกจากระบบ</button>
    </div>
  );
}

const btnStyle = (bg) => ({ width: '100%', padding: '16px', background: bg, color: '#fff', border: 'none', borderRadius: '12px', marginTop: '10px', fontWeight: 'bold', cursor: 'pointer' });
const adminBtn = { flex: 1, padding: '8px', backgroundColor: '#F472B6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '12px' };