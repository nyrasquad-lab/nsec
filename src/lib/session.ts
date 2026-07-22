import { cookies } from 'next/headers'

const SESSION_COOKIE = 'admin_session'
const SESSION_MAX_AGE = 60 * 60 * 24 * 7 // 7 days
const REMEMBER_MAX_AGE = 60 * 60 * 24 * 30 // 30 days

export function getSessionToken(): string | null {
  const cookieStore = cookies()
  return cookieStore.get(SESSION_COOKIE)?.value ?? null
}

export function setSessionCookie(token: string, remember: boolean = false) {
  const cookieStore = cookies()
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: remember ? REMEMBER_MAX_AGE : SESSION_MAX_AGE,
  expires: remember
      ? new Date(Date.now() + REMEMBER_MAX_AGE * 1000)
      : new Date(Date.now() + SESSION_MAX_AGE * 1000),
  })
}

export function clearSessionCookie() {
  const cookieStore = cookies()
  cookieStore.delete(SESSION_COOKIE)
}

export const SESSION_COOKIE_NAME = SESSION_COOKIE
