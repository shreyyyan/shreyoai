import fetch from 'node-fetch';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { contents } = req.body;
    
    // Get API Key from Vercel Environment Variables
    const API_KEY = process.env.GEMINI_API_KEY;

    if (!API_KEY) {
      console.error("GEMINI_API_KEY is missing.");
      return res.status(500).json({ error: "Server configuration error" });
    }

    // Using Gemini 1.5 Flash for stability
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("API Error:", data);
      res.status(response.status).json({ error: "AI Service Unavailable" });
    }

    res.status(200).json(data);

  } catch (err) {
    console.error("Server Error:", err);
    res.status(500).json({ error: "Failed Connecting with API" });
  }
}
