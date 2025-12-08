import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  try {
    const { contents } = req.body;
    const API_KEY = process.env.GEMINI_API_KEY;

    if (!API_KEY) return res.status(500).json({ error: "Server Key Config Error" });

    // Using 1.5 Flash
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents })
    });

    const data = await response.json();

    if (!response.ok) {
        console.error("Gemini Error:", data); // Log for you
        return res.status(response.status).json({ error: "Service Unavailable" }); // Generic for user
    }

    res.status(200).json(data);

  } catch (err) {
    console.error("Backend Error:", err);
    res.status(500).json({ error: "Internal Error" });
  }
}
