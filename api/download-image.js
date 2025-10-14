// This is the full, correct code for: api/download-image.js
import fetch from 'node-fetch';

export default async function handler(req, res) {
  try {
    const imageUrl = req.query.url;
    if (!imageUrl) {
      return res.status(400).json({ error: "Image URL is required" });
    }

    const response = await fetch(imageUrl);

    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`);
    }

    // Get the raw image data as a Buffer
    const imageBuffer = await response.buffer();

    // Set headers and send the image back
    res.setHeader('Content-Type', response.headers.get('content-type'));
    res.setHeader('Content-Length', response.headers.get('content-length'));
    res.send(imageBuffer);

  } catch (err) {
    console.error("Image Download Error:", err);
    res.status(500).json({ error: "Server failed to download image" });
  }
}
