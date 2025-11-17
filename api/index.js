import { createServer } from 'vite'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const distPath = path.resolve(__dirname, '../dist/server')

// Load the built server
const serverPath = path.join(distPath, 'server.js')

let handler

export default async function (req, res) {
  try {
    if (!handler) {
      // Dynamically import the server handler
      const serverModule = await import(serverPath)
      handler = serverModule.default || serverModule
    }

    // TanStack Start server expects Node.js request/response
    if (typeof handler === 'function') {
      return await handler(req, res)
    } else if (handler.fetch) {
      // If it's a Fetch API handler
      const url = new URL(req.url || '/', `https://${req.headers.host}`)
      const request = new Request(url, {
        method: req.method,
        headers: req.headers,
        body: req.method !== 'GET' && req.method !== 'HEAD' ? req : undefined,
      })

      const response = await handler.fetch(request)

      res.status(response.status)
      response.headers.forEach((value, key) => {
        res.setHeader(key, value)
      })

      const body = await response.text()
      return res.send(body)
    }

    res.status(500).json({ error: 'Invalid server handler' })
  } catch (error) {
    console.error('Server error:', error)
    res.status(500).json({ error: error.message, stack: error.stack })
  }
}
