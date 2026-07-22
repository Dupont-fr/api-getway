describe('Keepalive Utility', () => {
  let keepalive

  beforeEach(() => {
    process.env.USER_SERVICE_URL = 'http://localhost:3001'
    process.env.PATIENT_SERVICE_URL = 'http://localhost:3002'
    process.env.CONSULTATION_SERVICE_URL = 'http://localhost:3003'
    keepalive = require('../src/utils/keepalive')
  })

  test('should export startKeepAlive function', () => {
    expect(keepalive.startKeepAlive).toBeDefined()
    expect(typeof keepalive.startKeepAlive).toBe('function')
  })
})
