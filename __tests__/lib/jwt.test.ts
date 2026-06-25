import {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
} from '@/lib/jwt'

const user = { id: 'user-1', email: 'alice@example.com' }

describe('generateAccessToken / verifyAccessToken', () => {
  it('generates a token that verifies correctly', () => {
    const token = generateAccessToken(user)
    const payload = verifyAccessToken(token)

    expect(payload).not.toBeNull()
    expect(payload!.id).toBe(user.id)
    expect(payload!.email).toBe(user.email)
  })

  it('returns null for a tampered token', () => {
    const token = generateAccessToken(user)
    const tampered = token.slice(0, -5) + 'XXXXX'

    expect(verifyAccessToken(tampered)).toBeNull()
  })

  it('returns null for a refresh token used as an access token', () => {
    const refreshToken = generateRefreshToken(user)

    expect(verifyAccessToken(refreshToken)).toBeNull()
  })
})

describe('generateRefreshToken / verifyRefreshToken', () => {
  it('generates a token that verifies correctly', () => {
    const token = generateRefreshToken(user)
    const payload = verifyRefreshToken(token)

    expect(payload).not.toBeNull()
    expect(payload!.id).toBe(user.id)
    expect(payload!.email).toBe(user.email)
  })

  it('returns null for a tampered token', () => {
    const token = generateRefreshToken(user)
    const tampered = token.slice(0, -5) + 'XXXXX'

    expect(verifyRefreshToken(tampered)).toBeNull()
  })

  it('returns null for an access token used as a refresh token', () => {
    const accessToken = generateAccessToken(user)

    expect(verifyRefreshToken(accessToken)).toBeNull()
  })
})
