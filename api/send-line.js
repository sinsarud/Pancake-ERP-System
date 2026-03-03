// api/send-line.js
export default async function handler(req, res) {
  // รับเฉพาะการส่งข้อมูลแบบ POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  
  const { targetId, messageText } = req.body;
  const token = process.env.VITE_LINE_ACCESS_TOKEN; // ดึงรหัสจากระบบ Vercel

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
    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}