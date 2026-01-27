// lib/auth.ts
'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

// Simule une base de données d'utilisateurs
const users = [
  { id: '1', email: 'user@example.com', password: 'password' }
]

export async function login(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const user = users.find(u => u.email === email && u.password === password)
  
  if (!user) {
    return { error: 'Identifiants invalides' }
  }

  cookies().set('session', JSON.stringify({ id: user.id, email: user.email }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7, // 1 semaine
    path: '/',
  })
}

export async function logout() {
  cookies().delete('session')
  redirect('/login')
}

export async function getSession() {
  const session = cookies().get('session')?.value
  if (!session) return null
  return JSON.parse(session)
}

export async function isAuthenticated() {
  const session = await getSession()
  return !!session
}