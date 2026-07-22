describe('Proxy Configuration', () => {
  let proxyConfig

  beforeEach(() => {
    process.env.USER_SERVICE_URL = 'http://localhost:3001'
    process.env.PATIENT_SERVICE_URL = 'http://localhost:3002'
    process.env.CONSULTATION_SERVICE_URL = 'http://localhost:3003'
    proxyConfig = require('../src/config/proxies')
  })

  test('should have userService config', () => {
    expect(proxyConfig.userService).toBeDefined()
    expect(proxyConfig.userService.target).toBe('http://localhost:3001')
    expect(proxyConfig.userService.changeOrigin).toBe(true)
  })

  test('should have patientService config', () => {
    expect(proxyConfig.patientService).toBeDefined()
    expect(proxyConfig.patientService.target).toBe('http://localhost:3002')
    expect(proxyConfig.patientService.changeOrigin).toBe(true)
  })

  test('should have consultationService config', () => {
    expect(proxyConfig.consultationService).toBeDefined()
    expect(proxyConfig.consultationService.target).toBe('http://localhost:3003')
    expect(proxyConfig.consultationService.changeOrigin).toBe(true)
  })

  test('onError should return 503', () => {
    const req = {}
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
    const err = new Error('Connection refused')

    proxyConfig.userService.onError(err, req, res)
    expect(res.status).toHaveBeenCalledWith(503)
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ error: 'Service indisponible' })
    )
  })
})
