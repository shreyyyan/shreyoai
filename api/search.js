export default async function handler(req, res) {
  // 1. Setup headers for security
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const apiKey = process.env.SERPER_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: 'API Key missing in server configuration' });
  }

  const { q } = req.body;

  try {
    // Call the external API from the server
    const response = await fetch('https://google.serper.dev/search', {
      method: 'POST',
      headers: {
        'X-API-KEY': apiKey,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ q })
    });

    if (!response.ok) {
        throw new Error(`Serper API error: ${response.statusText}`);
    }

    const data = await response.json();

    //  Return the EXACT data structure the frontend expects
    return res.status(200).json(data);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}
