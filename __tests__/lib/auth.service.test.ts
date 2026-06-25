import { signup, login, refresh, logout } from '@/lib/auth.service'
import * as fileDb from '@/lib/fileDb'
import * as jwtLib from '@/lib/jwt'

jest.mock('@/lib/fileDb')
jest.mock('@/lib/jwt')
jest.mock('bcryptjs', () => ({
  hashSync: (_pwd: string, _rounds: number) => 'hashed-password',
  compareSync: (plain: string, hashed: string) => plain === 'correct-password' && hashed === 'hashed-password',
}))

const mockReadUsers = fileDb.readUsers as jest.MockedFunction<typeof fileDb.readUsers>
const mockWriteUsers = fileDb.writeUsers as jest.MockedFunction<typeof fileDb.writeUsers>
const mockReadTokens = fileDb.readTokens as jest.MockedFunction<typeof fileDb.readTokens>
const mockWriteTokens = fileDb.writeTokens as jest.MockedFunction<typeof fileDb.writeTokens>
const mockGenerateAccessToken = jwtLib.generateAccessToken as jest.MockedFunction<typeof jwtLib.generateAccessToken>
const mockGenerateRefreshToken = jwtLib.generateRefreshToken as jest.MockedFunction<typeof jwtLib.generateRefreshToken>
const mockVerifyRefreshToken = jwtLib.verifyRefreshToken as jest.MockedFunction<typeof jwtLib.verifyRefreshToken>

const existingUser = {
  id: 'user-1',
  name: 'Alice',
  email: 'alice@example.com',
  password: 'hashed-password',
  createdAt: '2024-01-01T00:00:00.000Z',
}

beforeEach(() => {
  jest.clearAllMocks()
  mockWriteUsers.mockImplementation(() => {})
  mockWriteTokens.mockImplementation(() => {})
  mockGenerateAccessToken.mockReturnValue('access-token')
  mockGenerateRefreshToken.mockReturnValue('refresh-token')
})

describe('signup', () => {
  it('returns 400 when required fields are missing', () => {
    const result = signup({ name: '', email: 'a@b.com', password: 'pass' })
    expect(result.status).toBe(400)
  })

  it('returns 400 when email already exists', () => {
    mockReadUsers.mockReturnValue([existingUser])

    const result = signup({ name: 'Bob', email: 'alice@example.com', password: 'pass123' })

    expect(result.status).toBe(400)
    expect(result.message).toMatch(/already exists/i)
  })

  it('creates a new user and returns 201', () => {
    mockReadUsers.mockReturnValue([])

    const result = signup({ name: 'Bob', email: 'bob@example.com', password: 'pass123' })

    expect(result.status).toBe(201)
    expect((result as any).user.email).toBe('bob@example.com')
    expect(mockWriteUsers).toHaveBeenCalledTimes(1)
    const saved = mockWriteUsers.mock.calls[0][0]
    expect(saved[0].password).toBe('hashed-password')
  })
})

describe('login', () => {
  it('returns 400 when credentials are missing', () => {
    const result = login({ email: '', password: '' })
    expect(result.status).toBe(400)
  })

  it('returns 404 when user is not found', () => {
    mockReadUsers.mockReturnValue([])

    const result = login({ email: 'nobody@example.com', password: 'pass' })

    expect(result.status).toBe(404)
  })

  it('returns 401 when password is wrong', () => {
    mockReadUsers.mockReturnValue([existingUser])
    mockReadTokens.mockReturnValue([])

    const result = login({ email: 'alice@example.com', password: 'wrong-password' })

    expect(result.status).toBe(401)
  })

  it('returns 200 with tokens on success', () => {
    mockReadUsers.mockReturnValue([existingUser])
    mockReadTokens.mockReturnValue([])

    const result = login({ email: 'alice@example.com', password: 'correct-password' })

    expect(result.status).toBe(200)
    expect((result as any).user.accessToken).toBe('access-token')
    expect((result as any).user.refreshToken).toBe('refresh-token')
    expect(mockWriteTokens).toHaveBeenCalledWith(['refresh-token'])
  })
})

describe('refresh', () => {
  it('returns 403 when token is not in store', () => {
    mockReadTokens.mockReturnValue([])

    const result = refresh('unknown-token')

    expect(result.status).toBe(403)
  })

  it('returns 403 when token fails verification', () => {
    mockReadTokens.mockReturnValue(['bad-token'])
    mockVerifyRefreshToken.mockReturnValue(null)

    const result = refresh('bad-token')

    expect(result.status).toBe(403)
  })

  it('returns 404 when user no longer exists', () => {
    mockReadTokens.mockReturnValue(['valid-token'])
    mockVerifyRefreshToken.mockReturnValue({ id: 'ghost-user', email: 'ghost@example.com' })
    mockReadUsers.mockReturnValue([])

    const result = refresh('valid-token')

    expect(result.status).toBe(404)
  })

  it('rotates the refresh token and returns new tokens', () => {
    mockReadTokens.mockReturnValue(['old-token'])
    mockVerifyRefreshToken.mockReturnValue({ id: existingUser.id, email: existingUser.email })
    mockReadUsers.mockReturnValue([existingUser])
    mockGenerateRefreshToken.mockReturnValue('new-refresh-token')

    const result = refresh('old-token')

    expect(result.status).toBe(200)
    expect((result as any).accessToken).toBe('access-token')
    expect((result as any).refreshToken).toBe('new-refresh-token')
    expect(mockWriteTokens).toHaveBeenCalledWith(['new-refresh-token'])
  })
})

describe('logout', () => {
  it('removes the token from the store', () => {
    mockReadTokens.mockReturnValue(['token-a', 'token-b'])

    const result = logout('token-a')

    expect(result.status).toBe(200)
    expect(mockWriteTokens).toHaveBeenCalledWith(['token-b'])
  })
})
