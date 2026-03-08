// ไฟล์: api/send-email.js
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });
  
  // ✨ แก้ให้รับตัวแปร 'text' ที่ส่งมาจาก Dashboard ด้วย
  const { to, subject, text, html } = req.body;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.VITE_RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Pancake ERP <onboarding@resend.dev>', // อีเมลผู้ส่งจาก Resend
        to: [to],
        subject: subject,
        text: text, // ✨ เพิ่มตรงนี้! เพื่อให้ส่งข้อความแบบธรรมดาได้
        html: html  // รองรับแบบ HTML ไว้ด้วยเผื่ออนาคตพี่อยากแต่งอีเมลสวยๆ
      })
    });
    
    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}