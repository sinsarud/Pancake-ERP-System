import { useState, useEffect } from 'react';
import { supabase } from './supabase';
import { useNavigate } from 'react-router-dom';

export default function AdminMap() {
  const [branches, setBranches] = useState([]);
  const [name, setName] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [radius, setRadius] = useState(100);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBranches();
  }, []);

  const fetchBranches = async () => {
    const { data } = await supabase.from('branches').select('*');
    if (data) setBranches(data);
  };

  // 🔥 ฟังก์ชันเด็ด: ดึงพิกัดที่คุณยืนอยู่ปัจจุบันมาใส่ในช่องพิมพ์ทันที
  const useCurrentLocation = () => {
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLat(pos.coords.latitude);
        setLng(pos.coords.longitude);
        setLoading(false);
        alert("📍 ดึงพิกัดปัจจุบันมาให้เรียบร้อยแล้วครับ!");
      },
      (err) => {
        alert("❌ ดึงพิกัดไม่ได้: " + err.message);
        setLoading(false);
      },
      { enableHighAccuracy: true }
    );
  };

  const handleAddBranch = async (e) => {
    e.preventDefault();
    if (!name || !lat || !lng) return alert("กรุณากรอกข้อมูลให้ครบ");

    const { error } = await supabase.from('branches').insert([
      { name, lat: parseFloat(lat), lng: parseFloat(lng), radius_m: parseInt(radius) }
    ]);

    if (error) alert(error.message);
    else {
      alert("✅ เพิ่มจุดปักหมุดใหม่เรียบร้อย!");
      setName(''); setLat(''); setLng('');
      fetchBranches();
    }
  };

  const deleteBranch = async (id) => {
    if (window.confirm("ลบจุดปักหมุดนี้ใช่ไหม?")) {
      await supabase.from('branches').delete().eq('id', id);
      fetchBranches();
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '500px', margin: '0 auto' }}>
      <button onClick={() => navigate(-1)} style={{ marginBottom: '10px' }}>⬅️ กลับ</button>
      <h2 style={{ color: '#F472B6' }}>📍 ตั้งค่าพื้นที่ลงเวลา (Geofence)</h2>

      {/* ฟอร์มเพิ่มจุดปักหมุด */}
      <form onSubmit={handleAddBranch} style={{ background: '#FDF2F8', padding: '20px', borderRadius: '15px', border: '1px solid #F472B6' }}>
        <input placeholder="ชื่อสาขา/ออฟฟิศ" value={name} onChange={e => setName(e.target.value)} style={inputStyle} />
        
        <div style={{ display: 'flex', gap: '5px', marginBottom: '10px' }}>
          <input placeholder="Latitude" value={lat} readOnly style={{ ...inputStyle, flex: 1, background: '#f0f0f0' }} />
          <input placeholder="Longitude" value={lng} readOnly style={{ ...inputStyle, flex: 1, background: '#f0f0f0' }} />
        </div>

        {/* 🌟 ปุ่มพระเอก: กดตอนยืนอยู่ที่ออฟฟิศ */}
        <button type="button" onClick={useCurrentLocation} disabled={loading} style={currentLocBtn}>
          {loading ? '⏳ กำลังหาสัญญาณ GPS...' : '📍 ใช้พิกัดที่ฉันยืนอยู่ตอนนี้'}
        </button>

        <label style={{ fontSize: '12px', display: 'block', marginTop: '10px' }}>รัศมีอนุญาต (เมตร):</label>
        <input type="number" value={radius} onChange={e => setRadius(e.target.value)} style={inputStyle} />
        
        <button type="submit" style={saveBtn}>💾 บันทึกจุดปักหมุดนี้</button>
      </form>

      <h3 style={{ marginTop: '30px' }}>รายการพื้นที่ทั้งหมด:</h3>
      {branches.map(b => (
        <div key={b.id} style={{ padding: '10px', borderBottom: '1px solid #eee', display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <b>{b.name}</b> <br/>
            <small>{b.radius_m} เมตร | {b.lat.toFixed(4)}, {b.lng.toFixed(4)}</small>
          </div>
          <button onClick={() => deleteBranch(b.id)} style={{ color: 'red', border: 'none', background: 'none' }}>ลบ</button>
        </div>
      ))}
    </div>
  );
}

const inputStyle = { width: '100%', padding: '12px', marginBottom: '10px', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box' };
const currentLocBtn = { width: '100%', padding: '12px', backgroundColor: '#3B82F6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' };
const saveBtn = { width: '100%', padding: '15px', backgroundColor: '#F472B6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', marginTop: '10px' };