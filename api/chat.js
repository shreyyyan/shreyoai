import fetch from 'node-fetch';

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    // 1. Get the message history (contents) from the frontend
    const { contents } = req.body;

    // 2. Get your Secure API Key from Vercel Environment Variables
    const API_KEY = process.env.GEMINI_API_KEY;

    if (!API_KEY) {
      // Log true error on server, send generic error to user
      console.error("Server Error: API Key missing"); 
      return res.status(500).json({ error: "Server configuration error" });
    }

    // 3. Define the API URL (Using 1.5 Flash for stability)
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

    // 4. Call the API from the server
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ contents })
    });

    const data = await response.json();

    // 5. Handle errors (Sanitized)
    if (!response.ok) {
      console.error("Upstream API Error:", data); // Only you see this in Vercel logs
      return res.status(response.status).json({ error: "AI Service Unavailable" }); // User sees this
    }

    // 6. Send the clean response back to your website
    res.status(200).json(data);

  } catch (err) {
    console.error("Server Error:", err); // Only you see this
    res.status(500).json({ error: "Processing failed" }); // User sees this
  }
}
