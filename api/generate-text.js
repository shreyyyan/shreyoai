// This is the full, correct code for: api/generate-text.js

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    // Securely get the API key from Vercel's Environment Variables
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    const GEMINI_API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

    // Forward the request body from the frontend to the Google API
    const response = await fetch(GEMINI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(req.body), // req.body contains the 'contents' payload
    });

    if (!response.ok) {
      // If Google's API returns an error, forward it
      const errorData = await response.json();
      console.error("Error from Gemini API:", errorData);
      return res.status(response.status).json(errorData);
    }

    const data = await response.json();
    res.status(200).json(data); // Send the successful response back to the frontend

  } catch (err) {
    console.error("Serverless Function Error:", err);
    res.status(500).json({ error: "Server failed to call Gemini API" });
  }
}
