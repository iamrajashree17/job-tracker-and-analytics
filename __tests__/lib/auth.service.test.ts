import { signup, login, refresh, logout } from '@/lib/auth.service'
import * as jwtLib from '@/lib/jwt'

jest.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}))
jest.mock('@/lib/jwt')
jest.mock('bcryptjs', () => ({
  hashSync: (_pwd: string, _rounds: number) => 'hashed-password',
  compareSync: (plain: string, hashed: string) => plain === 'correct-password' && hashed === 'hashed-password',
}))

import { prisma } from '@/lib/prisma'

const mockFindUnique = prisma.user.findUnique as jest.MockedFunction<typeof prisma.user.findUnique>
const mockCreate = prisma.user.create as jest.MockedFunction<typeof prisma.user.create>
const mockGenerateAccessToken = jwtLib.generateAccessToken as jest.MockedFunction<typeof jwtLib.generateAccessToken>
const mockGenerateRefreshToken = jwtLib.generateRefreshToken as jest.MockedFunction<typeof jwtLib.generateRefreshToken>
const mockVerifyRefreshToken = jwtLib.verifyRefreshToken as jest.MockedFunction<typeof jwtLib.verifyRefreshToken>

const existingUser = {
  id: 'user-1',
  name: 'Alice',
  email: 'alice@example.com',
  password: 'hashed-password',
  createdAt: new Date('2024-01-01T00:00:00.000Z'),
}

beforeEach(() => {
  jest.clearAllMocks()
  mockGenerateAccessToken.mockReturnValue('access-token')
  mockGenerateRefreshToken.mockReturnValue('refresh-token')
})

describe('signup', () => {
  it('returns 400 when required fields are missing', async () => {
    const result = await signup({ name: '', email: 'a@b.com', password: 'pass' })
    expect(result.status).toBe(400)
  })

  it('returns 400 when email already exists', async () => {
    mockFindUnique.mockResolvedValue(existingUser as any)

    const result = await signup({ name: 'Bob', email: 'alice@example.com', password: 'pass123' })

    expect(result.status).toBe(400)
    expect(result.message).toMatch(/already exists/i)
  })

  it('creates a new user and returns 201', async () => {
    mockFindUnique.mockResolvedValue(null)
    mockCreate.mockResolvedValue({ ...existingUser, email: 'bob@example.com', name: 'Bob' } as any)

    const result = await signup({ name: 'Bob', email: 'bob@example.com', password: 'pass123' })

    expect(result.status).toBe(201)
    expect((result as any).user.email).toBe('bob@example.com')
    expect(mockCreate).toHaveBeenCalledTimes(1)
    expect(mockCreate.mock.calls[0][0].data.password).toBe('hashed-password')
  })
})

describe('login', () => {
  it('returns 400 when credentials are missing', async () => {
    const result = await login({ email: '', password: '' })
    expect(result.status).toBe(400)
  })

  it('returns 404 when user is not found', async () => {
    mockFindUnique.mockResolvedValue(null)

    const result = await login({ email: 'nobody@example.com', password: 'pass' })

    expect(result.status).toBe(404)
  })

  it('returns 401 when password is wrong', async () => {
    mockFindUnique.mockResolvedValue(existingUser as any)

    const result = await login({ email: 'alice@example.com', password: 'wrong-password' })

    expect(result.status).toBe(401)
  })

  it('returns 200 with tokens on success', async () => {
    mockFindUnique.mockResolvedValue(existingUser as any)

    const result = await login({ email: 'alice@example.com', password: 'correct-password' })

    expect(result.status).toBe(200)
    expect((result as any).user.accessToken).toBe('access-token')
    expect((result as any).user.refreshToken).toBe('refresh-token')
  })
})

describe('refresh', () => {
  it('returns 403 when token fails verification', async () => {
    mockVerifyRefreshToken.mockReturnValue(null)

    const result = await refresh('bad-token')

    expect(result.status).toBe(403)
  })

  it('returns 404 when user no longer exists', async () => {
    mockVerifyRefreshToken.mockReturnValue({ id: 'ghost-user', email: 'ghost@example.com' })
    mockFindUnique.mockResolvedValue(null)

    const result = await refresh('valid-token')

    expect(result.status).toBe(404)
  })

  it('returns new tokens on success', async () => {
    mockVerifyRefreshToken.mockReturnValue({ id: existingUser.id, email: existingUser.email })
    mockFindUnique.mockResolvedValue(existingUser as any)
    mockGenerateRefreshToken.mockReturnValue('new-refresh-token')

    const result = await refresh('old-token')

    expect(result.status).toBe(200)
    expect((result as any).accessToken).toBe('access-token')
    expect((result as any).refreshToken).toBe('new-refresh-token')
  })
})

describe('logout', () => {
  it('returns 200', () => {
    const result = logout()
    expect(result.status).toBe(200)
  })
})
