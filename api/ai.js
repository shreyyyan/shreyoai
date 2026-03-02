import fetch from 'node-fetch';

export default async function handler(req, res) {
  // 1. CORS Headers (Essential for browser access)
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle browser "Preflight" checks
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { contents } = req.body;
    const API_KEY = process.env.GEMINI_API_KEY;

    if (!API_KEY) {
      console.error("Server Error: GEMINI_API_KEY is missing.");
      return res.status(500).json({ error: "Server configuration error" });
    }

    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-lite:generateContent?key=${API_KEY}`;

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents })
    });

    const data = await response.json();

    // Secure Error Handling
    if (!response.ok) {
      console.error("Gemini API Error:", data); // Logs real error for you
      return res.status(response.status).json({ error: "AI Service Unavailable" }); // Safe error for user
    }

    // Success
    res.status(200).json(data);

  } catch (err) {
    console.error("Backend Internal Error:", err);
    res.status(500).json({ error: "Internal Connection Error" });
  }
}
