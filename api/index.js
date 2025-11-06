import serverEntry from '../dist/server/server.js';

export default async function handler(req, res) {
  // Convert Vercel request to H3 Event
  const event = {
    node: {
      req,
      res
    }
  };

  try {
    const response = await serverEntry.default.handler(event);
    return response;
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: error.message });
  }
}
