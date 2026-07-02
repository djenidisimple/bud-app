import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'
import { createToken, verifyToken, COOKIE_NAME } from './auth-edge'

export { createToken, verifyToken, COOKIE_NAME }

export function hashPassword(password: string) {
  return bcrypt.hashSync(password, 10)
}

export function comparePassword(password: string, hash: string) {
  return bcrypt.compareSync(password, hash)
}

export async function getSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return null
  return verifyToken(token)
}

export function setTokenCookie(response: { cookies: { set: (name: string, value: string, opts: Record<string, unknown>) => void } }, token: string) {
  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60,
    path: '/',
  })
}

export function clearTokenCookie(response: { cookies: { set: (name: string, value: string, opts: Record<string, unknown>) => void } }) {
  response.cookies.set(COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 0,
    path: '/',
  })
}
