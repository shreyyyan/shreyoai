// This is the full, correct code for: api/generate-image.js

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    // Use the API key from Vercel's Environment Variables
    const HIVE_API_KEY = process.env.HIVE_API_KEY;
    const HIVE_API_URL = "https://api.thehive.ai/api/v3/black-forest-labs/flux-schnell";

    const response = await fetch(HIVE_API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${HIVE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ input: req.body.input }), // Pass the input from the frontend
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Error from Hive API:", errorData);
      return res.status(response.status).json(errorData);
    }
    
    const data = await response.json();
    res.status(200).json(data); // Send the successful response back

  } catch (err) {
    console.error("Serverless Function Error:", err);
    res.status(500).json({ error: "Server failed to call Hive API" });
  }
}
