export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const { messageText } = req.body;
  
  // 🟢 ดึง Token และ Admin ID จาก Vercel โดยตรง
  const token = process.env.VITE_LINE_ACCESS_TOKEN;
  const targetId = process.env.VITE_LINE_ADMIN_ID; 

  if (!token || !targetId) {
    return res.status(400).json({ error: 'ลืมใส่ Token หรือ Admin ID ใน Vercel' });
  }

  try {
    const response = await fetch('https://api.line.me/v2/bot/message/push', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        to: targetId,
        messages: [{ type: 'text', text: messageText }]
      })
    });

    const data = await response.json();
    
    // ดักจับ Error จากฝั่ง LINE API
    if (!response.ok) {
       console.error("LINE API Error:", data);
       return res.status(response.status).json({ error: data.message || 'LINE API Error', details: data });
    }

    res.status(200).json({ success: true, data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}