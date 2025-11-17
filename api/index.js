import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const distPath = path.resolve(__dirname, '../dist/server')

// Load the built server
const serverPath = path.join(distPath, 'server.js')

let serverEntry

export default async function handler(req, res) {
  try {
    // Lazy load the server module
    if (!serverEntry) {
      const serverModule = await import(serverPath)
      serverEntry = serverModule.default
    }

    // Build the full URL from Vercel request
    const protocol = req.headers['x-forwarded-proto'] || 'https'
    const host = req.headers['x-forwarded-host'] || req.headers.host
    const url = new URL(req.url || '/', `${protocol}://${host}`)

    // Convert Vercel request to Web Request
    const headers = new Headers()
    for (const [key, value] of Object.entries(req.headers)) {
      if (value) {
        headers.set(key, Array.isArray(value) ? value.join(', ') : value)
      }
    }

    // Create body for POST/PUT/PATCH requests
    let body = undefined
    if (req.method !== 'GET' && req.method !== 'HEAD') {
      // Vercel already parses body, reconstruct it
      if (req.body) {
        body = typeof req.body === 'string' ? req.body : JSON.stringify(req.body)
      }
    }

    const request = new Request(url.toString(), {
      method: req.method,
      headers,
      body,
    })

    // Call the TanStack Start fetch handler
    const response = await serverEntry.fetch(request)

    // Convert Web Response to Vercel response
    res.status(response.status)

    response.headers.forEach((value, key) => {
      res.setHeader(key, value)
    })

    // Handle streaming or text response
    if (response.body) {
      const reader = response.body.getReader()
      const pump = async () => {
        const { done, value } = await reader.read()
        if (done) {
          res.end()
          return
        }
        res.write(value)
        await pump()
      }
      await pump()
    } else {
      res.end()
    }
  } catch (error) {
    console.error('Serverless function error:', error)
    res.status(500).json({
      error: 'Internal Server Error',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    })
  }
}
