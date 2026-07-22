describe('Logger Middleware', () => {
  let logger
  let req, res, next

  beforeEach(() => {
    logger = require('../src/middlewares/logger')
    req = {
      method: 'POST',
      originalUrl: '/api/users/login',
      url: '/api/users/login',
      ip: '127.0.0.1',
      get: jest.fn().mockReturnValue('test-agent'),
      connection: { remoteAddress: '127.0.0.1' },
    }
    next = jest.fn()
  })

  test('should log request details and call next', () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation()
    logger(req, res, next)
    expect(consoleSpy).toHaveBeenCalled()
    expect(next).toHaveBeenCalled()
    consoleSpy.mockRestore()
  })

  test('should work without user agent', () => {
    req.get.mockReturnValue(null)
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation()
    logger(req, res, next)
    expect(next).toHaveBeenCalled()
    consoleSpy.mockRestore()
  })
})
