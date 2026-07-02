import { NextResponse } from 'next/server'
import { clearTokenCookie } from '@/lib/auth'

export async function POST() {
  const response = NextResponse.json({ message: 'Déconnexion réussie' })
  clearTokenCookie(response)
  return response
}
