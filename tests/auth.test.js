const mockVerify = jest.fn()
const mockDecode = jest.fn()

jest.mock('jsonwebtoken', () => ({
  verify: mockVerify,
  decode: mockDecode,
}))

describe('Auth Middleware', () => {
  let authMiddleware
  let req, res, next

  beforeEach(() => {
    jest.resetModules()
    process.env.JWT_SECRET = 'test-secret'
    process.env.NODE_ENV = 'production'
    mockVerify.mockReset()
    mockDecode.mockReset()
    authMiddleware = require('../src/middlewares/auth')
    req = { headers: {}, path: '/api/test' }
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
    next = jest.fn()
  })

  test('should return 401 if no authorization header', () => {
    authMiddleware(req, res, next)
    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: false })
    )
    expect(next).not.toHaveBeenCalled()
  })

  test('should return 401 if token is invalid', () => {
    req.headers.authorization = 'Bearer invalid-token'
    mockVerify.mockImplementation(() => { throw new Error('invalid') })

    authMiddleware(req, res, next)
    expect(res.status).toHaveBeenCalledWith(401)
    expect(next).not.toHaveBeenCalled()
  })

  test('should set req.user and call next if token valid', () => {
    req.headers.authorization = 'Bearer valid-token'
    const decoded = { id: '123', role: 'MEDECIN' }
    mockVerify.mockReturnValue(true)
    mockDecode.mockReturnValue(decoded)

    authMiddleware(req, res, next)
    expect(req.user).toEqual(decoded)
    expect(next).toHaveBeenCalled()
  })

  test('should skip auth for public routes', () => {
    req.path = '/login'
    authMiddleware(req, res, next)
    expect(next).toHaveBeenCalled()
    expect(res.status).not.toHaveBeenCalled()
  })

  test('should skip auth in development mode', () => {
    process.env.NODE_ENV = 'development'
    authMiddleware(req, res, next)
    expect(next).toHaveBeenCalled()
  })

  test('requireRole should allow allowed roles', () => {
    req.user = { role: 'ADMIN' }
    const { requireRole } = require('../src/middlewares/auth')
    const middleware = requireRole('ADMIN', 'MEDECIN')

    middleware(req, res, next)
    expect(next).toHaveBeenCalled()
  })

  test('requireRole should deny forbidden roles', () => {
    req.user = { role: 'ACCUEIL' }
    const { requireRole } = require('../src/middlewares/auth')
    const middleware = requireRole('ADMIN', 'MEDECIN')

    middleware(req, res, next)
    expect(res.status).toHaveBeenCalledWith(403)
    expect(next).not.toHaveBeenCalled()
  })
})
