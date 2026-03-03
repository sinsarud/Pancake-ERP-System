import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from './supabase';

export default function Login() {
  const [empCode, setEmpCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // ค้นหาพนักงานจากฐานข้อมูล Supabase
      const { data, error: fetchError } = await supabase
        .from('employees')
        .select('*')
        .eq('employee_code', empCode)
        .single();

      if (fetchError || !data) {
        setError('❌ ไม่พบรหัสพนักงานนี้ในระบบ');
      } else {
        // ถ้าเจอข้อมูล ให้บันทึกลงเครื่องแล้วไปหน้า Check-in
        localStorage.setItem('titan_user', JSON.stringify(data));
        navigate('/check-in'); 
      }
    } catch (err) {
      setError('❌ เกิดข้อผิดพลาดในการเชื่อมต่อ');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '400px', margin: '50px auto', fontFamily: 'sans-serif', textAlign: 'center' }}>
      <h2 style={{ color: '#333' }}>TITAN ERP SYSTEM</h2>
      <p style={{ color: '#666', marginBottom: '30px' }}>ลงเวลาเข้า-ออกงาน (Mobile)</p>

      <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input
          type="text"
          placeholder="กรอกรหัสพนักงานของคุณ..."
          value={empCode}
          onChange={(e) => setEmpCode(e.target.value)}
          style={{ padding: '15px', fontSize: '16px', borderRadius: '8px', border: '1px solid #ccc', textAlign: 'center' }}
          required
        />
        
        {error && <p style={{ color: 'red', margin: 0, fontWeight: 'bold' }}>{error}</p>}
        
        <button
          type="submit"
          disabled={loading}
          style={{
            padding: '15px',
            fontSize: '18px',
            fontWeight: 'bold',
            backgroundColor: loading ? '#ccc' : '#2563EB',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: loading ? 'not-allowed' : 'pointer',
            boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}
        >
          {loading ? 'กำลังตรวจสอบ...' : 'เข้าสู่ระบบ'}
        </button>
      </form>
    </div>
  );
}