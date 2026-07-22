describe('Error Handler Middleware', () => {
  let errorHandler
  let req, res

  beforeEach(() => {
    errorHandler = require('../src/middlewares/errorHandler')
    req = { method: 'GET', originalUrl: '/api/test' }
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    }
  })

  test('should return 500 for unknown errors', () => {
    const err = new Error('Something went wrong')
    errorHandler(err, req, res, jest.fn())
    expect(res.status).toHaveBeenCalledWith(500)
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: false,
        error: expect.objectContaining({ status: 500 }),
      })
    )
  })

  test('should return custom status code if provided', () => {
    const err = new Error('Not found')
    err.statusCode = 404
    errorHandler(err, req, res, jest.fn())
    expect(res.status).toHaveBeenCalledWith(404)
  })

  test('should return 400 for bad request errors', () => {
    const err = new Error('Invalid input')
    err.statusCode = 400
    errorHandler(err, req, res, jest.fn())
    expect(res.status).toHaveBeenCalledWith(400)
  })

  test('should return 401 for unauthorized errors', () => {
    const err = new Error('Unauthorized')
    err.statusCode = 401
    errorHandler(err, req, res, jest.fn())
    expect(res.status).toHaveBeenCalledWith(401)
  })

  test('should return 403 for forbidden errors', () => {
    const err = new Error('Forbidden')
    err.statusCode = 403
    errorHandler(err, req, res, jest.fn())
    expect(res.status).toHaveBeenCalledWith(403)
  })

  test('should return 429 for rate limit errors', () => {
    const err = new Error('Too many requests')
    err.statusCode = 429
    errorHandler(err, req, res, jest.fn())
    expect(res.status).toHaveBeenCalledWith(429)
  })

  test('should include request path in response', () => {
    const err = new Error('test')
    errorHandler(err, req, res, jest.fn())
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        error: expect.objectContaining({ path: '/api/test' }),
      })
    )
  })
})
