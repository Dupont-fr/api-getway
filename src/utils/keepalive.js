const https = require('https')
const http = require('http')

const INTERVAL = 10 * 60 * 1000

function getHealthUrl(serviceUrl) {
  if (!serviceUrl) return null
  try {
    return new URL('/health', serviceUrl).toString()
  } catch {
    return null
  }
}

function ping(url) {
  return new Promise((resolve) => {
    const client = url.startsWith('https') ? https : http
    const req = client.get(url, { timeout: 15000 }, (res) => {
      let data = ''
      res.on('data', (c) => { data += c })
      res.on('end', () => resolve({ status: res.statusCode, body: data }))
    })
    req.on('error', (err) => resolve({ status: null, error: err.message }))
    req.on('timeout', () => { req.destroy(); resolve({ status: null, error: 'timeout' }) })
  })
}

async function keepAlive() {
  const services = [
    { name: 'user-service', url: getHealthUrl(process.env.USER_SERVICE_URL) },
    { name: 'patient-service', url: getHealthUrl(process.env.PATIENT_SERVICE_URL) },
    { name: 'consultation-service', url: getHealthUrl(process.env.CONSULTATION_SERVICE_URL) },
  ]

  for (const svc of services) {
    if (!svc.url) continue
    const result = await ping(svc.url)
    if (result.status !== 200) {
      console.warn(`  ⚠️  ${svc.name}: ${result.status ? 'HTTP ' + result.status : result.error}`)
    } else {
      console.log(`  ✅ ${svc.name}: OK`)
    }
  }
}

function startKeepAlive() {
  console.log('🔄 Keepalive demarré (toutes les 10 min)')
  keepAlive()
  setInterval(keepAlive, INTERVAL)
}

module.exports = { startKeepAlive }
